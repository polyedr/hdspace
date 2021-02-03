import React, { FC, FormEvent } from 'react';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SearchIcon from '@material-ui/icons/Search';
import { IconButton } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { ProjectsSearchParameter } from '@Src/types';
import {
  searchProjects,
  setProjectsSearchParameter,
} from '@Redux/project/actions';
import { selectProjectsSearchParameter } from '@Redux/project/selectors/base';

const useStyles = makeStyles(({ palette, spacing }) => ({
  input: {
    margin: 0,
  },
  queryInput: {
    minWidth: 300,
    '& input': {
      paddingRight: spacing(4),
    },
  },
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  parameterInput: {
    minWidth: 150,
  },
  wrapper: {
    position: 'relative',
  },
  submit: {
    position: 'absolute',
    top: 2,
    right: 2,
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

const params = Object.keys(ProjectsSearchParameter).map(
  (k) => ProjectsSearchParameter[k] as ProjectsSearchParameter,
);

const Searchbar: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [key, value] = useSelector(selectProjectsSearchParameter);

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    dispatch(searchProjects());
  };

  const handleValueChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setProjectsSearchParameter([key, ev.target.value]));
  };

  const handleKeyChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setProjectsSearchParameter([
        ev.target.value as ProjectsSearchParameter,
        value,
      ]),
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.wrapper}>
          <TextField
            value={value}
            onChange={handleValueChange}
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
          />

          <IconButton type="submit" className={classes.submit} title="Search">
            <SearchIcon fontSize="small" />
          </IconButton>
        </div>

        <TextField
          value={key}
          onChange={handleKeyChange}
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
          {params.map((param) => (
            <MenuItem value={param} key={param} className={classes.capitalize}>
              {param}
            </MenuItem>
          ))}
        </TextField>
      </form>
    </div>
  );
};

export default Searchbar;
