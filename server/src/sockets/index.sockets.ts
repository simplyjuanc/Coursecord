import { Server, Socket } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import Role from "../models/role";
import {
  setupStudentHelpSockets,
  setupInstructorHelpSockets,
} from "./helpRequests";
import axios from "axios";
import User from "../models/user";
import organisation from "../models/organisation";
import { HelpRequest } from "../models";
import user from "../models/user";
import { request } from "express";
import { UserInfo } from "../types";

export default function setupWebSockets(io: Server<any>) {
  const getUpdatedRequests = async (courseId: string) => {
    let requests = await HelpRequest.findMany({
      where: { course: { equals: courseId } },
    });
    for (let i = 0; i < requests.length; i++) {
      for (let j = 0; j < requests[i].students.length; j++) {
        let student = await user.getUserById(requests[i].students[j]);
        if (student !== null && student !== undefined) {
          (requests[i] as any).students[j] = student;
        }
      }
    }
    for (let i = 0; i < requests.length; i++) {
      let instructorId = requests[i].instructor;
      if (instructorId !== null) {
        let instructor = await user.getUserById(instructorId);
        (requests[i].instructor as any) = instructor;
      }
    }
    return requests;
  };
  console.log("Instantiating socket setup ");
  io.use(async (socket, next) => {
    const accessToken = socket.handshake.auth.accessToken;
    try {
      if (!accessToken) {
        next(new Error("Unauthorised"));
      }

      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.status !== 200) next(new Error("Unauthorised"));
      const googleUser = response.data;
      if (!googleUser) {
        next(new Error("Unauthorised"));
      }
      const user = await User.getUserByEmail(googleUser.email);
      if (!user) {
        next(new Error("User not found"));
      }

      (socket as any).user = user;
      next();
    } catch (error) {
      console.error(error);
      next(new Error("Authorisation Error"));
    }
    next();
  });
  io.on("connection", (socket: Socket<any>) => {
    console.log("Connection established with user: ", socket.id);

    socket.on("join", async (courseId: string, callback: Function) => {
      if (!callback) return;
      const org = await organisation.getOrganisationWithCourse(courseId);
      const roles = await Role.getRolesByUser((socket as any).user.id);
      let isInstructor = await Role.userHasRole(
        roles.map((role) => role.id!),
        "instructor",
        org?.id ?? ""
      );
      if (isInstructor) {
        let requests = await getUpdatedRequests(courseId);
        callback(requests);
      }

      callback([]);
    });

    socket.on("createRequest", async (data: any, callback: Function) => {
      const { content, course, students } = data;
      console.log("STUDENTS", students);
      await HelpRequest.create({
        data: { content, course, students },
      });
      let requests = await getUpdatedRequests(course);
      io.emit("requestsUpdated", requests);
      callback();
    });

    socket.on("updateStatus", async (data: any) => {
      const { course, request, destination } = data;
      const org = await organisation.getOrganisationWithCourse(course);
      const roles = await Role.getRolesByUser((socket as any).user.id);
      let isInstructor = await Role.userHasRole(
        roles.map((role) => role.id!),
        "instructor",
        org?.id ?? ""
      );
      if (!isInstructor) return;
      await HelpRequest.update({
        where: { id: request },
        data: {
          status: destination,
          instructor: destination === "WAITING" ? "" : (socket as any).user.id,
          finished_at: destination === "FINISHED" ? new Date() : null,
        },
      });
      let requests = await getUpdatedRequests(course);
      io.emit("requestsUpdated", requests);
    });

    socket.on("disconnect", () => {
      socket.disconnect();
      console.log(`User ${socket.id} disconnected`);
    });
  });

  instrument(io, {
    auth: false,
    mode: "development",
  });
}
