import React from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { StyledTextField } from '@Components/styledComponents';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  flexWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});

const Attributes: React.FC<PropertiesChangeProps<LibraryElement<Entity>>> = ({
  updateParams,
  canEdit,
  activeElementId,
  // masterScreenEnabled,
}) => {
  const classes = useStyles();
  const element = useSelector(selectActiveElement);
  // const [addInProgress, setAddInProgress] = useState<boolean>(false);
  const { attributes } = element.parameters;
  console.log('ATTRIBUTES!!!', attributes);

  const handleUpdateAttribute = useDebouncedCallback(
    (name, value) => updateParams({ [name]: value }, activeElementId),
    100,
  );
  return (
    <>
      <div>
        {Object.keys(attributes).map((attrName) => {
          const attrValue = attributes[attrName];
          return (
            <StyledTextField
              key={`attribute-${attrName}`}
              style={{ width: '100%' }}
              label={attrName}
              defaultValue={attrValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = event.target;
                handleUpdateAttribute.flush();
                handleUpdateAttribute.callback(attrName, value);
              }}
              margin="dense"
              disabled={!canEdit}
            />
          );
        })}
        {/* addInProgress && (
          <StyledTextField
            style={{ width: '100%' }}
            label={attrName}
            defaultValue={attrValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = event.target;
              handleUpdateAttribute.flush();
              handleUpdateAttribute.callback(attrName, value);
            }}
            margin="dense"
            disabled={!canEdit}
          />
          ) */}
        <div className={classes.flexWrapper}>
          {canEdit && (
            <Button color="secondary" variant="contained">
              Add attribute
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Attributes;
