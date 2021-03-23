import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  Tab,
  Tabs,
} from '@material-ui/core';
import { setNewScreenModal } from '@Redux/project/actions';
import { setUserGuideActive } from '@Redux/user/actions';
import { selectUserGuideWatched } from '@Redux/user/selectors';
import React, { ChangeEvent, FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectNewScreenModalOpen } from '@Redux/project/selectors/screen';
import HtmlImportForm from './HTMLImportForm';
import ImageRecognizeForm from './ImageRecognizeForm';

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

const NewScreenModal: FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const newScreenModalOpen = useSelector(selectNewScreenModalOpen);
  const userGuideWatched = useSelector(selectUserGuideWatched);

  const [value, setValue] = useState(0);

  const handleTabChange = (ev: ChangeEvent<{}>, newValue: number) =>
    setValue(newValue);

  const handleClose = () => {
    dispatch(setNewScreenModal(false));
    if (!userGuideWatched) {
      dispatch(setUserGuideActive(true));
    }
  };

  return (
    <Dialog
      open={newScreenModalOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
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
