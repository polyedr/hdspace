import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CodeEditorEditable } from 'react-code-editor-editable';
import cn from 'classnames';
import validateCSS from 'simple-css-validator';
import { cssCamelize, cssDecamelize } from '@Utils/CSSConverter';

const transformToEditorStyles = (styles: React.CSSProperties) => {
  return Object.keys(styles).reduce((stringStyles, styleName) => {
    return `${stringStyles}${styleName}: ${styles[styleName]};\r\n`;
  }, '');
};

type Props = React.ComponentProps<'div'> & {
  value?: React.CSSProperties;
  onChange?: (props: React.CSSProperties) => void;
  onError?: (errors: Error[]) => void;
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

const StyleSheetsCodeEditor = ({ value, onChange, onError, style }: Props) => {
  const classes = useStyles();

  const [editorStyles, setEditorStyles] = useState<string>('');

  useEffect(() => {
    setEditorStyles(transformToEditorStyles(cssDecamelize(value || {})));
  }, [value]);

  const [editorError, setEditorError] = useState<string | null>(null);

  return (
    <div
      className={cn(
        classes.editorWrapper,
        editorError ? classes.editorError : '',
      )}
      style={style}
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
              if (onChange) {
                onChange(cssCamelize(stylesJson) as React.CSSProperties);
              }
            }
          } catch (e) {
            setEditorError(e.message);
            if (onError) {
              onError(e);
            }
          }
        }}
        language="css"
        inlineNumbers={false}
        width={`${style?.width || '200px'}`}
        height={`${style?.height || '200px'}`}
      />
    </div>
  );
};

export default StyleSheetsCodeEditor;
