/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
// @ts-nocheck

import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SyncIcon from '@material-ui/icons/Sync';
import Tooltip from '@material-ui/core/Tooltip';

import { SmartContainerRendererProps } from '../types';
import { selectElementById } from '../../../../redux/project/selectors';
import useUrlImageToBlob from '../../../../utils/useUrlImageToFile';
import useImageUpload from '../../../../utils/nn/hooks/useImageUpload';
import useNNProcessing from '../../../../utils/nn/hooks/useNNProcessing';

const styles = require('../styles.scss');

const useStyles = makeStyles(() => {
  return createStyles({
    innerContentWrapper: {
      position: 'relative',
    },
    icon: {
      color: '#3f4b57',
    },
    innerContent: {
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
      fontSize: 30,
      textShadow: '2px 2px #c2c2c2',
    },
    uploadField: {
      display: 'none',
    },
  });
});

const SmartContainerRenderer: React.FC<SmartContainerRendererProps> = React.forwardRef(
  (
    {
      id,
      entityStyles,
      groupStyles,
      ownStyles,
      isDisabled,
      className,
      isBorderVisible,
      children,
    },
    ref,
  ) => {
    const element = useSelector(selectElementById(id));

    const baseClasses = useStyles();

    const classes = makeStyles({
      entityStyles: {
        ...entityStyles,
      },

      groupStyles: {
        ...groupStyles,
      },

      ownStyles: {
        ...ownStyles,
      },
    })();

    const imgRef = useRef<HTMLImageElement>();

    const imageFile = useUrlImageToBlob(element.id, imgRef);

    const handleImageChange = useImageUpload(element.id);

    const handleNNProcessing = useNNProcessing(element.id, imageFile);

    const { imageURL } = element.parameters;

    return (
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          styles.addedElem,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        style={{
          ...(isBorderVisible && isDisabled && { outline: 'none' }),
          position: 'relative',
        }}
      >
        {children?.length ? (
          children
        ) : (
          <>
            {imageURL && <img src={imageURL} alt="Not found" ref={imgRef} />}

            <div className={baseClasses.innerContent}>
              <h4 className={baseClasses.nameHeading}>{element.name}</h4>

              {isDisabled && (
                <>
                  <input
                    id={`upload-image-wireframe-${element.id}`}
                    className={baseClasses.uploadField}
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    name="upload"
                    onChange={handleImageChange}
                  />

                  <label htmlFor={`upload-image-wireframe-${element.id}`}>
                    <Tooltip title="Upload image" placement="top">
                      <IconButton aria-label="upload picture" component="span">
                        <CloudUploadIcon className={baseClasses.icon} />
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
                        <SyncIcon className={baseClasses.icon} />
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
