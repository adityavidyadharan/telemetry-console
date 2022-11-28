import { useState, useEffect } from 'react';
import { Button, Modal, Spinner, Table, Toast } from 'react-bootstrap';
import { SessionModelType } from '../../../main/data/models/SessionModel';
import useModal from '../../hooks/useModal';
import SessionForm from './SessionForm';

import './SessionGrid.scss';
import SessionRow from './SessionRow';

const SessionGrid = () => {
  const [sessions, setSessions] = useState<SessionModelType[]>([]);
  const [form, setForm] = useState<Partial<SessionModelType>>({});
  const [load, setLoad] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [size, setSize] = useState<number>(0);
  const { isOpen, toggle } = useModal();

  const fetchSessions = async () => {
    setLoad(true);
    setSize(await window.session.ipcRenderer.getFileSize());
    const resp = await window.session.ipcRenderer.fetch();
    setLoad(false);
    setSessions(resp);
  };
  const editSession = async (contents: Partial<SessionModelType>) => {
    setForm(contents);
    toggle();
  };
  useEffect(() => {
    fetchSessions();
  }, [isOpen]);
  return (
    <div>
      <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000}>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Working . . .</strong>
        </Toast.Header>
        <Toast.Body>Delete in progress. This can take a minute.</Toast.Body>
      </Toast>
      <Table id="sessions-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Date</th>
            <th>Notes</th>
            <th>Actions</th>
            <th>Modify</th>
            <th>Data Count</th>
          </tr>
        </thead>
        <tbody>
          {load ? (
            <Spinner animation="border" />
          ) : (
            sessions.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                editSession={editSession}
                fetchSessions={fetchSessions}
                setShowToast={setShowToast}
              />
            ))
          )}
        </tbody>
      </Table>
      <p>
        Estimated file size:{' '}
        <strong>
          {size.toLocaleString('en-US', {
            maximumFractionDigits: 0,
          })}
          mb
        </strong>
      </p>
      <Button onClick={() => editSession({})}>Create Session</Button>
      <Modal show={isOpen} handleClose={toggle} title="Create New Session">
        <SessionForm toggle={toggle} initial={form} />
      </Modal>
    </div>
  );
};

export default SessionGrid;
