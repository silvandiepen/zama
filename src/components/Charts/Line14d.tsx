import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useThemeColors } from './useThemeColors';
import { chartAreaBackground } from './chartAreaPlugin';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type Props = { data: number[] };

export const Line14d: React.FC<Props> = ({ data }) => {
  const { primary, grid, text } = useThemeColors();
  const labels = Array.from({ length: 14 }, (_, i) => `D-${13 - i}`);
  const ds = labels.map((_, i) => data[i] ?? 0);
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: 'Requests',
            data: ds,
            borderColor: primary,
            backgroundColor: primary + '55',
            tension: 0.3,
            pointRadius: 2,
            fill: true,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 150,
        normalized: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: grid }, ticks: { color: text } },
          y: { grid: { color: grid }, ticks: { color: text }, beginAtZero: true },
        },
      }}
      height={180}
      plugins={[chartAreaBackground]}
    />
  );
};
