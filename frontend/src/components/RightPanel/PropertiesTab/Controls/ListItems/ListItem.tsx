import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { deleteItem } from '../../../../../redux/project/actions';
import { selectCurrentScreenId } from '../../../../../redux/project/selectors';

const useStyles = makeStyles({
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
});

type Props = {
  id: string;
  parameters: any;
  updateParams: any;
  isLast: boolean;
};

const ListItem: React.FC<Props> = ({
  id,
  parameters: { textContent, isLink, link },
  updateParams,
  isLast,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentScreenId = useSelector(selectCurrentScreenId);
  const [text, setText] = useState(textContent);
  const [debouncedText] = useDebounce(text, 500);
  useEffect(() => {
    updateParams({ textContent: debouncedText }, id);
  }, [debouncedText, updateParams, id]);

  const [linkText, setLinkText] = useState(link);
  const [debouncedLinkText] = useDebounce(linkText, 500);
  useEffect(() => {
    updateParams({ link: debouncedLinkText }, id);
  }, [debouncedLinkText, updateParams, id]);

  const handleDeleteButtonClick = (listItemID: string) => {
    dispatch(deleteItem(listItemID, { screenId: currentScreenId }));
  };

  const handleCheckboxChange = (
    listItemID: string,
    { target: { checked } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateParams({ isLink: checked }, listItemID);
  };
  return (
    <Accordion key={id}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className={classes.wrapper}>
          {textContent}

          {!isLast && (
            <IconButton
              title="Delete item"
              onClick={() => handleDeleteButtonClick(id)}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </AccordionSummary>

      <AccordionDetails className={classes.details}>
        <TextField
          variant="outlined"
          value={text}
          onChange={(ev) => setText(ev.target.value)}
          label="Item text"
          margin="dense"
          fullWidth
          multiline
        />

        <FormControlLabel
          control={
            <Checkbox
              value="make link"
              name="make link"
              checked={isLink}
              onChange={(event) => handleCheckboxChange(id, event)}
            />
          }
          label="Make Link"
        />

        {isLink && (
          <TextField
            variant="outlined"
            value={linkText}
            onChange={(ev) => setLinkText(ev.target.value)}
            label="Item URL"
            margin="dense"
            fullWidth
            multiline
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ListItem;
