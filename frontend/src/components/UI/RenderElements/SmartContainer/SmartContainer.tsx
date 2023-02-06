import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  CSSProperties,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import { DropTargetMonitor, useDrag } from 'react-dnd';
import {
  SyncProblem as SyncProblemIcon,
  AspectRatioRounded as AspectRatioRoundedIcon,
  Sync as SyncIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import useUrlImageToFile from '@Utils/useUrlImageToFile';
import useImageUpload from '@Utils/nn/hooks/useImageUpload';
import { NNBlockType } from '@Src/types';
import { updateElementParameters } from '@Redux/project/actions';
import { WindowContext } from '@Components/Editor/FrameWrapper/FrameContext';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import useAnalyzePucture from '@Utils/nn/hooks/useAnalyzePucture';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';

interface SizeProps {
  width: number;
  height: number;
}

const useStyles = makeComponentStyles('smart', {
  innerContentWrapper: {
    position: 'relative',
  },
  icon: {
    color: '#3f4b57',
  },
  innerContent: {
    width: '100%',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameHeading: {
    display: 'inline',
    color: '#3f4b57',
    fontSize: 18,
    textShadow: '2px 2px #c2c2c2',
  },
  uploadField: {
    display: 'none',
  },
  wireframe: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  resizeSection: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    lineHeight: 'initial',
    padding: '2px',
    backgroundColor: 'red',
    minWidth: 'unset',
    borderRadius: 0,
    '&:hover': {
      backgroundColor: 'red',
    },
  },
});

const getSizeForImage = (
  size: SizeProps,
  frameWindow: Window | null,
): CSSProperties | undefined => {
  const innerWidth = frameWindow?.innerWidth || 0;
  const innerHeight = frameWindow?.innerHeight || 0;
  if (size.width > innerWidth && size.height < innerHeight) {
    return {
      position: 'relative',
      width: innerWidth,
      height: 'auto',
      maxHeight: innerHeight,
    };
  }
  if (size.height > innerHeight && size.width < innerWidth) {
    return {
      position: 'relative',
      width: 'auto',
      maxWidth: innerWidth,
      height: innerHeight,
      minHeight: innerHeight / 2,
    };
  }
  if (size.height > innerHeight && size.width > innerWidth) {
    return {
      position: 'relative',
      width: 'auto',
      maxWidth: innerWidth,
      height: innerHeight,
      minHeight: innerHeight / 2,
    };
  }
  return undefined;
};
const SmartContainerRenderer = React.forwardRef<
  HTMLDivElement,
  RendererProps & { blockType: NNBlockType }
>((props, ref) => {
  const { element, isDisabled, blockType, children } = props;
  const [className, groupClass] = element.styles.classNames;

  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();

  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const resizeRef = useRef<HTMLDivElement | null>(null);

  const imageFile = useUrlImageToFile(element.id, imgRef);

  const imageUpload = useImageUpload(element.id);

  const handleAnalyzePicture = useAnalyzePucture(
    element.id,
    blockType || NNBlockType.WEBPAGE,
    imageFile,
  );
  const { imageURL, imageSize } = element.parameters;

  const [size, setSize] = useState<SizeProps>({
    width: imageSize?.width || imgRef.current?.naturalWidth || 0,
    height: imageSize?.height || imgRef.current?.naturalHeight || 0,
  });

  const [, drag] = useDrag({
    item: {
      type: element.type,
      drop: () => {
        if (!imgRef.current) {
          return;
        }
        const newSize = {
          width: parseInt(imgRef.current.style.width) || 0,
          height: parseInt(imgRef.current.style.height) || 0,
        };
        dispatch(
          updateElementParameters(
            element.id,
            {
              imageSize: newSize,
            },
            {
              screenId: currentScreenId,
            },
          ),
        );
      },
      hover: (monitor: DropTargetMonitor) => {
        const offsetDiff = monitor.getDifferenceFromInitialOffset();
        if (!imgRef || !imgRef.current || !offsetDiff) {
          return;
        }
        const aspectRatio =
          imgRef.current.naturalWidth / imgRef.current.naturalHeight;
        const newHeight =
          (imageSize.height || imgRef.current.naturalHeight) + offsetDiff.y;
        const newWidth = newHeight * aspectRatio;
        setSize({
          width: newWidth,
          height: newHeight,
        });
      },
    },
  });

  const resizeRefDom = resizeRef.current;

  useEffect(() => {
    if (resizeRef && resizeRefDom) {
      drag(resizeRef);
    }
  }, [drag, resizeRef, resizeRefDom]);
  const frameWindow = useContext(WindowContext);
  const resultGetSizeForImage = getSizeForImage(size, frameWindow);

  const imageHeight = resultGetSizeForImage?.height || size?.height;
  return (
    <div
      ref={ref}
      id={element.id}
      data-ls-id={element.id}
      className={cn(
        className,
        groupClass,
        classes.ownStyles,
        !isDisabled && classes.ownPseudoStyles,
      )}
      style={{ position: 'relative' }}
      {...eventHandlers}
    >
      {children?.length ? (
        children
      ) : (
        <>
          {imageURL && (
            <div
              style={
                imageHeight
                  ? {
                      height: imageHeight,
                    }
                  : {}
              }
            >
              <img
                src={imageURL}
                alt="Not found"
                className={classes.wireframe}
                ref={imgRef}
                style={resultGetSizeForImage}
                crossOrigin="anonymous"
                onLoad={() => {
                  setSize({
                    width: imgRef.current?.naturalWidth || 0,
                    height: imgRef.current?.naturalHeight || 0,
                  });
                }}
              />
              <div className={classes.resizeSection} ref={resizeRef}>
                <AspectRatioRoundedIcon fontSize="inherit" />
              </div>
            </div>
          )}
          <div className={classes.innerContent}>
            <h4 className={classes.nameHeading}>{element.name}</h4>

            {isDisabled && (
              <>
                <input
                  id={`upload-image-wireframe-${element.id}`}
                  className={classes.uploadField}
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  name="upload"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSize({
                      width: 0,
                      height: 0,
                    });
                    imageUpload(event);
                  }}
                />

                <label htmlFor={`upload-image-wireframe-${element.id}`}>
                  <IconButton
                    aria-label="upload picture"
                    component="span"
                    title="Upload image"
                  >
                    <CloudUploadIcon className={classes.icon} />
                  </IconButton>
                </label>

                {imageURL && (
                  <>
                    <IconButton
                      aria-label="automatically analyze picture"
                      title="Automatically Analyze image"
                      component="span"
                      disabled={!imageFile}
                      onClick={() => handleAnalyzePicture(imageFile.size, 100)}
                    >
                      <SyncIcon className={classes.icon} />
                    </IconButton>

                    <IconButton
                      aria-label="manually analyze picture"
                      title="Manually Analyze image"
                      component="span"
                      disabled={!imageFile}
                      onClick={() => handleAnalyzePicture(imageFile.size, 300)}
                    >
                      <SyncProblemIcon className={classes.icon} />
                    </IconButton>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
});

export default SmartContainerRenderer;
