export interface TranscriptSegment {
  id: string;
  start: number; // Start time in seconds
  duration: number;
  text: string;
}

export interface VideoState {
  currentTime: number;
  isPlaying: boolean;
  videoId: string | null;
}

export enum MessageType {
  VIDEO_UPDATE = 'VIDEO_UPDATE',
  REQUEST_STATUS = 'REQUEST_STATUS',
  GET_TRANSCRIPT = 'GET_TRANSCRIPT',
}

export interface ExtensionMessage {
  type: MessageType;
  payload?: any;
}
