import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useDebouncedCallback } from 'use-debounce';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { makeStyles } from '@material-ui/core/styles';
import CodeEditor from '@Components/UI/CodeEditor';
import { cssCamelize, cssDecamelize } from '@Utils/CSSConverter';
import StylesHeader from '../../helperComponents/StylesHeader';

import 'highlight.js/styles/dracula.css';

const useStyles = makeStyles((theme) => ({
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

const transformToEditorStyles = (styles: React.CSSProperties) => {
  return Object.keys(styles).reduce((stringStyles, styleName) => {
    return `${stringStyles}${styleName}: ${styles[styleName]};\r\n`;
  }, '');
};

const StyleSheets: React.FC<PropertiesChangeProps<LibraryElement<Entity>>> = ({
  removeStyles,
  updateStyles,
  canEdit,
  masterScreenEnabled,
}) => {
  const element = useSelector(selectActiveElement);
  const classes = useStyles();

  const [editorStyles, setEditorStyles] = useState<string>(
    transformToEditorStyles(cssDecamelize(element.styles.ownStyles || {})),
  );

  useEffect(() => {
    setEditorStyles(
      transformToEditorStyles(cssDecamelize(element.styles.ownStyles || {})),
    );
  }, [element.styles.ownStyles]);

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
              setEditorStyles('');
              removeStyles(styleNames);
            }}
            cssPropertiesNames={Object.keys(element.styles.ownStyles)}
          />
        )}
      </div>

      {/* <StyleSheetsCodeEditor
        value={element.styles.ownStyles}
        style={{ width: 290, height: 290 }}
        onChange={(styles) => {
          handleEditorChange.cancel();
          handleEditorChange.callback(styles);
        }}
      /> */}
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
                  const [ruleName, ruleValue, ...otherValues] = styleRule.split(
                    ':',
                  );
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
