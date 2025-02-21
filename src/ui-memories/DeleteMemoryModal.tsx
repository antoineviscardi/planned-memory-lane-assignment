import { FormEvent, useContext } from "react";
import { Modal } from "../lib/ui/Modal";
import { useStore } from "zustand";
import { UiStateContext } from "../ui-state";

export default function DeleteMemoryModal() {
  const uiState = useContext(UiStateContext);
  if (!uiState) throw new Error("Missing ui state context");

  const isDeletingMemory = useStore(uiState, (s) => s.isDeletingMemory);
  const cancelDeleteMemory = useStore(uiState, (s) => s.cancelDeleteMemory);
  const confirmDeleteMemory = useStore(uiState, (s) => s.confirmDeleteMemory);

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    confirmDeleteMemory(isDeletingMemory!.id);
  }

  return (
    <Modal isOpen={!!isDeletingMemory} onClose={cancelDeleteMemory}>
      <form
        onSubmit={handleSubmit}
        className="bg-white border-zinc-600 border px-5 py-4 rounded"
      >
        <h4 className="mb-4 text-xl text-zinc-500">Delete memory</h4>
        <p className="mb-6">
          Are you sure you want to delete {isDeletingMemory?.name}? Deleting a
          memory is
          <b> irreversible</b>.
        </p>
        <div className="flex gap-2 justify-end ">
          <button
            onClick={cancelDeleteMemory}
            autoFocus
            type="button"
            className="px-2 py-1 rounded border border-zinc-300 bg-zinc-100 hover:bg-zinc-200 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-2 py-1 rounded border border-red-500 hover:bg-red-500 hover:text-red-50 text-red-500 transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </form>
    </Modal>
  );
}
