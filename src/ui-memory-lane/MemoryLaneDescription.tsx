import { useContext } from "react";
import { useStore } from "zustand";
import { UiStateContext } from "../ui-state";
import { PencilSquareIcon } from "@heroicons/react/20/solid";

export default function MemoryLaneDescription() {
  const uiState = useContext(UiStateContext);
  if (!uiState) throw new Error("Missing ui state context");

  const user = useStore(uiState, (s) => s.user);
  const editDescription = useStore(uiState, (s) => s.editDescription);

  return (
    <div className="relative border rounded border-zinc-200 px-8 py-6 mb-8">
      {user.memoryLaneDescription ? (
        <p>{user.memoryLaneDescription}</p>
      ) : (
        <p className="text-zinc-500">No description...</p>
      )}
      <button
        onClick={editDescription}
        className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-700 transition cursor-pointer"
      >
        <PencilSquareIcon className="size-5"></PencilSquareIcon>
      </button>
    </div>
  );
}
