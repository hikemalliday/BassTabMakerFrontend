import "../assets/MeasuresView.css";
import { useEffect } from "react";
import { IMeasureState } from "../types";
import { useSongQuery } from "../requests";
import { useSongContext } from "../Context/SongContext";
import {
  reduceSong,
  renderStringsContainer,
  reduceSongMetadata,
} from "../utils";
import { Measure } from "./Measure";
import { useSnackbarContext } from "../Context/SnackBarContext";
import { useCellContext } from "../Context/CellContext";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Tooltip from "@mui/material/Tooltip";
import { MeasuresViewHandlers } from "../classes/MeasureViewHandlers";

export const MeasuresView = () => {
  const { songState, setSongState, songNameInt, setSongMetadata, songName } =
    useSongContext();
  const { data: songData, isLoading: isSongDataLoading } =
    useSongQuery(songNameInt);
  const { activeMeasure, activeRow, copiedMeasure, copiedStaffRow } =
    useCellContext();

  const SongContext = useSongContext();
  const CellContext = useCellContext();
  const SnackbarContext = useSnackbarContext();

  const EventHandlers = new MeasuresViewHandlers({
    songContext: SongContext,
    cellContext: CellContext,
    snackbarContext: SnackbarContext,
  });

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
          onClick={() => EventHandlers.measureClick(i)}
        >
          {activeMeasure === i && (
            <>
              <i
                className="fa-regular fa-copy measure"
                onClick={() => EventHandlers.copyMeasure(i)}
              ></i>
              <DeleteOutlinedIcon
                className="delete-measure"
                onClick={() => EventHandlers.deleteMeasure(i)}
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
              onClick={() => EventHandlers.rowClick(currentRowCount)}
            >
              {activeRow === currentRowCount && (
                <>
                  <i
                    className="fa-regular fa-copy staff-row"
                    onClick={() => EventHandlers.copyStaffRow(currentRowCount)}
                    title="copy row"
                  ></i>
                  <Tooltip title="delete row">
                    <DeleteOutlinedIcon
                      className="delete-staff-row"
                      onClick={() =>
                        EventHandlers.deleteStaffRow(currentRowCount)
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
          <button
            onClick={() => EventHandlers.addMeasure()}
            title="add measure"
          >
            +
          </button>
          <button
            onClick={() => EventHandlers.removeMeasure()}
            title="remove measure"
          >
            -
          </button>
          <button
            onClick={() => EventHandlers.pasteMeasure()}
            title="paste measure"
            disabled={copiedMeasure == undefined}
          >
            Paste Measure
          </button>
          <button
            onClick={() => EventHandlers.pasteStaffRow()}
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
