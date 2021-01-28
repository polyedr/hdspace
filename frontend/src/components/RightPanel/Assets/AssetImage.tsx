import { ElementType } from '@Constants/dragAndDrop';
import { makeStyles } from '@material-ui/core';
import { Asset } from '@Src/types';
import React from 'react';
import { useDrag } from 'react-dnd';

type Props = {
  asset: Asset;
};

const useStyles = makeStyles({
  assetWrapper: {
    border: '1px solid rgba(180,188,191,.5)',
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assetImage: {
    display: 'block',
    width: '100%',
    height: 'auto',
  },
});

const AssetImage = ({ asset }: Props) => {
  const classes = useStyles();

  const [, drag] = useDrag({
    item: {
      type: ElementType.CONSTRUCTOR,
      original: {
        type: 'image',
        name: 'Image asset',
        custom: false,
        parameters: {
          imageURL: asset.image,
        },
      },
    },
  });

  return (
    <div
      className={classes.assetWrapper}
      ref={(dom: HTMLDivElement) => {
        drag(dom);
      }}
    >
      <img
        src={asset.image || ''}
        alt="Missing asset"
        className={classes.assetImage}
      />
    </div>
  );
};

export default AssetImage;
