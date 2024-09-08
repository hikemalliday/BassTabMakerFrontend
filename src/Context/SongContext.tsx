import { createContext, useContext, useState } from "react";
import { ISongMetadata, ISongState } from "../types";

interface ISongContextProps {
  children: React.ReactNode;
}

export interface ISongContext {
  songState: ISongState;
  setSongState: (songState: ISongState) => void;
  songName: string;
  setSongName: (name: string) => void;
  songNameInt: number;
  setSongNameInt: (songNameInt: number) => void;
  songNames: Record<string, number>;
  setSongNames: (songNames: Record<string, number>) => void;
  songMetadata: ISongMetadata;
  setSongMetadata: (metadata: ISongMetadata) => void;
  instrument: string | undefined;
  setInstrument: (instrument: string | undefined) => void;
  timeSignature: number;
  setTimeSignature: (timeSignature: number) => void;
  clearSongContext: () => void;
}

const SongContext = createContext<ISongContext | undefined>(undefined);

export const SongContextProvider = ({ children }: ISongContextProps) => {
  const metadataPlaceholder = {
    song_name: "",
    artist: "",
    bpm: 0,
    time_signature: 4,
    instrument: "bass",
  };

  const [songState, setSongState] = useState<ISongState>({});
  const [songName, setSongName] = useState("");
  const [songNameInt, setSongNameInt] = useState(0);
  const [songNames, setSongNames] = useState<Record<string, number>>({});
  const [songMetadata, setSongMetadata] =
    useState<ISongMetadata>(metadataPlaceholder);
  const [instrument, setInstrument] = useState<string | undefined>(undefined);
  const [timeSignature, setTimeSignature] = useState(4);

  const clearSongContext = () => {
    setSongState({});
    setSongNameInt(0);
    setSongName("");
    setSongNames({});
  };

  return (
    <SongContext.Provider
      value={{
        songState,
        setSongState,
        songName,
        setSongName,
        songNameInt,
        setSongNameInt,
        songNames,
        setSongNames,
        songMetadata,
        setSongMetadata,
        clearSongContext,
        instrument,
        setInstrument,
        timeSignature,
        setTimeSignature,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSongContext = () => {
  const context = useContext(SongContext);
  if (context === undefined) {
    throw new Error(
      "useSongContext must be called within a SongContextProvider"
    );
  }
  return context;
};
