import { useState } from "react";
import { Button, Dialog } from "@mui/material/";
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
      <div className="modal-container">
        <div className="modal-title">New Song</div>
        <div className="modal-contents">
          <label>Song Name</label>
          <input
            className="modal-input"
            type="text"
            placeholder="song name"
            value={songNameCreate}
            onChange={(e) => setSongNameCreate(e.currentTarget.value)}
          />
          <label>Artist</label>
          <input
            className="modal-input"
            type="text"
            placeholder="artist"
            value={artistCreate}
            onChange={(e) => setArtistCreate(e.target.value)}
          />
          <label>BPM</label>
          <input
            className="modal-input"
            type="text"
            placeholder="BPM"
            value={bpmCreate}
            onChange={(e) => setBpmCreate(Number(e.target.value))}
          />
          <label>Instrument</label>
          <input
            className="modal-input"
            type="text"
            placeholder="song name"
            value={instrumentCreate}
            onChange={(e) => setInstrumentCreate(e.target.value)}
          />
          <label>Time Signature</label>
          <input
            className="modal-input"
            type="text"
            placeholder="song name"
            value={timeSignatureCreate}
            onChange={(e) => setTimeSignatureCreate(Number(e.target.value))}
          />
        </div>
        <div className="modal-buttons">
          <Button onClick={handleSave}>SAVE</Button>
          <Button onClick={() => setOpen(false)}>X</Button>
        </div>
      </div>
    </Dialog>
  );
};
