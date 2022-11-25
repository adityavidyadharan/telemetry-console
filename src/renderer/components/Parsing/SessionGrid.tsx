import { useState, useEffect } from 'react';
import { Button, Modal, Spinner, Table } from 'react-bootstrap';
import { SessionModelType } from '../../../main/data/models/SessionModel';
import useModal from '../../hooks/useModal';
import SessionForm from './SessionForm';

import './SessionGrid.scss';
import SessionRow from './SessionRow';

const SessionGrid = () => {
  const [sessions, setSessions] = useState<SessionModelType[]>([]);
  const [form, setForm] = useState<Partial<SessionModelType>>({});
  const [load, setLoad] = useState<boolean>(false);
  const { isOpen, toggle } = useModal();

  const fetchSessions = async () => {
    setLoad(true);
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
      <Table id="sessions-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Date</th>
            <th>Notes</th>
            <th>Actions</th>
            <th>Modify</th>
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
              />
            ))
          )}
        </tbody>
      </Table>
      <Button onClick={() => editSession({})}>Create Session</Button>
      <Modal show={isOpen} handleClose={toggle} title="Create New Session">
        <SessionForm toggle={toggle} initial={form} />
      </Modal>
    </div>
  );
};

export default SessionGrid;
