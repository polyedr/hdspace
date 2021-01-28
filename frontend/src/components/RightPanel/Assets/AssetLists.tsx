import React from 'react';
import { useSelector } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectAllAssetLists } from '@Redux/project/selectors/asset';
import { DEFAULT_ASSETS_LIST_ID } from '@Constants/defaultParams';

type Props = {
  onListChange: (listId: string | null) => void;
};

const useStyles = makeStyles({
  root: {
    width: '250px',
  },
});

const AssetLists = ({ onListChange }: Props) => {
  const classes = useStyles();
  const assetLists = useSelector(selectAllAssetLists);

  return (
    <Select
      labelId="label"
      defaultValue={DEFAULT_ASSETS_LIST_ID}
      className={classes.root}
      onChange={(event) => onListChange((event.target.value as string) || null)}
    >
      <MenuItem value={DEFAULT_ASSETS_LIST_ID}>All assets</MenuItem>
      {assetLists.map((list) => (
        <MenuItem key={`list-${list.id}`} value={list.id}>
          {list.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default AssetLists;
