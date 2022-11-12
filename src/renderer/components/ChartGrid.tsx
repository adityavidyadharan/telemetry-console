import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import SensorChart, { ISensorChartProps } from './SensorChart';

import './scss/ChartGrid.scss';

const ChartGrid = () => {
  const [charts, setCharts] = useState<ISensorChartProps[]>([
    { default_message: 'Message Category', default_labels: [] },
  ]);

  const addChart = () => {
    setCharts([
      ...charts,
      { default_message: 'Message Category', default_labels: [] },
    ]);
  };

  return (
    <div className="chart-grid">
      {charts.map((chart: ISensorChartProps, idx: number) => {
        const key = `chart - ${idx}`;
        return (
          <SensorChart
            key={key}
            default_message={chart.default_message}
            default_labels={chart.default_labels}
          />
        );
      })}
      <Button onClick={addChart}>
        <PlusCircle />
      </Button>
    </div>
  );
};

export default ChartGrid;
