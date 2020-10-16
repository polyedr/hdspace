/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
// @ts-nocheck

import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SyncIcon from '@material-ui/icons/Sync';

import { SmartContainerRendererProps } from '../types';
import {
  selectCurrentScreenId,
  selectElementById,
} from '../../../../redux/project/selectors';
import { updateElementImage } from '../../../../redux/project/actions';

const styles = require('../styles.scss');

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
    const classes = makeStyles({
      entityStyles: {
        ...entityStyles,
      },

      groupStyles: {
        ...groupStyles,
      },

      ownStyles: {
        ...ownStyles,
        ...(element && element.parameters.imageURL
          ? {
              backgroundColor: 'transparent',
              background: `url(${element.parameters.imageURL}) no-repeat center center`,
              backgroundSize: 'cover',
            }
          : {}),
      },
      nameHeading: {
        display: 'inline',
        color: '#C2C2C2',
        fontSize: 30,
      },
      uploadField: {
        display: 'none',
      },
    })();

    const currentScreenId = useSelector(selectCurrentScreenId);
    const dispatch = useDispatch();

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
        style={{ ...(isBorderVisible && isDisabled && { outline: 'none' }) }}
      >
        {children?.length ? (
          { children }
        ) : (
          <>
            <h4 className={classes.nameHeading}>{element.name}</h4>
            <input
              id={`upload-image-wireframe-${element.id}`}
              className={classes.uploadField}
              type="file"
              accept=".jpg, .jpeg, .png"
              name="upload"
              onChange={handleFileInputChange}
            />
            <label htmlFor={`upload-image-wireframe-${element.id}`}>
              <IconButton
                color={classes.nameHeading.color}
                aria-label="upload picture"
                component="span"
              >
                <CloudUploadIcon />
              </IconButton>
            </label>
            {element.parameters.imageURL && (
              <IconButton
                color={classes.nameHeading.color}
                aria-label="analyze picture"
                component="span"
              >
                <SyncIcon />
              </IconButton>
            )}
          </>
        )}
      </div>
    );
  },
);

export default SmartContainerRenderer;
