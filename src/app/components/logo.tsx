import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center items-center">
      <Image src="/logo.svg" alt="Meinl Logo" width={32} height={32} />
      <p className="text-2xl tracking-tighter text-(--main)">Office</p>
    </div>
  );
}
