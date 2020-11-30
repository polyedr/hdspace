import React, { useState } from 'react';
import { createStyles, Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(({ palette }) =>
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
      border: `1px dashed ${palette.text.primary}`,
      opacity: 0.5,
      backgroundColor: ({ over }: any) =>
        over ? palette.success.main : palette.grey.A100,
      transition: 'opacity 0.1s ease',
      '&:hover': {
        opacity: 1,
      },
    },
  }),
);

type Props = {
  open: boolean;
  onClose: (...args: any) => any;
};

const HtmlImportForm: React.FC<Props> = ({ open, onClose }) => {
  const [over, setOver] = useState(false);
  const classes = useStyles({ over });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload your HTML file</DialogTitle>

      <DialogContent>
        <form
          onDrop={async (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            const content = await ev.dataTransfer.files[0].text();
            console.log(content);
          }}
          onDragEnter={(ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            console.log(ev.dataTransfer);
            setOver(true);
          }}
          onDragLeave={(ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            setOver(false);
          }}
          className={classes.form}
        >
          <label htmlFor="html-input" className={classes.label}>
            Click or drop file here to upload
            <input
              hidden
              id="html-input"
              accept="text/html"
              type="file"
              onChange={async (ev) => {
                const { files } = ev.target;
                if (files) {
                  const content = await files[0].text();
                  console.log(content);
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

        <Button variant="contained" color="secondary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HtmlImportForm;
