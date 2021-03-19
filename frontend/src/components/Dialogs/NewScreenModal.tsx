import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  Tab,
  Tabs,
} from '@material-ui/core';
import { setNewScreenModal } from '@Redux/project/actions';
import React, { ChangeEvent, FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import HtmlImportForm from './HTMLImportForm';
import ImageRecognizeForm from './ImageRecognizeForm';

type Props = {
  open: boolean;
};

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  dialogContent: {
    minHeight: '50vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  tabPanel: {
    flex: 1,
    padding: spacing(2),
    width: '100%',
    maxWidth: breakpoints.values.sm,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
    padding: spacing(2),
  },
}));

const TabPanel: FC<{ index: number; value: number }> = ({
  index,
  value,
  children,
}) => {
  const classes = useStyles();

  return index === value ? (
    <div className={classes.tabPanel}>{children}</div>
  ) : null;
};

const NewScreenModal: FC<Props> = ({ open }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [value, setValue] = useState(0);

  const handleTabChange = (ev: ChangeEvent<{}>, newValue: number) =>
    setValue(newValue);

  const handleClose = () => dispatch(setNewScreenModal(false));

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <div>
        <DialogTitle>Choose the option to create a new screen</DialogTitle>

        <DialogContent className={classes.dialogContent}>
          <Tabs value={value} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Import external site" />

            <Tab label="Recognize an image using neural network" />

            <Tab label="Import Adobe XD, Figma or Sketch" />
          </Tabs>

          <TabPanel value={value} index={0}>
            <HtmlImportForm onClose={handleClose} />
          </TabPanel>

          <TabPanel value={value} index={1}>
            <ImageRecognizeForm onClose={handleClose} />
          </TabPanel>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default NewScreenModal;
