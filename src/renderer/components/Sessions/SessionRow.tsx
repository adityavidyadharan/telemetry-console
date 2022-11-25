import { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { SessionModelType } from '../../../main/data/models/SessionModel';

interface ISessionFormProps {
  session: SessionModelType;
  editSession: (session: Partial<SessionModelType>) => void;
  fetchSessions: () => void;
}

const SessionRow = ({
  session,
  editSession,
  fetchSessions,
}: ISessionFormProps) => {
  const [load, setLoad] = useState<boolean>(false);
  const navigate = useNavigate();

  const selectSession = async (id: number) => {
    await window.session.ipcRenderer.select(id);
    navigate('/parse');
  };

  const deleteSession = async (id: number) => {
    setLoad(true);
    await window.session.ipcRenderer.delete(id);
    fetchSessions();
  };

  return (
    <tr key={session.id}>
      <td>{session.name}</td>
      <td>{session.location}</td>
      <td>{session.date.toLocaleDateString()}</td>
      <td>{session.notes}</td>
      <td>
        {session.populated ? (
          <Button onClick={() => selectSession(session.id)}>Select</Button>
        ) : (
          <Button>Upload</Button>
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
    </tr>
  );
};

export default SessionRow;
