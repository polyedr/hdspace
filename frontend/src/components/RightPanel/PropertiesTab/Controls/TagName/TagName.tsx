import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import { AppReduxState } from '@Redux/types';
import { StyledTextField } from '@Components/styledComponents';
import { HTMLLibraryElement, PropertiesChangeProps } from '@Src/types';
import { useDebouncedInputChange } from '@Utils/debounceHooks';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { BLACKLIST_TAGS } from './constants';

const useStyles = makeStyles((theme: Theme) => ({
  errorLabel: {
    color: theme.palette.error.light,
    padding: '0 1em',
    marginBottom: 10,
    paddingTop: 25,
  },
}));

const TagName: React.FC<PropertiesChangeProps<HTMLLibraryElement>> = ({
  updateParams,
  canEdit,
}) => {
  const classes = useStyles();
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const tagName = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).tag,
  );

  const [state, handleNameChange] = useDebouncedInputChange(
    tagName || '',
    (value) => {
      const newTagName = value.length ? value.trim() : 'div';
      if (
        !BLACKLIST_TAGS.includes(newTagName) &&
        /^\D[a-zA-Z0-9]+$/.test(newTagName)
      ) {
        updateParams({ tag: newTagName });
      }
    },
  );

  useEffect(() => {
    setIsBlacklisted(
      (!!state && BLACKLIST_TAGS.includes(state.trim())) ||
        !/^\D[a-zA-Z0-9]+$/.test(state.trim()),
    );
  }, [state]);

  return (
    <>
      <StyledTextField
        variant="outlined"
        value={state}
        onChange={handleNameChange}
        label="Name"
        margin="dense"
        fullWidth
        multiline
        disabled={!canEdit}
      />
      {isBlacklisted && (
        <span className={classes.errorLabel}>Tag name is not allowed</span>
      )}
    </>
  );
};

export default TagName;
