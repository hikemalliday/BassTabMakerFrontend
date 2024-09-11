import { useCellContext } from "../Context/CellContext";
import { useSongContext } from "../Context/SongContext";
import { IMeasureState } from "../types";
import { handleCellInput, focusCell, getStringsArray } from "../utils";

interface IMeasureProps {
  measure: IMeasureState;
  measureInt: number;
}

export const Measure = ({ measure, measureInt }: IMeasureProps) => {
  const { activeCell, setActiveCell } = useCellContext();
  const { songState, setSongState, songNameInt, instrument, timeSignature } =
    useSongContext();

  const handleCellClick = (key: string): void => {
    setActiveCell(key);
    focusCell(key);
  };

  const colInts = (): number[] => {
    const results = [];
    for (let i = 0; i < timeSignature * 4; i++) {
      results.push(i);
    }
    return results;
  };

  let counter = 1;
  const determineCellClass = (key: string): string => {
    let className = "";

    counter += 1;
    if (counter % 2 === 0) {
      className = "cell-even";
    } else {
      className = "cell-odd";
    }
    if (key == activeCell) {
      className += "-active";
    }

    return className;
  };

  const strings = getStringsArray(instrument as string);
  return (
    <>
      {strings.map((_, y) => {
        return (
          <div key={y} className="cells-row">
            {colInts().map((int, x) => {
              const key = `${measureInt}-${y}-${int}`;
              return (
                <div
                  tabIndex={0}
                  key={x}
                  id={key}
                  className={determineCellClass(key)}
                  onClick={() => {
                    handleCellClick(key);
                  }}
                  onKeyDown={(e) =>
                    handleCellInput(
                      e,
                      key,
                      songState,
                      setSongState,
                      activeCell,
                      setActiveCell,
                      songNameInt
                    )
                  }
                >
                  {measure[key] ?? ""}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};
