import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { XLg } from 'react-bootstrap-icons';
import {
  SessionModelInputType,
  SessionModelType,
} from '../../../main/data/models/SessionModel';

interface ISessionFormProps {
  toggle: () => void;
  initial: Partial<SessionModelType>;
}

type IntermediateSession = SessionModelType & {
  date: string;
};

const SessionForm = ({ toggle, initial }: ISessionFormProps) => {
  let existing;
  if (initial) {
    existing = {
      ...initial,
      date: initial.date?.toISOString().split('T')[0],
    };
  }
  const [form, setForm] = useState<Partial<IntermediateSession>>(
    existing as IntermediateSession
  );
  const [validated, setValidated] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (event.currentTarget.checkValidity() === false) return;
    const session: SessionModelInputType = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      name: form.name!,
      location: form.location ?? '',
      date: new Date(form.date ?? ''),
      notes: form.notes ?? '',
      id: form.id,
    };
    console.log(session);
    await window.session.ipcRenderer.create(session);
    toggle();
  };

  const setField = (field: string, value: any) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        <Form onSubmit={handleSubmit} validated={validated} noValidate>
          <Form.Group controlId="sessionName">
            <Form.Label>Session Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter session name"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a session name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="sessionLocation">
            <Form.Label>Session Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter session location"
              value={form.location}
              onChange={(e) => setField('location', e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="sessionDate">
            <Form.Label>Session Date</Form.Label>
            <Form.Control
              required
              type="date"
              placeholder="Enter session date"
              value={form.date}
              onChange={(e) => setField('date', e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a session date.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="sessionNotes">
            <Form.Label>Session Notes</Form.Label>
            <Form.Control
              as="textarea"
              type="text"
              placeholder="Enter session notes"
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
            />
          </Form.Group>
          <Button onClick={toggle}>
            <XLg />
          </Button>
          <Button type="submit">{form.id ? 'Save' : 'Create'}</Button>
        </Form>
      </div>
    </div>
  );
};

export default SessionForm;
