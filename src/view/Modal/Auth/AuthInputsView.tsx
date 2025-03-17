import React from "react";
import { Flex } from "@chakra-ui/react";
import LoginView from "./LoginView";
import SignUp from "../../Auth/SignUp";

type AuthInputsViewProps = {
    view: "login" | "signup" | "resetPassword";
  };
  
  const AuthInputsView: React.FC<AuthInputsViewProps> = ({ view }) => {
    return (
      <Flex direction="column" align="center" width="100%" mt={4}>
        {view === "login" && <LoginView />}
        {view === "signup" && <SignUp />}
        {view === "resetPassword"}
      </Flex>
    );
  };

export default AuthInputsView; 