"use client";
import { useState } from "react";
import HelpRequestForm from "../../../../components/helpRequests/HelpRequestForm";
import HelpRequestModal from "../../../../components/helpRequests/HelpRequestConfirmation";
import { useAppSelector } from "@/store";
import HelpRequestBoard from "@/components/helpRequests/HelpRequestBoard";

const HelpRequest = () => {
  const [submitted, setSubmitted] = useState(false);
  const isUserInstructor = useAppSelector((state) => state.user).roles.some(
    (role) => role.title === "instructor"
  );

  return (
    <>
      {isUserInstructor ? (
        <HelpRequestBoard />
      ) : submitted ? (
        <HelpRequestModal />
      ) : (
        <HelpRequestForm setSubmitted={setSubmitted} />
      )}
    </>
  );
};

export default HelpRequest;
