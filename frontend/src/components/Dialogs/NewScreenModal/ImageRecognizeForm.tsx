import React, { FC, useState, MouseEvent } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import useNNProcessing from '@Utils/nn/hooks/useNNProcessing';
import { NNBlockType } from '@Src/types';
import { useSelector } from 'react-redux';
import { selectCurrentRootId } from '@Redux/project/selectors/element';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ spacing, palette }) => ({
  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  content: {
    flex: 1,
    display: 'flex',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing(1),
  },
  imageContainer: {
    flex: 1,
    border: `1px solid ${palette.grey[300]}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
  },
  image: {
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
  },
  actions: {
    padding: spacing(2, 0),
    textAlign: 'right',
    '& > *': {
      margin: spacing(0, 0.5),
    },
  },
  placeholder: {
    color: palette.grey[500],
  },
}));

interface Props {
  onClose: (...args: any) => void;
}

const ImageRecognizeForm: FC<Props> = ({ onClose }) => {
  const classes = useStyles();

  const rootId = useSelector(selectCurrentRootId);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [file, setFile] = useState<File | null>(null);

  const handleNNProcessing = useNNProcessing(rootId, NNBlockType.WEBPAGE, file);

  return (
    <div className={classes.wrapper}>
      <div className={classes.content}>
        <div className={classes.inputContainer}>
          <h3>Select an image to recognize</h3>

          <input
            onChange={(ev) => setFile(ev.target.files?.[0] || null)}
            accept="image/*"
            style={{ display: 'none' }}
            id="fileinput-recognize-image"
            multiple
            type="file"
          />

          <label htmlFor="fileinput-recognize-image">
            <Button variant="contained" component="span">
              Upload
            </Button>
          </label>
        </div>

        <div className={classes.imageContainer}>
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="uploaded"
              className={classes.image}
            />
          ) : (
            <div className={classes.placeholder}>No image selected</div>
          )}
        </div>
      </div>

      <div className={classes.actions}>
        <Button variant="contained" color="primary" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleMenuOpen}
          disabled={!file}
        >
          Create
        </Button>

        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              handleNNProcessing(false);
              handleClose();
              onClose();
            }}
          >
            Semi Auto
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default ImageRecognizeForm;
