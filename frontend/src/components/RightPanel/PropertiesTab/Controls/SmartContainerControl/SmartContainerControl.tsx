import React from 'react';
import { useSelector } from 'react-redux';
import useImageUpload from '@Utils/nn/hooks/useImageUpload';
import useNNProcessing from '@Utils/nn/hooks/useNNProcessing';
import { NNBlockType, StateElement } from '@Src/types';
import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import { selectElementFileInput } from '@Redux/project/selectors/base';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  element: StateElement;
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
  element,
  blockType,
  canEdit,
}) => {
  const classes = useStyles();
  const { id: activeElementId } = element;

  const imageURL = useSelector(selectActiveElementParamByName('imageURL'));
  const handleImageChange = useImageUpload(activeElementId);

  const imageFile = useSelector(selectElementFileInput(activeElementId));

  const handleNNProcessing = useNNProcessing(
    activeElementId,
    blockType,
    imageFile,
  );

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
            onClick={() => handleNNProcessing(true)}
          >
            Automatically Analyze
          </Button>

          <Button
            variant="contained"
            color="primary"
            component="span"
            disabled={!imageFile || !canEdit}
            onClick={() => handleNNProcessing(false)}
          >
            Manually Analyze
          </Button>
        </>
      )}
    </div>
  );
};

export default SmartContainerControl;
