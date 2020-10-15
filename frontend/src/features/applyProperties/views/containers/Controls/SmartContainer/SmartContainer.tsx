import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { updateElementImage } from '../../../../../../redux/project/actions';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { ImageElement } from '../../../../../../api/types';
import {
  selectActiveElement,
  selectCurrentScreenId,
} from '../../../../../../redux/project/selectors';

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

const SmartContainer: React.FC<PropertiesChangeProps<ImageElement>> = () => {
  const classes = useStyles();
  const element = useSelector(selectActiveElement);

  const currentScreenId = useSelector(selectCurrentScreenId);
  const dispatch = useDispatch();

  const handleFileInputChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      // TODO: implement image upload
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
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Screenshot</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <label
            htmlFor={`upload-component-wireframe-${element.id}`}
            className={classes.button}
          >
            Choose image
          </label>
          <input
            className={classes.uploadField}
            type="file"
            accept=".jpg, .jpeg, .png"
            name="upload"
            onChange={handleFileInputChange}
            id={`upload-component-wireframe-${element.id}`}
          />
          <button type="button" className={classes.button}>
            Analyze
          </button>
        </div>
      </div>
    </div>
  );
};

export default withConfigurableProperties(SmartContainer);
