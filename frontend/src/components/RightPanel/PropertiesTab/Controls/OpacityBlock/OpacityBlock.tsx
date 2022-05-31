import React, { useState } from 'react';
import RemoveStyles from '@Components/RightPanel/PropertiesTab/helperComponents/RemoveStyles';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { StyledSlider, StyledTextField } from '@Components/styledComponents';
import { makeStyles } from '@material-ui/core/styles';

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  opacity: React.CSSProperties['opacity'];
};

const useStyles = makeStyles({
  container: {
    padding: 16,
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: 62,
  },
  slider: {
    width: 150,
  },
});

const OpacityBlock: React.FC<Props> = ({
  removeStyles,
  editableStyles,
  element,
  masterScreenEnabled,
  canEdit,
}) => {
  const classes = useStyles();

  const [opacityState, setOpacityState] = useState(100);
  return (
    <div className={classes.container}>
      {!masterScreenEnabled && canEdit && (
        <RemoveStyles
          onClick={removeStyles}
          propsToRemove={['opacity']}
          type={element.type}
          editableStyles={editableStyles}
        />
      )}
      <div className={classes.inputsContainer}>
        <StyledTextField
          className={classes.input}
          value={`${opacityState}%`}
          onBlur={({ target: { value } }) => {
            setOpacityState(parseInt(value));
          }}
          onChange={({ target: { value } }) => {
            setOpacityState(parseInt(value));
          }}
          margin="none"
          disabled={!canEdit}
        />
        <StyledSlider
          style={{ width: '150px' }}
          size="small"
          defaultValue={opacityState}
          onChange={(event, value) => setOpacityState(value as number)}
          aria-label="Small"
          valueLabelDisplay="auto"
          disabled={!canEdit}
        />
      </div>
    </div>
  );
};

export default OpacityBlock;
