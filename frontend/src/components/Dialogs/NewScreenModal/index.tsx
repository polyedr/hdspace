import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  Theme,
} from '@mui/material';
import React, { ChangeEvent, FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { setNewScreenModal } from '@Redux/project/actions';
import { setUserGuideActive } from '@Redux/user/actions';
import { selectUserGuideWatched } from '@Redux/user/selectors';
import { selectNewScreenModalOpen } from '@Redux/project/selectors/screen';
import HtmlImportForm from './HTMLImportForm';
import ImageRecognizeForm from './ImageRecognizeForm';
import UseEditorForm from './UseEditorForm';

const useTabPanelStyles = makeStyles<Theme>(({ spacing, breakpoints }) => ({
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

const useStyles = makeStyles<Theme>(({ spacing }) => ({
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
  right: {
    textAlign: 'right',
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
            <Tab label="Create a screen using editor" />

            <Tab label="Import external site" />

            <Tab label="Recognize an image using neural network" />

            <Tab label="Import PSD, Adobe XD, Figma or Sketch" />
          </Tabs>

          <TabPanel value={value} index={0}>
            <UseEditorForm onClose={handleClose} />
          </TabPanel>

          <TabPanel value={value} index={1}>
            <HtmlImportForm onClose={handleClose} />
          </TabPanel>

          <TabPanel value={value} index={2}>
            <ImageRecognizeForm onClose={handleClose} />
          </TabPanel>

          <TabPanel value={value} index={3}>
            <div className={classes.coming}>This feature is coming soon</div>
            <div className={classes.right}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClose}
              >
                Ok
              </Button>
            </div>
          </TabPanel>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default NewScreenModal;
