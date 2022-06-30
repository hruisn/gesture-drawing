import { FolderConfig } from '../types';

export const msToHmsString = (ms: number, reduce?: boolean): string => {
  const isoString = new Date(ms).toISOString();
  return ms < 3600 * 1000 && reduce
    ? isoString.substring(14, 19)
    : isoString.substring(11, 19);
};

export const hmsStringToMs = (hms: string): number => {
  const arr = hms.split(':');
  return (+arr[0] * 60 * 60 + +arr[1] * 60 + (+arr[2] || 0)) * 1000;
};

export const getFolderInfo = ({ dirName, imagePaths }: FolderConfig): string =>
  `${dirName}, ${imagePaths.length} image${imagePaths.length > 1 ? 's' : ''}`;
