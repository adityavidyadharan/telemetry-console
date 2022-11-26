import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { CheckCircle } from 'react-bootstrap-icons';
import { useLocation } from 'react-router-dom';

type PageState = {
  id: number;
};

const Upload = () => {
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<boolean>(false);
  const [file, setFile] = useState<string>();
  const [validated, setValidated] = useState<boolean>(false);

  const session = (useLocation().state as PageState).id;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (file === undefined) {
      setError('Please upload a CSV file');
      return;
    }
    console.log('Starting parse process');
    await window.parse.ipcRenderer.parse(
      file,
      session,
      (step: number) => console.log('chunked: ', step),
      () => console.log('done')
    );
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('Please upload a CSV file');
    if (event === null || event === undefined) return;
    if (event.target.files === null || event.target.files[0] === undefined)
      return;

    setValidated(true);
    setError(undefined);
    setSuccess(false);
    setFile(event.target.files[0].path);
    if (event.target.files[0].path === undefined) return;

    const verify = await window.parse.ipcRenderer.verify(
      event.target.files[0].path
    );
    if (verify.valid) {
      setError(undefined);
    } else {
      setError(verify.message);
    }
    setSuccess(false);
  };

  return (
    <div>
      <div>
        <h1>Upload Data CSV</h1>
      </div>
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Select your CSV file</Form.Label>
          <Form.Control
            type="file"
            onChange={handleUpload}
            accept=".csv"
            isInvalid={!!error}
            isValid={validated && !error}
          />
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid">
            CSV headers match expectation
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit">Upload Data</Button>
      </Form>
      <Alert
        className="alert"
        variant="success"
        show={success}
        dismissible
        onClose={() => setSuccess(false)}
      >
        <CheckCircle />
        <h4>Success</h4>
      </Alert>
    </div>
  );
};

export default Upload;
