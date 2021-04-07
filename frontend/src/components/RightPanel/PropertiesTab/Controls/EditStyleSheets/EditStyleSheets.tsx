import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import React from 'react';
import StylesHeader from '../../helperComponents/StylesHeader';

const EditStyleSheets: React.FC<
  PropertiesChangeProps<LibraryElement<Entity>>
> = ({ removeStyles, canEdit, masterScreenEnabled }) => {
  return (
    <>
      <div>
        {!masterScreenEnabled && canEdit && (
          <StylesHeader
            title="Edit styles"
            onClick={removeStyles}
            cssPropertiesNames={[
              'display',
              'justifyContent',
              'alignItems',
              'flexDirection',
            ]}
          />
        )}
      </div>
    </>
  );
};

export default EditStyleSheets;
