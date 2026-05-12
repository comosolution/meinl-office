import Image from "next/image";

export default function Loader({ full }: { full?: boolean }) {
  return (
    <div
      className={`${full ? "w-screen h-screen" : "w-full h-[calc(100vh-64px)] md:h-screen p-16"} flex justify-center items-center overflow-hidden`}
    >
      <Image
        src="/logo.svg"
        width={36}
        height={36}
        alt="Meinl Logo"
        className="animate-bounce"
      />
    </div>
  );
}
