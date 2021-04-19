import React from 'react';
import { useSelector } from 'react-redux';

import { useDebouncedCallback } from 'use-debounce';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { selectActiveElement } from '@Redux/project/selectors/element';
import StyleSheetsCodeEditor from '@Components/UI/StyleSheetsCodeEditor';
import StylesHeader from '../../helperComponents/StylesHeader';

const StyleSheets: React.FC<PropertiesChangeProps<LibraryElement<Entity>>> = ({
  removeStyles,
  updateStyles,
  canEdit,
  masterScreenEnabled,
}) => {
  const element = useSelector(selectActiveElement);

  const handleEditorChange = useDebouncedCallback(
    (stylesJson: React.CSSProperties) => {
      updateStyles(stylesJson);
    },
    500,
  );

  return (
    <>
      <div>
        {!masterScreenEnabled && canEdit && (
          <StylesHeader
            title="Edit styles"
            onClick={(styleNames: string[]) => {
              removeStyles(styleNames);
            }}
            cssPropertiesNames={Object.keys(element.styles.ownStyles)}
          />
        )}
      </div>

      <StyleSheetsCodeEditor
        value={element.styles.ownStyles}
        style={{ width: 280, height: 280 }}
        onChange={(styles) => {
          handleEditorChange.cancel();
          handleEditorChange.callback(styles);
        }}
      />
    </>
  );
};

export default StyleSheets;
