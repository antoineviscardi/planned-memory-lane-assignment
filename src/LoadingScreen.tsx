import { ArrowPathIcon, CubeIcon } from "@heroicons/react/20/solid";

export default function LoadingScreen() {
  return (
    <div className="flex-col gap-8 absolute w-dvw h-dvh flex items-center justify-center">
      <div className="flex items-center gap-2">
        <CubeIcon className="size-12 text-blue-500" />
        <h1 className="text-3xl font-semibold text-gray-900 mb-4 ml-4 mt-4">
          Memory lane
        </h1>
      </div>
      <ArrowPathIcon className="size-12 animate-spin text-zinc-700"></ArrowPathIcon>
    </div>
  );
}
