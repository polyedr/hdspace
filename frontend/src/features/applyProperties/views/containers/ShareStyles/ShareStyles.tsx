import React from 'react';
import { Chip, makeStyles } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';

import { actionsCreators, selectors } from '$redux/project';
import { AppReduxState } from '$shared/types/app';
import { connect } from 'react-redux';
import { findChildByID } from '$utils/ElementsTreeHelper';
import { Button } from '$components/UI/Button';
import { ProjectClass } from '$api/types';
import { ControlSection } from '../../components/ControlSection/ControlSection';

const styles = require('./ShareStyles.scss');

const mapState = (state: AppReduxState) => {
  const activeItem = selectors.selectActiveItem(state);
  const root = selectors.selectRootElement(state);
  const activeElement = findChildByID(root, activeItem.itemId);
  const classNames = [...(activeElement?.styles.classNames || []), 'idStyles'];
  const editableStyles = selectors.selectEditableStyles(state);
  const copiedStyles = selectors.selectCopiedStyles(state);
  const project = selectors.selectCurrentProject(state);

  const sharedClasses = project.projectData.classes.filter(
    (cssClass) =>
      cssClass.supportedElement === activeElement?.type &&
      !activeElement.styles.classNames.includes(cssClass.className)
  );

  const elementClassNames = activeElement?.styles.classNames || [];

  return {
    activeElement,
    copiedStyles,
    sharedClasses,
    elementClassNames,
  }
};

const mapDispatch = {
  copyStyles: actionsCreators.copyElementStyles,
  addElementClassName: actionsCreators.addElementClassName,
  removeElementClassName: actionsCreators.removeElementClassName,
};

type Props = ReturnType<typeof mapState> & typeof mapDispatch;

const ShareStyles = (props: Props) => {
  const {
    activeElement,
    copiedStyles,
    copyStyles,
    addElementClassName,
    removeElementClassName,
    sharedClasses,
    elementClassNames,
  } = props;

  const handleCopyButtonClick = () => {
    activeElement && copyStyles(activeElement.type, activeElement.id, activeElement.styles.idStyles);
  };

  const handlePasteButtonClick = (className: string) => {
    activeElement && addElementClassName(activeElement.id, className);
  };

  const handleDeleteButtonClick = (className: string) => {
    activeElement && removeElementClassName(activeElement.id, className);
  };

  const showShareStylesButton = !copiedStyles || activeElement && copiedStyles && !activeElement.styles.classNames.includes(copiedStyles.className);

  const showApplyStylesButton = activeElement && copiedStyles && !activeElement.styles.classNames.includes(copiedStyles.className);
  
  const classes = makeStyles({
    root: {
      marginRight: '5px',
      marginBottom: '5px',
      color: '#1cc09f',
      border: '1px solid #1cc09f'
    },

    icon: {
      color: '#1cc09f',

      '&:hover': {
        color: '#1cc09f',
      },
    },

    elementsStylesChip: {
      marginRight: '5px',
      marginBottom: '5px',
      backgroundColor: '#1cc09f',

      '&:hover, &:focus': {
        backgroundColor: '#18a689',
      },
    },
  })();

  return (
    <>
      <Button className={styles.shareButton} onClick={handleCopyButtonClick}>
        Share styles
      </Button>
      <ControlSection title="Shared classes">
        <>
          {sharedClasses.length ? sharedClasses.map((sharedClass) => (
            <Chip
              size="small"
              variant="outlined"
              className={classes.root}
              label={sharedClass.className}
              clickable
              color="primary"
              onClick={() => handlePasteButtonClick(sharedClass.className)}
              onDelete={() => handlePasteButtonClick(sharedClass.className)}
              deleteIcon={<DoneIcon className={classes.icon} />}
            />
        )) : <p>No shared classes</p>}
      </>
      </ControlSection>
      <ControlSection title="Element's classes">
        <>
          {elementClassNames.length ? elementClassNames.map((className) => (
            <Chip
              size="small"
              className={classes.elementsStylesChip}
              label={className}
              clickable
              color="primary"
              onClick={() => handleDeleteButtonClick(className)}
              onDelete={() => handleDeleteButtonClick(className)}
            />
          )) : <p>No element's classes</p>}
        </>
      </ControlSection>
    </>
  );
};

const Component = connect(mapState, mapDispatch)(ShareStyles);
export { Component as ShareStyles };
