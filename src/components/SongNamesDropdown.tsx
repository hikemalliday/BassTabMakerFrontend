import React, { useState } from "react";
import { useSongContext } from "../Context/SongContext";
import { useCellContext } from "../Context/CellContext";
import { useSongNames } from "../requests";

export const SongNamesDropdown = () => {
  const { songNames, setSongNames, setSongNameInt, songState } =
    useSongContext();
  const { setActiveCell } = useCellContext();
  const { data } = useSongNames(songState);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);

  const handleClick = (pk: number): void => {
    setSongNameInt(pk);
    setIsHamburgerOpen(false);
    setActiveCell("");
  };

  const determineClassName = (i: number, arrayLength: number) => {
    let className = "songnames-hamburger-choice";
    if (i === 0) {
      className += "-first";
    }
    if (i === arrayLength - 1) {
      className += "-last";
    }
    return className;
  };

  React.useEffect(() => {
    if (data) setSongNames(data);
  }, [data]);

  // React.useEffect(() => {
  //   if ("untitled" in songNames) setSongNameInt(songNames["untitled"]);
  // }, [songNames]);

  // if (isLoading) return null;
  return (
    <div className="songnames-hamburger-container">
      <i
        className="fa-solid fa-bars"
        onClick={() => setIsHamburgerOpen((prev) => !prev)}
      ></i>
      {isHamburgerOpen ? (
        <div className="songnames-hamburger">
          <div className="songnames-choices-container">
            {Object.entries(songNames).map(([songName, pk], i) => {
              const className = determineClassName(
                i,
                Object.keys(songNames).length
              );
              return (
                <div
                  key={i}
                  className={className}
                  onClick={() => handleClick(pk)}
                >
                  {songName}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
