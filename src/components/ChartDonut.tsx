import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartDonut() {
  const data = {
    labels: ['塗装', '旋削1', '転造', '熱処理', '旋削2', '粗材供給'],
    datasets: [
      {
        data: [2242, 2811, 1103, 1721, 1148, 506],
        backgroundColor: [
          '#4F81BD',
          '#C0504D',
          '#9BBB59',
          '#8064A2',
          '#4BACC6',
          '#F79646'
        ],
      },
    ],
  };

  const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0);

  return (
    <div className="text-center">
      <div className="text-2xl font-bold mb-2">{total}</div>
      <Doughnut data={data} />
    </div>
  );
}
