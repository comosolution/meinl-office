"use client";
import { Button, Paper, PasswordInput } from "@mantine/core";
import { IconLock, IconLogin2 } from "@tabler/icons-react";
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
        "Ein unerwarteter Fehler ist aufgetreten. Bitte erneut versuchen."
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
        shadow="xl"
        className="w-[420px] relative z-50 p-8 flex flex-col items-center gap-8 backdrop-blur-md shadow-2xl shadow-black/20"
      >
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
          <div className="flex justify-center items-center cursor-pointer hover:opacity-80">
            <Image src="/logo.svg" alt="Meinl Logo" width={24} height={24} />
            <p className="text-xl font-bold tracking-tighter">Office</p>
          </div>
          <PasswordInput
            size="lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftSectionPointerEvents="none"
            leftSection={<IconLock size={16} />}
            error={error}
          />
          <Button
            size="lg"
            type="submit"
            leftSection={<IconLogin2 size={16} />}
          >
            Einloggen
          </Button>
        </form>
      </Paper>
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(640px_circle_at_center,white,transparent)]"
        )}
      />
    </div>
  );
}
