import { ISongContext } from "../Context/SongContext";
import { ICellContext } from "../Context/CellContext";
import { ISnackbarContext } from "../Context/SnackBarContext";
import { IMeasureState, ISongState } from "../types";

export interface IMasuresViewHandlersProps {
  songContext: ISongContext;
  cellContext: ICellContext;
  snackbarContext: ISnackbarContext;
}

export class MeasuresViewHandlers {
  private songContext: ISongContext;
  private cellContext: ICellContext;
  private snackbarContext: ISnackbarContext;

  constructor(props: IMasuresViewHandlersProps) {
    const { songContext, cellContext, snackbarContext } = props;
    this.songContext = songContext;
    this.cellContext = cellContext;
    this.snackbarContext = snackbarContext;
  }

  addMeasure(): void {
    const songNameInt = this.songContext.songNameInt;
    const setter = this.songContext.setSongState;
    const stateCopy = { ...this.songContext.songState };
    stateCopy[songNameInt].push({});
    setter(stateCopy);
  }

  removeMeasure(): void {
    const songNameInt = this.songContext.songNameInt;
    const stateCopy = { ...this.songContext.songState };
    const setter = this.songContext.setSongState;
    if (stateCopy[songNameInt].length === 1) return;
    stateCopy[songNameInt].pop();
    setter(stateCopy);
  }

  rowClick(rowInt: number): void {
    this.cellContext.setActiveRow(rowInt);
  }

  measureClick(i: number): void {
    this.cellContext.setActiveMeasure(i);
  }

  pasteMeasure(): void {
    const createPastedMeasure = (
      measure: IMeasureState,
      finalMeasureIndex: number
    ): IMeasureState => {
      const pastedMeasure = {} as IMeasureState;
      const regex = /^(\d+)-(\d+)-(\d+)/;

      Object.entries(measure).map(([key, fret]) => {
        const matches = key.match(regex);
        if (matches) {
          const stringRegex = matches[2];
          const timeIntervalRegex = matches[3];
          const newKey = `${finalMeasureIndex}-${stringRegex}-${timeIntervalRegex}`;
          pastedMeasure[newKey] = fret;
        }
      });
      return pastedMeasure;
    };

    const songNameInt = this.songContext.songNameInt;
    const copiedMeasure = this.cellContext.copiedMeasure;
    const stateCopy = { ...this.songContext.songState };
    const setter = this.songContext.setSongState;
    const finalMeasureIndex = stateCopy[songNameInt].length;
    const pastedMeasure = createPastedMeasure(
      copiedMeasure as IMeasureState,
      finalMeasureIndex
    );
    stateCopy[songNameInt].push(pastedMeasure);
    setter(stateCopy);
  }

  copyMeasure(measureInt: number): void {
    const songNameInt = this.songContext.songNameInt;
    const stateCopy = { ...this.songContext.songState };
    const setter = this.cellContext.setCopiedMeasure;
    setter(stateCopy[songNameInt][measureInt]);
    this.snackbarContext.addToast("Measure copied", "info");
  }

  deleteMeasure(measureInt: number): void {
    const deleteMeasureHelper = (
      measureInt: number,
      songStateCopy: ISongState,
      songNameInt: number
    ): ISongState => {
      const songArray = songStateCopy[songNameInt];
      songArray.splice(measureInt, 1);
      const regex = /^(\d+)-(\d+)-(\d+)/;

      for (let i = measureInt; i < songArray.length - 1; i++) {
        const measure = songArray[i];
        Object.entries(measure).forEach(([key, fret]) => {
          const matches = key.match(regex);
          if (matches) {
            const measureRegex = Number(matches[1]);
            const stringRegex = matches[2];
            const timeIntervalRegex = matches[3];
            const newKey = `${
              measureRegex - 1
            }-${stringRegex}-${timeIntervalRegex}`;
            measure[newKey] = fret;
            delete measure[key];
          }
        });
      }
      return songStateCopy;
    };

    const songNameInt = this.songContext.songNameInt;
    const stateCopy = { ...this.songContext.songState };
    const setter = this.songContext.setSongState;
    const newState = deleteMeasureHelper(measureInt, stateCopy, songNameInt);
    setter(newState);
    this.snackbarContext.addToast("Measure deleted", "info");
  }

  copyStaffRow(currentRow: number): void {
    const copyStaffRowHelper = (
      currentRow: number,
      songStateCopy: ISongState,
      songNameInt: number
    ) => {
      const songArray = songStateCopy[songNameInt];
      let index = currentRow * 4;
      const results = [];
      while (results.length < 4) {
        if (songArray[index] === undefined) break;
        results.push(songArray[index]);
        index += 1;
      }
      return results;
    };

    const songNameInt = this.songContext.songNameInt;
    const stateCopy = { ...this.songContext.songState };
    const setter = this.cellContext.setCopiedStaffRow;
    const copiedRow = copyStaffRowHelper(currentRow, stateCopy, songNameInt);
    setter(copiedRow);
    this.snackbarContext.addToast("Row copied.", "info");
  }

  pasteStaffRow = (): void => {
    const pasteStaffRowHelper = (
      songStateCopy: ISongState,
      songNameInt: number,
      copiedStaffRow: IMeasureState[]
    ) => {
      const regex = /^(\d+)-(\d+)-(\d+)/;
      const songArray = songStateCopy[songNameInt];
      for (const measure of copiedStaffRow) {
        if (measure === undefined) continue;
        const newNote = {} as IMeasureState;
        Object.entries(measure).map(([key, fret]) => {
          const matches = key.match(regex);
          if (matches === undefined || matches === null) return;
          const stringRegex = matches[2];
          const timeIntervalRegex = matches[3];
          const newKey = `${songArray.length}-${stringRegex}-${timeIntervalRegex}`;
          newNote[newKey] = fret;
        });
        songArray.push(newNote);
      }
      return songStateCopy;
    };

    const songNameInt = this.songContext.songNameInt;
    const stateCopy = { ...this.songContext.songState };
    const setter = this.songContext.setSongState;
    const copiedStaffRow = this.cellContext.copiedStaffRow;
    try {
      const newState = pasteStaffRowHelper(
        stateCopy,
        songNameInt,
        copiedStaffRow as IMeasureState[]
      );
      setter(newState);
    } catch (err) {
      console.error(err);
    }
  };

  deleteStaffRow = (currentRow: number): void => {
    const deleteStaffRowHelper = (
      currentRow: number,
      songStateCopy: ISongState,
      songNameInt: number
    ): void => {
      const songArray = songStateCopy[songNameInt];
      const regex = /^(\d+)-(\d+)-(\d+)/;
      let index = currentRow * 4;
      let counter = 0;

      while (counter <= 3) {
        const measure = songArray[index];
        if (measure === undefined) break;
        songArray.splice(index, 1);
        counter += 1;
      }

      while (true) {
        const measure = songArray[index];
        if (measure === undefined) break;
        Object.entries(measure).map(([key, fret]) => {
          const matches = key.match(regex);
          if (matches === undefined || matches === null) return;
          const measureRegex = Number(matches[1]);
          const stringRegex = matches[2];
          const timeIntervalRegex = matches[3];
          const newKey = `${
            measureRegex - counter
          }-${stringRegex}-${timeIntervalRegex}`;
          measure[newKey] = fret;
          delete measure[key];
        });
        index += 1;
      }
    };

    const songNameInt = this.songContext.songNameInt;
    const stateCopy = { ...this.songContext.songState };
    deleteStaffRowHelper(currentRow, stateCopy, songNameInt);
    this.snackbarContext.addToast("Staff row deleted", "info");
  };
}
