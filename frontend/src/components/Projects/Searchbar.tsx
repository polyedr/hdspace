import React, { FC, FormEvent } from 'react';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
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

const useStyles = makeStyles(({ palette, spacing }) => ({
  input: {
    margin: 0,
  },
  queryInput: {
    minWidth: 300,
    // '& input': {
    //   paddingRight: spacing(4),
    // },
    // '& .MuiSelect-icon': {
    //   marginRight: spacing(4),
    // },
  },
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  parameterInput: {
    minWidth: 150,
  },
  submit: {
    // position: 'absolute',
    // top: 2,
    // right: 2,
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

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    dispatch(searchProjects());
  };

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

    dispatch(
      setProjectsSearchParameter([
        parameterName,
        { ...parameterValue, [type]: newDate },
      ]),
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={classes.form}>
        <div>
          {isDate && typeof parameterValue === 'object' ? (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                label="From Date"
                value={parameterValue.from}
                onChange={(newDate) => handleDateChange(newDate, 'from')}
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
              disabled={param === ProjectsSearchParameter.user} // this search parameter is forbidden while projects are initially filtering by user
            >
              {param}
            </MenuItem>
          ))}
        </TextField>

        <Button type="submit" className={classes.submit} title="Search">
          {/* <SearchIcon fontSize="default" /> */}
          Go
        </Button>
      </form>
    </div>
  );
};

export default Searchbar;
