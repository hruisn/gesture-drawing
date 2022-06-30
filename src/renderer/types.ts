export interface FolderConfig {
  dirPath: string | null;
  dirName: string | null;
  imagePaths: string[];
}

export interface TimeoutConfig {
  timeout: number;
}

export type Session = FolderConfig & TimeoutConfig;

export interface SessionHistory extends Session {
  lastImageIndex: number | null;
  startTimeStamp?: Date;
  endTimeStamp?: Date;
}
