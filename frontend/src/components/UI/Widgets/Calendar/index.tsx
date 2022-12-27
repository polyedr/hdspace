/* eslint-disable react/no-unused-prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { selectEditorDocument } from '@Redux/project/selectors/base';
import Calendar from './colorCalendar';
import './colorCalendar/styles/theme-basic.css';

interface Props {
  id: string;
  calendarSize?: string;
  ownStyles?: React.CSSProperties;
  disabled?: boolean;
}

const useStyles = makeStyles((theme) => ({
  calendar: ({ ownStyles }: Props) => ({
    fontFamily: ownStyles?.fontFamily || theme.typography.fontFamily,
  }),
}));

const CalendarWidget: React.FC<Props> = (props) => {
  const { id, ownStyles, calendarSize } = props;
  const classes = useStyles(props);
  const [dom] = useState<HTMLElement | null>(null);
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const editorDocument = useSelector(selectEditorDocument);

  useEffect(() => {
    if (!calendar?.calendarSize || calendarSize) {
      setCalendar(
        new Calendar({
          id: `.widget-${id}`,
          theme: 'basic',
          calendarSize,
          fontFamilyHeader: ownStyles?.fontFamily || '"Roboto", sans-serif',
          document: editorDocument,
        }),
      );
    }
  }, [
    dom,
    ownStyles,
    calendar?.calendarSize,
    id,
    calendarSize,
    editorDocument,
  ]);

  return (
    <div className={cn('calendar-widget', `widget-${id}`, classes.calendar)} />
  );
};

export default CalendarWidget;
