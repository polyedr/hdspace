import React from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import DeleteIcon from '@mui/icons-material/Delete';
import { lighten, Theme, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { StyledTextField } from '@Components/styledComponents';

const useStyles = makeStyles<Theme>(({ palette }) => ({
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
}));

type Props = {
  id: string;
  textContent: string;
  updateParams: any;
  deleteChildFromElement: any;
  isLast: boolean;
  canEdit: boolean;
};

const DropdownItem: React.FC<Props> = ({
  id,
  textContent,
  updateParams,
  deleteChildFromElement,
  isLast,
  canEdit,
}) => {
  const classes = useStyles();
  const currentScreenId = useSelector(selectCurrentScreenId);

  const debounced = useDebouncedCallback((value) => {
    updateParams({ textContent: value }, id);
  }, 500);

  const handleDeleteButtonClick = (dropdownItemID: string) => {
    deleteChildFromElement(dropdownItemID, { screenId: currentScreenId });
  };

  return (
    <div className={classes.wrapper}>
      <StyledTextField
        variant="outlined"
        defaultValue={textContent || ''}
        onChange={(ev) => debounced.callback(ev.target.value)}
        label="Item text"
        margin="dense"
        fullWidth
        multiline
        disabled={!canEdit}
      />

      {!isLast && canEdit && (
        <IconButton
          title="Delete item"
          onClick={() => handleDeleteButtonClick(id)}
          size="small"
          className={classes.iconButton}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );
};

export default DropdownItem;
