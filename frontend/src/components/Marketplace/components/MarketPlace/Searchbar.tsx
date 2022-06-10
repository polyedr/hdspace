import React, { FC, useEffect } from 'react';
import { TextField, MenuItem } from '@mui/material';
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
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import styled from 'styled-components';

const CustomForm = styled.form`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 660px;
  height: 36px;
  left: 203px;
  top: 186px;
`;
const CustomSearchSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  width: 228px;
  height: 38px;
  left: 203px;
  top: 186px;
  & .MuiTextField-root {
    margin-top: 4px !important;
  }
`;
const CustomDatePicker = styled(DatePicker)`
  margin: 0;
  justify-content: center;
  padding: 8px 0px;
  width: 228px;
  height: 36px;
  border-radius: 4px;
  & .MuiInputBase-root {
    border: 1px solid #e4e6eb;
  }
`;
const CustomeSearch = styled(TextField)`
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  width: 228px;
  height: 36px;
  border-radius: 4px;
  & .MuiInputBase-root {
    border: 1px solid #e4e6eb;
  }
  & input#search_input {
    padding: 8px 4px !important;
  }
  & .MuiOutlinedInput-input {
    padding: 8px 4px !important;
  }
`;

const CustomSearchIcon = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  left: 20.83%;
  right: 20.87%;
  top: 20.83%;
  bottom: 20.83%;
  color: #81818e;
`;

const CustomeSelect = styled(TextField)`
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 228px;
  height: 36px;
  border-radius: 4px;
  min-width: 150;
  text-transform: capitalize;
  & .MuiInputBase-root {
    border: 1px solid #e4e6eb;
  }
  & .MuiOutlinedInput-input {
    padding: 8px 14px !important;
  }
`;
const CustomMenuItem = styled(MenuItem)`
  text-transform: capitalize;
`;

const parameterList = Object.keys(ProjectsSearchParameter).map(
  (k) => ProjectsSearchParameter[k] as ProjectsSearchParameter,
);

const initialDateRange = {
  from: null,
  to: null,
};

const Searchbar: FC = () => {
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
  }, [parameterName, parameterValue]);

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
      <CustomForm>
        <CustomSearchSection>
          {isDate && typeof parameterValue === 'object' ? (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <CustomDatePicker
                label="From Date"
                value={parameterValue.from}
                onChange={(newDate) => handleDateChange(newDate, 'from')}
                maxDate={parameterValue.to}
                inputVariant="outlined"
                margin="dense"
                autoOk
                clearable
              />
              <CustomDatePicker
                label="To Date"
                value={parameterValue.to}
                onChange={(newDate) => handleDateChange(newDate, 'to')}
                minDate={parameterValue.from}
                inputVariant="outlined"
                margin="dense"
                autoOk
                clearable
              />
            </MuiPickersUtilsProvider>
          ) : (
            <CustomeSearch
              value={parameterValue}
              onChange={handleParameterValueChange}
              variant="outlined"
              margin="dense"
              placeholder="Search Template"
              InputLabelProps={{
                htmlFor: 'search_input',
              }}
              InputProps={{
                id: 'search_input',
                startAdornment: (
                  <InputAdornment position="start">
                    <CustomSearchIcon>
                      <SearchIcon />
                    </CustomSearchIcon>
                  </InputAdornment>
                ),
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
            </CustomeSearch>
          )}
        </CustomSearchSection>
        <CustomeSelect
          value={parameterName}
          onChange={handleParameterNameChange}
          label="Sort by"
          variant="outlined"
          margin="dense"
          select
          InputLabelProps={{
            htmlFor: 'parameter_name_input',
          }}
          InputProps={{
            id: 'parameter_name_input',
          }}
        >
          {parameterList.map((param) => (
            <CustomMenuItem
              value={param}
              key={param}
              disabled={param === ProjectsSearchParameter.user}
            >
              {param}
            </CustomMenuItem>
          ))}
        </CustomeSelect>
        <CustomeSelect
          value={parameterName}
          onChange={handleParameterNameChange}
          label="Category"
          variant="outlined"
          margin="dense"
          select
          InputLabelProps={{
            htmlFor: 'parameter_name_input',
          }}
          InputProps={{
            id: 'parameter_name_input',
          }}
        >
          {parameterList.map((param) => (
            <CustomMenuItem
              value={param}
              key={param}
              disabled={param === ProjectsSearchParameter.user}
            >
              {param}
            </CustomMenuItem>
          ))}
        </CustomeSelect>
      </CustomForm>
    </div>
  );
};

export default Searchbar;
