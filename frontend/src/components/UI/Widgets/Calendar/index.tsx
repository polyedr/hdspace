import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectEditorDocument } from '@Redux/project/selectors/base';
import Calendar from './colorCalendar';

import './colorCalendar/styles/theme-basic.css';

type Props = {
  id: string;
  ownStyles?: React.CSSProperties;
  disabled?: boolean;
};

const CalendarWidget: React.FC<Props> = ({ id, ownStyles }) => {
  const [dom] = useState<HTMLElement | null>(null);
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const editorDocument = useSelector(selectEditorDocument);

  useEffect(() => {
    if (!calendar) {
      setCalendar(
        new Calendar({
          id: `#widget-${id}`,
          theme: 'basic',
          calendarSize: 'small',
          fontFamilyHeader: ownStyles?.fontFamily || '"Roboto", sans-serif',
          document: editorDocument,
        }),
      );
    }
  }, [
    dom,
    calendar,
    id,
    setCalendar,
    ownStyles?.fontFamily,
    ownStyles,
    editorDocument,
  ]);

  return <div id={`widget-${id}`} />;
};

export default CalendarWidget;
