import React, { useCallback, memo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { useDispatch, useSelector } from 'react-redux';
import { updateElement } from '@Redux/project/actions';
import { selectEditorDocument } from '@Redux/project/selectors/base';
import { Button, ButtonGroup, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { capitalize } from '@mui/material/utils';
import RemoveStyles from '../../helperComponents/RemoveStyles';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  sizeControl: {
    display: 'flex',
    justifyContent: 'stretch',
    alignItems: 'flex-end',
  },
  text: {
    width: 50,
  },
});

const sameSizeElements: (Entity | 'none')[] = ['checkbox', 'radiobutton'];
const percentSizeElements: (Entity | 'none')[] = ['carousel'];
const disableWidthElements: (Entity | 'none')[] = [
  'navbar',
  'calendar',
  'clock',
];
const disableHeightElements: (Entity | 'none')[] = [
  'calendar',
  'calendar',
  'clock',
];

enum Unit {
  px = 'px',
  '%' = '%',
  auto = 'auto',
}

type UnitName = keyof typeof Unit;

type MaxMinUnitName = Omit<UnitName, 'auto'>;

type SelectedUnit = {
  width: UnitName;
  height: UnitName;
  minHeight: MaxMinUnitName;
  maxHeight: MaxMinUnitName;
  minWidth: MaxMinUnitName;
  maxWidth: MaxMinUnitName;
};

type SizeName = keyof SelectedUnit;

type ControlProps = {
  sizeName: SizeName;
  disabled: boolean;
};

const getUnitFromValue = (value: string): UnitName => {
  const unit = value.replace(/[0-9, \d+.\d+]/g, '');
  if (unit in Unit) {
    return unit as UnitName;
  }
  return Unit.px;
};

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
};

