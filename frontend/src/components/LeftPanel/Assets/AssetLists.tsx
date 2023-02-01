import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllAssetLists,
  selectCurrentAssetListId,
} from '@Redux/project/selectors/asset';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import {
  addAssetList,
  loadAssetLists,
  setSelectedAssetListId,
} from '@Redux/project/actions';
import { UserProjectPermission } from '@Src/types';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import {
  Select,
  MenuItem,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
} from '@mui/material';

import { makeStyles } from '@mui/styles';
import {
  selectAssetsListsLoader,
  selectCurrentProjectId,
} from '@Redux/project/selectors/base';

const useStyles = makeStyles({
  root: {
    width: '100%',
    padding: '0.7em 0.7em 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assetsSelector: {
    width: '100%',
  },
  newAssetListInput: {
    width: '100%',
  },
  newAssetListCloseBtn: {
    padding: 0,
  },
  leftSideColor: {
    color: '#fff',
  },
  rightSideColor: {},
});

interface Props {
  isDefaultStyles?: boolean;
}

const AssetLists: React.FC<Props> = ({ isDefaultStyles = false }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentProjectId = useSelector(selectCurrentProjectId);
  const [addInProgress, setAddInProgress] = useState<boolean>(false);
  const [newAssetName, setNewAssetName] = useState<string>('');
  const assetLists = useSelector(selectAllAssetLists);
  const assetListsLoading = useSelector(selectAssetsListsLoader);
  const currentAssetListId = useSelector(selectCurrentAssetListId);
  const canEditProject = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );

  const handleAddList = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
        dispatch(addAssetList(newAssetName));
        setAddInProgress(false);
        setNewAssetName('');
      }
      if (event.key === 'Escape') {
        (event.target as HTMLInputElement).blur();
      }
    },
    [dispatch, newAssetName],
  );

  const handleListChange = useCallback(
    (listId) => {
      dispatch(setSelectedAssetListId(listId));
    },
    [dispatch],
  );

  useEffect(() => {
    if (!assetLists && !assetListsLoading) {
      dispatch(loadAssetLists(String(currentProjectId)));
    }
  }, [assetLists, dispatch, currentProjectId, assetListsLoading]);

  if (!assetLists || !currentAssetListId) {
    return null;
  }

  return (
    <div className={classes.root}>
      {addInProgress ? (
        <TextField
          className={classes.newAssetListInput}
          onKeyDown={handleAddList}
          onBlur={() => setAddInProgress(false)}
          value={newAssetName}
          onChange={(event) => setNewAssetName(event.target.value)}
          focused
          InputProps={{
            disableUnderline: true,
            className: isDefaultStyles
              ? classes.leftSideColor
              : classes.rightSideColor,
            endAdornment: (
              <IconButton
                aria-label="Confirm"
                title="Cancel"
                onClick={() => {
                  setNewAssetName('');
                  setAddInProgress(false);
                }}
                className={classes.newAssetListCloseBtn}
                disabled={!canEditProject}
              >
                <CloseIcon color={isDefaultStyles ? 'primary' : 'inherit'} />
              </IconButton>
            ),
          }}
        />
      ) : (
        // <Select
        //   label="Asset list"
        //   value={currentAssetListId}
        //   className={classes.assetsSelector}
        //   onChange={(event) => handleListChange(event.target.value || null)}
        //   inputProps={{
        //     className: isDefaultStyles
        //       ? classes.leftSideColor
        //       : classes.rightSideColor,
        //   }}
        // >
        //   {assetLists.map((list) => (
        //     <MenuItem key={`list-${list.id}`} value={list.id}>
        //       {list.name}
        //     </MenuItem>
        //   ))}
        // </Select>
        <FormControl variant="standard" fullWidth>
          <InputLabel>Asset List</InputLabel>
          <Select
            value={currentAssetListId}
            onChange={(event) => handleListChange(event.target.value || null)}
            inputProps={{
              className: isDefaultStyles
                ? classes.leftSideColor
                : classes.rightSideColor,
            }}
          >
            {assetLists.map((list) => (
              <MenuItem key={`list-${list.id}`} value={list.id}>
                {list.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <IconButton
        aria-label="add"
        title="Upload asset"
        disabled={addInProgress || !canEditProject}
        onClick={() => {
          setAddInProgress(true);
        }}
      >
        <AddIcon color={isDefaultStyles ? 'primary' : 'inherit'} />
      </IconButton>
    </div>
  );
};

export default AssetLists;
