import { useContext } from "react";
import { UiStateContext } from "../ui-state";
import { useStore } from "zustand";
import Toolbar from "./Toolbar";
import MemoriesList from "../ui-memories/MemoriesList";
import MemoryForm from "../ui-memories/MemoryForm";
import Header from "./Header";
import MemoryLaneDescription from "./MemoryLaneDescription";
import MemoryLaneDescriptionForm from "./MemoryLaneDescriptionForm";

export default function MemoryLanePage() {
  const uiState = useContext(UiStateContext);
  if (!uiState) throw new Error("Missing ui state context");

  const memories = useStore(uiState, (s) => s.memories);
  const isCreatingMemory = useStore(uiState, (s) => s.isCreatingMemory);
  const isEditingDescription = useStore(uiState, (s) => s.isEditingDescription);

  const cancelCreateNewMemory = useStore(
    uiState,
    (s) => s.cancelCreateNewMemory,
  );
  const confirmCreateNewMemory = useStore(
    uiState,
    (s) => s.confirmCreateNewMemory,
  );

  return (
    <div>
      <Header></Header>
      <div className="max-w-4xl m-auto p-8">
        {isEditingDescription ? (
          <MemoryLaneDescriptionForm></MemoryLaneDescriptionForm>
        ) : (
          <MemoryLaneDescription></MemoryLaneDescription>
        )}

        <Toolbar></Toolbar>

        {isCreatingMemory && (
          <MemoryForm
            onCancel={cancelCreateNewMemory}
            onSubmit={confirmCreateNewMemory}
            isFilesRequired={true}
          ></MemoryForm>
        )}

        {memories.length === 0 && !isCreatingMemory ? (
          <div className="text-zinc-600 m-auto w-min text-nowrap mt-40">
            <p className="text-2xl">No memories yet</p>
            <p>Create a memory using the "New memory" button.</p>
          </div>
        ) : (
          <MemoriesList memories={memories}></MemoriesList>
        )}
      </div>
    </div>
  );
}