const SizeBlock: React.FC<Props> = ({
  updateStyles,
  removeStyles,
  masterScreenEnabled,
  editableStyles,
  element,
  width,
  height,
  canEdit,
}) => {
  const classes = useStyles();

  const editorDocument = useSelector(selectEditorDocument);
  const { type } = element;

  const handleSelectChange = useCallback(
    ({ target: { value } }, sizeName: SizeName) => {
      const handleUpdateStyles = (key: SizeName, value: string) => {
        if (sameSizeElements.includes(type)) {
          updateStyles({
            width: value,
            height: value,
          });
          return;
        }
        updateStyles({ [key]: value });
      };

      if (editorDocument) {
        const el = editorDocument.getElementById(element.id);

        switch (value as UnitName) {
          case 'px': {
            if (el !== null) {
              const size =
                sizeName === 'width' ? el.offsetWidth : el.offsetHeight;
              handleUpdateStyles(sizeName, `${size}px`);
            }
            break;
          }

          case 'auto':
            handleUpdateStyles(sizeName, 'auto');
            break;

          case '%':
            if (el !== null && el.parentElement !== null) {
              const parentStyles = getComputedStyle(el.parentElement);
              const parentXPadding = parseFloat(parentStyles.paddingLeft);
              const parentYPadding = parseFloat(parentStyles.paddingTop);

              const parentSize =
                sizeName === 'width'
                  ? el.parentElement.clientWidth - parentXPadding * 2
                  : el.parentElement.clientHeight - parentYPadding * 2;

              const size =
                sizeName === 'width' ? el.offsetWidth : el.offsetHeight;
              const sizeInPercents = parentSize
                ? Math.round(Number((size * 10000) / parentSize)) / 100
                : 0;

              handleUpdateStyles(sizeName, `${sizeInPercents}%`);
            }
            break;

          default:
            break;
        }
      }
    },
    [element, updateStyles, editorDocument, type],
  );

  const handleInputChange = useCallback(
    (name, value) => {
      const size = String(name === 'width' ? width : height) || 'auto';
      const newWidth = width === undefined ? 1 : parseFloat(`${width}`);
      const newHeight = height === undefined ? 1 : parseFloat(`${height}`);

      const unitValue = Unit[getUnitFromValue(size?.toString() || Unit.px)];

      const finalValue =
        unitValue === 'auto' ? 'auto' : `${value}${Unit[unitValue]}`;
      let newSize;
      if (sameSizeElements.includes(type)) {
        newSize = {
          width: finalValue,
          height: finalValue,
        };
      } else if (percentSizeElements.includes(type)) {
        newSize =
          name === 'width'
            ? {
                width: finalValue,
                height:
                  unitValue === 'auto'
                    ? 'auto'
                    : `${Math.trunc((newHeight * value) / newWidth)}${
                        Unit[unitValue]
                      }`,
              }
            : {
                width:
                  unitValue === 'auto'
                    ? 'auto'
                    : `${Math.trunc((newWidth * value) / newHeight)}${
                        Unit[unitValue]
                      }`,
                height: finalValue,
              };
      } else {
        newSize = {
          [name]: finalValue,
        };
      }
      updateStyles({
        ...newSize,
        ...(name === 'height' && { minHeight: 'auto' }),
        flexGrow: 0,
      });
    },
    [updateStyles, width, height, type],
  );

  const ClendarSizeControl: React.FC = () => {
    const dispatch = useDispatch();
    const { id, parameters } = useSelector(selectActiveElement);
    const handleSizeChange = (e) => {
      dispatch(
        updateElement({
          elementID: id,
          data: { parameters: { ...parameters, size: e.currentTarget.value } },
          active: true,
        }),
      );
    };

    return (
      <ButtonGroup>
        <Button
          variant="contained"
          color="primary"
          value="small"
          onClick={handleSizeChange}
        >
          small
        </Button>
        <Button
          variant="contained"
          color="primary"
          value="large"
          onClick={handleSizeChange}
        >
          large
        </Button>
      </ButtonGroup>
    );
  };
  const SizeControl: React.FC<ControlProps> = ({ sizeName, disabled }) => {
    const size = String((sizeName === 'width' ? width : height) || 'auto');
    const parsedSize = Number.isNaN(parseFloat(size))
      ? ''
      : String(parseFloat(size));
    const inputValue = !size || size === 'auto' ? 'auto' : parsedSize;
    const [sizeState, setSizeState] = useState(inputValue || 0);

    const debounced = useDebouncedCallback((name, value) => {
      handleInputChange(name, value);
    }, 500);

    return (
      <div className={classes.sizeControl}>
        <StyledTextField
          className={classes.text}
          label={capitalize(sizeName)}
          type="text"
          name={sizeName}
          value={sizeState}
          onChange={({ target: { name, value } }) => {
            setSizeState(value);
            debounced.callback(name, value);
          }}
          disabled={inputValue === 'auto' || !canEdit || disabled}
          margin="dense"
        />

        <StyledTextField
          margin="dense"
          onChange={(event) => handleSelectChange(event, sizeName)}
          value={Unit[getUnitFromValue(size)]}
          name={`${sizeName}_unit`}
          select
          disabled={!canEdit || disabled}
        >
          {Object.keys(Unit).map((unit) => (
            <MenuItem key={unit} value={unit} dense>
              {unit}
            </MenuItem>
          ))}
        </StyledTextField>
      </div>
    );
  };

  return (
    <section>
      {!masterScreenEnabled && canEdit && (
        <RemoveStyles
          onClick={removeStyles}
          propsToRemove={['width', 'height']}
          type={element.type}
          editableStyles={editableStyles}
        />
      )}

      <div className={classes.wrapper}>
        {type === 'calendar' ? (
          <ClendarSizeControl />
        ) : (
          <>
            <SizeControl
              sizeName="height"
              disabled={disableHeightElements.includes(type)}
            />
            <SizeControl
              sizeName="width"
              disabled={disableWidthElements.includes(type)}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default memo(SizeBlock);
