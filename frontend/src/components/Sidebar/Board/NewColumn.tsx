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
import { createColumn } from '@Redux/pmtools/board/actions/columns';

export const NewColumn = ({ open, projectId, onClose }) => {
  const dispatch = useDispatch();

  const handleCreateColumn = useCallback(
    (values: any) => {
      dispatch(
        createColumn({
          title: values.title,
          colour: values.color.hex,
          projectId,
        }),
      );
      onClose();
    },
    [projectId, dispatch, createColumn, onClose],
  );

  return (
    <Dialog maxWidth="md" open={open} onClose={onClose}>
      <Form
        onSubmit={handleCreateColumn}
        initialValues={{
          title: '',
          color: createColor('#F3F4F6'),
        }}
        render={({ handleSubmit, values }) => (
          <>
            <DialogTitle>New Column</DialogTitle>
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
                Create
              </Button>
            </DialogActions>
          </>
        )}
      />
    </Dialog>
  );
};
