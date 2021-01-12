// @ts-nocheck

import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import { DropTargetMonitor, useDrag } from 'react-dnd';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SyncIcon from '@material-ui/icons/Sync';
import Tooltip from '@material-ui/core/Tooltip';
import AspectRatioRoundedIcon from '@material-ui/icons/AspectRatioRounded';
import useUrlImageToFile from '@Utils/useUrlImageToFile';
import useImageUpload from '@Utils/nn/hooks/useImageUpload';
import useNNProcessing from '@Utils/nn/hooks/useNNProcessing';
import { NNBlockType, SyntheticGlobalElement } from '@Src/types';
import { updateElementParameters } from '@Redux/project/actions';

import { selectElementById } from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';

import { SmartContainerRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const styles = require('../styles.scss');

type SizeProps = {
  width: number;
  height: number;
};

const useStyles = makeComponentStyles({
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

const SmartContainerRenderer: React.FC<SmartContainerRendererProps> = React.forwardRef(
  (props, ref) => {
    const {
      id,
      isDisabled,
      className,
      isBorderVisible,
      blockType,
      children,
      entityClass,
      groupClass,
    } = props;
    const element = useSelector(selectElementById(id));
    const currentScreenId = useSelector(selectCurrentScreenId);
    const dispatch = useDispatch();

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    const imgRef = useRef<HTMLImageElement>();
    const resizeRef = useRef<HTMLElement>();

    const imageFile = useUrlImageToFile(element.id, imgRef);

    const imageUpload = useImageUpload(element.id);

    const handleNNProcessing = useNNProcessing(
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
          const newSize = {
            width: parseInt(imgRef.current?.style.width) || 0,
            height: parseInt(imgRef.current?.style.height) || 0,
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
          if (!imgRef || !imgRef.current) {
            return;
          }
          const offsetDiff = monitor.getDifferenceFromInitialOffset();
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
      } as SyntheticGlobalElement,
    });

    const resizeRefDom = resizeRef.current;

    useEffect(() => {
      if (resizeRef && resizeRefDom) {
        drag(resizeRef);
      }
    }, [drag, resizeRef, resizeRefDom]);

    return (
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          entityClass,
          groupClass,
          styles.addedElem,
          classes.ownStyles,
        )}
        style={{
          ...(isBorderVisible && isDisabled && { outline: 'none' }),
          position: 'relative',
        }}
        {...eventHandlers}
      >
        {children?.length ? (
          children
        ) : (
          <>
            {imageURL && (
              <div
                style={{
                  position: 'relative',
                  width: imgRef.current?.width,
                  height: imgRef.current?.height,
                }}
              >
                <img
                  src={imageURL}
                  alt="Not found"
                  className={classes.wireframe}
                  ref={imgRef}
                  style={{
                    width: size.width || imageSize?.width || 'auto',
                    height: size.height || imageSize?.height || 'auto',
                  }}
                  crossOrigin="anonymous"
                  onLoad={() => {
                    setSize({
                      width: imgRef.current?.naturalWidth,
                      height: imgRef.current?.naturalHeight,
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
                    <Tooltip title="Upload image" placement="top">
                      <IconButton aria-label="upload picture" component="span">
                        <CloudUploadIcon className={classes.icon} />
                      </IconButton>
                    </Tooltip>
                  </label>
                  {imageURL && (
                    <Tooltip title="Analyze image" placement="top">
                      <IconButton
                        aria-label="analyze picture"
                        label=""
                        component="span"
                        disabled={!imageFile}
                        onClick={handleNNProcessing}
                      >
                        <SyncIcon className={classes.icon} />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    );
  },
);

export default SmartContainerRenderer;
