import React, { useState, ChangeEvent } from 'react';
import { createStyles, TextField } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { importHtml, uploadImportUrl } from '@Redux/project/actions';
import prettyBytes from 'pretty-bytes';
import prevent from '@Utils/preventEvent';

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
      backgroundColor: palette.grey[100],
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
    formActions: {
      padding: spacing(2, 0),
      textAlign: 'right',
      '& > *': {
        margin: spacing(0, 0.5),
      },
    },
    placeholder: {
      color: palette.grey[700],
    },
  }),
);

type Props = {
  onClose: (...args: any) => any;
};

const allowedMimeTypes = [
  'text/html',
  'text/css',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const HtmlImportForm: React.FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch();
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const classes = useStyles({ over, file: files });

  const [url, setUrl] = useState('');

  const handleUrlChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setUrl(value);
  };

  const handleUrlSubmit = () => {
    dispatch(uploadImportUrl(url));
    setUrl('');
  };

  const handleFormSubmit = () => {
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
    setFiles([]);
  };

  const handleConfirm = () => {
    if (url) {
      handleUrlSubmit();
    } else {
      handleFormSubmit();
    }
    onClose();
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
      setFiles((prevState) => [...prevState, ...files]);
    }
  };

  return (
    <div>
      <h3>Provide a URL</h3>

      <div>
        <TextField
          type="text"
          value={url}
          onChange={handleUrlChange}
          variant="outlined"
          fullWidth
          margin="dense"
          placeholder="URL"
        />
      </div>

      <h3>Or upload an HTML and CSS files</h3>

      <div>
        <form
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={classes.form}
        >
          <label htmlFor="html-input" className={classes.label}>
            {files.length ? (
              files.map((file) => (
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
                      {`${prettyBytes(file.size)}`}
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
            ) : (
              <div className={classes.placeholder}>
                Click or drop file here to upload
              </div>
            )}

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
      </div>

      <div className={classes.formActions}>
        <Button variant="contained" color="primary" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleConfirm}
          disabled={!files.length && !url}
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default HtmlImportForm;
