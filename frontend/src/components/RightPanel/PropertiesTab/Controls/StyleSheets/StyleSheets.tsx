import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AceEditor from 'react-ace';
// import { useDebouncedCallback } from 'use-debounce';
import { /* cssCamelize, */ cssDecamelize } from '@Utils/CSSConverter';
import { Entity, LibraryElement, PropertiesChangeProps } from '@Src/types';
import { selectActiveElement } from '@Redux/project/selectors/element';

import ReactAce from 'react-ace/lib/ace';
import StylesHeader from '../../helperComponents/StylesHeader';
import editorRules from './highlightRules';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/theme-dracula';

const transformToEditorStyles = (styles: React.CSSProperties) => {
  return Object.keys(styles).reduce((stringStyles, styleName) => {
    return `${stringStyles}${styleName}: ${styles[styleName]};\r\n`;
  }, '');
};

const useStyles = makeStyles(() => {
  return {
    editorError: {
      outline: '1px solid #ff0000',
    },
    editorWrapper: {
      margin: '7px 0',
      position: 'relative',
      /* '& textarea': {
        lineHeight: theme.typography.body2.lineHeight,
      }, */
    },
  };
});

// const modeRulesToExclude = ['start', 'media', 'comments', 'escapes'];

const StyleSheets: React.FC<PropertiesChangeProps<LibraryElement<Entity>>> = ({
  removeStyles,
  // updateStyles,
  activeElementId,
  canEdit,
  masterScreenEnabled,
}) => {
  const element = useSelector(selectActiveElement);
  const classes = useStyles();
  const editorRef = useRef<ReactAce>(null);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    const currentMode = editorRef.current.editor.getSession().getMode() as any;
    /* cssMode.HighlightRules.$rules = {
      ...Object.keys(cssMode.HighlightRules.$rules).filter((keyName) => )
    } */
    currentMode.$rules = editorRules;
    editorRef.current.editor.getSession().setMode(currentMode);
  });

  /* const handleEditorChange = useDebouncedCallback(
    (stylesJson: React.CSSProperties) => {
      updateStyles(cssCamelize(stylesJson));
    },
    500,
  ); */

  const [editorStyles, setEditorStyles] = useState<string>(
    transformToEditorStyles(cssDecamelize(element.styles.ownStyles)),
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
      <div className={cn(classes.editorWrapper)}>
        <AceEditor
          ref={editorRef}
          mode="css"
          theme="dracula"
          name={`css-editor-${activeElementId}`}
          width="280px"
          height="280px"
          onChange={() => {}}
          fontSize={14}
          showPrintMargin
          showGutter
          highlightActiveLine
          editorProps={{ $blockScrolling: true }}
          value={editorStyles}
        />
      </div>
    </>
  );
};

export default StyleSheets;
