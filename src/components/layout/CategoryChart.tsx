import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, MenuItem, TextField } from '@mui/material';
import { TransactionType } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = () => {
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSelectedType(e.target.value as TransactionType);
  };

  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <TextField label='収支の種類' select fullWidth value={selectedType} onChange={handleChange}>
        <MenuItem value={'income'}>収入</MenuItem>
        <MenuItem value={'expense'}>支出</MenuItem>
      </TextField>
      <Pie data={data} />
    </Box>
  );
};

export default CategoryChart;
