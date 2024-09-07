import { useState } from "react";
import { Button } from "@mui/material";
import { NewSongModal } from "./NewSongModal";
import { SongNamesModal } from "./SongNamesModal";
import { useSongContext } from "../Context/SongContext";

export const Dashboard = () => {
  const [newSongModalOpen, setNewSongModalOpen] = useState(false);
  const [songNamesModalOpen, setSongNamesModalOpen] = useState(false);
  const { songNames } = useSongContext();

  console.log("test");
  return (
    <div className="dashboard-container">
      <div className="dashboard-title">Bass Tab Maker</div>
      <div className="dashboard-cards">
        <Button
          id="dashboard-card"
          onClick={() => setNewSongModalOpen(true)}
          variant="outlined"
        >
          CREATE
        </Button>
        {Object.keys(songNames).length > 0 && (
          <Button
            id="dashboard-card"
            onClick={() => setSongNamesModalOpen(true)}
            variant="outlined"
          >
            SELECT
          </Button>
        )}
      </div>
      {<NewSongModal open={newSongModalOpen} setOpen={setNewSongModalOpen} />}
      {
        <SongNamesModal
          open={songNamesModalOpen}
          setOpen={setSongNamesModalOpen}
        />
      }
    </div>
  );
};
