import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import {
  selectActiveElement,
  selectElementFileInput,
} from '../../../../../redux/project/selectors';
import useImageUpload from '../../../../../utils/nn/hooks/useImageUpload';
import useNNProcessing from '../../../../../utils/nn/hooks/useNNProcessing';
import { NNBlockType } from '../../../../../constants/defaultParams';
import { ImageElement, PropertiesChangeProps } from '../../../../../types';

type Props = {
  blockType: NNBlockType;
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

const SmartContainer: React.FC<PropertiesChangeProps<ImageElement> & Props> = ({
  blockType,
}) => {
  const classes = useStyles();
  const element = useSelector(selectActiveElement);

  const handleImageChange = useImageUpload(element.id);

  const imageFile = useSelector(selectElementFileInput(element.id));

  const handleNNProcessing = useNNProcessing(element.id, blockType, imageFile);

  return (
    <div className={classes.wrapper}>
      <input
        className={classes.uploadField}
        type="file"
        accept=".jpg, .jpeg, .png"
        name="upload"
        onChange={handleImageChange}
        id={`upload-component-wireframe-${element.id}`}
      />

      <label htmlFor={`upload-component-wireframe-${element.id}`}>
        <Button variant="contained" color="primary" component="span">
          Choose image
        </Button>
      </label>

      {element.parameters.imageURL && (
        <Button
          variant="contained"
          color="primary"
          component="span"
          disabled={!imageFile}
          onClick={handleNNProcessing}
        >
          Analyze
        </Button>
      )}
    </div>
  );
};

export default withConfigurableProperties(SmartContainer);
