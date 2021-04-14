import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { selectEditorDocument } from '@Redux/project/selectors/base';
import Calendar from './colorCalendar';

import './colorCalendar/styles/theme-basic.css';

type Props = {
  id: string;
  ownStyles?: React.CSSProperties;
  disabled?: boolean;
};

const useStyles = makeStyles((theme) => ({
  calendar: ({ ownStyles }: Props) => ({
    fontFamily: ownStyles?.fontFamily || theme.typography.fontFamily,
  }),
}));

const CalendarWidget: React.FC<Props> = (props) => {
  const { id, ownStyles } = props;
  const classes = useStyles(props);
  const [dom] = useState<HTMLElement | null>(null);
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const editorDocument = useSelector(selectEditorDocument);

  useEffect(() => {
    if (!calendar) {
      setCalendar(
        new Calendar({
          id: `.widget-${id}`,
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

  return (
    <div className={cn('calendar-widget', `widget-${id}`, classes.calendar)} />
  );
};

export default CalendarWidget;
