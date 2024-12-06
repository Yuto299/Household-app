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
import { useEffect } from 'react';

interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string;
}

type IncomeExpense = 'income' | 'expense';

const TransactionForm = ({ onCloseForm, isEntryDrawerOpen, currentDay }: TransactionFormProps) => {
  const formWidth = 320;

  const { control, setValue, watch } = useForm({
    defaultValues: {
      type: 'expense',
      date: currentDay,
      amount: 0,
      category: '',
      content: '',
    },
  });

  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue('type', type);
  };

  //収支タイプを監視
  const currentType = watch('type');
  // console.log(currentType);

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
      <Box component={'form'}>
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
              />
            )}
          />
          {/* カテゴリ */}
          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <TextField {...field} id='カテゴリ' label='カテゴリ' select>
                <MenuItem value={'食費'}>
                  <ListItemIcon>
                    <Fastfood />
                  </ListItemIcon>
                  食費
                </MenuItem>
              </TextField>
            )}
          />
          {/* 金額 */}
          <Controller
            name='amount'
            control={control}
            render={({ field }) => <TextField {...field} label='金額' type='number' />}
          />
          {/* 内容 */}
          <Controller
            name='content'
            control={control}
            render={({ field }) => <TextField {...field} label='内容' type='text' />}
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
