import { create } from "zustand";
import { Memory, memorySchema, User } from "./lib/domain";
import { createContext } from "react";
import dayjs from "dayjs";

type SortOrder = "newToOld" | "oldToNew";

interface State {
  user: User;
  memories: Memory[];

  isCreatingMemory: boolean;
  isEditingDescription: boolean;
  isDeletingMemory: Memory | null;
  isEditingMemory: Memory | null;
  sortOrder: SortOrder;
}

interface Action {
  changeSortOrder: (sortOrder: SortOrder) => Promise<void>;

  createNewMemory: () => Promise<void>;
  cancelCreateNewMemory: () => Promise<void>;
  confirmCreateNewMemory: (
    formData: FormData,
    dataURLs: string[],
  ) => Promise<void>;

  editDescription: () => Promise<void>;
  cancelEditDescription: () => Promise<void>;
  confirmEditDescription: (description: string) => Promise<void>;

  deleteMemory: (id: string) => Promise<void>;
  cancelDeleteMemory: () => Promise<void>;
  confirmDeleteMemory: (id: string) => Promise<void>;

  editMemory: (id: string) => Promise<void>;
  cancelEditMemory: () => Promise<void>;
  confirmEditMemory: (formData: FormData, dataURLs: string[]) => Promise<void>;
}

export type UiStateStore = ReturnType<typeof createUiStateStore>;

export function createUiStateStore(data: Pick<State, "user" | "memories">) {
  return create<State & Action>((set) => ({
    user: data.user,
    memories: data.memories,
    sortOrder: "newToOld",

    isCreatingMemory: false,
    isEditingDescription: false,
    isDeletingMemory: null,
    isEditingMemory: null,

    async shareMemoryLane() {
      console.debug("share memory lane");
    },

    async createNewMemory() {
      console.debug("create new memory");
      set(() => ({
        isEditingDescription: false,
        isDeletingMemory: null,
        isEditingMemory: null,
        isCreatingMemory: true,
      }));
    },

    async cancelCreateNewMemory() {
      console.debug("cancel create new memory");
      set(() => ({ isCreatingMemory: false }));
    },

    async confirmCreateNewMemory(formData: FormData, dataURLs: string[]) {
      console.debug("confirm create new memory");

      const isoDatetime = dayjs(
        formData.get("timestampISO")!.toString(),
      ).toISOString();
      formData.set("timestampISO", isoDatetime);

      const memory = memorySchema.parse({
        id: formData.get("id"),
        name: formData.get("name"),
        description: formData.get("description"),
        timestampISO: formData.get("timestampISO"),
        images: dataURLs,
      });

      set((state) => ({
        isCreatingMemory: false,
        memories: sortMemories([...state.memories, memory], state.sortOrder),
      }));

      refreshOnFetchError(
        fetch(`${import.meta.env.VITE_API_HOST}/memories`, {
          method: "POST",
          body: formData,
        }),
      );
    },

    async changeSortOrder(sortOrder: SortOrder) {
      console.debug("change sort order");
      set((state) => {
        return {
          sortOrder,
          memories: sortMemories(state.memories, sortOrder),
        };
      });
    },

    async editDescription() {
      console.debug("edit description");
      set(() => ({
        isDeletingMemory: null,
        isEditingMemory: null,
        isCreatingMemory: false,
        isEditingDescription: true,
      }));
    },

    async cancelEditDescription() {
      console.debug("cancel edit description");
      set(() => ({ isEditingDescription: false }));
    },

    async confirmEditDescription(description: string) {
      console.debug("confirm edit description");

      set((state) => ({
        isEditingDescription: false,
        user: { ...state.user, memoryLaneDescription: description },
      }));

      refreshOnFetchError(
        fetch(`${import.meta.env.VITE_API_HOST}/description`, {
          method: "PUT",
          body: JSON.stringify({ description }),
          headers: { "Content-Type": "application/json" },
        }),
      );
    },

    async deleteMemory(id: string) {
      console.debug("delete memory");
      set((state) => {
        const memory = state.memories.find((m) => m.id === id);
        if (!memory) throw new Error("Memory not found");
        return {
          isCreatingMemory: false,
          isEditingDescription: false,
          isEditingMemory: null,
          isDeletingMemory: memory,
        };
      });
    },

    async cancelDeleteMemory() {
      console.debug("cancel delete memory ");
      set(() => ({ isDeletingMemory: null }));
    },

    async confirmDeleteMemory(id: string) {
      console.debug("confirm delete memory");

      set((state) => ({
        isDeletingMemory: null,
        memories: [...state.memories].filter((m) => m.id !== id),
      }));

      await refreshOnFetchError(
        fetch(`${import.meta.env.VITE_API_HOST}/memories/${id}`, {
          method: "DELETE",
        }),
      );
    },

    async editMemory(id: string) {
      console.debug("edit memory");
      set((state) => {
        const memory = state.memories.find((m) => m.id === id);
        if (!memory) throw new Error("Memory not found");
        return {
          isCreatingMemory: false,
          isEditingDescription: false,
          isDeletingMemory: null,
          isEditingMemory: memory,
        };
      });
    },

    async cancelEditMemory() {
      console.debug("cancel edit memory ");
      set(() => ({ isEditingMemory: null }));
    },

    async confirmEditMemory(formData: FormData, dataURLs: string[]) {
      console.debug("confirm create new memory");

      const isoDatetime = dayjs(
        formData.get("timestampISO")!.toString(),
      ).toISOString();
      formData.set("timestampISO", isoDatetime);

      const memory = memorySchema.parse({
        id: formData.get("id"),
        name: formData.get("name"),
        description: formData.get("description"),
        timestampISO: formData.get("timestampISO"),
        images: dataURLs,
      });

      set((state) => {
        const updated = [...state.memories];
        const idx = updated.findIndex((m) => m.id === memory.id);
        updated.splice(idx, 1, memory);

        return {
          isEditingMemory: null,
          memories: sortMemories(updated, state.sortOrder),
        };
      });

      // Insure we don't remove images if not changed (empty input);
      if (!(formData.get("images") as File).size) {
        formData.delete("images");
      }

      refreshOnFetchError(
        fetch(`${import.meta.env.VITE_API_HOST}/memories/${memory.id}`, {
          method: "PUT",
          body: formData,
        }),
      );
    },
  }));
}

export const UiStateContext = createContext<UiStateStore | null>(null);

async function refreshOnFetchError(responsePromise: Promise<Response>) {
  const response = await responsePromise.catch((err) => {
    console.error("fetch error", err);
    window.location.reload();
  });

  if (response && (response.status < 200 || response.status >= 300)) {
    window.location.reload();
  }
}

function sortMemories(memories: Memory[], order: SortOrder): Memory[] {
  const sorted = [...memories].sort(
    (a, b) =>
      (order === "oldToNew" ? 1 : -1) *
      dayjs(a.timestampISO).diff(b.timestampISO),
  );
  return sorted;
}
