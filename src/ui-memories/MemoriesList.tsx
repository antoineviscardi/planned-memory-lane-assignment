import dayjs from "dayjs";
import { Memory } from "../lib/domain";
import Dropdown from "../lib/ui/Dropdown";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useStore } from "zustand";
import { UiStateContext } from "../ui-state";
import { useContext } from "react";
import MemoryForm from "./MemoryForm";
import DeleteMemoryModal from "./DeleteMemoryModal";

interface Props {
  memories: Memory[];
}

export default function MemoriesList({ memories }: Props) {
  const uiState = useContext(UiStateContext);
  if (!uiState) throw new Error("Missing ui state context");

  const editMemory = useStore(uiState, (s) => s.editMemory);
  const cancelEditMemory = useStore(uiState, (s) => s.cancelEditMemory);
  const confirmEditMemory = useStore(uiState, (s) => s.confirmEditMemory);
  const isEditingMemory = useStore(uiState, (s) => s.isEditingMemory);

  const deleteMemory = useStore(uiState, (s) => s.deleteMemory);

  function formatTimestamp(timestamp: string) {
    return dayjs(timestamp).format("MMMM D, YYYY");
  }

  return (
    <>
      <DeleteMemoryModal></DeleteMemoryModal>
      <ul>
        {memories.map((memory) => {
          if (memory.id === isEditingMemory?.id) {
            return (
              <MemoryForm
                key={memory.id}
                memory={memory}
                onCancel={cancelEditMemory}
                onSubmit={confirmEditMemory}
                confirmText="Confirm"
              ></MemoryForm>
            );
          }

          return (
            <li key={memory.id}>
              <div className="mb-4 px-4 py-3 rounded bg-zinc-50 flex flex-col border border-zinc-100">
                <div className="flex justify-between gap-4">
                  <h4 className="text-xl font-bold text-zinc-700">
                    {memory.name}
                  </h4>
                  <Dropdown
                    align="right"
                    button={
                      <div className="size-6 hover:text-zinc-700 translate-x-2 text-zinc-400 cursor-pointer">
                        <EllipsisVerticalIcon className="size-6 "></EllipsisVerticalIcon>
                      </div>
                    }
                    content={
                      <ul className="px-2 py-1">
                        <li>
                          <button
                            onClick={() => editMemory(memory.id)}
                            className="text-left w-full text-zinc-600 cursor-pointer hover:text-zinc-900 transition"
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => deleteMemory(memory.id)}
                            className="text-left w-full text-red-400 cursor-pointer hover:text-red-600 transition"
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    }
                  ></Dropdown>
                </div>
                <p className="text-zinc-500 mb-2">
                  {formatTimestamp(memory.timestampISO)}
                </p>
                <p className="text-zinc-700 mb-4">{memory.description}</p>
                <div className="flex flex-wrap gap-4">
                  {memory.images.map((url) => (
                    <div
                      key={url}
                      className="w-28  rounded overflow-hidden  flex items-center justify-center"
                    >
                      <img
                        alt="memory image"
                        src={url}
                        className="size-full object-contain"
                      ></img>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
