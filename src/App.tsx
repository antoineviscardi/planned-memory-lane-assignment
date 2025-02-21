import "./App.css";
import { useEffect, useRef, useState } from "react";
import { UiStateContext, UiStateStore, createUiStateStore } from "./ui-state";
import { Memory, User, memorySchema, userSchema } from "./lib/domain";
import { z } from "zod";
import LoadingScreen from "./LoadingScreen";
import MemoryLanePage from "./ui-memory-lane/MemoryLanePage";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const uiStateStore = useRef<UiStateStore | null>(null);

  useEffect(() => {
    async function fetchUser(): Promise<User> {
      const response = await fetch(`${import.meta.env.VITE_API_HOST}/user`);
      const body = await response.json();
      const valid = z.object({ user: userSchema }).parse(body);
      return valid.user;
    }

    async function fetchMemories(): Promise<Memory[]> {
      const response = await fetch(`${import.meta.env.VITE_API_HOST}/memories`);
      const body = await response.json();
      const valid = z.object({ memories: memorySchema.array() }).parse(body);
      return valid.memories;
    }

    async function loadData() {
      setIsLoading(true);

      const [user, memories] = await Promise.all([
        fetchUser(),
        fetchMemories(),
      ]);

      uiStateStore.current = createUiStateStore({ user, memories });
      uiStateStore.current.getState().changeSortOrder("newToOld");

      setIsLoading(false);
    }

    loadData();
  }, []);

  if (isLoading) {
    return <LoadingScreen></LoadingScreen>;
  } else {
    return (
      <UiStateContext.Provider value={uiStateStore.current}>
        <MemoryLanePage></MemoryLanePage>;
      </UiStateContext.Provider>
    );
  }
}

export default App;
