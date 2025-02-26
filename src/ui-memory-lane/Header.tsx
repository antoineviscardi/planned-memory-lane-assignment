import { CubeIcon } from "@heroicons/react/20/solid";
import { useContext } from "react";
import { UiStateContext } from "../ui-state";
import { useStore } from "zustand";
import ShareButton from "./ShareButton";

export default function Header() {
  const uiState = useContext(UiStateContext);
  if (!uiState) throw new Error("Missing ui state context");

  const user = useStore(uiState, (s) => s.user);

  return (
    <header className="sticky top-0 bg-zinc-50 z-10 border-zinc-200 border-b ">
      <div className="m-auto h-24 max-w-4xl flex px-8 gap-4 items-center">
        <CubeIcon className="min-w-12 size-12 text-blue-500" />
        <h1 className="text-xl md:text-3xl font-semibold text-gray-900 mb-4 ml-4 mt-4">
          {user.name}
          {user.name.endsWith("s") ? "'" : "'s"} memory lane
        </h1>
        <div className="grow"></div>
        <ShareButton></ShareButton>
      </div>
    </header>
  );
}
