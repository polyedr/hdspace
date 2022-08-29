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
    <Dialog maxWidth="md" open={open} onClose={onClose}>
      <Form
        onSubmit={handleUpdateColumn}
        initialValues={{
          title: column.title,
          color: column.colour || createColor('#F3F4F6'),
        }}
        render={({ handleSubmit, values }) => (
          <>
            <DialogTitle>Edit Column</DialogTitle>
            <DialogContent>
              <Field name="title">
                {(props) => (
                  <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Name"
                    fullWidth
                    variant="outlined"
                    {...props.input}
                  />
                )}
              </Field>

              <Field name="color">
                {({ input: { onChange, value, ...inputProps } }) => (
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ColorPicker
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
                        </InputAdornment>
                      ),
                    }}
                    margin="dense"
                    id="color"
                    label="Color"
                    fullWidth
                    variant="outlined"
                    disabled
                    value={value.hex}
                    {...inputProps}
                  />
                )}
              </Field>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                disabled={!values.title || values.title.trim().length < 1}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </DialogActions>
          </>
        )}
      />
    </Dialog>
  );
};
