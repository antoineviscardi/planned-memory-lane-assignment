import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useContext } from "react";
import { UiStateContext } from "../ui-state";
import { useStore } from "zustand";
import Dropdown from "../lib/ui/Dropdown";

export default function Toolbar() {
  const uiState = useContext(UiStateContext);
  if (!uiState) throw new Error("Missing ui state context");

  const sortOrder = useStore(uiState, (s) => s.sortOrder);
  const createNewMemory = useStore(uiState, (s) => s.createNewMemory);
  const changeSortOrder = useStore(uiState, (s) => s.changeSortOrder);

  function handleSelectNewToOld() {
    changeSortOrder("newToOld");
  }

  function handleSelectOldToNew() {
    changeSortOrder("oldToNew");
  }

  return (
    <div className="mb-8 flex justify-between items-center">
      <Dropdown
        button={
          <div className="flex gap-2 items-center border border-zinc-200 rounded px-2 py-1 text-sm bg-zinc-100 hover:bg-zinc-200 transition cursor-pointer text-zinc-700">
            {sortOrder === "oldToNew" ? "Older to new" : "Newer to older"}
            <ChevronDownIcon className="size-5 text-zinc-600"></ChevronDownIcon>
          </div>
        }
        content={
          <ul className="p-1 text-sm text-nowrap flex flex-col gap-1">
            <li>
              <button
                onClick={handleSelectNewToOld}
                className={`rounded px-2 py-1 ${sortOrder === "newToOld" ? "bg-zinc-200" : "hover:bg-zinc-100"}`}
              >
                Newer to old
              </button>
            </li>
            <li>
              <button
                onClick={handleSelectOldToNew}
                className={`rounded px-2 py-1 ${sortOrder === "oldToNew" ? "bg-zinc-200" : "hover:bg-zinc-100"}`}
              >
                Older to new
              </button>
            </li>
          </ul>
        }
      ></Dropdown>
      <button
        onClick={createNewMemory}
        className="px-2 py-1 rounded items-center border border-blue-500 text-blue-700 text-sm flex gap-2 hover:text-blue-50 hover:bg-blue-500 cursor-pointer transition"
      >
        <PlusIcon className="size-5"></PlusIcon>
        New memory
      </button>
    </div>
  );
}
