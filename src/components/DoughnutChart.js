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
    <div className="relative w-40 h-52">
      <Doughnut data={chartData} options={options} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
        {total} / {maxTotal}
      </div>
    </div>
  );
};

const DoughnutCharts = ({ content, graduation }) => {
  if (!content || !graduation) return null;

 
  const contentArray = content.split(', ');
  const userData = {};
  contentArray.forEach(item => {
    const [key, value] = item.split(': ');
    userData[key.trim()] = parseInt(value, 10);
  });

  const requiredCredits = {
    '기초교양': graduation.basicLiberalArts,
    '인성교양': graduation.characterCulture,
    '일반교양': graduation.generalLiberalArts,
    '전공공통': graduation.majorCommon,
    '전공심화': graduation.majorAdvanced,
    '자유선택': graduation.freeChoice
  };

  const charts = Object.keys(requiredCredits).map(key => {
    const required = requiredCredits[key];
    const remaining = userData[key] || 0;
    const completed = required - remaining;

    return (
      <div key={key} className="p-2 sm:p-4">
        <DoughnutChart
          data={[completed, remaining]}
          total={completed}
          maxTotal={required}
          title={key}
        />
      </div>
    );
  });

  const totalCompletedCredits = userData['완료 학점'] || 0;
  const totalRemainingCredits = graduation.graduationCredits - totalCompletedCredits;

  return (
    <div className="flex flex-wrap justify-center">
      {charts}
      <div className="p-2 sm:p-4">
        <DoughnutChart
          data={[totalCompletedCredits, totalRemainingCredits]}
          total={totalCompletedCredits}
          maxTotal={graduation.graduationCredits}
          title="졸업 총 학점"
        />
      </div>
    </div>
  );
};

export default DoughnutCharts;
