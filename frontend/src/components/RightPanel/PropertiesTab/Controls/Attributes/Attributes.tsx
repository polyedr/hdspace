import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Button, IconButton, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { lighten } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { StyledTextField } from '@Components/styledComponents';

const useStyles = makeStyles<Theme>(({ palette }) => ({
  flexWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  iconButton: {
    color: palette.common.white,
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.1),
    },
    width: 45,
    height: 45,
  },
  attrWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attrName: {
    width: '100%',
  },
  attrValue: {
    width: 45,
    height: 45,
  },
}));

const Attributes: React.FC<PropertiesChangeProps<LibraryElement<Entity>>> = ({
  updateParams,
  canEdit,
  element,
}) => {
  const classes = useStyles();
  const [addInProgress, setAddInProgress] = useState<boolean>(false);
  const { attributes } = element.parameters;
  const { id: activeElementId } = element;

  const handleUpdateAttribute = useDebouncedCallback(
    (name, value) =>
      updateParams(
        {
          attributes: {
            ...attributes,
            [name]: value,
          },
        },
        activeElementId,
      ),
    500,
  );

  if (attributes === undefined || attributes === null) {
    return null;
  }

  return (
    <div>
      {Object.keys(attributes).map((attrName) => {
        const attrValue = attributes[attrName];
        return (
          <div key={`attribute-${attrName}`} className={classes.attrWrapper}>
            <StyledTextField
              className={classes.attrName}
              label={attrName}
              defaultValue={attrValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = event.target;
                handleUpdateAttribute.cancel();
                handleUpdateAttribute.callback(attrName, value);
              }}
              margin="dense"
              disabled={!canEdit}
            />
            <IconButton
              onClick={() => {
                updateParams({
                  attributes: Object.keys(attributes).reduce(
                    (newAttributes, name) => {
                      if (name === attrName) {
                        return newAttributes;
                      }
                      return {
                        ...newAttributes,
                        [name]: attributes[name],
                      };
                    },
                    {},
                  ),
                });
              }}
              size="small"
              title="Delete element"
              disabled={!canEdit}
              className={classes.iconButton}
              disableRipple
              disableFocusRipple
              disableTouchRipple
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      })}
      {addInProgress && (
        <StyledTextField
          style={{ width: '100%' }}
          label="New attribute name"
          margin="dense"
          disabled={!canEdit}
          onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.target && event.key === 'Enter') {
              const { value } = event.target as HTMLInputElement;
              updateParams({
                attributes: {
                  ...attributes,
                  [value.toLowerCase().replaceAll(' ', '_')]: '',
                },
                activeElementId,
              });
              setAddInProgress(false);
            }
          }}
        />
      )}
      <div className={classes.flexWrapper}>
        {canEdit && !addInProgress && (
          <Button
            color="secondary"
            variant="contained"
            onClick={() => setAddInProgress(true)}
          >
            Add attribute
          </Button>
        )}
      </div>
    </div>
  );
};

export default Attributes;
