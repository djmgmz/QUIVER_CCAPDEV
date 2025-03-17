import React from "react";
import { Flex } from "@chakra-ui/react";
import Login from "../../Auth/Login";
import SignUp from "../../Auth/SignUp";

type AuthInputsViewProps = {
    view: "login" | "signup" | "resetPassword";
  };
  
  const AuthInputsView: React.FC<AuthInputsViewProps> = ({ view }) => {
    return (
      <Flex direction="column" align="center" width="100%" mt={4}>
        {view === "login" && <Login />}
        {view === "signup" && <SignUp />}
        {view === "resetPassword"}
      </Flex>
    );
  };

export default AuthInputsView; 