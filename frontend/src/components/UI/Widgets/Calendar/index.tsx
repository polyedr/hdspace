import React, { useState, useEffect } from 'react';
import Calendar from 'color-calendar';

import 'color-calendar/dist/css/theme-basic.css';

type Props = {
  id: string;
  ownStyles?: React.CSSProperties;
};

const CalendarWidget: React.FC<Props> = ({ id, ownStyles }) => {
  const [dom] = useState<HTMLElement | null>(null);
  const [calendar, setCalendar] = useState<Calendar | null>(null);

  useEffect(() => {
    if (!calendar) {
      setCalendar(
        new Calendar({
          id: `#widget-${id}`,
          theme: 'basic',
          calendarSize: 'small',
          fontFamilyHeader: ownStyles?.fontFamily || '"Roboto", sans-serif',
        }),
      );
    }
  }, [dom, calendar, id, setCalendar, ownStyles?.fontFamily, ownStyles]);

  return <div id={`widget-${id}`} />;
};

export default CalendarWidget;
