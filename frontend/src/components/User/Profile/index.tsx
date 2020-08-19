import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Field } from 'react-final-form';
import cn from 'classnames';
import { changeProfileData, changeUserData, logout } from '$redux/user/actions';
import { openSignScreen } from '$utils/history';
import { selectUserData } from '$redux/user/selectors';
import { IMAGES } from '$constants/images';
import { Button } from '$components/UI/Button';
import { ProfileData, UserData } from '$redux/user/types';

const styles = require('./Profile.scss');

const Profile: React.FC = () => {
  const dispatch = useDispatch();

  const userData = useSelector(selectUserData);
  const { firstName, lastName, email, role, id, avatar } = userData;

  const handleLogout = () => {
    dispatch(logout());
    openSignScreen('signin');
  };

  const handleChangeUserData = async (values: any) => {
    if (
      Object.entries(values).some(
        ([key, value]) => value !== userData[key as keyof UserData],
      )
    ) {
      dispatch(changeUserData(id, values));
    }
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
    <main className={styles.profileContainer}>
      <div className={styles.profileHeaderContainer}>
        <div className={styles.profileHeader}>Profile settings</div>

        <Button styleType="link" onClick={handleLogout}>
          Log out
        </Button>
      </div>

      <div className={styles.profileMainBlock}>
        <div className={styles.profileFormsContainer}>
          <div className={styles.textFieldsContainer}>
            <Form
              onSubmit={handleChangeUserData}
              render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit} className={styles.profileForm}>
                  <div className={styles.profileFieldWrapper}>
                    <label>First Name</label>
                    <Field
                      name="firstName"
                      onBlur={handleSubmit}
                      defaultValue={firstName}
                      component="input"
                      type="text"
                    />
                  </div>

                  <div className={styles.profileFieldWrapper}>
                    <label>Last Name</label>
                    <Field
                      name="lastName"
                      onBlur={handleSubmit}
                      defaultValue={lastName}
                      component="input"
                      type="text"
                    />
                  </div>
                </form>
              )}
            />

            <Form
              onSubmit={handleChangeProfileData}
              render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit} className={styles.profileForm}>
                  <div className={styles.profileFieldWrapper}>
                    <label>Company Name</label>
                    <input type="text" />
                  </div>

                  <div className={styles.profileFieldWrapper}>
                    <label>Role</label>
                    <Field
                      name="role"
                      component="select"
                      defaultValue={role}
                      onBlur={handleSubmit}
                    >
                      <option value="Designer">Designer</option>
                      <option value="Developer">Developer</option>
                      <option value="Administrator">Administrator</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Expert">Expert</option>
                      <option value="Communication">Communication</option>
                    </Field>
                  </div>
                </form>
              )}
            />
          </div>

          <Form
            onSubmit={handleChangeProfileData}
            render={({ handleSubmit }) => (
              <form
                onSubmit={handleSubmit}
                className={styles.profileImageWrapper}
              >
                <div className={styles.imageInputLabel}>Your photo</div>

                <img src={avatar ?? IMAGES.prof} alt="profile" />

                <div className={styles.profileImageActions}>
                  {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
                  <label className={styles.imageActionButton} tabIndex={0}>
                    Upload
                    <Field
                      name="avatar"
                      render={({ input }) => {
                        return (
                          <input
                            {...input}
                            type="file"
                            onChange={handleImageUpload}
                            className={styles.hidden}
                          />
                        );
                      }}
                    />
                  </label>
                  <button
                    className={styles.imageActionButton}
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

        <div className={styles.profileCredentials}>
          <div className={cn(styles.subheader, styles.strong)}>
            Email address
          </div>
          <div className={styles.subheader}>
            {'Your email address is '}
            <span className={styles.strong}>{email}</span>
          </div>
          <Button className={styles.linkButton} styleType="link">
            Change
          </Button>
        </div>

        <div className={styles.profileCredentials}>
          <div className={styles.subheader}>Password</div>
          <Button className={styles.linkButton} styleType="link">
            Change
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Profile;
