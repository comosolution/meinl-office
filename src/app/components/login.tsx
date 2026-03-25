"use client";
import { Button, Paper } from "@mantine/core";
import { IconBrandWindows } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import DotPattern from "./dots";

export default function Login() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const errorFromQuery = searchParams.get("error");
    if (errorFromQuery === "CredentialsSignin") {
      setError("Falsches Kennwort. Bitte erneut versuchen.");
    } else if (errorFromQuery) {
      setError(
        "Ein unerwarteter Fehler ist aufgetreten. Bitte erneut versuchen.",
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", { redirect: false, password });

    if (result?.error) {
      setError("Falsches Kennwort. Bitte erneut versuchen.");
    }
  };

  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center">
      <Paper
        p="lg"
        shadow="xl"
        className="relative z-50 backdrop-blur-md shadow-black/20"
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-center items-center">
            <Image
              src="/logo_w.svg"
              alt="Meinl Logo"
              width={24}
              height={24}
              className="inverted"
            />
            <p className="text-xl font-bold tracking-tighter">Office</p>
          </div>
          <Button
            onClick={() => signIn("azure-ad")}
            leftSection={<IconBrandWindows size={16} />}
            fullWidth
          >
            Mit Microsoft Account anmelden
          </Button>
        </div>
      </Paper>
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(640px_circle_at_center,white,transparent)]",
        )}
      />
    </div>
  );
}
