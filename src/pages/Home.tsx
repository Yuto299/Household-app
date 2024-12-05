import { Box } from '@mui/material';
import MonthlySummary from '../components/layout/common/Layout/MonthlySummary';
import Calender from '../components/layout/common/Layout/Calendar';
import TransactionMenu from '../components/layout/common/Layout/TransactionMenu';
import TransactionForm from '../components/layout/common/Layout/TransactionForm';
import { Transaction } from '../types/index';
import { useState } from 'react';
import { format } from 'date-fns';

interface HomeProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Home = ({ monthlyTransactions, setCurrentMonth }: HomeProps) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [currentDay, setCurrentDay] = useState(today);

  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  });
  console.log(dailyTransactions);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary monthlyTransactions={monthlyTransactions} />
        <Calender
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
        />
      </Box>

      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu dailyTransactions={dailyTransactions} currentDay={currentDay} />
        <TransactionForm />
      </Box>
    </Box>
  );
};

export default Home;
