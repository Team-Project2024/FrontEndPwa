import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const CreditChart = ({ content }) => {
  if (!content) return null;


  const contentArray = content.split(', ');
  const data = {};
  contentArray.forEach(item => {
    const [key, value] = item.split(': ');
    data[key.trim()] = parseInt(value, 10);
  });

  const requiredCredits = {
    인성교양: data['인성교양'] || 0,
    기초교양: data['기초교양'] || 0,
    일반교양: data['일반교양'] || 0,
    전공공통: data['전공공통'] || 0,
    전공심화: data['전공심화'] || 0,
    자유선택: data['자유선택'] || 0
  };

  const completedCredits = data['완료 학점'] || 0;
  const totalCredits = data['졸업 총 학점'] || 0;
  const categories = Object.keys(requiredCredits);
  const remainingCredits = categories.map(category => requiredCredits[category]);

  
  const totalRemainingCredits = remainingCredits.reduce((a, b) => a + b, 0);

  const chartData = {
    labels: [...categories, '졸업 총 학점'],
    datasets: [
      {
        label: '남은학점',
        data: [...remainingCredits, totalCredits - completedCredits],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: '이수한 학점',
        data: [...Array(categories.length).fill(0), completedCredits],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      }
    ]
  };

  const options = {
    responsive: true, 
    maintainAspectRatio: false, 
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(totalCredits, totalRemainingCredits + completedCredits) + 10
      }
    }
  };

  return (
    <div className='relative h-64 w-full'>
        <h2>부족한 학점을 차트로 보여드리겠습니다.</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CreditChart;
