import React from "react";
import { Button, Html, Text, Heading } from "@react-email/components";

function ResetPass({ name, url }) {
  return (
    <Html>
      <Heading>Hello {name}</Heading>
      <Text>
        You have requested to reset your password. If it is not you then please
        ignore it.
      </Text>
      <Button
        href={url}
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Reset Password
      </Button>
    </Html>
  );
}

export default ResetPass;
