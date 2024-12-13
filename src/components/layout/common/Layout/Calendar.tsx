import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import '../../../../calendar.css';
import { DatesSetArg, EventContentArg } from '@fullcalendar/core';
import { calculateDailyBalances } from '../../../../utils/financeCalculations';
import { Balance, CalenderContent, Transaction } from '../../../../types';
import { formatCurrency } from '../../../../utils/formatting';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useTheme } from '@mui/material';
import { isSameMonth } from 'date-fns';

interface monthlyTransactions {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  currentDay: string;
  today: string;
}

const Calender = ({ monthlyTransactions, setCurrentMonth, setCurrentDay, currentDay, today }: monthlyTransactions) => {
  const theme = useTheme();

  const dailyBalance = calculateDailyBalances(monthlyTransactions);
  // console.log(dailyBalance);

  const createCalenderEvents = (dailyBalance: Record<string, Balance>): CalenderContent[] => {
    return Object.keys(dailyBalance).map((date) => {
      const { income, expense, balance } = dailyBalance[date];
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      };
    });
  };

  const calenderEvents = createCalenderEvents(dailyBalance);
  console.log(calenderEvents);

  const backgroundEvent = {
    start: currentDay,
    display: 'background',
    backgroundColor: theme.palette.incomeColor.light,
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div>
        <div className='money' id='event-income'>
          {eventInfo.event.extendedProps.income}
        </div>

        <div className='money' id='event-expense'>
          {eventInfo.event.extendedProps.expense}
        </div>

        <div className='money' id='event-balance'>
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    );
  };

  const handleDateSet = (datesetInfo: DatesSetArg) => {
    const CurrentMonth = datesetInfo.view.currentStart;
    setCurrentMonth(CurrentMonth);
    const todayDate = new Date();
    if (isSameMonth(todayDate, CurrentMonth)) {
      setCurrentDay(today);
    }
  };

  const handleDateClick = (dateInfo: DateClickArg) => {
    // console.log(dateInfo);
    setCurrentDay(dateInfo.dateStr);
  };

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView='dayGridMonth'
      events={[...calenderEvents, backgroundEvent]}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
      dateClick={handleDateClick}
    />
  );
};

export default Calender;
