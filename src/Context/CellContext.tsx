import React, { useState } from "react";
import { useContext, createContext } from "react";
import { IMeasureState } from "../types";

interface ICellContextProps {
  children: React.ReactNode;
}

export interface ICellContext {
  activeCell: string;
  setActiveCell: (cell: string) => void;
  activeMeasure: number | undefined;
  setActiveMeasure: (measureIndex: number) => void;
  activeRow: number | undefined;
  setActiveRow: (row: number | undefined) => void;
  copiedMeasure: IMeasureState | undefined;
  setCopiedMeasure: (measure: IMeasureState | undefined) => void;
  copiedStaffRow: IMeasureState[] | undefined;
  setCopiedStaffRow: (staffRow: IMeasureState[] | undefined) => void;
}

const CellContext = createContext<ICellContext | undefined>(undefined);

export const CellContextProvider = ({ children }: ICellContextProps) => {
  const [activeCell, setActiveCell] = useState("");
  const [activeMeasure, setActiveMeasure] = useState<number | undefined>(
    undefined
  );
  const [activeRow, setActiveRow] = useState<number | undefined>(undefined);
  const [copiedMeasure, setCopiedMeasure] = useState<IMeasureState | undefined>(
    undefined
  );
  const [copiedStaffRow, setCopiedStaffRow] = useState<
    IMeasureState[] | undefined
  >(undefined);
  return (
    <CellContext.Provider
      value={{
        activeCell,
        setActiveCell,
        activeMeasure,
        setActiveMeasure,
        activeRow,
        setActiveRow,
        copiedMeasure,
        setCopiedMeasure,
        copiedStaffRow,
        setCopiedStaffRow,
      }}
    >
      {children}
    </CellContext.Provider>
  );
};

export const useCellContext = () => {
  const context = useContext(CellContext);
  if (context === undefined) {
    throw new Error(
      "useCellContext must be called within a CellContextProvider."
    );
  }
  return context;
};
