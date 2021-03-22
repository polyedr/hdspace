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

const useTabPanelStyles = makeStyles(({ breakpoints, spacing }) => ({
  tabPanel: {
    flex: 1,
    padding: spacing(2),
    width: '100%',
    maxWidth: breakpoints.values.sm,
    margin: 'auto',
    display: ({ active }: any) => (active ? 'flex' : 'none'),
    flexDirection: 'column',
  },
}));

const useStyles = makeStyles(({ spacing }) => ({
  dialogContent: {
    minHeight: '50vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  paper: {
    padding: spacing(2),
  },
  coming: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const TabPanel: FC<{ index: number; value: number }> = ({
  index,
  value,
  children,
}) => {
  const active = index === value;
  const classes = useTabPanelStyles({ active });

  return <div className={classes.tabPanel}>{children}</div>;
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

            <Tab label="Import PSD, Adobe XD, Figma or Sketch" />
          </Tabs>

          <TabPanel value={value} index={0}>
            <HtmlImportForm onClose={handleClose} />
          </TabPanel>

          <TabPanel value={value} index={1}>
            <ImageRecognizeForm onClose={handleClose} />
          </TabPanel>

          <TabPanel value={value} index={2}>
            <div className={classes.coming}>This feature is coming soon</div>
          </TabPanel>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default NewScreenModal;
