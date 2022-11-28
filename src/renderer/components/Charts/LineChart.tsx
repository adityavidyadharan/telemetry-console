import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
// import { Data } from 'plotly.js';

import './LineChart.scss';

type DataPoints = {
  times: Date[];
  values: number[];
};

interface ILineChartProps {
  message: string;
  setLoading: (loading: boolean) => void;
  activeLabels: string[];
  reset: boolean;
}

const LineChart = ({
  message,
  activeLabels,
  setLoading,
  reset,
}: ILineChartProps) => {
  const [data, setData] = useState<Record<string, DataPoints> | undefined>();

  const getColor = (index: number) => {
    const colors = [
      '#1f77b4',
      '#ff7f0e',
      '#2ca02c',
      '#d62728',
      '#9467bd',
      '#8c564b',
      '#e377c2',
      '#7f7f7f',
      '#bcbd22',
      '#17becf',
    ];
    return colors[index % colors.length];
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const labels = await window.data.ipcRenderer.getDistinctLabels(message);
      labels.forEach(async (label) => {
        const points = await window.data.ipcRenderer.getSensor(message, label);
        const times = points.map((point) => new Date(point.time));
        const values = points.map((point) => Number(point.value));
        setData((d) => {
          const temp = d ?? {};
          temp[label] = { times, values };
          return temp;
        });
      });
      setLoading(false);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);
  useEffect(() => {
    const resetData = async () => {
      setLoading(true);
      setData(undefined);
      setLoading(false);
    };
    resetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  return (
    <div>
      <Plot
        className="line-chart"
        data={activeLabels.map((label, idx) => {
          return {
            name: label,
            line: { color: getColor(idx) },
            mode: 'lines',
            type: 'scatter',
            x: data?.[label]?.times,
            y: data?.[label]?.values,
          };
        })}
        layout={{
          width: 500,
          height: 500,
          title: `${message}`,
        }}
      />
    </div>
  );
};

export default LineChart;
