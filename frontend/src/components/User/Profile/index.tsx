import React from 'react';
import MakeAsyncFunction from 'react-redux-promise-listener';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Field } from 'react-final-form';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles, darken } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';
import Button from '../../UI/Button';
import { selectUserData } from '../../../redux/user/selectors';
import { changeProfileData, logout } from '../../../redux/user/actions';
import IMAGES from '../../../constants/images';
import { ProfileData } from '../../../types';
import { openSignScreen } from '../../../redux/history';
import { promiseListener } from '../../../redux/store';
import TYPES from '../../../redux/actionTypes';
import SubmitError from '../SubmitError';

const ROLES = ['STAFF', 'ADMINISTRATOR', 'LIBRARIAN', 'EXTERNAL'];

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
    profileCredentials: {
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
  }),
);

const Profile: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const userData = useSelector(selectUserData);
  const { firstName, lastName, email, role, id, avatar } = userData;

  const handleLogout = () => {
    dispatch(logout());
    openSignScreen('signin');
  };

  const handleChangeProfileData = async (values: any) => {
    if (
      Object.entries(values).some(
        ([key, value]) => value !== userData[key as keyof ProfileData],
      )
    ) {
      dispatch(changeProfileData(id, values));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file, file.name);

    dispatch(changeProfileData(id, (formData as any) as ProfileData));
  };

  const removeProfileImage = () => handleChangeProfileData({ avatar: null });

  return (
    <main>
      <div className={classes.headerContainer}>
        <Typography variant="h4" className={classes.header}>
          Profile settings
        </Typography>

        <Button styleType="link" onClick={handleLogout}>
          Log out
        </Button>
      </div>

      <Box padding={2}>
        <div className={classes.formsContainer}>
          <div className={classes.textFieldsContainer}>
            <MakeAsyncFunction
              listener={promiseListener}
              start={TYPES.CHANGE_USER_DATA}
              resolve={TYPES.CHANGE_USER_DATA_COMPLETE}
              reject={TYPES.CHANGE_USER_DATA_FAILURE}
            >
              {(onSubmit) => (
                <Form
                  onSubmit={onSubmit}
                  render={({ handleSubmit, submitError }) => (
                    <>
                      {submitError && (
                        <div className={classes.error}>
                          <SubmitError name="detail" />

                          <Alert severity="error" variant="filled">
                            {submitError}
                          </Alert>
                        </div>
                      )}
                      <form
                        onSubmit={handleSubmit}
                        className={classes.profileForm}
                      >
                        <Field name="first_name" defaultValue={firstName}>
                          {({ input, meta }) => (
                            <TextField
                              {...input}
                              onBlur={handleSubmit}
                              type="text"
                              fullWidth
                              label="First Name"
                              placeholder="First Name"
                              required
                              variant="outlined"
                              size="small"
                              error={
                                (meta.error || meta.submitError) && meta.touched
                              }
                              helperText={
                                (meta.error || meta.submitError) && meta.touched
                                  ? meta.error || meta.submitError
                                  : null
                              }
                            />
                          )}
                        </Field>

                        <Field name="last_name" defaultValue={lastName}>
                          {({ input, meta }) => (
                            <TextField
                              {...input}
                              onBlur={handleSubmit}
                              placeholder="Last Name"
                              type="text"
                              fullWidth
                              label="Last Name"
                              required
                              variant="outlined"
                              size="small"
                              error={
                                (meta.error || meta.submitError) && meta.touched
                              }
                              helperText={
                                (meta.error || meta.submitError) && meta.touched
                                  ? meta.error || meta.submitError
                                  : null
                              }
                            />
                          )}
                        </Field>
                      </form>
                    </>
                  )}
                />
              )}
            </MakeAsyncFunction>

            <Form
              onSubmit={handleChangeProfileData}
              render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit} className={classes.profileForm}>
                  <TextField
                    type="text"
                    fullWidth
                    label="Company Name"
                    placeholder="Company Name"
                    required
                    variant="outlined"
                    size="small"
                  />

                  <Field name="role" defaultValue={role}>
                    {({ input, meta }) => (
                      <FormControl
                        fullWidth
                        error={(meta.error || meta.submitError) && meta.touched}
                        variant="outlined"
                      >
                        <InputLabel>Role</InputLabel>

                        <Select
                          {...input}
                          margin="dense"
                          label="Role"
                          onChange={(ev) =>
                            handleChangeProfileData({ role: ev.target.value })
                          }
                        >
                          {ROLES.map((role) => (
                            <MenuItem key={role} value={role} dense>
                              {role}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                </form>
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

                <img src={avatar ?? IMAGES.prof} alt="profile" />

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
                    onClick={removeProfileImage}
                  >
                    Remove
                  </button>
                </div>
              </form>
            )}
          />
        </div>

        <div className={classes.profileCredentials}>
          <div className={cn(classes.subheader, classes.strong)}>
            Email address
          </div>
          <div className={classes.subheader}>
            {'Your email address is '}
            <span className={classes.strong}>{email}</span>
          </div>
          <Button styleType="link">Change</Button>
        </div>

        <div className={classes.profileCredentials}>
          <div className={classes.subheader}>Password</div>
          <Button styleType="link">Change</Button>
        </div>
      </Box>
    </main>
  );
};

export default Profile;
