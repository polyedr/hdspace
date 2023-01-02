import React, { FC, useEffect } from 'react';
import { TextField, MenuItem, Theme } from '@mui/material';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { DateRange, ProjectsSearchParameter } from '@Src/types';
import {
  searchProjects,
  setProjectsSearchParameter,
} from '@Redux/project/actions';
import { selectProjectsSearchParameter } from '@Redux/project/selectors/base';
import { PROJECT_STATUS_LIST } from '@Constants/defaultParams';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { startOfDay, endOfDay } from 'date-fns';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles<Theme>(({ palette, spacing }) => ({
  input: {
    margin: 0,
  },
  queryInput: {
    minWidth: 300,
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  parameterInput: {
    minWidth: 150,
  },
  submit: {
    color: 'white',
    padding: spacing(1),
    backgroundColor: palette.secondary.light,
    '&:hover': {
      backgroundColor: palette.secondary.dark,
    },
    '& svg': {
      color: 'white',
    },
  },
  capitalize: {
    textTransform: 'capitalize',
  },
}));

const parameterList = Object.keys(ProjectsSearchParameter).map(
  (k) => ProjectsSearchParameter[k] as ProjectsSearchParameter,
);

const initialDateRange = {
  from: null,
  to: null,
};

const Searchbar: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [parameterName, parameterValue] = useSelector(
    selectProjectsSearchParameter,
  );

  const isStatus = parameterName === ProjectsSearchParameter.status;

  const isDate =
    parameterName === ProjectsSearchParameter.created ||
    parameterName === ProjectsSearchParameter.updated;

  useEffect(() => {
    dispatch(searchProjects());
  }, [dispatch, parameterName, parameterValue]);

  const handleParameterValueChange = (
    ev: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(setProjectsSearchParameter([parameterName, ev.target.value]));
  };

  const handleParameterNameChange = ({
    target: { value: newName },
  }: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parameterValue;

    if (newName === ProjectsSearchParameter.name) {
      newValue = '';
    }

    if (newName === ProjectsSearchParameter.tags) {
      newValue = '';
    }

    if (newName === ProjectsSearchParameter.status) {
      [newValue] = PROJECT_STATUS_LIST;
    }

    if (
      newName === ProjectsSearchParameter.updated ||
      newName === ProjectsSearchParameter.created
    ) {
      newValue = typeof newValue === 'object' ? newValue : initialDateRange;
    }

    dispatch(
      setProjectsSearchParameter([
        newName as ProjectsSearchParameter,
        newValue,
      ]),
    );
  };

  const handleDateChange = (newDate: Date | null, type: keyof DateRange) => {
    if (typeof parameterValue !== 'object') return;

    let date = newDate;

    if (type === 'to' && newDate) {
      date = endOfDay(newDate);
    }

    if (type === 'from' && newDate) {
      date = startOfDay(newDate);
    }

    dispatch(
      setProjectsSearchParameter([
        parameterName,
        { ...parameterValue, [type]: date },
      ]),
    );
  };

  return (
    <div>
      <form className={classes.form}>
        <div className={classes.form}>
          {isDate && typeof parameterValue === 'object' ? (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                label="From Date"
                value={parameterValue.from}
                onChange={(newDate) => handleDateChange(newDate, 'from')}
                maxDate={parameterValue.to}
                inputVariant="outlined"
                margin="dense"
                className={classes.input}
                autoOk
                clearable
              />
              <DatePicker
                label="To Date"
                value={parameterValue.to}
                onChange={(newDate) => handleDateChange(newDate, 'to')}
                minDate={parameterValue.from}
                inputVariant="outlined"
                margin="dense"
                className={classes.input}
                autoOk
                clearable
              />
            </MuiPickersUtilsProvider>
          ) : (
            <TextField
              value={parameterValue}
              onChange={handleParameterValueChange}
              label="Search project"
              variant="outlined"
              margin="dense"
              className={cn(classes.input, classes.queryInput)}
              placeholder="Search project"
              InputLabelProps={{
                htmlFor: 'search_input',
              }}
              InputProps={{
                id: 'search_input',
              }}
              {...(isStatus && {
                select: true,
              })}
            >
              {isStatus &&
                PROJECT_STATUS_LIST.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
            </TextField>
          )}
        </div>

        <TextField
          value={parameterName}
          onChange={handleParameterNameChange}
          label="Search by"
          variant="outlined"
          margin="dense"
          select
          className={cn(
            classes.input,
            classes.parameterInput,
            classes.capitalize,
          )}
          InputLabelProps={{
            htmlFor: 'parameter_name_input',
          }}
          InputProps={{
            id: 'parameter_name_input',
          }}
        >
          {parameterList.map((param) => (
            <MenuItem
              value={param}
              key={param}
              className={classes.capitalize}
              disabled={param === ProjectsSearchParameter.user} // this search parameter is forbidden while projects are initially filtered by user
            >
              {param}
            </MenuItem>
          ))}
        </TextField>
      </form>
    </div>
  );
};

export default Searchbar;
