import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

const DoughnutChart = ({ data, total, title, maxTotal }) => {
  const chartData = {
    datasets: [
      {
        data: data,
        backgroundColor: ['#36A2EB', '#E0E0E0'],
        hoverBackgroundColor: ['#36A2EB', '#E0E0E0'],
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      datalabels: {
        display: true,
        color: 'black',
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          if (label === 'Used') {
            return `${value}`;
          } else {
            return '';
          }
        },
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
  };

  return (
    <div style={{ position: 'relative', width: '200px', height: '250px' }}>
      <Doughnut data={chartData} options={options} />
   
      <div
        style={{
          position: 'absolute',
          top: '65%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        {total} / {maxTotal}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <DoughnutChart data={[16, 68]} total={16} maxTotal={84} title="요소1" />
      <DoughnutChart data={[97, 65]} total={97} maxTotal={162} title="요소2" />
      <DoughnutChart data={[80, 88]} total={80} maxTotal={168} title="요소3" />
    </div>
  );
};

export default App;
