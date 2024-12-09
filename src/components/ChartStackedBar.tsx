import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ChartStackedBar() {
  const labels = ['11/18', '11/19', '11/20', '11/21', '11/22', '11/23', '11/24'];
  // サンプル用データセット（実際には各工程に応じて色分けなど調整）
  const data = {
    labels,
    datasets: [
      { label: '粗材供給', data: [34, 76, 133, 189, 72, 18, 0], backgroundColor: '#F79646' },
      { label: '旋削1', data: [180, 108, 111, 40, 159, 45, 0], backgroundColor: '#C0504D' },
      { label: '転造', data: [72, 73, 55, 72, 77, 14, 0], backgroundColor: '#9BBB59' },
      { label: '熱処理', data: [45, 40, 42, 59, 143, 72, 0], backgroundColor: '#8064A2' },
      { label: '旋削2', data: [72, 108, 93, 106, 111, 53, 0], backgroundColor: '#4BACC6' },
      { label: '塗装', data: [134, 159, 189, 180, 72, 34, 0], backgroundColor: '#4F81BD' },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
}
