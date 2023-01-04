import React, { useState } from 'react';
import { ElementType } from '@Constants/dragAndDrop';
import { makeStyles } from '@material-ui/core/styles';
import { Asset } from '@Src/types';
import { useDrag } from 'react-dnd';

enum FullSizeDirection {
  VERTICAL,
  HORIZONTAL,
}

interface Props {
  asset: Asset;
}

interface StyleProps {
  sizeDirection: FullSizeDirection;
}

const useStyles = makeStyles({
  assetWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
  },
  assetImage: ({ sizeDirection }: StyleProps) => ({
    display: 'block',
    width: sizeDirection === FullSizeDirection.HORIZONTAL ? '100%' : '5rem',
    height: sizeDirection === FullSizeDirection.VERTICAL ? '100%' : '5rem',
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
          style={
            !imageLoaded
              ? { display: 'none' }
              : { borderRadius: ' 10px', height: '80%' }
          }
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
