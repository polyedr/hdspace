import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  selectAllAssetLists,
  selectSelectedAssetListId,
} from '@Redux/project/selectors/asset';
import {
  DEFAULT_ASSETS_LIST_ID,
  DEFAULT_ASSET_LIST_NAME,
} from '@Constants/defaultParams';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import { addAssetList } from '@Redux/project/actions';

type Props = {
  onListChange: (listId: string | null) => void;
};

const useStyles = makeStyles({
  root: {
    width: '300px',
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
  imageInput: {
    display: 'none',
  },
  newAssetListCloseBtn: {
    padding: 0,
  },
});

const AssetLists = ({ onListChange }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [addInProgress, setAddInProgress] = useState<boolean>(false);
  const [newAssetName, setNewAssetName] = useState<string>('');
  const assetLists = useSelector(selectAllAssetLists);
  const selectedAssetListId = useSelector(selectSelectedAssetListId);

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
            endAdornment: (
              <IconButton
                aria-label="Confirm"
                onClick={() => {
                  setAddInProgress(false);
                }}
                className={classes.newAssetListCloseBtn}
              >
                <CloseIcon />
              </IconButton>
            ),
          }}
        />
      ) : (
        <Select
          label="Asset list"
          value={selectedAssetListId || DEFAULT_ASSETS_LIST_ID}
          className={classes.assetsSelector}
          onChange={(event) =>
            onListChange((event.target.value as string) || null)
          }
        >
          <MenuItem value={DEFAULT_ASSETS_LIST_ID}>
            {DEFAULT_ASSET_LIST_NAME}
          </MenuItem>
          {assetLists.map((list) => (
            <MenuItem key={`list-${list.id}`} value={list.id}>
              {list.name}
            </MenuItem>
          ))}
        </Select>
      )}

      <div>
        <input
          accept="image/*"
          className={classes.imageInput}
          id="upload-asset"
          type="file"
        />

        <label htmlFor="upload-asset">
          <IconButton
            aria-label="add"
            onClick={() => {
              setAddInProgress(true);
            }}
          >
            <AddIcon />
          </IconButton>
        </label>
      </div>
    </div>
  );
};

export default AssetLists;
