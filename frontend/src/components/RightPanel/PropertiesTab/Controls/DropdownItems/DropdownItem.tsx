import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { selectCurrentScreenId } from '../../../../../redux/project/selectors';

const useStyles = makeStyles({
  wrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

type Props = {
  id: string;
  textContent: string;
  updateParams: any;
  deleteChildFromElement: any;
  isLast: boolean;
};

const DropdownItem: React.FC<Props> = ({
  id,
  textContent,
  updateParams,
  deleteChildFromElement,
  isLast,
}) => {
  const classes = useStyles();
  const currentScreenId = useSelector(selectCurrentScreenId);

  const [text, setText] = useState(textContent);
  const [debouncedText] = useDebounce(text, 500);

  useEffect(() => {
    updateParams({ textContent: debouncedText }, id);
  }, [debouncedText, updateParams, id]);

  const handleDeleteButtonClick = (dropdownItemID: string) => {
    deleteChildFromElement(dropdownItemID, { screenId: currentScreenId });
  };

  return (
    <div className={classes.wrapper}>
      <TextField
        variant="outlined"
        value={text}
        onChange={(ev) => setText(ev.target.value)}
        label="Item text"
        margin="dense"
        fullWidth
        multiline
      />

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
  );
};

export default DropdownItem;
