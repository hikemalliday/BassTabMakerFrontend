import { useState } from "react";
import { Button, Dialog, DialogTitle, List, TextField } from "@mui/material/";
import { useSongContext } from "../Context/SongContext";
import { useCreateSong, IUseCreateSongParams } from "../requests";
import { useNavigate } from "react-router-dom";
import { useSnackbarContext } from "../Context/SnackBarContext";

export interface IOptionsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const NewSongModal = ({ open, setOpen }: IOptionsModalProps) => {
  const { addToast } = useSnackbarContext();
  const { setSongNameInt, setSongName } = useSongContext();
  const { mutateAsync } = useCreateSong();
  const [songNameCreate, setSongNameCreate] = useState("");
  const [artistCreate, setArtistCreate] = useState("");
  const [timeSignatureCreate, setTimeSignatureCreate] = useState(4);
  const [bpmCreate, setBpmCreate] = useState(120);
  const [instrumentCreate, setInstrumentCreate] = useState("bass");
  const navigate = useNavigate();

  const handleSave = async () => {
    const createSongParams: IUseCreateSongParams = {
      song_name: songNameCreate,
      artist: artistCreate,
      time_signature: timeSignatureCreate,
      instrument: "bass",
    };
    try {
      const resp = await mutateAsync(createSongParams);
      if (resp) {
        if (resp.status === 201) {
          setSongNameInt(resp.data.id);
          setSongName(resp.data.song_name);
          addToast(`Song: ${songNameCreate} created.`, "success");
          navigate("/main");
          return;
        }
        console.log("error song toast");
        addToast(`Song: ${songNameCreate} could not be created.`, "error");
        return resp.data;
      }
    } catch (err) {
      addToast(`Song: ${songNameCreate} could not be created.`, "error");
      console.error(err);
    }
  };

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <DialogTitle>Create Song</DialogTitle>
      <List>
        <TextField
          label="song name"
          variant="standard"
          autoComplete="off"
          value={songNameCreate}
          onChange={(e) => setSongNameCreate(e.currentTarget.value)}
        />
        <TextField
          label="artist name"
          variant="standard"
          autoComplete="off"
          value={artistCreate}
          onChange={(e) => setArtistCreate(e.target.value)}
        />
        <TextField
          label="bpm"
          variant="standard"
          autoComplete="off"
          value={bpmCreate}
          onChange={(e) => setBpmCreate(Number(e.target.value))}
          type="number"
        />
        <TextField
          label="instrument"
          variant="standard"
          autoComplete="off"
          value={instrumentCreate}
          onChange={(e) => setInstrumentCreate(e.target.value)}
        />
        <TextField
          label="time signature"
          variant="standard"
          autoComplete="off"
          value={timeSignatureCreate}
          onChange={(e) => setTimeSignatureCreate(Number(e.target.value))}
          type="number"
        />
      </List>
      <Button onClick={handleSave}>SAVE</Button>
      <Button onClick={() => setOpen(false)}>X</Button>
    </Dialog>
  );
};
