import { contextBridge } from 'electron';
import { AppApi, appApi } from './api';

contextBridge.exposeInMainWorld('appApi', appApi);

declare global {
  interface Window {
    appApi: AppApi;
  }
}
