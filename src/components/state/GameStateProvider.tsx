"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { gameState as defaultGameState } from "../../data/gameState";
import {
  clearSavedGameState,
  cloneGameState,
  readSavedGameState,
  type SaveStatus,
  writeSavedGameState,
} from "../../lib/saveStorage";
import type { GameState } from "../../types/state";

type GameStateContextValue = {
  state: GameState;
  saveStatus: SaveStatus;
  setState: (nextState: GameState) => void;
  resetState: () => void;
};

const GameStateContext = createContext<GameStateContextValue | null>(null);

type GameStateProviderProps = {
  children: React.ReactNode;
};

export function GameStateProvider({ children }: GameStateProviderProps) {
  const [state, setInternalState] = useState(() => cloneGameState(defaultGameState));
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("loading");

  useEffect(() => {
    const savedState = readSavedGameState();

    if (savedState) {
      setInternalState(savedState);
    }

    setSaveStatus("ready");
  }, []);

  function setState(nextState: GameState) {
    setInternalState(nextState);

    const didSave = writeSavedGameState(nextState);
    setSaveStatus(didSave ? "ready" : "error");
  }

  function resetState() {
    clearSavedGameState();
    setInternalState(cloneGameState(defaultGameState));
    setSaveStatus("ready");
  }

  const contextValue = useMemo<GameStateContextValue>(
    () => ({
      state,
      saveStatus,
      setState,
      resetState,
    }),
    [state, saveStatus],
  );

  return (
    <GameStateContext.Provider value={contextValue}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const contextValue = useContext(GameStateContext);

  if (!contextValue) {
    throw new Error("useGameState must be used inside GameStateProvider");
  }

  return contextValue;
}
