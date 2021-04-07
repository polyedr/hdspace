import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { CodeEditorEditable } from 'react-code-editor-editable';
import validateCSS from 'simple-css-validator';
import { useDebouncedCallback } from 'use-debounce';
import { cssCamelize, cssDecamelize } from '@Utils/CSSConverter';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { selectElementById } from '@Redux/project/selectors/element';
import StylesHeader from '../../helperComponents/StylesHeader';

import 'highlight.js/styles/dracula.css';

const transformToEditorStyles = (styles: React.CSSProperties) => {
  return Object.keys(styles).reduce((stringStyles, styleName) => {
    return `${stringStyles}${styleName}: ${styles[styleName]};\r\n`;
  }, '');
};

const useStyles = makeStyles({
  editorError: {
    outline: '1px solid #ff0000',
  },
  error: {
    color: '#ff0000',
  },
});

const EditStyleSheets: React.FC<
  PropertiesChangeProps<LibraryElement<Entity>>
> = ({
  activeElementId,
  removeStyles,
  updateStyles,
  canEdit,
  masterScreenEnabled,
}) => {
  const element = useSelector(selectElementById(activeElementId));
  const classes = useStyles();

  const handleEditorChange = useDebouncedCallback(
    (stylesJson: React.CSSProperties) => updateStyles(cssCamelize(stylesJson)),
    100,
  );

  const [editorStyles, setEditorStyles] = useState<string>(
    transformToEditorStyles(cssDecamelize(element.styles.ownStyles)),
  );

  const [inputError, setInputError] = useState<string | null>(null);

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
      <div className={inputError ? classes.editorError : ''}>
        <CodeEditorEditable
          value={editorStyles}
          setValue={(newStyles: string) => {
            setEditorStyles(newStyles);
            try {
              const stylesJson = newStyles
                .split(';')
                .reduce((json, styleRule) => {
                  const [ruleName, ruleValue, ...otherValues] = styleRule.split(
                    ':',
                  );
                  if (!ruleName || !ruleValue || otherValues.length) {
                    throw new Error('Invalid CSS input');
                  }
                  return {
                    ...json,
                    [ruleName.trim()]: ruleValue.trimLeft(),
                  };
                }, {});
              const validationResult = validateCSS(stylesJson);
              if (validationResult.valid) {
                handleEditorChange.flush();
                handleEditorChange.callback(stylesJson);
              }
            } catch (e) {
              setInputError(e.message);
            }
          }}
          width="280px"
          height="280px"
          language="css"
          inlineNumbers={false}
        />
      </div>
    </>
  );
};

export default EditStyleSheets;
