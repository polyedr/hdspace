import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { styled } from '@mui/material/styles';
import { createStyles, darken, makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import {
  selectProfileData,
  selectSubscriptionData,
  selectUserData,
  selectUserGuideWatched,
} from '@Redux/user/selectors';
import {
  changeProfileData,
  setUserExperience,
  sendResetPasswordMail,
  changeUserData,
  changeProfileAvatar,
} from '@Redux/user/actions';
import { ROLES } from '@Constants/defaultParams';
import { Experience, ProfileData } from '@Src/types';
import {
  Typography,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Switch,
  Tab,
  Tabs,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
} from '@material-ui/core';
import ImageCropper from '@Components/CropImage';
import { useHistory } from 'react-router';
import { Avatar } from '@mui/material';
import { getSubscriptionData } from '@Redux/permissions/actions';
import { isRequired } from '@Utils/validators';
import SubmitError from '../SubmitError';
import { SubscriptionCard } from './SubscriptionCard';

const useStyles = makeStyles((theme) =>
  createStyles({
    headerContainer: {
      paddingTop: theme.spacing(2),
      borderBottom: '1px solid #E7EAEC',
    },
    header: {
      fontWeight: 'bold',
    },
    formsContainer: {
      maxWidth: 900,
    },
    textFieldsContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      flex: 1,
      marginTop: '20px',
    },
    profileForm: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    profileImageWrapper: {
      '& img': {
        height: 102,
        width: 102,
        objectFit: 'contain',
      },
    },
    imageInputLabel: {
      fontSize: '11px',
    },
    profileImageActions: {
      width: '100%',
      maxWidth: '102px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    imageActionButton: {
      fontSize: '11px',
      padding: theme.spacing(0.5),
      border: 'none',
      borderRadius: '3px',
      marginTop: theme.spacing(1),
      cursor: 'pointer',
      backgroundColor: '#efefef',
      '&:hover, &:focus': {
        backgroundColor: darken('#efefef', 0.1),
      },
    },
    hidden: {
      display: 'none',
    },
    settingsPart: {
      padding: `${theme.spacing(1)}px 0`,
    },
    subheader: {
      marginBottom: 10,
    },
    strong: {
      fontWeight: 'bold',
    },
    error: {
      margin: theme.spacing(1),
    },
    link: {
      '&, &:active, &:visited, &:focus': {
        color: theme.palette.primary.light,
      },
      textDecoration: 'none',
    },
    buttonsWrapper: {
      '& button + button': {
        marginLeft: theme.spacing(1),
      },
    },
    tabList: {
      '& button + button': {
        marginLeft: theme.spacing(4),
      },
    },
    avatar: {
      fontSize: '34px',
    },
  }),
);

const TabPanel = ({ children, value, index, ...rest }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...rest}
    >
      {value === index && children}
    </div>
  );
};

const TabStyle = styled(Tab)(({ theme }) => ({
  minWidth: 'unset',
  padding: theme.spacing(1),
  paddingLeft: 0,
}));

