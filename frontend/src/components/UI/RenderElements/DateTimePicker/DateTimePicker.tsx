import React, { useCallback, useState } from 'react';
import {
  DateTimePicker as MuiDateTimePicker,
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from '@mui/lab';
import cn from 'classnames';
import DateFnsUtils from '@date-io/date-fns';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { DateTimePickerType } from '@Src/types';
import { TextField, TextFieldProps } from '@mui/material';
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

    const pickerProps = {
      ampm: false,
      style: { width: '100%' },
      id: element.id,
      value: date,
      onChange: handleChange,
      disabled: isDisabled,
      disableToolbar: false,
      label,
      TextFieldComponent: (props: TextFieldProps) => (
        <TextField
          {...props}
          inputProps={{
            className: cn(
              classes.ownStyles,
              isDisabled ? classes.disabled : classes.ownPseudoStyles,
            ),
          }}
        />
      ),
    };

    const renderPicker = useCallback(() => {
      switch (type) {
        case DateTimePickerType.Date: {
          return (
            <DatePicker
              {...pickerProps}
              variant="inline"
              inputVariant="outlined"
              format="MM/dd/yyyy"
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          );
        }
        case DateTimePickerType.Time: {
          return (
            <TimePicker
              variant="inline"
              {...pickerProps}
              format="hh:mm a"
              inputVariant="outlined"
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          );
        }
        case DateTimePickerType.DateTime: {
          return (
            <MuiDateTimePicker
              {...pickerProps}
              format="MM/dd/yyyy hh:mm"
              variant="inline"
              inputVariant="outlined"
              KeyboardButtonProps={{
                'aria-label': 'change date time',
              }}
            />
          );
        }
        default: {
          return null;
        }
      }
    }, [pickerProps, type, label]);

    return (
      <div
        ref={ref}
        data-ls-id={element.id}
        className={cn(className, groupClass)}
        {...eventHandlers}
      >
        <LocalizationProvider utils={DateFnsUtils}>
          {renderPicker()}
        </LocalizationProvider>
      </div>
    );
  },
);

export default DateTimePicker;
