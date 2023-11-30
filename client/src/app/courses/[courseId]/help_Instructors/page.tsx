"use client";
import { DbUser, SessionWithToken, THelpRequest } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { MdSupportAgent } from "react-icons/md";
import { Socket, io } from "socket.io-client";
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

let socket: Socket;
export default function Help() {
  const [helpRequests, setHelpRequests] = useState<THelpRequest[]>([]);
  const [instructors, setInstructors] = useState<DbUser[]>();
  const baseUrl = process.env.API_URL || "http://localhost:5000";
  const courseId = "6565c41df515f6ec9392f30f";
  const { data: session } = useSession();
  useEffect(() => {
    axios
      .get<DbUser[]>(`${baseUrl}/${courseId}/instructors`)
      .then((res) => setInstructors(res.data))
      .catch((e) => console.error(e));

    socket = io("http://localhost:5000/", {
      auth: {
        accessToken: (session as SessionWithToken).accessToken,
      },
    });
    socket.emit("join", courseId, (res: THelpRequest[]) => {
      console.log(res);
      setHelpRequests(res);
    });
    socket.on("requestsUpdated", (res: THelpRequest[]) => {
      console.log("req updated", res);
      setHelpRequests(res);
    });

    return () => {
      socket.disconnect();
    };
  }, [baseUrl]);
  const ItemComponent = (props: { item: THelpRequest }) => {
    return (
      <div className="border-primary-red border-2 rounded-xl select-none">
        <div className="p-2">
          <div className="flex">
            <div className="my-auto">
              <Image
                src={props.item.students[0].image ?? ""}
                alt={""}
                width={30}
                height={30}
                className="rounded-full pr-1"
              />
            </div>
            <h1 className="text-xl font-semibold my-auto">
              {props.item.students[0].name}
            </h1>
          </div>
          <h2 className="py-2 font-medium">{props.item.content}</h2>
          <div>
            <h3 className="">
              {formatDistanceToNow(new Date(props.item.created_at), {
                addSuffix: true,
              })}
            </h3>
          </div>
        </div>
      </div>
    );
  };
  const BoardComponent = (props: { status: string }) => {
    return (
      <Droppable droppableId={props.status}>
        {(droppableProvided, snapshot) => (
          <div
            className="bg-white w-full rounded-xl p-6"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            <div className="">
              {helpRequests.map((item, index) =>
                item.status === props.status ? (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ItemComponent item={item} />
                      </div>
                    )}
                  </Draggable>
                ) : (
                  <></>
                )
              )}
            </div>
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <div className="w-full h-full px-32 py-12">
      <div className="bg-white flex text-5xl font-semibold px-8 py-4 mx-auto rounded-xl">
        <div className="my-auto mr-4 text-primary-red text-6xl">
          <MdSupportAgent />
        </div>
        <h1 className="my-auto">Help Requests</h1>
      </div>
      <div className="grid pt-12 grid-cols-3 h-screen gap-x-32 overflow-y-scroll">
        <DragDropContext
          onDragEnd={(source, destination) => {
            let newHelpRequests = helpRequests;
            let req = newHelpRequests.find(
              (value) => value.id == source.draggableId
            );
            if (req && source.destination) {
              (req as any).status = source.destination.droppableId;
            }
            setHelpRequests(newHelpRequests);
            socket.emit("updateStatus", {
              course: courseId,
              request: source.draggableId,
              destination: source.destination?.droppableId,
            });
          }}
        >
          {["WAITING", "ASSIGNED", "FINISHED"].map((item) => (
            <BoardComponent status={item} />
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
