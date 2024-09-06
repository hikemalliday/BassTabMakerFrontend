import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSongContext } from "../Context/SongContext";
import { useDeleteSong } from "../requests";
import { useSnackbarContext } from "../Context/SnackBarContext";

interface IDeleteSongModalProps {
  open: boolean;
  setOpen: (bool: boolean) => void;
}

export default function DeleteSongModal({
  open,
  setOpen,
}: IDeleteSongModalProps) {
  const { songName, songNameInt, clearSongContext } = useSongContext();
  const { mutateAsync } = useDeleteSong();
  const { addToast } = useSnackbarContext();

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      await mutateAsync(songNameInt);
      setOpen(false);
      clearSongContext();
      addToast(`Song: ${songName} deleted.`, "success");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="delete-song-modal-title">
          {`Are you sure you want to delete song: ${songName}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Abort</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
