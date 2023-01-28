import React from 'react';
import { useSelector } from 'react-redux';
import useImageUpload from '@Utils/nn/hooks/useImageUpload';
import { NNBlockType, StateElement } from '@Src/types';
import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import { selectElementFileInput } from '@Redux/project/selectors/base';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useAnalyzePucture from '@Utils/nn/hooks/useAnalyzePucture';

interface Props {
  element: StateElement;
  blockType: NNBlockType;
  canEdit: boolean;
}

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
  const handleAnalyzePicture = useAnalyzePucture(
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
            onClick={() => handleAnalyzePicture(imageFile.size, 100)}
          >
            Automatically Analyze
          </Button>

          <Button
            variant="contained"
            color="primary"
            component="span"
            disabled={!imageFile || !canEdit}
            onClick={() => handleAnalyzePicture(imageFile.size, 300)}
          >
            Manually Analyze
          </Button>
        </>
      )}
    </div>
  );
};

export default SmartContainerControl;
