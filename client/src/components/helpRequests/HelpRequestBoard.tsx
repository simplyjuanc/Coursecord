"use client";
import { DbUser, SessionWithToken, THelpRequest } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { MdSupportAgent } from "react-icons/md";
import { Socket, io } from "socket.io-client";
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Image from "next/image";
import Spinner from "/public/spinner.svg";
import BoardComponent from "./BoardComponent";


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

    socket = io(baseUrl, {
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
  }, [baseUrl, session]);    
  

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
            {["WAITING", "ASSIGNED", "FINISHED"].map((status, idx) => (
              <BoardComponent key={idx} status={status} helpRequests={helpRequests}/>
            ))}
          </DragDropContext>
        )}
      </div>
    </div>
  );
}
