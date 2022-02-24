import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Field } from 'react-final-form';
import cn from 'classnames';
import { createStyles, darken, makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import {
  selectProfileData,
  selectUserData,
  selectUserGuideWatched,
} from '@Redux/user/selectors';
import {
  changeProfileData,
  setUserExperience,
  logoutStart,
  sendResetPasswordMail,
  changeUserData,
} from '@Redux/user/actions';
import IMAGES from '@Constants/images';
import { ROLES } from '@Constants/defaultParams';
import { Experience, ProfileData } from '@Src/types';
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Switch,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
} from '@material-ui/core';
import { updateUISettingsParameters } from '@Redux/project/actions';
import PATH_NAMES from '@Constants/pathNames';
import ImageCropper from '@Components/CropImage';
import SubmitError from '../SubmitError';
import CustomButton from '../../UI/Button';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) =>
  createStyles({
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(2),
      borderBottom: '1px solid #E7EAEC',
    },
    header: {
      fontWeight: 'bold',
    },
    formsContainer: {
      display: 'flex',
      maxWidth: 1000,
    },
    textFieldsContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      flex: 1,
    },
    profileForm: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    profileImageWrapper: {
      flex: '0 1',
      display: 'flex',
      flexDirection: 'column',
      padding: `0 ${theme.spacing(1)}px`,
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
      marginTop: 50,
      padding: theme.spacing(1),
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
  }),
);

const Profile: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [imageToCrop, setImageToCrop] = useState<any>(undefined);
  const [croppedImage, setCroppedImage] = useState<any>(undefined);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setCancelDialogOpen(false);
  };

  const userData = useSelector(selectUserData);
  const { firstName, lastName, email, profile } = userData;
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

  const handleLogout = () => {
    dispatch(logoutStart());
  };

  const handleChangeProfileData = async (values: any) => {
    if (
      Object.entries(values).some(
        ([key, value]) => value !== userData[key as keyof ProfileData],
      )
    ) {
      dispatch(changeProfileData(values));
    }
  };

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
    dispatch(changeProfileData({
      parameters: {
        avatarCrop: croppedImage as string
      }
    } as ProfileData));
    setImageToCrop(undefined);
  };

  const removeProfileImage = () => {
    handleClose();
    handleChangeProfileData({ avatar: null });
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
          }
        }
      } as ProfileData),
    );

    if (formData) {
      dispatch(
        changeUserData({
          firstName: formData.first_name,
          lastName: formData.last_name,
        }),
      );
    }
  };

  const handleCancel = () => {
    history.go(0);
  };

  return (
    <main>
      <div className={classes.headerContainer}>
        <Typography variant="h4" className={classes.header}>
          Profile settings
        </Typography>

        <div>
          <a className={classes.link} href={PATH_NAMES.projects}>
            My projects
          </a>
          <CustomButton styleType="link" onClick={handleLogout}>
            Log out
          </CustomButton>
        </div>
      </div>

      <Box padding={2}>
        <div className={classes.formsContainer}>
          <div className={classes.textFieldsContainer}>
            <Form
              initialValues={{
                first_name: firstName,
                last_name: lastName,
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
                    <Grid container spacing={2}>
                      <Grid container item spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Field name="first_name" validate={fieldValidate}>
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
                          <Field name="last_name" validate={fieldValidate}>
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
                    </Grid>
                  </form>
                </>
              )}
            />
          </div>

          <Form
            onSubmit={handleChangeProfileData}
            render={({ handleSubmit }) => (
              <form
                onSubmit={handleSubmit}
                className={classes.profileImageWrapper}
              >
                <div className={classes.imageInputLabel}>Your photo</div>

                <img alt="profile" src={avatarCrop ?? IMAGES.prof} />

                {imageToCrop && (
                  <>
                    <ImageCropper
                      imageToCrop={imageToCrop}
                      setResult={setCroppedImage}
                    />

                    <button type="button" onClick={handleSaved}>
                      Saved
                    </button>
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
                            accept=".png, .jpg, .jpeg"
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
        </div>

        <div className={classes.settingsPart}>
          <div className={cn(classes.subheader, classes.strong)}>
            Email address
          </div>
          <div className={classes.subheader}>
            {'Your email address is '}
            <span className={classes.strong}>{email}</span>
          </div>
          {/* <Button styleType="link">Change</Button> */}
        </div>

        <div className={classes.settingsPart}>
          <div className={classes.subheader}>Password</div>
          <CustomButton styleType="link" onClick={handlePwdChange}>
            Change
          </CustomButton>
        </div>

        <div className={classes.settingsPart}>
          <div className={cn(classes.subheader, classes.strong)}>
            UI settings
          </div>
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
        <Button color="primary" onClick={handleUpdate}>
          Update
        </Button>

        <Button color="primary" onClick={() => setCancelDialogOpen(true)}>
          Cancel
        </Button>
      </Box>
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
    </main>
  );
};

export default Profile;
