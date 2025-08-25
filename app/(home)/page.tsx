import Header from "@/components/layouts/header";

export default function Home() {
  return (
    <div className="w-full md:overflow-hidden flex flex-col items-center justify-center">
      <div className="flex w-full flex-col gap-4 my-10 items-center">
        <Header />
      </div>
    </div>
  );
}
