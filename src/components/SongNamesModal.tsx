import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { useSongContext } from "../Context/SongContext";
import { useSongNames } from "../requests";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@mui/material";
import { useCellContext } from "../Context/CellContext";

interface ISongNamesModalProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const SongNamesModal = ({ open, setOpen }: ISongNamesModalProps) => {
  const navigate = useNavigate();
  const { songNames, setSongNames, songState, setSongNameInt } =
    useSongContext();
  const { setCopiedMeasure } = useCellContext();
  const { data } = useSongNames(songState);
  const listItemStyle = {
    bgcolor: "rgb(17 24 39)",
    margin: "1px",
    color: "white",
  };

  const handleClick = (pk: number) => {
    setSongNameInt(pk);
    setCopiedMeasure(undefined);
    navigate("/main");
  };

  React.useEffect(() => {
    if (data) setSongNames(data);
  }, [data]);

  return (
    <Dialog
      open={open}
      scroll="paper"
      onClose={() => setOpen(false)}
      sx={{
        "& .MuiDialog-paper": {
          bgcolor: "black",
          marginTop: "20vh", // Adjust this value to control how far down the dialog appears
          padding: 0,
        },
      }}
    >
      <DialogContent
        sx={{
          padding: 0,
        }}
      >
        <List
          sx={{
            width: "400px",
            marginTop: "auto",
          }}
          disablePadding
        >
          {Object.entries(songNames).map(([songName, pk]) => {
            return (
              <ListItem
                onClick={() => handleClick(pk)}
                disablePadding
                sx={listItemStyle}
                key={pk}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <MusicNoteIcon />
                  </ListItemIcon>
                  <ListItemText primary={songName} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
};
