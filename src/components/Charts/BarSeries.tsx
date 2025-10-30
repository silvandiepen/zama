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

type Props = { labels: string[]; data: number[]; height?: number };

export const BarSeries: React.FC<Props> = ({ labels, data, height = 160 }) => {
  const { info, grid, text } = useThemeColors();
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
          x: { grid: { color: grid }, ticks: { color: text } },
          y: { grid: { color: grid }, ticks: { color: text }, beginAtZero: true },
        },
        layout: { padding: 4 },
        datasets: { bar: { maxBarThickness: 22, barPercentage: 0.85, categoryPercentage: 0.85 } }
      }}
      height={height}
      plugins={[chartAreaBackground]}
    />
  );
};
