import React from 'react';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material';
import RemoveStyles from '@Components/RightPanel/PropertiesTab/helperComponents/RemoveStyles';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { StyledSlider, StyledTextField } from '@Components/styledComponents';
import { useDebouncedValueChange } from '@Utils/debounceHooks';

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  opacity: React.CSSProperties['opacity'];
};

const useStyles = makeStyles({
  container: {
    // padding: '0 16px',
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: 'calc(50% - 40px) !important',
  },
});

const OpacityStyledSlider = styled(StyledSlider)({
  width: '50%',
  marginRight: 12,

  '& .MuiSlider-thumb': {
    border: '1px solid #E4E6EB',
  },
});

const OpacityBlock: React.FC<Props> = ({
  removeStyles,
  updateStyles,
  editableStyles,
  element,
  masterScreenEnabled,
  canEdit,
  opacity,
}) => {
  const classes = useStyles();

  const initialOpacity = opacity || 1;

  const [opacityState, handleOpacityChange] = useDebouncedValueChange(
    initialOpacity as number,
    (value) => {
      updateStyles({ opacity: value });
    },
    250,
  );

  const handlerWrapper: (value: number) => void = handleOpacityChange as (
    value: number,
  ) => void;

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
          value={
            opacityState
              ? `${Math.round((opacityState as number) * 100)}%`
              : '100%'
          }
          onBlur={({ target: { value } }) => {
            handlerWrapper(parseInt(value) / 100);
          }}
          onChange={({ target: { value } }) =>
            handlerWrapper(parseInt(value) / 100)
          }
          margin="none"
          disabled={!canEdit}
        />
        <OpacityStyledSlider
          size="small"
          value={(opacityState as number) * 100}
          defaultValue={100}
          onChange={(event, value) => handlerWrapper((value as number) / 100)}
          aria-label="Small"
          disabled={!canEdit}
        />
      </div>
    </div>
  );
};

export default OpacityBlock;
