import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

type DataPoints = {
  times: Date[];
  values: number[];
};

interface ILineChartProps {
  message: string;
  label: string;
}

const LineChart = ({ message, label }: ILineChartProps) => {
  const [data, setData] = useState<DataPoints>();

  useEffect(() => {
    const getConnections = async () => {
      if (message && label) {
        const connections = await window.data.ipcRenderer.getSensor(
          message,
          label
        );
        const times = connections.map(
          (connection) => new Date(connection.time)
        );
        const values = connections.map((connection) =>
          Number(connection.value)
        );
        setData({ times, values });
      }
    };
    getConnections();
  }, [message, label]);

  return (
    <Plot
      data={[
        {
          line: { color: 'red' },
          mode: 'lines',
          type: 'scatter',
          x: data?.times,
          y: data?.values,
          automargin: true,
        },
      ]}
      layout={{ width: 600, height: 600, title: 'A Fancy Plot' }}
    />
  );
};

export default LineChart;
