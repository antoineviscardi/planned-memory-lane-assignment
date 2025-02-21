import { FormEvent, useContext, useState } from "react";
import { useStore } from "zustand";
import { UiStateContext } from "../ui-state";

export default function MemoryLaneForm() {
  const uiState = useContext(UiStateContext);
  if (!uiState) throw new Error("Missing ui state context");

  const user = useStore(uiState, (s) => s.user);
  const cancelEditDescription = useStore(
    uiState,
    (s) => s.cancelEditDescription,
  );
  const confirmEditDescription = useStore(
    uiState,
    (s) => s.confirmEditDescription,
  );

  const [description, setDescription] = useState(user.memoryLaneDescription);

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    console.log(ev.isDefaultPrevented(), ev.isPropagationStopped());
    confirmEditDescription(description);
  }

  return (
    <div className="relative border rounded border-zinc-200 mb-8">
      <form onSubmit={handleSubmit}>
        <textarea
          autoFocus
          required
          name="description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          className="w-full px-8 py-6 rounded"
          placeholder="No description..."
        ></textarea>

        <div className="absolute bottom-0 left-0 w-full flex justify-end gap-4 p-4">
          <button
            type="button"
            onClick={cancelEditDescription}
            className="cursor-pointer border border-zinc-200 hover:bg-zinc-100 rounded transition text-zinc-600 px-2 py-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer border border-zinc-600 hover:bg-zinc-600 rounded transition text-zinc-50 px-2 py-1 bg-zinc-500"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
