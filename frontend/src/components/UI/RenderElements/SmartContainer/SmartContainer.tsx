/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
// @ts-nocheck

import React, { useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SyncIcon from '@material-ui/icons/Sync';

import { SmartContainerRendererProps } from '../types';
import {
  selectCurrentScreenId,
  selectElementById,
} from '../../../../redux/project/selectors';
import {
  updateElementImage,
  uploadFile,
} from '../../../../redux/project/actions';
import useUrlImageToBlob from '../../../../utils/useUrlImageToFile';

const styles = require('../styles.scss');

const useStyles = makeStyles(() => {
  return createStyles({
    innerContentWrapper: {
      position: 'relative',
    },
    icon: {
      color: '#C2C2C2',
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
      color: '#C2C2C2',
      fontSize: 30,
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

    const currentScreenId = useSelector(selectCurrentScreenId);
    const dispatch = useDispatch();

    const imgRef = useRef<HTMLImageElement>();

    const handleFileInputChange = useCallback(
      ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const file = target.files && target.files[0];

        if (!file) {
          return;
        }

        if (file.size > 5242880) {
          // eslint-disable-next-line no-alert
          alert('Choose image up to 5Mb!');
        } else {
          dispatch(
            updateElementImage(element.id, file, { screenId: currentScreenId }),
          );
        }
      },
      [dispatch, currentScreenId, element],
    );

    const { imageURL } = element.parameters;

    const imageFile = useUrlImageToBlob(element.id, imgRef);

    const handleStartAnalysis = useCallback(() => {
      dispatch(
        uploadFile(
          {
            name: imageFile.name,
            file: imageFile,
            imgPreviewUrl: element.parameters.imageUrl,
          },
          element.id,
          {
            screenId: currentScreenId,
          },
        ),
      );
    }, [dispatch, imageFile, element, currentScreenId]);

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
              <input
                id={`upload-image-wireframe-${element.id}`}
                className={baseClasses.uploadField}
                type="file"
                accept=".jpg, .jpeg, .png"
                name="upload"
                onChange={handleFileInputChange}
              />
              <label htmlFor={`upload-image-wireframe-${element.id}`}>
                <IconButton aria-label="upload picture" component="span">
                  <CloudUploadIcon className={baseClasses.icon} />
                </IconButton>
              </label>
              {imageURL && (
                <IconButton
                  aria-label="analyze picture"
                  component="span"
                  disabled={!imageFile}
                  onClick={handleStartAnalysis}
                >
                  <SyncIcon className={baseClasses.icon} />
                </IconButton>
              )}
            </div>
          </>
        )}
      </div>
    );
  },
);

export default SmartContainerRenderer;
