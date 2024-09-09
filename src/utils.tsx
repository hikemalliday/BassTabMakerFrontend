import {
  ISong,
  IMeasureState,
  INotePost,
  ISongMetadata,
  ISongState,
  ISoundNote,
} from "./types";

import * as Tone from "tone";

export const focusCell = (key: string): void => {
  const cell = document.getElementById(key);
  if (cell) {
    cell.focus();
  }
};

export const reduceSong = (song: ISong): IMeasureState[] => {
  const results = [];
  const seenMeasures = new Set();
  let measureObj = {} as IMeasureState;

  for (let i = 0; i < song.notes.length; i++) {
    const note = song.notes[i];
    const measure = note.measure;
    const string = note.string;
    const time_interval = note.time_interval;
    const fret = note.fret;

    if (!seenMeasures.has(measure)) {
      if (i > 0) {
        results.push(measureObj);
      }
      measureObj = {};
      seenMeasures.add(measure);
    }
    if (string === null && time_interval === null) {
      measureObj = {};
      continue;
    }
    measureObj[`${measure}-${string}-${time_interval}`] = fret;
  }
  results.push(measureObj);
  return results;
};

export const unReduceSong = (
  songState: ISongState,
  songNameInt: number
): INotePost[] => {
  const results: INotePost[] = [];
  const regex = /^(\d+)-(\d+)-(\d+)/;
  for (let i = 0; i < songState[songNameInt].length; i++) {
    const measure = songState[songNameInt][i];
    const measureEntries = Object.entries(measure);
    if (measureEntries.length === 0) {
      results.push({
        song_id: songNameInt,
        measure: i,
      });
      continue;
    }
    measureEntries.map(([key, val]) => {
      const matches = key.match(regex);
      if (matches) {
        const measureInt = matches[1];
        const stringInt = matches[2];
        const timeInterval = matches[3];
        const noteObj = {
          song_id: songNameInt,
          measure: Number(measureInt),
          string: Number(stringInt),
          time_interval: Number(timeInterval),
          fret: Number(val),
        };
        results.push(noteObj);
      }
    });
  }
  return results;
};

export const reduceSongMetadata = (song: ISong): ISongMetadata => {
  return {
    song_name: song["song_name"] || "",
    artist: song["artist"] || "",
    bpm: song["bpm"] || 0,
    time_signature: song["time_signature"] || 4,
    instrument: song["instrument"] || "bass",
  };
};

export const handleCellInput = (
  e: React.KeyboardEvent<HTMLDivElement>,
  key: string,
  songState: ISongState,
  songStateSetter: (state: ISongState) => void,
  activeCell: string,
  activeCellSetter: (activeCell: string) => void,
  songNameInt: number
) => {
  const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  const regex = /^(\d+)-(\d+)-(\d+)/;
  const matches = key.match(regex);
  let measureRegex = 0;
  let stringRegex = 0;
  let timeIntervalRegex = 0;

  if (activeCell === key) {
    if (matches) {
      measureRegex = Number(matches[1]);
      stringRegex = Number(matches[2]);
      timeIntervalRegex = Number(matches[3]);
    } else return;

    if (e.key === "Delete" || e.key === "Backspace") {
      const stateCopy = { ...songState };
      delete stateCopy[songNameInt][measureRegex][key];
      songStateSetter(stateCopy);
      return;
    }

    if (arrowKeys.includes(e.key)) {
      switch (e.key) {
        case "ArrowUp":
          if (stringRegex === 0) {
            if (songState[songNameInt][measureRegex - 4] === undefined) return;
            measureRegex -= 4;
            stringRegex = 3;
          } else {
            stringRegex -= 1;
          }
          key = `${measureRegex}-${stringRegex}-${timeIntervalRegex}`;
          activeCellSetter(key);
          focusCell(key);
          break;
        case "ArrowDown":
          if (stringRegex === 3) {
            if (songState[songNameInt][measureRegex + 4] === undefined) return;
            measureRegex += 4;
            stringRegex = 0;
          } else {
            stringRegex += 1;
          }
          key = `${measureRegex}-${stringRegex}-${timeIntervalRegex}`;
          activeCellSetter(key);
          focusCell(key);
          break;
        case "ArrowLeft":
          if (timeIntervalRegex === 0) {
            if (songState[songNameInt][measureRegex - 1] === undefined) return;
            measureRegex -= 1;
            timeIntervalRegex = 15;
          } else {
            timeIntervalRegex -= 1;
          }
          key = `${measureRegex}-${stringRegex}-${timeIntervalRegex}`;
          activeCellSetter(key);
          focusCell(key);
          break;
        case "ArrowRight":
          if (timeIntervalRegex === 15) {
            if (songState[songNameInt][measureRegex + 1] === undefined) return;
            measureRegex += 1;
            timeIntervalRegex = 0;
          } else {
            timeIntervalRegex += 1;
          }
          key = `${measureRegex}-${stringRegex}-${timeIntervalRegex}`;
          activeCellSetter(key);
          focusCell(key);
          break;
      }
      return;
    }
    // Handle double digit entries
    if (!isNaN(Number(e.key))) {
      const stateCopy = { ...songState };
      const currVal = stateCopy[songNameInt][measureRegex][key] ?? "";
      let newVal = "";
      if (currVal.toString().length === 2) {
        newVal = e.key;
      } else {
        newVal += currVal.toString() + e.key;
      }
      stateCopy[songNameInt][measureRegex][key] = Number(newVal);
      songStateSetter(stateCopy);
      return;
    }
  }
};

