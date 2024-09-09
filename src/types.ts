export interface ISong {
  id: number;
  song_name: string;
  artist: string;
  instrument: string;
  bpm: number;
  time_signature: number;
  user: number;
  notes: INote[];
}

export interface INote {
  id: number;
  string: number;
  time_interval: number;
  fret: number;
  song: number;
  measure: number;
}

export interface ISongState {
  [key: string | number]: IMeasureState[];
}

// Probably too generic
export interface IMeasureState {
  [key: string]: number | null;
}

export interface INotePost {
  song_id: number;
  measure: number;
  string?: number;
  time_interval?: number;
  fret?: number;
}

export interface ISongMetadata {
  [key: string]: string | number;
  song_name: string;
  artist: string;
  bpm: number;
  time_signature: number;
  instrument: string;
}

export interface ILoginParams {
  username: string;
  password: string;
}

export interface ISignUpParams {
  username: string;
  password: string;
}

// Probably too generic
export interface ISoundMeasure {
  [key: string]: number;
}

export interface ISoundNote {
  fret: number;
  string: string;
  timeInterval: number;
}
