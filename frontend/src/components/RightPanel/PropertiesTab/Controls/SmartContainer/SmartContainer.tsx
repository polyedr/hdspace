import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
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

const SmartContainer: React.FC<Props> = ({
  activeElementId,
  blockType,
  canEdit,
}) => {
  const classes = useStyles();

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

export default SmartContainer;
