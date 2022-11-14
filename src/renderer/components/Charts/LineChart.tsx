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
        data={activeLabels.map((label) => {
          return {
            line: { color: 'red' },
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
  // return (
  //   <div>
  //     <Plot
  //       className="line-chart"
  //       data={[
  //         {
  //           line: { color: 'red' },
  //           mode: 'lines',
  //           type: 'scatter',
  //           x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  //           y: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  //         },
  //         {
  //           line: { color: 'blue' },
  //           mode: 'lines',
  //           type: 'scatter',
  //           x: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  //           y: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  //         },
  //       ]}
  //       layout={{ width: 500, height: 500, title }}
  //     />
  //   </div>
  // );
};

export default LineChart;
