import { useEffect, useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import LineChart from './Charts/LineChart';

import './scss/SensorChart.scss';
import Loading from './utils/Loading';

export interface ISensorChartProps {
  default_message: string;
  default_labels: string[];
}

const SensorChart = ({
  default_message,
  default_labels,
}: ISensorChartProps) => {
  const [message, setMessage] = useState<string>(default_message); // active message
  const [messageList, setMessageList] = useState<string[]>(['']); // list of messages
  const [loadingMessage, setLoadingMessage] = useState<boolean>(true); // loading messages
  const [labels, setLabels] = useState<string[]>([]); // active labels
  const [labelList, setLabelList] = useState<string[]>(default_labels); // list of labels
  const [loadingLabel, setLoadingLabel] = useState<boolean>(false); // loading list of messages
  const [dataLoading, setDataLoading] = useState<boolean>(true); // loading data
  const [reset, setReset] = useState<boolean>(true); // show chart

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessage(true);
      setMessageList(await window.data.ipcRenderer.getDistinctMessages());
      setLoadingMessage(false);
    };
    getMessages();
  }, []);

  useEffect(() => {
    const getLabels = async () => {
      if (message === 'Message Category') return;
      setLoadingLabel(true);
      setLabelList(await window.data.ipcRenderer.getDistinctLabels(message));
      setLoadingLabel(false);
    };
    getLabels();
  }, [message]);

  return (
    <div className="chart-wrapper">
      <div className="dropdown-wrapper">
        <Dropdown className="dropdown">
          <Dropdown.Toggle variant="primary">
            <Loading loading={loadingMessage} nested>
              <span>{message}</span>
            </Loading>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {messageList.map((messageItem: string) => {
              const dbKey = `dropdown- + ${messageItem}`;
              return (
                <Dropdown.Item
                  key={dbKey}
                  onClick={() => {
                    setReset(!reset);
                    setMessage(messageItem);
                  }}
                >
                  {messageItem}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
        <Loading loading={loadingLabel} nested={false}>
          <Form>
            {labelList.map((labelItem: string) => {
              const dbKey = `checkbox- + ${labelItem}`;
              return (
                <Form.Check
                  disabled={dataLoading}
                  key={dbKey}
                  type="checkbox"
                  label={labelItem}
                  onClick={() => {
                    if (labels.includes(labelItem)) {
                      setLabels(labels.filter((label) => label !== labelItem));
                    } else {
                      setLabels([...labels, labelItem]);
                    }
                  }}
                />
              );
            })}
          </Form>
        </Loading>
      </div>
      <LineChart
        setLoading={setDataLoading}
        activeLabels={labels}
        message={message}
        reset={reset}
      />
    </div>
  );
};

export default SensorChart;
