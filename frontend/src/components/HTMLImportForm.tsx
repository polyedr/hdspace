import React, { useState } from 'react';
import { createStyles, Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { importHtml } from '@Redux/project/actions';

const prevent = (ev: React.BaseSyntheticEvent) => {
  ev.stopPropagation();
  ev.preventDefault();
};

const useStyles = makeStyles(({ palette, shape, spacing }) =>
  createStyles({
    form: {
      display: 'flex',
      justifyContent: 'stretch',
      alignItems: 'stretch',
      minHeight: 200,
    },
    label: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      border: ({ over }: any) =>
        `2px ${over ? 'solid' : 'dashed'} ${palette.primary.main}`,
      borderRadius: shape.borderRadius,
      opacity: ({ over, file }: any) => (over || file ? 1 : 0.5),
      backgroundColor: palette.grey.A100,
      transition: 'opacity 0.1s ease',
      '&:hover': {
        opacity: 1,
      },
      padding: spacing(1),
    },
    card: {
      margin: spacing(0, 1),
      maxWidth: 200,
      minWidth: 150,
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    field: {
      backgroundColor: '#ececec',
      padding: '0 0.5em',
      margin: '0.5em 0',
    },
  }),
);

type Props = {
  open: boolean;
  onClose: (...args: any) => any;
};

const allowedMimeTypes = ['text/html', 'text/css'];

const HtmlImportForm: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const classes = useStyles({ over, file: files });

  const handleCreate = () => {
    const htmlCount = files.reduce((acc, curr) => {
      if (curr.type === 'text/html') return acc + 1;
      return acc;
    }, 0);

    if (htmlCount !== 1) {
      dispatch(
        enqueueSnackbar({
          message: htmlCount
            ? 'Only one HTML file allowed'
            : `At least one HTML file required`,
          options: { variant: 'error' },
        }),
      );
      return;
    }
    dispatch(importHtml(files));
    onClose();
    setFiles([]);
  };

  const handleDrop = (ev: React.DragEvent<HTMLFormElement>) => {
    prevent(ev);
    const { files } = ev.dataTransfer;
    [...files].forEach((file) => {
      if (allowedMimeTypes.includes(file.type)) {
        setFiles((prevState) => [...prevState, file]);
      } else {
        dispatch(
          enqueueSnackbar({
            message: `Only ${allowedMimeTypes.join(' and ')} files allowed `,
            options: { variant: 'error' },
          }),
        );
      }
    });
    setOver(false);
  };

  const handleDragEnter = (ev) => {
    prevent(ev);
    setOver(true);
  };

  const handleDragLeave = (ev) => {
    prevent(ev);
    setOver(false);
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = ev.target;
    if (files) {
      setFiles([...files]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload your HTML file</DialogTitle>

      <DialogContent>
        <form
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={classes.form}
        >
          <label htmlFor="html-input" className={classes.label}>
            {files.length
              ? files.map((file) => (
                  <Card
                    onClick={prevent}
                    className={classes.card}
                    key={file.name}
                  >
                    <CardContent>
                      <Typography className={classes.field} variant="subtitle1">
                        {file.name}
                      </Typography>

                      <Typography className={classes.field} variant="caption">
                        {`${file.size} bytes`}
                      </Typography>
                    </CardContent>

                    <CardActions className={classes.actions}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setFiles((prevState) =>
                            prevState.filter((prev) => prev.name !== file.name),
                          )
                        }
                        title="Remove"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                ))
              : 'Click or drop file here to upload'}

            <input
              hidden
              id="html-input"
              accept={allowedMimeTypes.join(',')}
              type="file"
              onChange={handleChange}
              multiple
            />
          </label>
        </form>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleCreate}
          disabled={!files.length}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HtmlImportForm;
