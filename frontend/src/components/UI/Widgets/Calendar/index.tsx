import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { selectEditorDocument } from '@Redux/project/selectors/base';
import {
  selectActiveElement,
  selectActiveElementId,
  selectCurrentRoot,
} from '@Redux/project/selectors/element';

import Calendar from './colorCalendar';

import './colorCalendar/styles/theme-basic.css';

type Props = {
  id: string;
  calendarSize?: string;
  ownStyles?: React.CSSProperties;
  disabled?: boolean;
};

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
  const selectedElement = useSelector(selectActiveElement);
  const rootId = useSelector(selectCurrentRoot).id;
  const selectedElementId = useSelector(selectActiveElementId);

  // const size = selectedElementId === id ? selectedElement.size : calendarSize ?? 'large';

  const widgetId =
    selectedElementId === 'none' || selectedElementId === rootId
      ? id
      : selectedElementId;
  useEffect(() => {
    if (
      !calendar?.calendarSize ||
      selectedElementId === id ||
      calendar?.calendarSize === selectedElement.size ||
      (selectedElement.size !== undefined && calendarSize !== undefined)
    ) {
      setCalendar(
        new Calendar({
          id: `.widget-${widgetId}`,
          theme: 'basic',
          calendarSize: selectedElement.size,
          fontFamilyHeader: ownStyles?.fontFamily || '"Roboto", sans-serif',
          document: editorDocument,
        }),
      );
    }
  }, [
    selectedElement,
    dom,
    ownStyles,
    calendar?.calendarSize,
    selectedElementId,
    id,
    calendarSize,
    widgetId,
    editorDocument,
  ]);

  return (
    <div className={cn('calendar-widget', `widget-${id}`, classes.calendar)} />
  );
};

export default CalendarWidget;
