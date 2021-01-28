import React from 'react';
import { selectDisplayAssets } from '@Redux/project/selectors/asset';
import { useSelector } from 'react-redux';
import Scrollbar from '@Components/UI/Scrollbar';
import GridList from '@material-ui/core/GridList';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { GridListTile } from '@material-ui/core';
import { Asset } from '@Src/types';
import AssetImage from './AssetImage';

type Props = {
  selectedAssetListId: string | null;
};

const useStyles = makeStyles({
  root: {
    position: 'relative',
    height: '250px',
  },
  gridList: {
    width: 300,
  },
});

const AssetsGrid = ({ selectedAssetListId }: Props) => {
  const classes = useStyles();
  const assets = useSelector(selectDisplayAssets(selectedAssetListId));

  return (
    <div className={classes.root}>
      <Scrollbar autoHeightMin="100%" autoHeightMax={250}>
        <GridList
          className={classes.gridList}
          cellHeight={80}
          cols={3}
          spacing={5}
        >
          {assets.map((asset: Asset) => {
            return (
              <GridListTile key={`asset-${asset.id}`}>
                <AssetImage asset={asset} />
              </GridListTile>
            );
          })}
        </GridList>
      </Scrollbar>
    </div>
  );
};

export default AssetsGrid;
