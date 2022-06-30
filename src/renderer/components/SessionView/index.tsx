import { useEffect, useState } from 'react';
import { FolderConfig, Session } from 'renderer/types';
import Button from 'renderer/components/Button';
import FolderInput from 'renderer/components/FolderInput';
import TimeoutInput from 'renderer/components/TimeoutInput';
import styles from './styles.module.css';

interface SessionViewProps {
  session: Session | null;
  onStart: (session: Session) => void;
  onResume?: (session: Session) => void;
}

export const sessionTemplate: Session = {
  dirPath: null,
  dirName: null,
  imagePaths: [],
  timeout: 30 * 1000,
};

const SessionView: React.FC<SessionViewProps> = ({
  session,
  onStart,
  onResume,
}) => {
  const [editableSession, setEditableSession] = useState<Session>(
    session || sessionTemplate
  );

  const [isSessionFolderChanged, setSessionFolderChanged] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      !session ||
      (session.dirPath !== editableSession.dirPath &&
        session.imagePaths.length !== editableSession.imagePaths.length)
    ) {
      setSessionFolderChanged(true);
    }
  }, [session, editableSession]);

  const onChangeFolder = (folder: FolderConfig) =>
    setEditableSession((s) => ({ ...s, ...folder }));

  const onChangeTimeout = (timeout: number) =>
    setEditableSession((s) => ({ ...s, timeout }));

  const isSessionReady =
    editableSession.dirPath &&
    editableSession.imagePaths.length > 0 &&
    editableSession.timeout > 0;

  const canResume =
    isSessionReady &&
    !isSessionFolderChanged &&
    !!onResume &&
    typeof onResume === 'function';

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSessionReady) {
      if (canResume) onResume(editableSession);
      else onStart(editableSession);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <h1>Setup session</h1>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.formItem}>
            <label>Folder</label>
            <FolderInput {...editableSession} onChange={onChangeFolder} />
          </div>
          <div className={styles.formItem}>
            <label>Time per drawing</label>
            <TimeoutInput
              min={1 * 1000} // 1 second
              max={2 * 60 * 60 * 1000} // 2 hours
              timeout={editableSession.timeout}
              onChange={onChangeTimeout}
            />
          </div>
          <div className={styles.actions}>
            {canResume && (
              <Button
                disabled={!isSessionReady}
                fluid
                onClick={() => onResume(editableSession)}
              >
                Resume
              </Button>
            )}
            <Button
              disabled={!isSessionReady}
              fluid
              onClick={() => onStart(editableSession)}
            >
              {canResume ? 'Start over' : 'Start'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionView;
