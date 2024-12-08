import { Grid, Paper } from '@mui/material';
import CategoryChart from '../components/layout/CategoryChart';
import TransactionTable from '../components/layout/TransactionTable';
import BarChart from '../components/layout/BarChart';
import MouthSelecter from '../components/layout/MouthSelecter';

interface ReportProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Report = ({ currentMonth, setCurrentMonth }: ReportProps) => {
  const commonPaperStyle = () => ({
    height: { xs: 'auto', md: '400px' },
    display: 'flex',
    flexDirection: 'column',
  });
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <MouthSelecter currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={commonPaperStyle}>
          <CategoryChart />
        </Paper>
        カテゴリグラフ
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper sx={commonPaperStyle}>
          <BarChart />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <TransactionTable />
      </Grid>
    </Grid>
  );
};

export default Report;
