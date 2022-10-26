import { useEffect, useState } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const jsonMap = require('json-source-map');

type Error = Partial<{
  reason: string;
  line: number;
}>;

const EditMapping = () => {
  const [placeholder, setPlaceholder] = useState({});
  const [error, setError] = useState<Error>();
  const [content, setContent] = useState('');
  const verifyJSON = async (payload: any) => {
    if (payload.error) return;
    const check = await window.mappings.ipcRenderer.validateMapping(
      payload.jsObject
    );
    if (check) {
      console.log('error');
      const reason = `${check[0].instancePath} ${check[0].message}`;
      const result = jsonMap.stringify(payload.jsObject, null, 2);
      const { line } = result.pointers[check[0].instancePath].value;
      setError({ reason, line });
    } else {
      setContent(payload.jsObject);
      setError(undefined);
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
    <JSONInput
      id="a_unique_id"
      height="550px"
      locale={locale}
      placeholder={!content ? placeholder : null}
      error={error}
      onChange={verifyJSON}
    />
  );
};

export default EditMapping;
