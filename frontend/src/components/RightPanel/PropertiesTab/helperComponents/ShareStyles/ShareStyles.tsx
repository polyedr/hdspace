import React from 'react';
import { Chip, Button, Theme } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { connect, useSelector } from 'react-redux';
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
import { makeStyles } from '@mui/styles';
import EditableStyles from '../EditableStyles/EditableStyles';

const useStyles = makeStyles<Theme>(({ spacing }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: '0 16px',
  },
  chip: {
    marginRight: '5px',
    marginBottom: '5px',
    color: 'black',
    border: '1px solid rgba(80, 100, 255, 1)',
    '& .MuiChip-label': {
      textTransform: 'capitalize',
    },
  },

  text: {
    color: 'rgba(129, 129, 142, 1)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '135%',
    fontFamily: 'Roboto',
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
    color: 'rgba(42, 42, 45, 1)',
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    '&:hover, &:focus': {
      backgroundColor: 'rgba(243, 244, 246, 1)',
    },
    '& .MuiChip-label': {
      textTransform: 'capitalize',
    },
  },
  chipContainer: {
    padding: spacing(1, 0.5),
    marginBottom: 14,
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
    !isElementHasOwnStyles || isElementHasSharedClassName;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      {canEditProject && (
        <Button
          color="secondary"
          onClick={handleCopyButtonClick}
          disabled={!!disableShareButton}
          variant="contained"
        >
          Share styles
        </Button>
      )}

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
              color="secondary"
              onClick={() => handlePasteButtonClick(sharedClass.className)}
            />
          ))
        ) : (
          <p className={classes.text}>No shared classes</p>
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
