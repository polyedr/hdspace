import React, { memo, useState, useCallback } from 'react';
import Calendar from 'react-calendar';

export const CalendarWidget: React.FunctionComponent = memo(() => {
  const [localDate, setLocalDate] = useState<Date>(new Date());

  const onChangeDate = useCallback((date) => {
    setLocalDate(date);
  }, []);

  return <Calendar onChange={onChangeDate} value={localDate} />;
});
