import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectAllAssetLists } from '@Redux/project/selectors/asset';
import { ALL_ASSETS_LIST_ID } from '@Constants/defaultParams';
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
  imageInputWrapper: {},
});

const AssetLists = ({ onListChange }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [addInProgress, setAddInProgress] = useState<boolean>(false);
  const [newAssetName, setNewAssetName] = useState<string>('');
  const assetLists = useSelector(selectAllAssetLists);

  const handleAddList = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
        dispatch(addAssetList(newAssetName));
        setAddInProgress(false);
        setNewAssetName('');
      }
    },
    [dispatch, newAssetName],
  );

  return (
    <div className={classes.root}>
      {addInProgress ? (
        <TextField
          label="New list name"
          variant="outlined"
          ref={(dom: HTMLInputElement) => {
            if (dom) {
              dom.focus();
            }
          }}
          onKeyDown={handleAddList}
          value={newAssetName}
          onChange={(event) => setNewAssetName(event.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="Confirm"
                onClick={() => {
                  setAddInProgress(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            ),
          }}
        />
      ) : (
        <Select
          label="Asset list"
          defaultValue={ALL_ASSETS_LIST_ID}
          className={classes.assetsSelector}
          onChange={(event) =>
            onListChange((event.target.value as string) || null)
          }
        >
          <MenuItem value={ALL_ASSETS_LIST_ID}>All assets</MenuItem>
          {assetLists.map((list) => (
            <MenuItem key={`list-${list.id}`} value={list.id}>
              {list.name}
            </MenuItem>
          ))}
        </Select>
      )}

      <div className={classes.imageInputWrapper}>
        <input
          accept="image/*"
          style={{
            display: 'none',
          }}
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
