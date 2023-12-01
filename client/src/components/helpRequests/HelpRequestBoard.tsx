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
import { BsThreeDots } from "react-icons/bs";
import Spinner from "/public/spinner.svg";

let socket: Socket;
export default function HelpRequestBoard() {
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
                className="object-contain rounded-full mr-1"
              />
            </div>
            <h1 className="text-xl font-semibold my-auto">
              {props.item.students[0].name}
            </h1>
          </div>
          <h2 className="py-2 font-medium">{props.item.content}</h2>
          {props.item.instructor ? (
            <div className="flex">
              <Image
                src={props.item.instructor.image ?? ""}
                alt={""}
                width={25}
                height={25}
                className="object-contain rounded-full mr-1 my-auto"
              />
              <h1 className="my-auto text-lg font-medium">
                {props.item.instructor.name}
              </h1>
            </div>
          ) : (
            <></>
          )}
          <div>
            <h3 className="">
              {props.item.finished_at === null
                ? formatDistanceToNow(new Date(props.item.created_at), {
                    addSuffix: true,
                  })
                : "finished " +
                  formatDistanceToNow(new Date(props.item.finished_at), {
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
      <div className="flex-grow flex flex-col ">
        <div className="flex font-bold text-3xl">
          <div className="my-auto text-primary-red text-4xl pr-4 pb-6">
            <BsThreeDots />
          </div>
          <h1 className="drop-shadow-lg">
            {props.status.slice(0, 1)}
            {props.status.slice(1).toLocaleLowerCase()}
          </h1>
        </div>
        <Droppable droppableId={props.status}>
          {(droppableProvided, snapshot) => (
            <div
              className="bg-white w-full max-h-min rounded-xl p-6 shadow-xl border-2 border-primary-gray border-opacity-40"
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              <div className="">
                {helpRequests.map((item, index) =>
                  item.status === props.status ? (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div style={{ height: "1rem" }} />
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
      </div>
    );
  };

  return (
    <div className="flex-grow flex flex-col h-screen px-20 pt-10 bg-white">
      <div className="bg-white flex text-3xl font-semibold px-8 py-4 mx-auto rounded-xl shadow-xl border-2 border-primary-gray border-opacity-40">
        <div className="my-auto mr-4 text-primary-red text-4xl">
          <MdSupportAgent />
        </div>
        <h1 className="my-auto">Help Requests</h1>
      </div>
      <div className="flex-grow max-h-screen grid pt-12 grid-cols-3 gap-x-12 overflow-y-auto">
        {socket === undefined ? (
          <div className="text-center mx-auto justify-center pt-40 left-1/2 flex absolute">
            <Image src={Spinner} alt="Spinner" width={75} height={75} />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