const TabPanelStyle = styled(TabPanel)(({ theme }) => ({
  padding: `${theme.spacing(3)}px 0`,
}));

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const Profile: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [imageToCrop, setImageToCrop] = useState<any>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const imageRef = useRef(null);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  useEffect(() => {
    dispatch(getSubscriptionData());
  }, []);

  const handleClose = () => {
    setDialogOpen(false);
    setCancelDialogOpen(false);
  };

  const userData = useSelector(selectUserData);

  const { firstName, lastName, email, profile, username } = userData;
  const {
    parameters: {
      profileDataParameters: { autoSwitchTabs, dropTargetBordersMode },
    },
  } = profile;
  const {
    role,
    parameters: { avatarCrop },
  } = useSelector(selectProfileData);
  const userGuideWatched = useSelector(selectUserGuideWatched);

  const [formData, setFormData] = useState<any>();
  const [autoSwitch, setAutoSwitch] = useState<boolean>(autoSwitchTabs);
  const [dropTargetBorders, setDropTargetBorders] = useState<boolean>(
    dropTargetBordersMode,
  );
  const [userGuide, setUserGuide] = useState<boolean>(userGuideWatched);

  const handleChangeProfileData = async (values: any) => {
    if (
      Object.entries(values).some(
        ([key, value]) => value !== userData[key as keyof ProfileData],
      )
    ) {
      dispatch(changeProfileData(values));
    }
  };
  const userSubscriptionData = useSelector(selectSubscriptionData);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file, file.name);

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const image = reader.result;
      setImageToCrop(image);
    });

    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSaved = () => {
    if (imageRef.current) {
      dispatch(changeProfileAvatar(imageRef.current));
    }
    setImageToCrop(undefined);
  };

  const removeProfileImage = () => {
    handleClose();
    handleChangeProfileData({
      avatar: null,
      parameters: {
        avatarCrop: null,
      },
    });
  };

  const fieldValidate = (value) => {
    const isValid = /^[a-zA-Z]+$/.test(value);
    let result: string | undefined;
    if (!isValid) {
      result = 'Symbols and Numbers are not allowed!';
    }
    return result;
  };

  const handlePwdChange = () => {
    dispatch(sendResetPasswordMail(email));
  };

  const handleFormSubmit = (values) => {
    setFormData(values);
  };

  const handleUpdate = () => {
    const newEx = userGuide ? Experience.EXPERIENCED : Experience.BEGINNER;

    dispatch(setUserExperience(newEx));

    dispatch(
      changeProfileData({
        experienced: newEx,
        parameters: {
          profileDataParameters: {
            dropTargetBordersMode: dropTargetBorders,
            autoSwitchTabs: autoSwitch,
          },
        },
      } as ProfileData),
    );

    if (formData) {
      dispatch(changeUserData(formData));
    }
  };

  const handleSetCroppedImage = useCallback((_, imageBlob) => {
    imageRef.current = imageBlob;
  }, []);

  const handleCancel = () => {
    history.go(0);
  };

  return (
    <main>
      <Container>
        <div className={classes.headerContainer}>
          <Typography variant="h4" className={classes.header}>
            Profile settings
          </Typography>
          <Tabs
            value={activeTab}
            className={classes.tabList}
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            <TabStyle label="Profile" {...a11yProps(0)} />
            <TabStyle label="Subscription" {...a11yProps(1)} />
            <TabStyle label="Security" {...a11yProps(2)} />
            <TabStyle label="UI settings" {...a11yProps(3)} />
          </Tabs>
        </div>
        <TabPanelStyle value={activeTab} index={0}>
          <div className={classes.formsContainer}>
            <Form
              onSubmit={handleChangeProfileData}
              render={({ handleSubmit }) => (
                <form
                  onSubmit={handleSubmit}
                  className={classes.profileImageWrapper}
                >
                  <div className={classes.imageInputLabel}>Your photo</div>

                  <Avatar
                    sx={{ bgcolor: '#344AF0', width: 100, height: 100 }}
                    alt={username}
                    src={profile.avatar ?? undefined}
                  >
                    <div className={classes.avatar}>
                      {username[0].toUpperCase()}
                    </div>
                  </Avatar>

                  {imageToCrop && (
                    <>
                      <ImageCropper
                        imageToCrop={imageToCrop}
                        setResult={handleSetCroppedImage}
                      />
                      <div>
                        <button type="button" onClick={handleSaved}>
                          Saved
                        </button>
                      </div>
                    </>
                  )}

                  <div className={classes.profileImageActions}>
                    <label className={classes.imageActionButton}>
                      Upload
                      <Field
                        name="avatar"
                        render={({ input }) => {
                          return (
                            <input
                              {...input}
                              type="file"
                              accept=".png, .jpeg"
                              onChange={handleImageUpload}
                              className={classes.hidden}
                            />
                          );
                        }}
                      />
                    </label>
                    <button
                      className={classes.imageActionButton}
                      type="button"
                      onClick={handleDialogOpen}
                      disabled={!avatarCrop}
                    >
                      Remove
                    </button>
                  </div>
                </form>
              )}
            />
            <div className={classes.textFieldsContainer}>
              <Form
                initialValues={{
                  first_name: firstName,
                  last_name: lastName,
                  role,
                  email,
                }}
                onSubmit={handleFormSubmit}
                render={({ handleSubmit, submitError }) => (
                  <>
                    <div className={classes.error}>
                      <SubmitError name="detail" />

                      {submitError && (
                        <Alert severity="error" variant="filled">
                          {submitError}
                        </Alert>
                      )}
                    </div>
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={4}>
                        <Grid container item spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Field name="first_name" validate={isRequired}>
                              {({ input, meta }) => (
                                <TextField
                                  {...input}
                                  onBlur={handleSubmit}
                                  InputLabelProps={{
                                    htmlFor: 'first_name_input',
                                  }}
                                  InputProps={{
                                    id: 'first_name_input',
                                  }}
                                  type="text"
                                  fullWidth
                                  label="First Name"
                                  placeholder="First Name"
                                  variant="outlined"
                                  size="small"
                                  error={
                                    (meta.error || meta.submitError) &&
                                    meta.touched
                                  }
                                  helperText={
                                    (meta.error || meta.submitError) &&
                                    meta.touched
                                      ? meta.error || meta.submitError
                                      : null
                                  }
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field name="last_name" validate={isRequired}>
                              {({ input, meta }) => (
                                <TextField
                                  {...input}
                                  onBlur={handleSubmit}
                                  placeholder="Last Name"
                                  type="text"
                                  fullWidth
                                  label="Last Name"
                                  variant="outlined"
                                  size="small"
                                  error={
                                    (meta.error || meta.submitError) &&
                                    meta.touched
                                  }
                                  helperText={
                                    (meta.error || meta.submitError) &&
                                    meta.touched
                                      ? meta.error || meta.submitError
                                      : null
                                  }
                                />
                              )}
                            </Field>
                          </Grid>
                        </Grid>
                        <Grid container item spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Field name="company_name" validate={fieldValidate}>
                              {({ input, meta }) => (
                                <TextField
                                  {...input}
                                  onBlur={handleSubmit}
                                  placeholder="Company Name"
                                  type="text"
                                  fullWidth
                                  label="Company Name"
                                  variant="outlined"
                                  size="small"
                                  error={
                                    (meta.error || meta.submitError) &&
                                    meta.touched
                                  }
                                  helperText={
                                    (meta.error || meta.submitError) &&
                                    meta.touched
                                      ? meta.error || meta.submitError
                                      : null
                                  }
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field name="role" defaultValue={role}>
                              {({ input, meta }) => (
                                <FormControl
                                  fullWidth
                                  error={
                                    (meta.error || meta.submitError) &&
                                    meta.touched
                                  }
                                  variant="outlined"
                                  disabled
                                >
                                  <InputLabel>Role</InputLabel>

                                  <Select
                                    {...input}
                                    margin="dense"
                                    label="Role"
                                    onBlur={handleSubmit}
                                  >
                                    {ROLES.map((role) => (
                                      <MenuItem key={role} value={role} dense>
                                        {role}
                                      </MenuItem>
                                    ))}
                                  </Select>

                                  <FormHelperText>
                                    {(meta.error || meta.submitError) &&
                                    meta.touched
                                      ? meta.error || meta.submitError
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              )}
                            </Field>
                          </Grid>
                        </Grid>
                        <Grid container item spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Field name="email">
                              {({ input, meta }) => (
                                <TextField
                                  {...input}
                                  onBlur={handleSubmit}
                                  placeholder="Email"
                                  type="text"
                                  fullWidth
                                  label="Email"
                                  variant="outlined"
                                  size="small"
                                  error={
                                    (meta.error || meta.submitError) &&
                                    meta.touched
                                  }
                                  helperText={
                                    (meta.error || meta.submitError) &&
                                    meta.touched
                                      ? meta.error || meta.submitError
                                      : null
                                  }
                                  disabled
                                />
                              )}
                            </Field>
                          </Grid>
                        </Grid>
                      </Grid>
                    </form>
                  </>
                )}
              />
            </div>
          </div>
        </TabPanelStyle>
        <TabPanelStyle value={activeTab} index={1} style={{ paddingBottom: 0 }}>
          {userSubscriptionData === null ? (
            <div className={classes.settingsPart}>
              <div className={classes.subheader}>
                Now you do not have a subscription you can choose a suitable
                rate plan here
              </div>
              <Button
                style={{ background: '#5064FF', color: '#FFFFFF' }}
                variant="contained"
              >
                Subscription
              </Button>
            </div>
          ) : (
            <SubscriptionCard result={userSubscriptionData} />
          )}
        </TabPanelStyle>
        <TabPanelStyle value={activeTab} index={2} style={{ paddingBottom: 0 }}>
          <div className={classes.settingsPart}>
            <div className={classes.subheader}>Password</div>
            <Button
              color="secondary"
              variant="contained"
              onClick={handlePwdChange}
            >
              Change
            </Button>
          </div>
        </TabPanelStyle>
        <TabPanelStyle value={activeTab} index={3} style={{ paddingBottom: 0 }}>
          <div className={classes.settingsPart}>
            <div className={classes.subheader}>
              Always display drop target element borders
              <Switch
                checked={dropTargetBorders}
                onChange={() => setDropTargetBorders(!dropTargetBorders)}
              />
            </div>

            <div className={classes.subheader}>
              User guide watched
              <Switch
                checked={userGuide}
                onChange={() => setUserGuide(!userGuide)}
              />
            </div>

            <div className={classes.subheader}>
              Enable Tabs Auto Switch
              <Switch
                checked={autoSwitch}
                onChange={() => setAutoSwitch(!autoSwitch)}
              />
            </div>
          </div>
        </TabPanelStyle>
        {activeTab !== 1 && activeTab !== 2 && (
          <Box padding="8px 0" className={classes.buttonsWrapper}>
            <Button
              color="secondary"
              variant="contained"
              onClick={handleUpdate}
            >
              Update
            </Button>

            <Button
              variant="contained"
              onClick={() => setCancelDialogOpen(true)}
            >
              Cancel
            </Button>
          </Box>
        )}
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you want to remove avatar?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={removeProfileImage} color="secondary">
              Yes
            </Button>
            <Button onClick={handleClose}>No</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={cancelDialogOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you want to cancel changes?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="secondary">
              Yes
            </Button>
            <Button onClick={handleClose}>No</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </main>
  );
};

export default Profile;
