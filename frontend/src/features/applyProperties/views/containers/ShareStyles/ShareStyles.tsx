import React from 'react';
import { Chip, makeStyles } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';

import { connect, useSelector } from 'react-redux';
import ControlSection from '../../components/ControlSection/ControlSection';
import Button from '../../../../../components/UI/Button';
import { AppReduxState } from '../../../../../shared/types/app';
import {
  selectActiveElement,
  selectCurrentProject,
  selectCurrentScreenId,
} from '../../../../../redux/project/selectors';
import {
  addElementClassName,
  copyElementStyles,
  removeElementClassName,
} from '../../../../../redux/project/actions';

const useStyles = makeStyles({
  root: {
    marginRight: '5px',
    marginBottom: '5px',
    color: '#1cc09f',
    border: '1px solid #1cc09f',
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
});

const mapState = (state: AppReduxState) => {
  const activeElement = selectActiveElement(state);
  const project = selectCurrentProject(state);

  const sharedClasses = project.projectData.classes.filter(
    (cssClass) =>
      cssClass.supportedElement === activeElement?.type &&
      !activeElement.styles.classNames.includes(cssClass.className),
  );

  const elementClassNames = activeElement?.styles.classNames || [];

  return {
    activeElement,
    sharedClasses,
    elementClassNames,
  };
};

const mapDispatch = {
  copyStyles: copyElementStyles,
  addElementClassName,
  removeElementClassName,
};

type Props = ReturnType<typeof mapState> & typeof mapDispatch;

const ShareStyles: React.FC<Props> = ({
  activeElement,
  copyStyles,
  addElementClassName,
  removeElementClassName,
  sharedClasses,
  elementClassNames,
}) => {
  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleCopyButtonClick = () =>
    activeElement &&
    copyStyles(
      activeElement.type,
      activeElement.id,
      activeElement.styles.ownStyles,
      { screenId: currentScreenId },
    );

  const handlePasteButtonClick = (className: string) =>
    activeElement &&
    addElementClassName(activeElement.id, className, {
      screenId: currentScreenId,
    });

  const handleDeleteButtonClick = (className: string) =>
    activeElement &&
    removeElementClassName(activeElement.id, className, {
      screenId: currentScreenId,
    });
  const isTagClassName = (className: string) =>
    className === activeElement?.type;

  const isElementHasOwnStyles =
    activeElement && Object.keys(activeElement.styles.ownStyles).length;
  const isElementHasSharedClassName = activeElement?.styles.classNames[1];
  const disableShareButton =
    !isElementHasOwnStyles || isElementHasSharedClassName;

  const classes = useStyles();

  return (
    <>
      <Button onClick={handleCopyButtonClick} disabled={!!disableShareButton}>
        Share styles
      </Button>
      <ControlSection title="Shared classes">
        <>
          {sharedClasses.length ? (
            sharedClasses.map((sharedClass) => (
              <Chip
                key={sharedClass.className}
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
            ))
          ) : (
            <p>No shared classes</p>
          )}
        </>
      </ControlSection>
      <ControlSection title="Element's classes">
        <>
          {elementClassNames.length ? (
            (elementClassNames as string[]).map((className) => (
              <Chip
                key={className}
                size="small"
                className={classes.elementsStylesChip}
                label={className}
                clickable={!isTagClassName(className)}
                color="primary"
                {...(!isTagClassName(className) && {
                  deleteIcon: <CancelIcon />,
                })}
                {...(!isTagClassName(className) && {
                  onClick: () => handleDeleteButtonClick(className),
                })}
                {...(!isTagClassName(className) && {
                  onDelete: () => handleDeleteButtonClick(className),
                })}
              />
            ))
          ) : (
            <p>No elementId&apos;s classes</p>
          )}
        </>
      </ControlSection>
    </>
  );
};

export default connect(mapState, mapDispatch)(ShareStyles);
