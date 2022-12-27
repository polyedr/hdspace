import React, { useState, useEffect } from 'react';
import {
  Checkbox,
  IconButton,
  FormControlLabel,
  MenuItem,
  FormLabel,
} from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { deleteElement } from '@Redux/project/actions';
import {
  selectCurrentScreenId,
  selectScreensWithoutMaster,
} from '@Redux/project/selectors/screen';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledTextField,
} from '@Components/styledComponents';

const useStyles = makeStyles(({ palette, spacing }) => ({
  title: {
    '& .MuiAccordionSummary-content': {
      padding: '0.5em 1em',
    },
  },
  details: {
    padding: spacing(0.5),
    display: 'flex',
    flexDirection: 'column',
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
  wrapperCheckbox: {
    display: 'flex',
  },
}));

interface Props {
  id: string;
  parameters: any;
  updateParams: any;
  isLast: boolean;
  canEdit: boolean;
}

const PaginationItem: React.FC<Props> = ({
  id,
  parameters: {
    textContent,
    isActiveLink,
    isLink,
    link,
    screenName,
    screenLink,
  },
  updateParams,
  isLast,
  canEdit,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentScreenId = useSelector(selectCurrentScreenId);

  const [selectedScreen, selectScreen] = useState(screenName);
  const screens = useSelector(selectScreensWithoutMaster);
  const [isValidURL, setValidURL] = useState(true);
  const debouncedText = useDebouncedCallback((value) => {
    updateParams({ textContent: value }, id);
  }, 500);

  const debouncedLink = useDebouncedCallback((value) => {
    if (value) {
      const isValidURL =
        value.startsWith('https://') || value.startsWith('http://');
      setValidURL(isValidURL);
      if (isValidURL) {
        updateParams({ link: value, screenLink: '', screenName: '' }, id);
      }
    } else {
      setValidURL(true);
    }
  }, 500);

  const debouncedLinkedScreen = useDebouncedCallback((value, screenName) => {
    updateParams(
      { isLink: false, link: '', screenLink: value, screenName },
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

  const handleDeleteButtonClick = () => {
    dispatch(deleteElement(id, { screenId: currentScreenId }));
  };

  const handleCheckboxChange = (
    listItemID: string,
    { target: { checked } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (checked) {
      updateParams(
        { isLink: checked, screenLink: '', screenName: '' },
        listItemID,
      );
    } else {
      updateParams(
        { isLink: checked, link: '', screenLink: '', screenName: '' },
        listItemID,
      );
    }
    selectScreen('noScreen');
  };

  useEffect(() => {
    if (screenName && screenLink) {
      const selectdScreen = `${screenLink}-${screenName}`;
      selectScreen(selectdScreen);
    } else {
      selectScreen('noScreen');
    }
  }, [screenName, screenLink]);

  const handleCheckboxActiveLink = (
    listItemID: string,
    { target: { checked } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateParams({ isActiveLink: checked }, listItemID);
  };
  return (
    <StyledAccordion>
      <StyledAccordionSummary className={classes.title}>
        <div className={classes.wrapper}>
          {textContent}

          {!isLast && canEdit && (
            <IconButton
              title="Delete item"
              onClick={handleDeleteButtonClick}
              size="small"
              color="primary"
              className={classes.iconButton}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </StyledAccordionSummary>

      <StyledAccordionDetails className={classes.details}>
        <StyledTextField
          variant="outlined"
          defaultValue={textContent}
          onChange={(ev) => debouncedText.callback(ev.target.value)}
          label="Item text"
          margin="dense"
          fullWidth
          multiline
          disabled={!canEdit}
        />

        <FormControlLabel
          control={
            <Checkbox
              value="active link"
              name="active link"
              checked={isActiveLink}
              onChange={(event) => handleCheckboxActiveLink(id, event)}
              disabled={!canEdit}
            />
          }
          label="Active Link"
        />

        <FormControlLabel
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
            defaultValue={link}
            onChange={(ev) => debouncedLink.callback(ev.target.value)}
            label="Item URL"
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
  );
};

export default PaginationItem;
