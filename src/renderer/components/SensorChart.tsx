import { useState } from 'react';
import LineChart from './Charts/LineChart';
import Dropdown from './utils/Dropdown';

import '../scss/SensorChart.scss';

type Senor = {
  message: string;
  label: string;
};

const SensorChart = () => {
  const [sensor, setSensor] = useState<Senor>();
  const [message, setMessage] = useState<string>('Message category');
  const [label, setLabel] = useState<string>('Data label');

  const getMessages = async (store: (contents: string[]) => void) => {
    store(await window.data.ipcRenderer.getDistinctMessages());
  };
  const setMessageDropdown = async (m: string) => {
    setMessage(m);
    setLabel('Data label');
  };
  const getLabels = async (store: (contents: string[]) => void) => {
    store(await window.data.ipcRenderer.getDistinctLabels(message));
  };

  return (
    <div className="d-flex justify-content-center">
      <div>
        <Dropdown
          currentValue={message}
          setCurrentValue={setMessageDropdown}
          fetchContents={getMessages}
        />
      </div>
      <div>
        <Dropdown
          currentValue={label}
          setCurrentValue={setLabel}
          fetchContents={getLabels}
        />
      </div>

      <LineChart message={message} label={label} />
    </div>
  );
};

export default SensorChart;
