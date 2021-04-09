import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { CodeEditorEditable } from 'react-code-editor-editable';
import validateCSS from 'simple-css-validator';
import { useDebouncedCallback } from 'use-debounce';
import { cssCamelize, cssDecamelize } from '@Utils/CSSConverter';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { selectActiveElement } from '@Redux/project/selectors/element';
import StylesHeader from '../../helperComponents/StylesHeader';

import 'highlight.js/styles/arta.css';

const transformToEditorStyles = (styles: React.CSSProperties) => {
  return Object.keys(styles).reduce((stringStyles, styleName) => {
    return `${stringStyles}${styleName}: ${styles[styleName]};\r\n`;
  }, '');
};

const useStyles = makeStyles((theme) => {
  return {
    editorError: {
      outline: '1px solid #ff0000',
    },
    editorWrapper: {
      margin: '7px 0',
      '& textarea': {
        lineHeight: theme.typography.body2.lineHeight,
      },
    },
  };
});

const StyleSheets: React.FC<PropertiesChangeProps<LibraryElement<Entity>>> = ({
  removeStyles,
  updateStyles,
  canEdit,
  masterScreenEnabled,
}) => {
  const element = useSelector(selectActiveElement);
  const classes = useStyles();

  const handleEditorChange = useDebouncedCallback(
    (stylesJson: React.CSSProperties) => {
      updateStyles(cssCamelize(stylesJson));
    },
    500,
  );

  const [editorStyles, setEditorStyles] = useState<string>(
    transformToEditorStyles(cssDecamelize(element.styles.ownStyles)),
  );

  const [editorError, setEditorError] = useState<string | null>(null);

  return (
    <>
      <div>
        {!masterScreenEnabled && canEdit && (
          <StylesHeader
            title="Edit styles"
            onClick={(styleNames: string[]) => {
              setEditorStyles('');
              removeStyles(styleNames);
            }}
            cssPropertiesNames={Object.keys(element.styles.ownStyles)}
          />
        )}
      </div>
      <div
        className={cn(
          classes.editorWrapper,
          editorError ? classes.editorError : '',
        )}
      >
        <CodeEditorEditable
          value={editorStyles}
          setValue={(newStyles: string) => {
            setEditorStyles(newStyles);
            try {
              const stylesJson = newStyles
                .replaceAll('\r\n', '')
                .split(';')
                .reduce((json, styleRule) => {
                  if (!styleRule.trim().length) {
                    return json;
                  }
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
                if (editorError) {
                  setEditorError(null);
                }
                handleEditorChange.cancel();
                handleEditorChange.callback(stylesJson);
              }
            } catch (e) {
              setEditorError(e.message);
            }
          }}
          width="284px"
          height="284px"
          language="css"
          inlineNumbers={false}
        />
      </div>
    </>
  );
};

export default StyleSheets;
