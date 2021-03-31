import React from 'react';
import { Chip, makeStyles } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { connect, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import {
  addElementClassName,
  copyElementStyles,
  removeElementClassName,
} from '@Redux/project/actions';

import { selectActiveElement } from '@Redux/project/selectors/element';
import { selectCurrentProject } from '@Redux/project/selectors/base';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { AppReduxState } from '@Redux/types';
import { selectIfCurrentUserHasPermission } from '@Redux/permissions/selectors';
import { UserProjectPermission } from '@Src/types';
import EditableStyles from '../EditableStyles/EditableStyles';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  chip: {
    marginRight: '5px',
    marginBottom: '5px',
    color: '#1cc09f',
    border: '1px solid #1cc09f',
    '& .MuiChip-label': {
      textTransform: 'capitalize',
    },
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
    '& .MuiChip-label': {
      textTransform: 'capitalize',
    },
  },
  chipContainer: {
    padding: spacing(1, 0.5),
  },
}));

const mapState = (state: AppReduxState) => {
  const activeElement = selectActiveElement(state);
  const project = selectCurrentProject(state);

  const sharedClasses = project.projectData.classes.filter(
    (cssClass) =>
      cssClass.supportedElement === activeElement?.type &&
      !activeElement.styles.classNames?.includes(cssClass.className),
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
  const canEditProject = useSelector(
    selectIfCurrentUserHasPermission(UserProjectPermission.CHANGE_PROJECT),
  );

  const handleCopyButtonClick = () =>
    activeElement &&
    activeElement.type !== 'none' &&
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
  const isElementHasSharedClassName = activeElement?.styles.classNames?.[1];
  const disableShareButton =
    !isElementHasOwnStyles || isElementHasSharedClassName || !canEditProject;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button
        color="secondary"
        onClick={handleCopyButtonClick}
        disabled={!!disableShareButton}
        variant="contained"
      >
        Share styles
      </Button>

      <div className={classes.chipContainer}>
        {sharedClasses.length ? (
          sharedClasses.map((sharedClass) => (
            <Chip
              key={sharedClass.className}
              size="small"
              variant="outlined"
              className={classes.chip}
              label={sharedClass.className}
              clickable={canEditProject}
              color="primary"
              onClick={() => handlePasteButtonClick(sharedClass.className)}
            />
          ))
        ) : (
          <p>No shared classes</p>
        )}
      </div>

      <div>
        {elementClassNames.length ? (
          (elementClassNames as string[]).map((className) => (
            <Chip
              key={className}
              size="small"
              className={classes.elementsStylesChip}
              label={className}
              clickable={!isTagClassName(className) && canEditProject}
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
      </div>

      <EditableStyles disabled={!canEditProject} />
    </div>
  );
};

export default connect(mapState, mapDispatch)(ShareStyles);
