import { useCallback, useEffect, useRef, useState } from 'react';
import { FolderConfig } from 'renderer/types';
import Button from 'renderer/components/Button';
import styles from './styles.module.css';

export const getFolderInfo = ({ dirName, imagePaths }: FolderConfig): string =>
  dirName && imagePaths.length > 0
    ? `${dirName}, ${imagePaths.length} image${
        imagePaths.length > 1 ? 's' : ''
      }`
    : '';

type FolderInputProps = FolderConfig & {
  onChange: (f: FolderConfig) => void;
};
const FolderInput: React.FC<FolderInputProps> = ({
  dirName,
  dirPath,
  imagePaths,
  onChange,
}) => {
  const [folder, setFolder] = useState<string>(
    getFolderInfo({ dirName, dirPath, imagePaths }) || ''
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (folder && inputRef.current) {
      inputRef.current.focus();
    }
  }, [folder]);

  const openDialog = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.blur();
      const selectedDirPath = await window.appApi.selectDir();
      if (!selectedDirPath) return;

      const selectedDirName = await window.appApi.getDirName(selectedDirPath);
      if (!selectedDirName) return;

      const selectedImagePaths = await window.appApi.getImagePathsFromDir(
        selectedDirPath
      );
      if (!selectedImagePaths || selectedImagePaths.length === 0) return;

      setFolder(
        getFolderInfo({
          dirName: selectedDirName,
          dirPath: selectedDirPath,
          imagePaths: selectedImagePaths,
        })
      );

      onChange({
        dirName: selectedDirName,
        dirPath: selectedDirPath,
        imagePaths: selectedImagePaths,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange]
  );

  const isSelected = dirName && dirPath && imagePaths.length > 0;

  return (
    <div className={styles.folderInputContainer}>
      <input
        type="text"
        readOnly
        placeholder="Select folder"
        value={folder}
        ref={inputRef}
        className={styles.folderInput}
      />
      <Button className={styles.selectButton} onClick={openDialog}>
        {isSelected ? 'Change' : 'Select'}
      </Button>
    </div>
  );
};

export default FolderInput;
