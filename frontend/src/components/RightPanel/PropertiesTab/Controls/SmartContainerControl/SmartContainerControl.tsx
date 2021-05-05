import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useImageUpload from '@Utils/nn/hooks/useImageUpload';
import useNNProcessing from '@Utils/nn/hooks/useNNProcessing';
import {
  Entity,
  NNBlockType,
  PropertiesChangeProps,
  SmartElement,
} from '@Src/types';
import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import { selectElementFileInput } from '@Redux/project/selectors/base';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { enqueueSnackbar } from '@Redux/notification/actions';

type Props = {
  activeElementId: PropertiesChangeProps<
    SmartElement<Entity>
  >['activeElementId'];
  blockType: NNBlockType;
  canEdit: boolean;
};

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  uploadField: {
    display: 'none',
  },
});

const SmartContainerControl: React.FC<Props> = ({
  activeElementId,
  blockType,
  canEdit,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const imageURL = useSelector(selectActiveElementParamByName('imageURL'));
  const handleImageChange = useImageUpload(activeElementId);

  const imageFile = useSelector(selectElementFileInput(activeElementId));

  const handleNNProcessing = useNNProcessing(
    activeElementId,
    blockType,
    imageFile,
  );
  const onclickAnalyzePicture = (size: number, bool: boolean) => {
    if (bool) {
      if (size < 101376) {
        handleNNProcessing(bool);
      } else {
        dispatch(
          enqueueSnackbar({
            message: 'image size is greater than 100 kB',
            options: { variant: 'warning' },
          }),
        );
      }
    } else if (size < 306176) {
      handleNNProcessing(bool);
    } else {
      dispatch(
        enqueueSnackbar({
          message: 'image size is greater than 300 kB',
          options: { variant: 'warning' },
        }),
      );
    }
  };
  return (
    <div className={classes.wrapper}>
      <input
        className={classes.uploadField}
        type="file"
        accept=".jpg, .jpeg, .png"
        name="upload"
        onChange={handleImageChange}
        id={`upload-component-wireframe-${activeElementId}`}
        disabled={!canEdit}
      />

      <label htmlFor={`upload-component-wireframe-${activeElementId}`}>
        <Button
          variant="contained"
          color="primary"
          component="span"
          disabled={!canEdit}
        >
          Choose image
        </Button>
      </label>

      {imageURL && (
        <>
          <Button
            variant="contained"
            color="primary"
            component="span"
            disabled={!imageFile || !canEdit}
            onClick={() => onclickAnalyzePicture(imageFile.size, true)}
          >
            Automatically Analyze
          </Button>

          <Button
            variant="contained"
            color="primary"
            component="span"
            disabled={!imageFile || !canEdit}
            onClick={() => onclickAnalyzePicture(imageFile.size, false)}
          >
            Manually Analyze
          </Button>
        </>
      )}
    </div>
  );
};

export default SmartContainerControl;
