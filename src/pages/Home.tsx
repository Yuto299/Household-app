import { Box } from '@mui/material';
import MonthlySummary from '../components/layout/common/Layout/MonthlySummary';
import Calender from '../components/layout/common/Layout/Calender';
import TransactionMenu from '../components/layout/common/Layout/TransactionMenu';
import TransactionForm from '../components/layout/common/Layout/TransactionForm';

const Home = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary />
        <Calender />
      </Box>

      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu />
        <TransactionForm />
      </Box>
    </Box>
  );
};

export default Home;
