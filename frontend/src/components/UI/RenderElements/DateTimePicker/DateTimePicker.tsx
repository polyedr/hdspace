import React, { useCallback, useMemo, useState } from 'react';
import {
  DateTimePicker as MuiDateTimePicker,
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import cn from 'classnames';
import DateFnsUtils from '@date-io/date-fns';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { DateTimePickerType } from '@Src/types';
import { TextField } from '@mui/material';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('dateTimePicker');

const DateTimePicker = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    const [date, setDate] = useState(new Date());

    const handleChange = useCallback(
      (date) => {
        setDate(date);
      },
      [setDate],
    );

    const { type, label } = element.parameters;

    const pickerProps = useMemo(() => {
      return {
        ampm: false,
        id: element.id,
        value: date,
        onChange: handleChange,
        disabled: isDisabled,
        disableToolbar: false,
        label,
      };
    }, [label, isDisabled, handleChange, element.id, date]);

    const renderPicker = useCallback(() => {
      switch (type) {
        case DateTimePickerType.Date: {
          return (
            <DatePicker
              {...pickerProps}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          );
        }
        case DateTimePickerType.Time: {
          return (
            <TimePicker
              {...pickerProps}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          );
        }
        case DateTimePickerType.DateTime: {
          return (
            <MuiDateTimePicker
              {...pickerProps}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          );
        }
        default: {
          return null;
        }
      }
    }, [pickerProps, type, label]);

    return (
      <LocalizationProvider utils={DateFnsUtils} dateAdapter={AdapterDateFns}>
        <div
          ref={ref}
          data-ls-id={element.id}
          className={cn(className, groupClass, classes.ownStyles)}
          {...eventHandlers}
        >
          {renderPicker()}
        </div>
      </LocalizationProvider>
    );
  },
);

export default DateTimePicker;
