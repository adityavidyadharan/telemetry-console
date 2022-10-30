import { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { ArrowCounterclockwise, Save2, Trash } from 'react-bootstrap-icons';
import JSONInput from 'react-json-editor-ajrm';
import ReactTooltip from 'react-tooltip';
import { Mapping } from '../../../main/data/service/MappingService';

const jsonMap = require('json-source-map');

const locale = require('react-json-editor-ajrm/locale/en');

type Error = Partial<{
  reason: string;
  line: number;
}>;

const EditMapping = () => {
  const [placeholder, setPlaceholder] = useState({});
  const [error, setError] = useState<Error>();
  const [success, setSuccess] = useState<boolean>(false);
  const [content, setContent] = useState<Mapping>();

  const resetMapping = async () => {
    console.debug('Resetting mapping');
    await window.mappings.ipcRenderer.resetMapping();
    setPlaceholder({});
    setPlaceholder(await window.mappings.ipcRenderer.getCurrentMapping());
  };

  const discardChanges = async () => {
    console.debug('Discarding changes');
    setPlaceholder({});
    setPlaceholder(await window.mappings.ipcRenderer.getCurrentMapping());
  };

  /**
   * Save the current mapping to the file system.
   */
  const saveChanges = async () => {
    console.debug('Saving changes');
    if (content === undefined) return;
    try {
      await window.mappings.ipcRenderer.updateMapping(content);
      setSuccess(true);
    } catch (e) {
      console.error(e);
    }
  };

  const verifyJSON = async (payload: any) => {
    console.debug('Verifying JSON');
    setSuccess(false);
    setError({});
    if (payload.error) return;
    const check = await window.mappings.ipcRenderer.validateMapping(
      payload.jsObject
    );
    if (check) {
      const reason = `${check[0].instancePath} ${check[0].message}`;
      const result = jsonMap.stringify(payload.jsObject, null, 2);
      const { line } = result.pointers[check[0].instancePath].value;
      setError({ reason, line });
    } else {
      setError(undefined);
      setContent(payload.jsObject);
    }
  };

  useEffect(() => {
    const getMapping = async () => {
      const mapping = await window.mappings.ipcRenderer.getCurrentMapping();
      setPlaceholder(mapping);
    };
    getMapping();
  }, []);

  return (
    <div>
      <Alert
        variant="success"
        dismissible
        style={{
          visibility: success === true ? 'visible' : 'hidden',
        }}
        onClose={() => setSuccess(false)}
      >
        <Alert.Heading>Successfully saved mapping</Alert.Heading>
      </Alert>
      <JSONInput
        id="a_unique_id"
        height="550px"
        locale={locale}
        placeholder={placeholder}
        error={error}
        onChange={verifyJSON}
      />
      <div className="code-toolbar">
        <Button onClick={resetMapping} data-tip="Revert to default mapping">
          <ArrowCounterclockwise />
        </Button>
        <Button onClick={discardChanges} data-tip="Discard Changes">
          <Trash />
        </Button>
        <Button
          onClick={saveChanges}
          data-tip="Save mapping"
          disabled={error !== undefined}
        >
          <Save2 />
        </Button>
        <ReactTooltip place="bottom" effect="solid" delayShow={200} />
      </div>
    </div>
  );
};

export default EditMapping;
