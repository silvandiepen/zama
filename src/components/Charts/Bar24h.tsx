import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useThemeColors } from './useThemeColors';
import { chartAreaBackground } from './chartAreaPlugin';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = { data: number[] };

export const Bar24h: React.FC<Props> = ({ data }) => {
  const { info, grid, text } = useThemeColors();
  const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const ds = labels.map((_, i) => data[i] ?? 0);
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: 'Requests',
            data: ds,
            backgroundColor: info + 'cc',
            borderRadius: 6,
            borderSkipped: false as any,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 150,
        devicePixelRatio: 1,
        normalized: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: grid }, ticks: { color: text }, stacked: false },
          y: { grid: { color: grid }, ticks: { color: text }, beginAtZero: true },
        },
        layout: { padding: 4 },
        datasets: {
          bar: {
            maxBarThickness: 18,
            barPercentage: 0.8,
            categoryPercentage: 0.8,
          }
        }
      }}
      height={220}
      plugins={[chartAreaBackground]}
    />
  );
};