export const renderStringsContainer = (instrument: string): React.ReactNode => {
  if (instrument === "bass") {
    return (
      <div className="strings-container">
        <div className="string-note">G</div>
        <div className="string-note">D</div>
        <div className="string-note">A</div>
        <div className="string-note">E</div>
      </div>
    );
  } else {
    return (
      <div className="strings-container">
        <div className="string-note">E</div>
        <div className="string-note">B</div>
        <div className="string-note">G</div>
        <div className="string-note">D</div>
        <div className="string-note">A</div>
        <div className="string-note">E</div>
      </div>
    );
  }
};

export const getStringsArray = (instrument: string) => {
  if (instrument === "bass") {
    return [0, 1, 2, 3];
  } else if (instrument === "guitar") {
    return [0, 1, 2, 3, 4, 5];
  } else {
    return [0, 1, 2, 3];
  }
};

export const createSoundArray = (
  songState: ISongState,
  songNameInt: number,
  timeSignature: number
): ISoundNote[][] => {
  const song = songState[songNameInt];

  const regex = /^(\d+)-(\d+)-(\d+)/;
  const results = [];
  for (const measure of song) {
    const length = timeSignature * 4;
    const soundMeasureArray: ISoundNote[][] = Array.from({ length }, () => []);
    Object.entries(measure).map(([key, fret]) => {
      const matches = key.match(regex);
      if (matches) {
        const stringRegex = matches[2];
        const timeIntervalRegex = Number(matches[3]);
        // If note exceeds measure length, discard it.
        if (timeIntervalRegex > timeSignature * 4) return;
        const soundObject: ISoundNote = {
          fret: Number(fret),
          string: stringRegex,
          timeInterval: timeIntervalRegex,
        };
        soundMeasureArray[timeIntervalRegex].push(soundObject);
      }
    });
    results.push(soundMeasureArray.flat());
  }
  return results;
};
// #^ This currently returns an array of arrays, where
export const playSong = (
  bpm: number,
  timeSignature: number = 4,
  soundArray: ISoundNote[][]
) => {
  const bassNoteMap = {
    "3-0": "E2",
    "3-1": "F2",
    "3-2": "F#2",
    "3-3": "G2",
    "3-4": "G#2",
    "3-5": "A2",
    "3-6": "A#2",
    "3-7": "B2",
    "3-8": "C3",
    "3-9": "C#3",
    "3-10": "D3",
    "3-11": "D#3",
    "3-12": "E3",
    "3-13": "F3",
    "3-14": "F#3",
    "3-15": "G3",
    "3-16": "G#3",
    "3-17": "A3",
    "3-18": "A#3",
    "3-19": "B3",
    "3-20": "C4",
    "3-21": "C#4",
    "3-22": "D4",
    "3-23": "D#4",
    "3-24": "E4",

    "2-0": "A2",
    "2-1": "A#2",
    "2-2": "B2",
    "2-3": "C3",
    "2-4": "C#3",
    "2-5": "D3",
    "2-6": "D#3",
    "2-7": "E3",
    "2-8": "F3",
    "2-9": "F#3",
    "2-10": "G3",
    "2-11": "G#3",
    "2-12": "A3",
    "2-13": "A#3",
    "2-14": "B3",
    "2-15": "C4",
    "2-16": "C#4",
    "2-17": "D4",
    "2-18": "D#4",
    "2-19": "E4",
    "2-20": "F4",
    "2-21": "F#4",
    "2-22": "G4",
    "2-23": "G#4",
    "2-24": "A4",

    "1-0": "D3", // Adjusted from D2 to D3
    "1-1": "D#3", // Adjusted from D#2 to D#3
    "1-2": "E3", // Adjusted from E2 to E3
    "1-3": "F3", // Adjusted from F2 to F3
    "1-4": "F#3", // Adjusted from F#2 to F#3
    "1-5": "G3", // Adjusted from G2 to G3
    "1-6": "G#3", // Adjusted from G#2 to G#3
    "1-7": "A3", // Adjusted from A2 to A3
    "1-8": "A#3", // Adjusted from A#2 to A#3
    "1-9": "B3", // Adjusted from B2 to B3
    "1-10": "C4", // Adjusted from C3 to C4
    "1-11": "C#4", // Adjusted from C#3 to C#4
    "1-12": "D4", // Adjusted from D3 to D4
    "1-13": "D#4",
    "1-14": "E4",
    "1-15": "F4",
    "1-16": "F#4",
    "1-17": "G4",
    "1-18": "G#4",
    "1-19": "A4",
    "1-20": "A#4",
    "1-21": "B4",
    "1-22": "C5", // Adjusted from C4 to C5
    "1-23": "C#5", // Adjusted from C#4 to C#5
    "1-24": "D5", // Adjusted from D4 to D5

    "0-0": "G3", // Adjusted from G2 to G3
    "0-1": "G#3", // Adjusted from G#2 to G#3
    "0-2": "A3", // Adjusted from A2 to A3
    "0-3": "A#3", // Adjusted from A#2 to A#3
    "0-4": "B3", // Adjusted from B2 to B3
    "0-5": "C4", // Adjusted from C3 to C4
    "0-6": "C#4", // Adjusted from C#3 to C#4
    "0-7": "D4", // Adjusted from D3 to D4
    "0-8": "D#4", // Adjusted from D#3 to D#4
    "0-9": "E4", // Adjusted from E3 to E4
    "0-10": "F4", // Adjusted from F3 to F4
    "0-11": "F#4", // Adjusted from F#3 to F#4
    "0-12": "G4", // Adjusted from G3 to G4
    "0-13": "G#4",
    "0-14": "A4",
    "0-15": "A#4",
    "0-16": "B4",
    "0-17": "C5", // Adjusted from C4 to C5
    "0-18": "C#5", // Adjusted from C#4 to C#5
    "0-19": "D5", // Adjusted from D4 to D5
    "0-20": "D#5",
    "0-21": "E5",
    "0-22": "F5",
    "0-23": "F#5",
    "0-24": "G5",
  };

  function playNote(soundNote: ISoundNote, noteMap: Record<string, string>) {
    const key = `${soundNote.string}-${soundNote.fret}`;
    const synth = new Tone.Synth().toDestination();
    const note = noteMap[key];
    synth.triggerAttackRelease(note, "16n");
  }

  // const bassNoteMap = generateBassNoteMap();
  console.log(bassNoteMap);

  Tone.Transport.stop();
  Tone.Transport.cancel();
  Tone.Transport.bpm.value = bpm;
  Tone.Transport.timeSignature = [timeSignature, 4];

  const measureLength = Tone.Time("1m").toSeconds();

  soundArray.forEach((measure, measureIndex) => {
    const measureTimeContext = measureIndex * measureLength;

    measure.forEach((note) => {
      const time =
        measureTimeContext + note.timeInterval * Tone.Time("16n").toSeconds();
      Tone.Transport.schedule(() => playNote(note, bassNoteMap), time);
    });
    Tone.Transport.start();
  });
};
