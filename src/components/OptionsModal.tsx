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
      <div className="modal-container">
        <div className="modal-title">Edit Song</div>
        <div className="modal-contents">
          <label>Song Name</label>
          <input
            className="modal-input"
            type="text"
            placeholder="song name"
            value={songMetadata["song_name"]}
            onChange={(e) => handleChange(e, "song_name")}
          />
          <label>Song Name</label>
          <input
            className="modal-input"
            type="text"
            placeholder="artist"
            value={songMetadata["artist"]}
            onChange={(e) => handleChange(e, "artist")}
          />
          <label>BPM</label>
          <input
            className="modal-input"
            type="number"
            placeholder="bpm"
            value={songMetadata["bpm"]}
            onChange={(e) => handleChange(e, "bpm")}
          />
          <label>Instrument</label>
          <input
            className="modal-input"
            type="text"
            placeholder="bpm"
            value={songMetadata["instrument"]}
            onChange={(e) => handleChange(e, "instrument")}
          />
          <label>Time Signature</label>
          <input
            className="modal-input"
            type="number"
            placeholder="4"
            value={songMetadata["time_signature"]}
            onChange={(e) => handleChange(e, "time_signature")}
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
