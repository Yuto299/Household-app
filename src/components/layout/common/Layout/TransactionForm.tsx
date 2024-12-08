import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  ListItemIcon,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // 閉じるボタン用のアイコン
import Fastfood from '@mui/icons-material/Fastfood'; //食事アイコン
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { ExpenseCategory, IncomeCategory } from '../../../../types';
import { AddBusiness, AddHome, Alarm, Diversity3, Savings, SportsTennis, Train, Work } from '@mui/icons-material';
import { transactionSchema } from '../../../../validations/schema';

interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string;
}

type IncomeExpense = 'income' | 'expense';

interface CategoryItem {
  label: IncomeCategory | ExpenseCategory;
  icon: JSX.Element;
}

const TransactionForm = ({ onCloseForm, isEntryDrawerOpen, currentDay }: TransactionFormProps) => {
  const formWidth = 320;

  const expenseCategories: CategoryItem[] = [
    { label: '食費', icon: <Fastfood fontSize='small' /> },
    { label: '日用品', icon: <Alarm fontSize='small' /> },
    { label: '家賃', icon: <AddHome fontSize='small' /> },
    { label: '交際費', icon: <Diversity3 fontSize='small' /> },
    { label: '娯楽', icon: <SportsTennis fontSize='small' /> },
    { label: '交通費', icon: <Train fontSize='small' /> },
  ];

  const incomeCategories: CategoryItem[] = [
    { label: '給与', icon: <Work fontSize='small' /> },
    { label: '副収入', icon: <Savings fontSize='small' /> },
    { label: 'お小遣い', icon: <AddBusiness fontSize='small' /> },
  ];
  const [categories, setCategories] = useState(expenseCategories);

  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      type: 'expense',
      date: currentDay,
      amount: 0,
      category: '',
      content: '',
    },
    resolver: zodResolver(transactionSchema),
  });
  console.log(errors);

  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue('type', type);
  };

  //収支タイプを監視
  const currentType = watch('type');
  // console.log(currentType);

  useEffect(() => {
    const newCategories = currentType === 'expense' ? expenseCategories : incomeCategories;
    // console.log(newCategories);
    setCategories(newCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentType]);

  const onSubmit = (date: any) => {
    console.log(date);
  };

  useEffect(() => {
    setValue('date', currentDay);
  }, [currentDay, setValue]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64,
        right: isEntryDrawerOpen ? formWidth : '-2%', // フォームの位置を調整
        width: formWidth,
        height: '100%',
        bgcolor: 'background.paper',
        zIndex: (theme) => theme.zIndex.drawer - 1,
        transition: (theme) =>
          theme.transitions.create('right', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        p: 2, // 内部の余白
        boxSizing: 'border-box', // ボーダーとパディングをwidthに含める
        boxShadow: '0px 0px 15px -5px #777777',
      }}
    >
      {/* 入力エリアヘッダー */}
      <Box display={'flex'} justifyContent={'space-between'} mb={2}>
        <Typography variant='h6'>入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
          onClick={onCloseForm}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* フォーム要素 */}
      <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name='type'
            control={control}
            render={({ field }) => (
              <ButtonGroup fullWidth>
                <Button
                  variant={field.value === 'expense' ? 'contained' : 'outlined'}
                  color='error'
                  onClick={() => incomeExpenseToggle('expense')}
                >
                  支出
                </Button>
                <Button
                  onClick={() => incomeExpenseToggle('income')}
                  color={'primary'}
                  variant={field.value === 'income' ? 'contained' : 'outlined'}
                >
                  収入
                </Button>
              </ButtonGroup>
            )}
          />

          {/* 日付 */}
          <Controller
            name='date'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='日付'
                type='date'
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.date} //trueにするとフォームが赤くなる
                helperText={errors.date?.message} //dateがある時だけmessageにアクセスする
              />
            )}
          />
          {/* カテゴリ */}
          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.category} //trueにするとフォームが赤くなる
                helperText={errors.category?.message} //dateがある時だけmessageにアクセスする
                {...field}
                id='カテゴリ'
                label='カテゴリ'
                select
              >
                {categories.map((category, index) => (
                  <MenuItem value={category.label} key={index}>
                    <ListItemIcon>{category.icon}</ListItemIcon>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          {/* 金額 */}
          <Controller
            name='amount'
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.amount} //trueにするとフォームが赤くなる
                helperText={errors.amount?.message} //dateがある時だけmessageにアクセスする
                {...field}
                value={field.value === 0 ? '' : field.value}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10) || 0; //10進数に変換
                  field.onChange(newValue);
                }}
                label='金額'
                type='number'
              />
            )}
          />
          {/* 内容 */}
          <Controller
            name='content'
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.content} //trueにするとフォームが赤くなる
                helperText={errors.content?.message} //dateがある時だけmessageにアクセスする
                {...field}
                label='内容'
                type='text'
              />
            )}
          />
          {/* 保存ボタン */}
          <Button type='submit' variant='contained' color={currentType === 'income' ? 'primary' : 'error'} fullWidth>
            保存
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
export default TransactionForm;
