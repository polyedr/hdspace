import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Field } from 'react-final-form';
import cn from 'classnames';
import { logout } from '$redux/user/actions';
import { openSignScreen } from '$utils/history';
import { selectUserData } from '$redux/user/selectors';
import { IMAGES } from '$constants/images';
import { Button } from '$components/UI/Button';

const styles = require('./Profile.scss');

const Profile: React.FC = () => {
  const dispatch = useDispatch();

  const { firstName, lastName, email } = useSelector(selectUserData);

  const handleLogout = () => {
    dispatch(logout());
    openSignScreen('signin');
  };

  const handleSubmitForm = async (values: any) => {
    console.log(values);
  };

  return (
    <main className={styles.profileContainer}>
      <div className={styles.profileHeaderContainer}>
        <div className={styles.profileHeader}>Profile settings</div>

        <Button styleType="link" onClick={handleLogout}>
          Log out
        </Button>
      </div>

      <div className={styles.profileMainBlock}>
        <Form
          onSubmit={handleSubmitForm}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className={styles.profileForm}>
              <div className={styles.profileFieldContainer}>
                <div className={styles.profileFieldWrapper}>
                  <label>First Name</label>
                  <Field
                    name="firstName"
                    defaultValue={firstName}
                    component="input"
                    type="text"
                  />
                </div>

                <div className={styles.profileFieldWrapper}>
                  <label>Last Name</label>
                  <Field
                    name="lastName"
                    defaultValue={lastName}
                    component="input"
                    type="text"
                  />
                </div>

                <div className={styles.profileFieldWrapper}>
                  <label>Company Name</label>
                  <Field name="Company Name" component="input" type="text" />
                </div>

                <div className={styles.profileFieldWrapper}>
                  <label>Role</label>
                  <Field name="role" component="select">
                    <option value="designer">Designer</option>
                    <option value="developer">Developer</option>
                    <option value="boss">Boss</option>
                    <option value="janitor">Janitor</option>
                  </Field>
                </div>
              </div>

              <div className={styles.profileImageWrapper}>
                <div className={styles.imageInputLabel}>Your photo</div>

                <img src={IMAGES.prof} alt="profile" />

                <div className={styles.profileImageActions}>
                  {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
                  <label className={styles.imageActionButton} tabIndex={0}>
                    Upload
                    <input type="file" className={styles.hidden} />
                  </label>
                  <button className={styles.imageActionButton} type="button">
                    Remove
                  </button>
                </div>
              </div>
            </form>
          )}
        />

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
