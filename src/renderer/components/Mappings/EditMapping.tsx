import { useEffect, useState } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

type Error = Partial<{
  reason: string;
  line: number;
}>;

const EditMapping = () => {
  const [json, setJSON] = useState({});
  const [error, setError] = useState<Error>();
  const verifyJSON = async (content: any) => {
    if (content.error) return;
    const check = await window.mappings.ipcRenderer.validateMapping(
      content.jsObject
    );
    console.log(check);
    if (check) {
      console.log('error');
      const reason = `${check[0].instancePath} ${check[0].message}`;
      console.log(reason);
      setError({ reason });
    } else {
      setError(undefined);
    }
  };
  useEffect(() => {
    const getMapping = async () => {
      console.log('try');
      const mapping = await window.mappings.ipcRenderer.getCurrentMapping();
      setJSON(mapping);
    };
    getMapping();
  }, []);

  return (
    <JSONInput
      id="a_unique_id"
      height="550px"
      locale={locale}
      placeholder={json}
      error={error}
      onChange={verifyJSON}
    />
  );
};

export default EditMapping;
