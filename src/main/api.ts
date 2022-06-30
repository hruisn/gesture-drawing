import { ipcRenderer } from 'electron';

export enum Channels {
  SELECT_DIR = 'select-dir',
  GET_DIR_NAME = 'get-dir-name',
  GET_IMAGE_PATHS_FROM_FIR = 'get-image-paths-from-dir',
  CONFIRM = 'confirm',
}

export interface AppApi {
  selectDir: () => Promise<string | void | undefined>;
  getDirName: (dirPath: string) => Promise<string | void | undefined>;
  getImagePathsFromDir: (
    dirPath: string
  ) => Promise<string[] | void | undefined>;
  confirm: (question: string) => Promise<boolean | void | undefined>;
}

export const appApi: AppApi = {
  selectDir: async (): Promise<string | void | undefined> =>
    ipcRenderer.invoke(Channels.SELECT_DIR),
  getDirName: async (dirPath: string): Promise<string | void | undefined> =>
    ipcRenderer.invoke(Channels.GET_DIR_NAME, dirPath),
  getImagePathsFromDir: async (
    dirPath: string
  ): Promise<string[] | void | undefined> =>
    ipcRenderer.invoke(Channels.GET_IMAGE_PATHS_FROM_FIR, dirPath),
  confirm: async (question: string): Promise<boolean | void | undefined> =>
    ipcRenderer.invoke(Channels.CONFIRM, question),
};
