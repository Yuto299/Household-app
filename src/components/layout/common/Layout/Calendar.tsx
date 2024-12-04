import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import '../../../../calendar.css';
import { DatesSetArg, EventContentArg } from '@fullcalendar/core';
import { calculateDailyBalances } from '../../../../utils/financeCalculations';
import { Balance, CalenderContent, Transaction } from '../../../../types';
import { formatCurrency } from '../../../../utils/formatting';

interface monthlyTransactions {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Calender = ({ monthlyTransactions, setCurrentMonth }: monthlyTransactions) => {
  const dailyBalance = calculateDailyBalances(monthlyTransactions);
  console.log(dailyBalance);

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
    console.log(datesetInfo);
    setCurrentMonth(datesetInfo.view.currentStart);
  };

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin]}
      initialView='dayGridMonth'
      events={calenderEvents}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
    />
  );
};

export default Calender;
