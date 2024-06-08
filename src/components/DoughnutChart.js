import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

const DoughnutChart = ({ data, total, title }) => {
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
      },
      datalabels: {
        display: true,
        color: 'black',
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
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
    <div style={{ position: 'relative', width: '200px', height: '200px' }}>
      <Doughnut data={chartData} options={options} />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        {total}
      </div>
    </div>
  );
};

const Doughnutd = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <DoughnutChart data={[16, 68]} total={16} title="24시간 열람실" />
      <DoughnutChart data={[97, 65]} total={97} title="일반열람실 A" />
      <DoughnutChart data={[80, 88]} total={80} title="일반열람실 B" />
    </div>
  );
};

export default Doughnutd;