import { useState } from 'react';
import LineChart from './Charts/LineChart';
import Dropdown from './utils/Dropdown';

import '../scss/SensorChart.scss';

const SensorChart = () => {
  const [message, setMessage] = useState<string>('Message category');
  const [label, setLabel] = useState<string>('Data label');
  const [active, setActive] = useState<boolean>(false);

  const getMessages = async (store: (contents: string[]) => void) => {
    store(await window.data.ipcRenderer.getDistinctMessages());
  };
  const setMessageDropdown = async (m: string) => {
    setMessage(m);
    setActive(true);
    setLabel('Data label');
  };
  const getLabels = async (store: (contents: string[]) => void) => {
    store(await window.data.ipcRenderer.getDistinctLabels(message));
  };

  return (
    <div className="d-flex justify-content-center">
      <div>
        <Dropdown
          active
          currentValue={message}
          setCurrentValue={setMessageDropdown}
          fetchContents={getMessages}
        />
      </div>
      <div>
        <Dropdown
          active={active}
          currentValue={label}
          setCurrentValue={setLabel}
          fetchContents={getLabels}
        />
      </div>

      <LineChart
        message={message}
        label={label}
        show={label !== 'Data label'}
      />
    </div>
  );
};

export default SensorChart;
