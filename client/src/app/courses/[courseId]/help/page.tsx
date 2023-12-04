"use client";
import { useState } from "react";
import { useAppSelector } from "@/store";
import HelpRequestBoard from "@/components/helpRequests/HelpRequestBoard";
import HelpRequestForm from "../../../../components/helpRequests/HelpRequestForm";
import HelpRequestModal from "../../../../components/helpRequests/HelpRequestConfirmation";

const HelpRequest = () => {
  const [submitted, setSubmitted] = useState(false);
  const isUserInstructor = useAppSelector(
    (state) => state.user.roles.instructor
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
