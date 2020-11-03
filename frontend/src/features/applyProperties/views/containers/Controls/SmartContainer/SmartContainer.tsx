import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { ImageElement } from '../../../../../../api/types';
import {
  selectActiveElement,
  selectElementFileInput,
} from '../../../../../../redux/project/selectors';
import useImageUpload from '../../../../../../utils/nn/hooks/useImageUpload';
import useNNProcessing from '../../../../../../utils/nn/hooks/useNNProcessing';
import { NNBlockType } from '../../../../../../constants/defaultParams';

type Props = {
  blockType: NNBlockType;
};

const useStyles = makeStyles((theme) =>
  createStyles({
    button: {
      width: 'calc(50% - 2px)',
      border: 0,
      outline: 'none',
      padding: '8px 12px',
      borderRadius: 3,
      fontSize: 14,
      lineHeight: '18px',
      color: theme.palette.common.white,
      textAlign: 'center',
      cursor: 'pointer',
      backgroundColor: '#1ab394',
      '&:hover, &:focus': {
        backgroundColor: 'lighten(#1ab394, 10%)',
      },
      '&:active': {
        backgroundColor: 'darken(#1ab394, 10%)',
      },
      '&:disabled': {
        backgroundColor: '#949494',
        borderColor: '#949494',
      },
    },
    uploadField: {
      width: 'calc(50% - 2px)',
      display: 'none',
    },
  }),
);

const SmartContainer: React.FC<PropertiesChangeProps<ImageElement> & Props> = ({
  blockType,
}) => {
  const classes = useStyles();
  const element = useSelector(selectActiveElement);

  const handleImageChange = useImageUpload(element.id);

  const imageFile = useSelector(selectElementFileInput(element.id));

  const handleNNProcessing = useNNProcessing(element.id, blockType, imageFile);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Screenshot</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <label
            htmlFor={`upload-component-wireframe-${element.id}`}
            className={classes.button}
          >
            Choose image
            <input
              className={classes.uploadField}
              type="file"
              accept=".jpg, .jpeg, .png"
              name="upload"
              onChange={handleImageChange}
              id={`upload-component-wireframe-${element.id}`}
            />
          </label>
          {element.parameters.imageURL && (
            <button
              type="button"
              className={classes.button}
              disabled={!imageFile}
              onClick={handleNNProcessing}
            >
              Analyze
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default withConfigurableProperties(SmartContainer);
