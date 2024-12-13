import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material';
import { ExpenseCategory, IncomeCategory, Transaction, TransactionType } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
}

const CategoryChart = ({ monthlyTransactions, isLoading }: CategoryChartProps) => {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');
  const handleChange = (e: SelectChangeEvent<string>) => {
    setSelectedType(e.target.value as TransactionType);
  };

  const categorySums = monthlyTransactions
    .filter((transaction) => transaction.type === selectedType)
    .reduce<Record<IncomeCategory | ExpenseCategory, number>>((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {} as Record<IncomeCategory | ExpenseCategory, number>);
  console.log(categorySums);

  const categoryLabels = Object.keys(categorySums) as (IncomeCategory | ExpenseCategory)[];
  console.log(categoryLabels);

  const categoryValues = Object.values(categorySums);
  console.log(categoryValues);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const incomeCategoryColor: Record<IncomeCategory, string> = {
    給与: theme.palette.incomeCategoryColor.給与,
    副収入: theme.palette.incomeCategoryColor.副収入,
    お小遣い: theme.palette.incomeCategoryColor.お小遣い,
  };

  const expenseCategoryColor: Record<ExpenseCategory, string> = {
    食費: theme.palette.expenseCategoryColor.食費,
    日用品: theme.palette.expenseCategoryColor.日用品,
    家賃: theme.palette.expenseCategoryColor.家賃,
    交際費: theme.palette.expenseCategoryColor.交際費,
    娯楽: theme.palette.expenseCategoryColor.娯楽,
    交通費: theme.palette.expenseCategoryColor.交通費,
  };

  const getCategoryColor = (category: IncomeCategory | ExpenseCategory): string => {
    if (selectedType === 'income') {
      return incomeCategoryColor[category as IncomeCategory];
    } else {
      return expenseCategoryColor[category as ExpenseCategory];
    }
  };

  const data: ChartData<'pie'> = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,

        // backgroundColor: [
        //   'rgba(255, 99, 132, 0.2)',
        //   'rgba(54, 162, 235, 0.2)',
        //   'rgba(255, 206, 86, 0.2)',
        //   'rgba(75, 192, 192, 0.2)',
        //   'rgba(153, 102, 255, 0.2)',
        //   'rgba(255, 159, 64, 0.2)',
        // ],

        backgroundColor: categoryLabels.map((category) => {
          return getCategoryColor(category);
        }),

        borderColor: categoryLabels.map((category) => {
          return getCategoryColor(category);
        }),
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {/* <TextField id={'select-type'} label='収支の種類' select fullWidth value={selectedType} onChange={handleChange}>
        <MenuItem value={'income'}>収入</MenuItem>
        <MenuItem value={'expense'}>支出</MenuItem>
      </TextField> */}
      <FormControl fullWidth>
        <InputLabel id='type-select-label'>収支の種類</InputLabel>
        <Select
          labelId='type-select-label'
          id='type-select'
          label='収支の種類'
          value={selectedType}
          onChange={handleChange}
        >
          <MenuItem value='income'>収入</MenuItem>
          <MenuItem value='expense'>支出</MenuItem>
        </Select>
      </FormControl>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : monthlyTransactions.length > 0 ? (
          <Pie data={data} options={options} />
        ) : (
          <Typography>データがありません</Typography>
        )}
      </Box>
    </>
  );
};

export default CategoryChart;
