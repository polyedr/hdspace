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

const prevent = (ev: React.BaseSyntheticEvent) => {
  ev.stopPropagation();
  ev.preventDefault();
};

const useStyles = makeStyles(({ palette, shape }) =>
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

const HtmlImportForm: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [over, setOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const classes = useStyles({ over, file });

  const handleCreate = async () => {
    if (!file) return;
    const text = await file.text();
    console.log(text);
    onClose();
    setFile(null);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload your HTML file</DialogTitle>

      <DialogContent>
        <form
          onDrop={async (ev) => {
            prevent(ev);
            const file = ev.dataTransfer.files[0];
            if (file.type !== 'text/html') {
              dispatch(
                enqueueSnackbar({
                  message: 'Provide an HTML file please!',
                  options: { variant: 'error' },
                }),
              );
              return;
            }
            setFile(file);
            setOver(false);
          }}
          onDragEnter={(ev) => {
            prevent(ev);
            setOver(true);
          }}
          onDragLeave={(ev) => {
            prevent(ev);
            setOver(false);
          }}
          className={classes.form}
        >
          <label htmlFor="html-input" className={classes.label}>
            {file ? (
              <Card onClick={prevent}>
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
                    onClick={() => setFile(null)}
                    title="Remove"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            ) : (
              'Click or drop file here to upload'
            )}

            <input
              hidden
              id="html-input"
              accept="text/html"
              type="file"
              onChange={async (ev) => {
                const { files } = ev.target;
                if (files) {
                  setFile(files[0]);
                }
              }}
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
          disabled={!file}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HtmlImportForm;
