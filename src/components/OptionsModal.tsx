import { Button, Dialog, DialogTitle, List, TextField } from "@mui/material/";
import { useSongContext } from "../Context/SongContext";
import { ISongMetadata } from "../types";
import { useSaveSongMetadata, ISongMetadataParams } from "../requests";
import { useSnackbarContext } from "../Context/SnackBarContext";

export interface IOptionsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const OptionsModal = ({ open, setOpen }: IOptionsModalProps) => {
  const { songMetadata, setSongMetadata, songNameInt, setSongName, songName } =
    useSongContext();
  const { mutateAsync } = useSaveSongMetadata();
  const { addToast } = useSnackbarContext();

  const handleSave = async () => {
    const saveSongMetadataParams: ISongMetadataParams = {
      id: songNameInt,
      metadata: songMetadata,
    };
    try {
      const resp = await mutateAsync(saveSongMetadataParams);
      if (resp) {
        if (resp.status === 200) {
          setSongName(resp.data.song_name);
          addToast(`Song: ${songName} edited.`, "success");
        }
        return resp.data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof ISongMetadata
  ) => {
    const metadataCopy: ISongMetadata = { ...songMetadata };
    metadataCopy[key] = e.target.value;
    setSongMetadata(metadataCopy);
  };

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <DialogTitle>Edit Song</DialogTitle>
      <List>
        <TextField
          label="song name"
          variant="standard"
          autoComplete="off"
          value={songMetadata["song_name"]}
          onChange={(e) => handleChange(e, "song_name")}
        />
        <TextField
          label="artist name"
          variant="standard"
          autoComplete="off"
          value={songMetadata["artist"]}
          onChange={(e) => handleChange(e, "artist")}
        />
        <TextField
          label="bpm"
          variant="standard"
          autoComplete="off"
          value={songMetadata["bpm"]}
          onChange={(e) => handleChange(e, "bpm")}
        />
        <TextField
          label="instrument"
          variant="standard"
          autoComplete="off"
          value={songMetadata["instrument"]}
          onChange={(e) => handleChange(e, "instrument")}
        />
        <TextField
          label="time signature"
          variant="standard"
          autoComplete="off"
          value={songMetadata["time_signature"]}
          onChange={(e) => handleChange(e, "time_signature")}
        />
      </List>
      <Button onClick={handleSave}>SAVE</Button>
      <Button onClick={() => setOpen(false)}>X</Button>
    </Dialog>
  );
};
