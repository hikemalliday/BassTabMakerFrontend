import "../assets/MeasuresView.css";
import { useEffect } from "react";
import { IMeasureState } from "../types";
import { useSongQuery } from "../requests";
import { useSongContext } from "../Context/SongContext";
import {
  reduceSong,
  renderStringsContainer,
  reduceSongMetadata,
  createPastedMeasure,
  handleDeleteMeasure,
  handleCopyStaffRow,
  handleDeleteStaffRow,
  handlePasteStaffRow,
} from "../utils";
import { Measure } from "./Measure";
import { useSnackbarContext } from "../Context/SnackBarContext";
import { useCellContext } from "../Context/CellContext";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Tooltip from "@mui/material/Tooltip";

export const MeasuresView = () => {
  const { songState, setSongState, songNameInt, setSongMetadata, songName } =
    useSongContext();
  const { data: songData, isLoading: isSongDataLoading } =
    useSongQuery(songNameInt);
  const { addToast } = useSnackbarContext();
  const {
    activeMeasure,
    activeRow,
    setActiveRow,
    setActiveMeasure,
    copiedMeasure,
    setCopiedMeasure,
    copiedStaffRow,
    setCopiedStaffRow,
  } = useCellContext();

  const addMeasure = (): void => {
    const stateCopy = { ...songState };
    stateCopy[songNameInt].push({});
    setSongState(stateCopy);
  };

  const removeMeasure = (): void => {
    if (songState[songNameInt].length === 1) return;
    const stateCopy = { ...songState };
    stateCopy[songNameInt].pop();
    setSongState(stateCopy);
  };

  const handleRowClick = (rowInt: number): void => {
    setActiveRow(rowInt);
  };

  const handleMeasureClick = (i: number): void => {
    setActiveMeasure(i);
  };

  const pasteMeasure = (): void => {
    const stateCopy = { ...songState };
    const finalMeasureIndex = stateCopy[songNameInt].length;
    const pastedMeasure = createPastedMeasure(
      copiedMeasure as IMeasureState,
      finalMeasureIndex
    );
    stateCopy[songNameInt].push(pastedMeasure);
    setSongState(stateCopy);
  };

  const copyMeasure = (measureInt: number): void => {
    const stateCopy = { ...songState };
    setCopiedMeasure(stateCopy[songNameInt][measureInt]);
    addToast("Measure copied", "info");
  };

  const deleteMeasure = (measureInt: number, songNameInt: number): void => {
    const stateCopy = { ...songState };
    const newState = handleDeleteMeasure(measureInt, stateCopy, songNameInt);
    setSongState(newState);
    addToast("Measure deleted", "info");
  };

  const copyStaffRow = (currentRow: number, songNameInt: number): void => {
    const stateCopy = { ...songState };
    const copiedRow = handleCopyStaffRow(currentRow, stateCopy, songNameInt);
    setCopiedStaffRow(copiedRow);
  };

  const pasteStaffRow = (songNameInt: number) => {
    const stateCopy = { ...songState };
    try {
      const newState = handlePasteStaffRow(
        stateCopy,
        songNameInt,
        copiedStaffRow as IMeasureState[]
      );
      setSongState(newState);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStaffRow = (currentRow: number, songNameInt: number): void => {
    const stateCopy = { ...songState };
    handleDeleteStaffRow(currentRow, stateCopy, songNameInt);
    addToast(`Staff row deleted.`, "info");
  };

  const determineMeasureClass = (measureInt: number): string => {
    let className = "measure-component-wrapper";
    if (measureInt === activeMeasure) return (className += "-active");
    return className;
  };

  const determineRowClass = (rowInt: number): string => {
    let className = "staff-row";
    if (rowInt === activeRow) return (className += "-active");
    return className;
  };

  useEffect(() => {
    if (songData) {
      setSongMetadata(reduceSongMetadata(songData));
      // If cache exists, use that instead of query
      if (songNameInt in songState) {
        return;
      }
      const songStateCopy = { ...songState };
      songStateCopy[songNameInt] = reduceSong(songData);
      setSongState(songStateCopy);
    }
  }, [songData]);

  if (isSongDataLoading) return null;

  const renderMeasures = (measures: IMeasureState[]) => {
    const results = [];
    let currentRow = [];
    let rowCount = 0;

    for (let i = 0; i < measures.length; i++) {
      const measure = measures[i];
      currentRow.push(
        <div
          key={i}
          className={determineMeasureClass(i)}
          onClick={() => handleMeasureClick(i)}
        >
          {activeMeasure === i && (
            <>
              <i
                className="fa-regular fa-copy measure"
                onClick={() => copyMeasure(i)}
              ></i>
              <DeleteOutlinedIcon
                className="delete-measure"
                onClick={() => deleteMeasure(i, songNameInt)}
              />
            </>
          )}
          <Measure measure={measure} measureInt={i} />
        </div>
      );
      if ((i + 1) % 4 === 0 || i === measures.length - 1) {
        const currentRowCount = rowCount;
        results.push(
          <>
            <div
              key={i}
              className={determineRowClass(currentRowCount)}
              onClick={() => handleRowClick(currentRowCount)}
            >
              {activeRow === currentRowCount && (
                <>
                  <i
                    className="fa-regular fa-copy staff-row"
                    onClick={() => copyStaffRow(currentRowCount, songNameInt)}
                    title="copy row"
                  ></i>
                  <Tooltip title="delete row">
                    <DeleteOutlinedIcon
                      className="delete-staff-row"
                      onClick={() =>
                        deleteStaffRow(currentRowCount, songNameInt)
                      }
                    />
                  </Tooltip>
                </>
              )}
              {renderStringsContainer("bass")}
              {currentRow}
            </div>
          </>
        );
        rowCount += 1;
        currentRow = [];
      }
    }
    return <div>{results}</div>;
  };

  return (
    <div className="measures-view-container">
      <div className="song-name-title">{songName}</div>
      {renderMeasures(songState[songNameInt] ?? [])}
      {songState[songNameInt] !== undefined ? (
        <div className="measures-view-buttons">
          <button onClick={addMeasure} title="add measure">
            +
          </button>
          <button onClick={removeMeasure} title="remove measure">
            -
          </button>
          <button
            onClick={pasteMeasure}
            title="paste measure"
            disabled={copiedMeasure == undefined}
          >
            Paste Measure
          </button>
          <button
            onClick={() => pasteStaffRow(songNameInt)}
            title="paste staff row"
            disabled={copiedStaffRow == undefined}
          >
            Paste Staff Row
          </button>
        </div>
      ) : (
        "Please select or create a song"
      )}
    </div>
  );
};
