"use client";
import { Button } from "@mantine/core";
import { IconBrandWindows } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import Logo from "./logo";

export default function Login() {
  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-2">
        <Logo />
        <Button
          color="dark"
          onClick={() => signIn("azure-ad")}
          leftSection={<IconBrandWindows size={16} />}
          fullWidth
        >
          Mit Microsoft Account anmelden
        </Button>
      </div>
    </div>
  );
}
