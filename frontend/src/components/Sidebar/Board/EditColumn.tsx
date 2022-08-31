import React, { useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Form, Field } from 'react-final-form';
import { ColorPicker, createColor } from 'material-ui-color';
import { useDispatch } from 'react-redux';
import { updateColumn } from '@Redux/pmtools/board/actions/columns';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const StyledDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    minWidth: '420px',
    borderRadius: 6,
  },

  '& .InputLabel': {
    marginBottom: 3,
  },
});

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#81818E',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E4E6EB !important',
    },
    '&:hover fieldset': {
      borderColor: 'var(--blue)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#E4E6EB',
    },
  },
});

const StyledInputAdornment = styled(InputAdornment)({
  '& button': {
    width: '16px',
    height: '16px',
    minWidth: 'auto',
    margin: 0,

    '& .MuiButton-label div': {
      width: '16px',
      height: '16px',
      minWidth: 'auto',
      borderRadius: 2,
    },
  },
});

const StyledColorPicker = styled(ColorPicker)({
  '& .MuiBox-root': {
    width: '267px',
  },
});

export const EditColumn = ({ open, onClose, column }) => {
  const dispatch = useDispatch();

  const handleUpdateColumn = useCallback(
    (values: any) => {
      dispatch(
        updateColumn(
          { title: values.title, colour: values.color.hex },
          column.id,
        ),
      );
      onClose();
    },
    [column, dispatch, updateColumn, onClose],
  );

  return (
    <StyledDialog maxWidth="md" open={open} onClose={onClose}>
      <Form
        onSubmit={handleUpdateColumn}
        initialValues={{
          title: column.title,
          color: column.colour
            ? createColor(`#${column.colour}`)
            : createColor('#F3F4F6'),
        }}
        render={({ handleSubmit, values }) => (
          <>
            <DialogTitle sx={{ pb: 1, fontSize: 18, fontWeight: 600 }}>
              Edit Column
              {onClose ? (
                <IconButton
                  aria-label="close"
                  onClick={onClose}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              ) : null}
            </DialogTitle>
            <DialogContent>
              <Field name="title">
                {(props) => (
                  <StyledTextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Column Name"
                    size="small"
                    fullWidth
                    variant="outlined"
                    {...props.input}
                  />
                )}
              </Field>

              <p className="InputLabel">Select the column color</p>
              <Field name="color">
                {({ input: { onChange, value, ...inputProps } }) => (
                  <StyledTextField
                    InputProps={{
                      startAdornment: (
                        <StyledInputAdornment position="start">
                          <StyledColorPicker
                            disableAlpha
                            value={value}
                            onChange={(color) =>
                              onChange({
                                target: {
                                  value: color,
                                },
                              })
                            }
                            hideTextfield
                          />
                        </StyledInputAdornment>
                      ),
                    }}
                    margin="dense"
                    id="color"
                    size="small"
                    fullWidth
                    variant="outlined"
                    disabled
                    value={value.hex}
                    {...inputProps}
                  />
                )}
              </Field>
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 24px' }}>
              <Button
                onClick={onClose}
                variant="text"
                size="small"
                sx={{
                  p: '8px 16px',
                  textTransform: 'capitalize',
                  fontSize: 14,
                  color: '#81818E',
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={!values.title || values.title.trim().length < 1}
                onClick={handleSubmit}
                variant="contained"
                size="small"
                sx={{
                  p: '8px 16px',
                  backgroundColor: 'var(--blue)',
                  textTransform: 'capitalize',
                  fontSize: 14,
                }}
              >
                Save
              </Button>
            </DialogActions>
          </>
        )}
      />
    </StyledDialog>
  );
};
