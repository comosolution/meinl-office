"use client";
import { Button } from "@mantine/core";
import { IconBrandWindows } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Login() {
  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-2">
        <div className="flex justify-center items-center">
          <Image src="/logo.svg" alt="Meinl Logo" width={32} height={32} />
          <p className="text-2xl tracking-tighter text-(--main)">Office</p>
        </div>
        <Button
          color="black"
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
