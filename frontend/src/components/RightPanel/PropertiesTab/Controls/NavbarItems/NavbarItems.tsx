import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@mui/styles';
import { addChildToElement } from '@Redux/project/actions';
import { selectActiveItemChildren } from '@Redux/project/selectors/element';
import {
  selectCurrentScreenId,
  selectScreensWithoutMaster,
} from '@Redux/project/selectors/screen';
import {
  IconButton,
  Checkbox,
  MenuItem,
  FormControlLabel,
  FormLabel,
  lighten,
  Theme,
} from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';
import {
  StyledTextField,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledAccordion,
} from '@Components/styledComponents';
import NavbarItem from './NavbarItem';

const useStyles = makeStyles<Theme>(({ palette, spacing }) => ({
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
  },
  details: {
    padding: spacing(0.5),
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface Props {
  updateParams: any;
  element: any;
  canEdit: boolean;
}

const NavbarItems: React.FC<Props> = ({ updateParams, element, canEdit }) => {
  const {
    id,
    parameters: { titleName, titleLink, isLink, screenName, screenLink },
  } = element;
  const dispatch = useDispatch();
  const classes = useStyles();
  const navbarItem = useSelector(selectActiveItemChildren('navbarItem'));
  const currentScreenId = useSelector(selectCurrentScreenId);
  const [isValidURL, setValidURL] = useState(true);

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
    if (value) {
      const isValidURL =
        value.startsWith('https://') || value.startsWith('http://');
      setValidURL(isValidURL);
      if (isValidURL) {
        updateParams({ titleLink: value }, id);
      }
    } else {
      setValidURL(true);
    }
  }, 500);

  const [selectedScreen, selectScreen] = useState(screenName);
  const screens = useSelector(selectScreensWithoutMaster);

  const debouncedLinkedScreen = useDebouncedCallback((value, screenName) => {
    updateParams(
      {
        isLink: false,
        titleLink: '',
        screenLink: value,
        screenName,
      },
      id,
    );
  }, 500);

  const setElementScreen = (ev) => {
    const { value } = ev.target;
    if (value === 'noScreen') {
      selectScreen('noScreen');
      debouncedLinkedScreen.callback('', '');
    } else {
      const data = value.toString().split('-');
      const screenIds = data.shift();
      const screenName = data.join('-');
      selectScreen(`${screenIds}-${screenName}`);
      debouncedLinkedScreen.callback(screenIds, screenName);
    }
  };

  useEffect(() => {
    if (screenName && screenLink) {
      const selectdScreen = `${screenLink}-${screenName}`;
      selectScreen(selectdScreen);
    } else {
      selectScreen('noScreen');
    }
  }, [screenName, screenLink]);

  const handleCheckboxChange = (
    textId: string,
    { target: { checked } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (checked) {
      updateParams({ isLink: checked, screenLink: '', screenName: '' }, textId);
    } else {
      updateParams(
        { isLink: checked, titleLink: '', screenLink: '', screenName: '' },
        textId,
      );
    }
    selectScreen('noScreen');
  };

  return (
    <div>
      <StyledAccordion>
        <StyledAccordionSummary className={classes.title}>
          <div className={classes.wrapper}>Title navbar</div>
        </StyledAccordionSummary>

        <StyledAccordionDetails className={classes.details}>
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
          <FormControlLabel
            id={id}
            control={
              <Checkbox
                value="make link"
                name="make link"
                checked={isLink || false}
                onChange={(event) => handleCheckboxChange(id, event)}
                disabled={!canEdit}
              />
            }
            label="Make Link"
          />

          {isLink && (
            <StyledTextField
              variant="outlined"
              defaultValue={titleLink}
              onChange={(ev) => debouncedTitleLink.callback(ev.target.value)}
              label="Link"
              margin="dense"
              placeholder="https://www.google.com"
              fullWidth
              multiline
              disabled={!canEdit}
            />
          )}
          {isLink && !isValidURL && (
            <FormLabel id="error" component="label" error>
              Your link should be start with http:// or https://.
            </FormLabel>
          )}

          {!isLink && (
            <StyledTextField
              margin="dense"
              fullWidth
              label="Link with screen"
              onChange={setElementScreen}
              select
              value={selectedScreen || 'noScreen'}
            >
              <MenuItem value="noScreen" dense>
                Select Screen
              </MenuItem>
              {screens.map((data) => (
                <MenuItem
                  value={`${data?.project}/${data?.id}-${data?.name}`}
                  key={data?.id}
                  dense
                >
                  {data?.name}
                </MenuItem>
              ))}
            </StyledTextField>
          )}
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
