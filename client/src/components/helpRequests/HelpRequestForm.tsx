import axios from "axios";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { MdOutlineSupportAgent } from "react-icons/md";
import { Socket, io } from "socket.io-client";
import { DbUser, SessionWithToken } from "@/types";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

type HelpRequestForm = {
  setSubmitted: Dispatch<SetStateAction<boolean>>;
};

let socket: Socket;
export default function HelpRequestForm({ setSubmitted }: HelpRequestForm) {
  const session = useSession().data as SessionWithToken;
  const userId = session.user.id;
  const courseIdRegex = /[0-9a-fA-F]{24}/;
  const courseId = usePathname().match(courseIdRegex)![0];

  const [message, setMessage] = useState("");
  const [students, setStudents] = useState<Partial<DbUser>[]>([]);
  const [requestors, setRequestors] = useState<string[]>();

  const baseUrl = process.env.API_URL || "http://localhost:5000";

  useEffect(() => {
    socket = io("http://localhost:5000/", {
      auth: {
        accessToken: session.accessToken,
      },
    });
    socket.emit("join", courseId);

    axios
      .get<DbUser[]>(`${baseUrl}/${courseId}/students`)
      .then((res) => setStudents(res.data))
      .catch((e) => console.error(e));

    return () => {
      socket.disconnect();
    };
  }, [baseUrl, courseId]);

  const handleMessage = (e: ChangeEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setMessage(target.value);
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setRequestors([e.target.value]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    socket.emit(
      "createRequest",
      {
        content: message,
        course: courseId,
        students: [userId, ...(requestors ?? [])],
      },
      (res: any) => {
        setSubmitted(true);
      }
    );

    setMessage("");
  };

  return (
    <section className="h-screen w-full flex items-center bg-white">
      <div className="mx-auto w-1/3 min-w-max aspect-square bg-white rounded-lg flex flex-col items-center justify-evenly border-2 border-gray border-opacity-90 shadow-lg">
        <div className="flex items-center text-4xl font-bold text-center">
          <div className="text-5xl text-primary-1 pr-4">
            <MdOutlineSupportAgent />
          </div>
          <h2>Help Request</h2>
        </div>
        <div className="h-1/3 p-4">
          <label htmlFor="input-description">What can we help you with?</label>
          <textarea
            id="input-description"
            className="p-1 border-2 border-solid border-slate resize-none h-full w-full rounded-md"
            value={message}
            onChange={handleMessage}
            maxLength={140}
            required
          />
        </div>
        <div className="w-4/5 ">
          {students && (
            <>
              <h1 className="text-left pb-4">
                Are there other students working with you?
              </h1>
              <select
                className="p-2 rounded-xl"
                onChange={handleSelect}
                name="students"
                id="students"
              >
                <option value="">Student dropdown</option>
                {students
                  .filter((student) => student.id !== userId)
                  .map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
              </select>
            </>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={message.length === 0}
          className={
            `my-5 mx-auto w-1/4 p-2 bg-primary-1 bg-opacity-30 text-primary-1 rounded-lg font-bold ` +
            (message.length === 0
              ? "cursor-not-allowed"
              : "hover:bg-opacity-40")
          }
        >
          Send
        </button>
      </div>
    </section>
  );
}
