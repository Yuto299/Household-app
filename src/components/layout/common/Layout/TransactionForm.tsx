import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // 閉じるボタン用のアイコン
import Fastfood from '@mui/icons-material/Fastfood'; //食事アイコン
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExpenseCategory, IncomeCategory, Transaction } from '../../../../types';
import { AddBusiness, AddHome, Alarm, Diversity3, Savings, SportsTennis, Train, Work } from '@mui/icons-material';
import { Schema, transactionSchema } from '../../../../validations/schema';

interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  selectedTransaction: Transaction | null;
  onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>;
  setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
  onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>;
}

type IncomeExpense = 'income' | 'expense';
interface CategoryItem {
  label: IncomeCategory | ExpenseCategory;
  icon: JSX.Element;
}

const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  onSaveTransaction,
  selectedTransaction,
  onDeleteTransaction,
  setSelectedTransaction,
  onUpdateTransaction,
}: TransactionFormProps) => {
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
    reset,
  } = useForm<Schema>({
    defaultValues: {
      type: 'expense',
      date: currentDay,
      amount: 0,
      category: '' as Schema['category'], //refineでから文字が無効になっているので変更
      content: '',
    },
    resolver: zodResolver(transactionSchema),
  });
  console.log(errors);

  //収支タイプを切り替える関数
  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue('type', type);
    setValue('category', '食費');
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

  //送信処理
  const onSubmit: SubmitHandler<Schema> = (date) => {
    // console.log(date);
    if (selectedTransaction) {
      onUpdateTransaction(date, selectedTransaction.id)
        .then(() => {
          // alert('更新しました');
          setSelectedTransaction(null);
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      onSaveTransaction(date)
        .then(() => {
          alert('保存しました');
          setSelectedTransaction(null);
        })
        .catch((error) => {
          alert(error);
        });
    }

    reset({
      type: 'expense',
      date: currentDay,
      amount: 0,
      category: '' as Schema['category'], //refineでから文字が無効になっているので変更
      content: '',
    });
  };

  useEffect(() => {
    //選択肢が更新されたか確認する処理
    if (selectedTransaction) {
      const categoryExists = categories.some((category) => category.label === selectedTransaction.category);
      setValue('category', categoryExists ? selectedTransaction.category : ('' as Schema['category']));
    }
  }, [selectedTransaction, categories, setValue]);

  useEffect(() => {
    if (selectedTransaction) {
      setValue('type', selectedTransaction.type);
      setValue('date', selectedTransaction.date);
      setValue('amount', selectedTransaction.amount);
      setValue('content', selectedTransaction.content);
    } else {
      reset({
        date: currentDay,
        type: 'expense',
        amount: 0,
        category: '' as Schema['category'],
        content: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTransaction]);

  useEffect(() => {
    setValue('date', currentDay);
  }, [currentDay, setValue]);

  const handleDelete = () => {
    if (selectedTransaction) {
      onDeleteTransaction(selectedTransaction.id);
      setSelectedTransaction(null);
    }
  };

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
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h5'>入力</Typography>
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
              //   <TextField
              //     error={!!errors.category} //trueにするとフォームが赤くなる
              //     helperText={errors.category?.message} //dateがある時だけmessageにアクセスする
              //     InputLabelProps= {{
              //       htmlFor: 'category',
              //     }}
              //     inputProps={{id: 'category'}}
              //     {...field}
              //     id='カテゴリ'
              //     label='カテゴリ'
              //     select
              //   >
              //     {categories.map((category, index) => (
              //       <MenuItem value={category.label} key={index}>
              //         <ListItemIcon>{category.icon}</ListItemIcon>
              //         {category.label}
              //       </MenuItem>
              //     ))}
              //   </TextField>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel id='category-select-label'>カテゴリ</InputLabel>
                <Select {...field} labelId='category-select-label' id='category-select' label='カテゴリ'>
                  {categories.map((category, index) => (
                    <MenuItem value={category.label} key={index}>
                      <ListItemIcon>{category.icon}</ListItemIcon>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.category?.message}</FormHelperText>
              </FormControl>
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
            {selectedTransaction ? '更新' : '保存'}
          </Button>

          {selectedTransaction && (
            <Button onClick={handleDelete} variant='outlined' color={'secondary'} fullWidth>
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
export default TransactionForm;
