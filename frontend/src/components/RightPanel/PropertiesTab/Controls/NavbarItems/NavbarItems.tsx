import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { addChildToElement } from '@Redux/project/actions';
import { BreadcrumbItemElement, PropertiesChangeProps } from '@Src/types';
import { selectActiveItemChildren } from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { IconButton } from '@material-ui/core';
import { useDebouncedCallback } from 'use-debounce';
import {
  StyledTextField,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledAccordion,
} from '@Components/styledComponents';
import NavbarItem from './NavbarItem';

const useStyles = makeStyles(({ palette, spacing }) => ({
  row: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  title: {
    '& .MuiAccordionSummary-content': {
      padding: '0.5em 1em',
    },
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    color: palette.common.white,
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.1),
    },
    details: {
      padding: spacing(0.5),
      display: 'flex',
      flexDirection: 'column',
    },
  },
}));

const NavbarItems: React.FC<PropertiesChangeProps<BreadcrumbItemElement>> = ({
  updateParams,
  element,
  canEdit,
}) => {
  const {
    id,
    parameters: { titleName, titleLink },
  } = element;
  const dispatch = useDispatch();
  const classes = useStyles();
  const navbarItem = useSelector(selectActiveItemChildren('navbarItem'));
  const currentScreenId = useSelector(selectCurrentScreenId);
  const handleAddButtonClick = () => {
    dispatch(
      addChildToElement(
        'navbarItem',
        element.id,
        {
          textContent: 'navbar',
          isLink: false,
        },
        { screenId: currentScreenId },
      ),
    );
  };
  const debouncedTitleName = useDebouncedCallback((value) => {
    updateParams({ titleName: value }, id);
  }, 500);
  const debouncedTitleLink = useDebouncedCallback((value) => {
    updateParams({ titleLink: value }, id);
  }, 500);
  return (
    <div>
      <StyledAccordion>
        <StyledAccordionSummary className={classes.title}>
          <div className={classes.wrapper}>Title navbar</div>
        </StyledAccordionSummary>

        <StyledAccordionDetails>
          <StyledTextField
            variant="outlined"
            defaultValue={titleName}
            onChange={(ev) => debouncedTitleName.callback(ev.target.value)}
            label="Title"
            margin="dense"
            fullWidth
            multiline
            disabled={!canEdit}
          />
          <StyledTextField
            variant="outlined"
            defaultValue={titleLink}
            onChange={(ev) => debouncedTitleLink.callback(ev.target.value)}
            label="Link"
            margin="dense"
            fullWidth
            multiline
            disabled={!canEdit}
          />
        </StyledAccordionDetails>
      </StyledAccordion>
      {navbarItem.map(({ id, parameters }) => (
        <NavbarItem
          key={id}
          id={id}
          parameters={parameters}
          updateParams={updateParams}
          isLast={navbarItem.length <= 1}
          canEdit={canEdit}
        />
      ))}

      {canEdit && (
        <div className={classes.row}>
          <IconButton
            onClick={handleAddButtonClick}
            title="Add new item"
            className={classes.iconButton}
          >
            <AddIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default NavbarItems;
