import React, { useCallback } from 'react';
import { Field, Form } from 'react-final-form';
import { makeStyles } from '@material-ui/core/styles';

import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';

import { useDispatch } from 'react-redux';
import { uploadIcoScreen } from '@Redux/project/actions';

interface Props {
  open: boolean;
  titleDialog: string;
  onSubmit: (...args: any) => void;
  onClose: () => void;
  withoutField?: boolean;
  fieldName?: string;
  initialValueName?: any;
  initialValueTags?: any;
  type?: string;
  validation?: any;
  currentScreenId: number;
  project: number;
}
const useStyles = makeStyles({
  dialogTitle: {
    padding: '0',
    marginTop: '10px',
    marginBottom: '2px',
    textAlign: 'center',
  },
  favicon: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '-8px',
  },
});
const ScreenEditDialog: React.FC<Props> = ({
  open,
  titleDialog,
  onSubmit,
  onClose,
  initialValueName,
  initialValueTags: {
    title,
    description,
    keywords,
    viewport,
    author,
    refresh,
    faviconUrl,
  },
  withoutField = false,
  type,
  validation,
  currentScreenId,
  project,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const handleChangeFileInput = useCallback(
    (event) => {
      const file = event.target.files[0];

      if (file.size > 5242880) {
        // eslint-disable-next-line no-alert
        alert('Choose image up to 5Mb!');
      } else {
        dispatch(uploadIcoScreen(file, project, currentScreenId));
      }
    },
    [dispatch, currentScreenId, project],
  );
  const deleteFavicon = () => {
    dispatch(uploadIcoScreen(null, project, currentScreenId));
  };
  return (
    <MuiDialog open={open} onClose={onClose}>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <DialogTitle className={classes.dialogTitle}>
              {titleDialog}
            </DialogTitle>
            <DialogContent>
              {!withoutField && (
                <>
                  <Field
                    name="name"
                    initialValue={initialValueName}
                    validate={validation}
                  >
                    {({ input }) => (
                      <TextField
                        autoFocus
                        required
                        label="name screen"
                        variant="outlined"
                        margin="dense"
                        type={type || 'text'}
                        fullWidth
                        {...input}
                        style={{ marginTop: '0' }}
                      />
                    )}
                  </Field>
                  <DialogTitle className={classes.dialogTitle}>
                    Upload favicon
                  </DialogTitle>
                  <label
                    htmlFor="contained-button-file"
                    className={classes.favicon}
                  >
                    <input
                      accept="image/x-icon"
                      type="file"
                      hidden
                      id="contained-button-file"
                      onChange={handleChangeFileInput}
                    />
                    <Tooltip title="Delete" arrow>
                      <IconButton aria-label="delete" onClick={deleteFavicon}>
                        <DeleteIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Upload" arrow>
                      <IconButton
                        aria-label="upload"
                        component="span"
                        style={{ marginRight: '10px' }}
                      >
                        <CloudUploadIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                    {faviconUrl ? (
                      <img
                        src={faviconUrl}
                        width={40}
                        height={40}
                        alt="favicon"
                      />
                    ) : null}
                  </label>

                  <DialogTitle className={classes.dialogTitle}>
                    Screen metatags
                  </DialogTitle>
                  <Field
                    name="title"
                    validate={validation}
                    initialValue={title}
                  >
                    {({ input }) => (
                      <TextField
                        label="title"
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        placeholder="Page title"
                        type={type || 'text'}
                        {...input}
                        style={{ marginTop: '12' }}
                      />
                    )}
                  </Field>
                  <Field
                    name="description"
                    validate={validation}
                    initialValue={description}
                  >
                    {({ input }) => (
                      <TextField
                        label="description"
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        placeholder="Short description of the page"
                        type={type || 'text'}
                        {...input}
                        style={{ marginTop: '12px' }}
                      />
                    )}
                  </Field>
                  <Field
                    name="keywords"
                    validate={validation}
                    initialValue={keywords}
                  >
                    {({ input }) => (
                      <TextField
                        label="keywords"
                        variant="outlined"
                        margin="dense"
                        type={type || 'text'}
                        fullWidth
                        placeholder="List of keywords"
                        {...input}
                        style={{ marginTop: '12px' }}
                      />
                    )}
                  </Field>

                  <Field
                    name="viewport"
                    validate={validation}
                    initialValue={viewport}
                  >
                    {({ input }) => (
                      <TextField
                        label="viewport"
                        variant="outlined"
                        margin="dense"
                        type={type || 'text'}
                        fullWidth
                        placeholder="Setting the viewport to make your website look good on all devices"
                        {...input}
                        style={{ marginTop: '12px' }}
                      />
                    )}
                  </Field>

                  <Field
                    name="author"
                    validate={validation}
                    initialValue={author}
                  >
                    {({ input }) => (
                      <TextField
                        label="author"
                        variant="outlined"
                        margin="dense"
                        type={type || 'text'}
                        fullWidth
                        placeholder="Define the author of a page"
                        {...input}
                        style={{ marginTop: '12px' }}
                      />
                    )}
                  </Field>

                  <Field
                    name="refresh"
                    validate={validation}
                    initialValue={refresh}
                  >
                    {({ input }) => (
                      <TextField
                        label="refresh"
                        variant="outlined"
                        margin="dense"
                        type={type || 'text'}
                        fullWidth
                        placeholder="Page refresh interval in seconds"
                        {...input}
                        style={{ marginTop: '12px' }}
                      />
                    )}
                  </Field>
                </>
              )}

              <DialogActions>
                <Button onClick={onClose} color="primary" variant="contained">
                  Cancel
                </Button>

                <Button type="submit" color="secondary" variant="contained">
                  Confirm
                </Button>
              </DialogActions>
            </DialogContent>
          </form>
        )}
      />
    </MuiDialog>
  );
};

export default ScreenEditDialog;
