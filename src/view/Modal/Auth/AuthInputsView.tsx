import React from "react";
import { Flex } from "@chakra-ui/react";
import LoginView from "./LoginView";
import SignUpView from "./SignUpView";

type AuthInputsViewProps = {
    view: "login" | "signup" | "resetPassword";
  };
  
  const AuthInputsView: React.FC<AuthInputsViewProps> = ({ view }) => {
    return (
      <Flex direction="column" align="center" width="100%" mt={4}>
        {view === "login" && <LoginView />}
        {view === "signup" && <SignUpView />}
        {view === "resetPassword"}
      </Flex>
    );
  };

export default AuthInputsView; 