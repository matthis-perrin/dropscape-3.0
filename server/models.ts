export interface SlackAccount {
  name: string;
  label: string;
  email: string;
  apiToken: string;
}

export interface SlackUser {
  id: string;
  name: string;
  realName: string;
  displayName: string;
  email: string;
  imId: string;
}

export enum VideoStatus {
  NotPlayed = 'not-played',
  Playing = 'playing',
  Played = 'played',
}

export interface Pause {
  startTime: number;
  endTime?: number;
}

export interface Team {
  id: number;
  name: string;
  creationTime: number;
  startTime?: number;
  endTime?: number;
  deleted: boolean;
  pauses: Pause[];
  duration: number;
  videoStatus: VideoStatus;
  isPresenting: boolean;
}

export interface SevArtwork {
  name: string;
  label: string;
}
