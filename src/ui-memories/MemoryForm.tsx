import { FormEvent, useContext, useState } from "react";
import { UiStateContext } from "../ui-state";
import dayjs from "dayjs";
import ImagesInput from "./ImagesInput";
import { nanoid } from "nanoid";
import { Memory } from "../lib/domain";

interface Props {
  memory?: Memory;
  confirmText?: string;
  onCancel: () => void;
  onSubmit: (formData: FormData, imageURLs: string[]) => void;
  isFilesRequired?: boolean;
}

export default function MemoryForm({
  memory,
  confirmText,
  onCancel,
  onSubmit,
  isFilesRequired,
}: Props) {
  const uiState = useContext(UiStateContext);
  if (!uiState) throw new Error("Missing ui state context");

  const [imageURLs, setImageURLs] = useState<string[]>(memory?.images ?? []);

  const defaultTimestamp = dayjs(memory?.timestampISO ?? new Date()).format(
    "YYYY-MM-DDThh:mm",
  );

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    console.debug("submit");

    const formData = new FormData(ev.currentTarget as HTMLFormElement);
    onSubmit(formData, imageURLs);
    return false;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" defaultValue={memory?.id ?? nanoid()} />

        <div className="flex flex-col gap-4 mb-8 bg-zinc-50 border border-zinc-100 rounded py-3 px-4">
          <div className="flex gap-4 md:flex-row flex-col">
            <input
              type="datetime-local"
              name="timestampISO"
              defaultValue={defaultTimestamp}
              placeholder="Date"
              className="border border-zinc-300 rounded px-2 py-1"
              required
            />
            <input
              type="text"
              name="name"
              defaultValue={memory?.name}
              autoFocus
              placeholder="Name"
              className="border border-zinc-300 rounded px-2 py-1 w-full"
              required
            />
          </div>
          <textarea
            name="description"
            defaultValue={memory?.description}
            placeholder="Description"
            className="border border-zinc-300 rounded px-2 py-1 w-full"
            required
          />

          <ImagesInput
            imageURLs={memory?.images}
            onChange={setImageURLs}
            isRequired={isFilesRequired}
          ></ImagesInput>

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="hover:bg-zinc-200 border-zinc-300 px-2 py-1 cursor-pointer text-zinc-700 rounded border"
            >
              Cancel
            </button>
            <button
              type="submit"
              value="Submit"
              className="border-blue-600 bg-blue-500 cursor-pointer px-2 py-1 text-blue-50 hover:bg-blue-600 rounded border"
            >
              {confirmText ?? "Create"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
