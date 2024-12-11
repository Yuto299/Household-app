import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };

  const labels = ['2024-12-25', '2024-12-25', '2024-12-25', '2024-12-25', '2024-12-25', '2024-12-25', '2024-12-25'];
  const data = {
    labels,
    datasets: [
      {
        label: '支出',
        data: [100, 200, 300, 300, 400, 400, 500],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '収入',
        data: [100, 200, 300, 300, 400, 400, 500],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default BarChart;
