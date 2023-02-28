import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import CodeEditor from '@Components/UI/CodeEditor';
import { cssCamelize, cssDecamelize } from '@Utils/CSSConverter';

import 'highlight.js/styles/dracula.css';
import RemoveStyles from '../../helperComponents/RemoveStyles';

const useStyles = makeStyles((theme: Theme) => ({
  editorWrapper: {
    margin: '7px 0',
    '& textarea': {
      lineHeight: theme.typography.body2.lineHeight,
    },
  },
  error: {
    textDecoration: 'underline wavy red',
  },
}));

const transformToEditorStyles = (styles: React.CSSProperties) =>
  Object.keys(styles).reduce(
    (stringStyles, styleName) =>
      `${stringStyles}${styleName}: ${styles[styleName]};\r\n`,
    '',
  );

const StyleSheets: React.FC<PropertiesChangeProps<LibraryElement<Entity>>> = ({
  removeStyles,
  replaceStyles,
  canEdit,
  masterScreenEnabled,
  element,
  editableStyles,
}) => {
  const classes = useStyles();

  const [editorStyles, setEditorStyles] = useState<string>(
    transformToEditorStyles(cssDecamelize(element.styles.ownStyles || {})),
  );

  const handleEditorChange = useDebouncedCallback(
    (stylesJson: React.CSSProperties) => {
      replaceStyles(stylesJson);
    },
    500,
  );

  return (
    <>
      <div>
        {!masterScreenEnabled && canEdit && (
          <RemoveStyles
            onClick={(styleNames: string[]) => {
              setEditorStyles('');
              removeStyles(styleNames);
            }}
            propsToRemove={Object.keys(element.styles.ownStyles)}
            editableStyles={editableStyles}
            type={element.type}
          />
        )}
      </div>

      <div className={classes.editorWrapper}>
        <CodeEditor
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
                  const [ruleName, ruleValue, ...otherValues] =
                    styleRule.split(':');
                  if (!ruleName || !ruleValue || otherValues.length) {
                    throw new Error(
                      `Invalid CSS input: '${styleRule.replaceAll('\n', '')}'`,
                    );
                  }
                  return {
                    ...json,
                    [ruleName.trim()]: ruleValue.trimLeft(),
                  };
                }, {});

              const newOwnStyles = cssCamelize(stylesJson);
              handleEditorChange.cancel();
              handleEditorChange.callback(newOwnStyles);
            } catch (e) {
              // invalid output error - do nothing
            }
          }}
          language="css"
          width="290px"
          height="290px"
        />
      </div>
    </>
  );
};

export default StyleSheets;
