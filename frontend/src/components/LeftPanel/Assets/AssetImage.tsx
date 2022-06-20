import React, { useState } from 'react';
import { ElementType } from '@Constants/dragAndDrop';
import { makeStyles } from '@material-ui/core/styles';
import { Asset } from '@Src/types';
import { useDrag } from 'react-dnd';

enum FullSizeDirection {
  VERTICAL,
  HORIZONTAL,
}

type Props = {
  asset: Asset;
};

type StyleProps = {
  sizeDirection: FullSizeDirection;
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
  assetImage: ({ sizeDirection }: StyleProps) => ({
    display: 'block',
    width: sizeDirection === FullSizeDirection.HORIZONTAL ? '100%' : 'auto',
    height: sizeDirection === FullSizeDirection.VERTICAL ? '100%' : 'auto',
  }),
});

const AssetImage = React.forwardRef<HTMLImageElement, Props>(
  ({ asset }: Props, ref) => {
    const [sizeDirection, setSizeDirection] = useState(
      FullSizeDirection.HORIZONTAL,
    );
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    const classes = useStyles({ sizeDirection } as StyleProps);

    const [, dragRef] = useDrag({
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
      <div className={classes.assetWrapper} ref={dragRef}>
        <img
          ref={ref}
          src={asset.image || ''}
          alt="No asset"
          className={classes.assetImage}
          style={!imageLoaded ? { display: 'none' } : {}}
          onLoad={(event: React.SyntheticEvent) => {
            const imgDom = event.target as HTMLImageElement;
            setImageLoaded(true);
            setSizeDirection(
              imgDom.naturalWidth > imgDom.naturalHeight
                ? FullSizeDirection.HORIZONTAL
                : FullSizeDirection.VERTICAL,
            );
          }}
        />
      </div>
    );
  },
);

export default AssetImage;
