import type { Plugin } from 'chart.js';

/**
 * Chart.js plugin to add a background color to the chart area.
 * Uses CSS variable --chart-bg for the background color.
 */
export const chartAreaBackground: Plugin = {
  id: 'chartAreaBackground',
  beforeDraw: (chart) => {
    const anyChart: any = chart as any;
    const { ctx, chartArea } = anyChart;
    if (!chartArea) return;
    ctx.save();
    const root = document.documentElement;
    const bg = getComputedStyle(root).getPropertyValue('--chart-bg').trim() || 'rgba(0,0,0,.05)';
    ctx.fillStyle = bg;
    ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
    ctx.restore();
  },
};

