import {
  ISong,
  IMeasureState,
  INotePost,
  ISongMetadata,
  ISongState,
} from "./types";

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
      stateCopy[songNameInt][measureRegex][key] = null;
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
