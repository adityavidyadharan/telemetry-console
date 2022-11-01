import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

type DataPoints = {
  times: Date[];
  values: number[];
};

interface ILineChartProps {
  message: string;
  label: string;
  show: boolean;
}

const LineChart = ({ message, label, show }: ILineChartProps) => {
  const [data, setData] = useState<DataPoints>();
  const [title, setTitle] = useState<string>('Data');

  useEffect(() => {
    const updateTitle = () => {
      setTitle(`${message} - ${label}`);
    };
    const getData = async () => {
      if (!show) setData(undefined);
      else if (message && label) {
        const points = await window.data.ipcRenderer.getSensor(message, label);
        const times = points.map((point) => new Date(point.time));
        const values = points.map((point) => Number(point.value));
        setData({ times, values });
      }
    };
    updateTitle();
    getData();
  }, [message, label, show]);

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
      layout={{ width: 600, height: 600, title }}
    />
  );
};

export default LineChart;
