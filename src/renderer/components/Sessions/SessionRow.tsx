import { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { SessionModelType } from '../../../main/data/models/SessionModel';

interface ISessionFormProps {
  session: SessionModelType;
  editSession: (session: Partial<SessionModelType>) => void;
  fetchSessions: () => void;
  setShowToast: (show: boolean) => void;
}

const SessionRow = ({
  session,
  editSession,
  fetchSessions,
  setShowToast,
}: ISessionFormProps) => {
  const [load, setLoad] = useState<boolean>(false);
  const navigate = useNavigate();

  const selectSession = async (id: number) => {
    await window.session.ipcRenderer.select(id);
    navigate('/charts');
  };

  const uploadSession = async (id: number) => {
    navigate('/upload', { state: { id } });
  };

  const deleteSession = async (id: number) => {
    setLoad(true);
    setShowToast(true);
    await window.session.ipcRenderer.delete(id);
    setShowToast(false);
    fetchSessions();
  };

  return (
    <tr key={session.id}>
      <td>{session.name}</td>
      <td>{session.location}</td>
      <td>{session.date.toLocaleDateString()}</td>
      <td>{session.notes}</td>
      <td>
        {session.count > 0 ? (
          <Button onClick={() => selectSession(session.id)}>Select</Button>
        ) : (
          <Button onClick={() => uploadSession(session.id)}>Upload</Button>
        )}
      </td>
      <td>
        {load ? (
          <Spinner animation="border" />
        ) : (
          <div>
            <button
              type="button"
              className="deleteButton edit-icons"
              onClick={() => editSession(session)}
            >
              <PencilSquare />
            </button>
            <button
              type="button"
              className="deleteButton edit-icons"
              onClick={() => deleteSession(session.id)}
            >
              <Trash />
            </button>
          </div>
        )}
      </td>
      <td>{session.count.toLocaleString()}</td>
    </tr>
  );
};

export default SessionRow;
