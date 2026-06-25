"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { gameState as defaultGameState } from "../../data/gameState";
import { resolveGeneratorFuel } from "../../lib/generatorStation";
import { resolveCompletedHideoutInstallations } from "../../lib/hideoutInstallation";
import {
  clearSavedGameState,
  cloneGameState,
  normalizeSavedGameState,
  readSavedGameState,
  type SaveStatus,
  writeSavedGameState,
} from "../../lib/saveStorage";
import { resolveCompletedThreeDPrinterCrafts } from "../../lib/threeDPrinterCrafting";
import { grantInitialPrinterFilament } from "../../lib/threeDPrinterSupplies";
import { resolveCompletedWorkbenchCrafts } from "../../lib/workbenchCrafting";
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

function resolveTimedState(state: GameState, now: number) {
  const generatorState = resolveGeneratorFuel(state, now);
  const installationState = resolveCompletedHideoutInstallations(generatorState, now);
  const workbenchState = resolveCompletedWorkbenchCrafts(installationState, now);
  return resolveCompletedThreeDPrinterCrafts(workbenchState, now);
}

export function GameStateProvider({ children }: GameStateProviderProps) {
  const [state, setInternalState] = useState(() =>
    grantInitialPrinterFilament(cloneGameState(defaultGameState), true),
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("loading");

  useEffect(() => {
    const savedState = readSavedGameState();
    const savedPrinter = savedState?.hideoutModules?.find(
      (module) => module.id === "three_d_printer",
    );
    const shouldGrantInitialFilament =
      savedPrinter?.printerFilamentSlot === undefined;
    const normalizedState = normalizeSavedGameState(savedState, defaultGameState);
    const stateWithInitialFilament = grantInitialPrinterFilament(
      normalizedState,
      shouldGrantInitialFilament,
    );
    const resolvedState = resolveTimedState(
      stateWithInitialFilament,
      Date.now(),
    );

    setInternalState(resolvedState);
    writeSavedGameState(resolvedState);
    setSaveStatus("ready");
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setInternalState((currentState) => {
        const nextState = resolveTimedState(currentState, Date.now());

        if (nextState === currentState) {
          return currentState;
        }

        const didSave = writeSavedGameState(nextState);
        setSaveStatus(didSave ? "ready" : "error");

        return nextState;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  function setState(nextState: GameState) {
    setInternalState(nextState);

    const didSave = writeSavedGameState(nextState);
    setSaveStatus(didSave ? "ready" : "error");
  }

  function resetState() {
    clearSavedGameState();
    setInternalState(
      grantInitialPrinterFilament(cloneGameState(defaultGameState), true),
    );
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
