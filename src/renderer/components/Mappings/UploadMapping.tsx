import { ErrorObject } from 'ajv';
import { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { CheckCircle } from 'react-bootstrap-icons';

import './Mapping.scss';

const UploadMapping = () => {
  const [error, setError] = useState<ErrorObject[]>();
  const [success, setSuccess] = useState<boolean>(false);
  const [file, setFile] = useState<string>();

  const handleSubmit = async (event: React.SyntheticEvent) => {
    console.log(event);
    event.preventDefault();
    event.stopPropagation();
    if (file === undefined) return;
    const result = await window.mappings.ipcRenderer.updateMappingFromFile(
      file
    );
    if (result) {
      console.error(result);
      setError(result);
      setSuccess(false);
      console.log(!!error);
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event === null || event === undefined) return;
    if (event.target.files === null) return;
    setError(undefined);
    setSuccess(false);
    setFile(event.target.files[0].path);
  };

  return (
    <div>
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Upload your new mapping</Form.Label>
          <Form.Control
            type="file"
            onChange={handleUpload}
            accept=".json"
            isInvalid={!!error}
          />
          {/* <Form.Control.Feedback type="invalid"> */}
        </Form.Group>
        <Button type="submit">Upload Mapping</Button>
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
      <Alert
        className="alert"
        variant="error"
        show={!!error}
        dismissible
        onClose={() => setError(undefined)}
      >
        <CheckCircle />
        <p style={{ overflowWrap: 'break-word' }}>
          {JSON.stringify(error, null, 2)}
        </p>
      </Alert>
    </div>
  );
};

export default UploadMapping;
