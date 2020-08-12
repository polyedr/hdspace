import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Field } from 'react-final-form';
import cn from 'classnames';
import { logout } from '$redux/user/actions';
import { openSignScreen } from '$utils/history';
import { selectUserData } from '$redux/user/selectors';
import { IMAGES } from '$constants/images';

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

        <button type="button" className={styles.button} onClick={handleLogout}>
          Log out
        </button>
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
                    placeholder="First Name"
                  />
                </div>

                <div className={styles.profileFieldWrapper}>
                  <label>Last Name</label>
                  <Field
                    name="lastName"
                    defaultValue={lastName}
                    component="input"
                    type="text"
                    placeholder="Last Name"
                  />
                </div>

                <div className={styles.profileFieldWrapper}>
                  <label>Company Name</label>
                  <Field
                    name="Company Name"
                    component="input"
                    type="text"
                    placeholder="Company Name"
                  />
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
                  <label>
                    <button
                      className={cn(styles.button, styles.imageActionButton)}
                      type="button"
                    >
                      Upload
                    </button>
                    <input type="file" />
                  </label>
                  <button
                    className={cn(styles.button, styles.imageActionButton)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </form>
          )}
        />

        <div className={styles.profileCredentials}>
          <div className={styles.subheader}>Email address</div>
          <div>
            {'Your email address is '}
            <span className={styles.strong}>{email}</span>
          </div>
          <button className={styles.button} type="button">
            Change
          </button>
        </div>

        <div className={styles.profileCredentials}>
          <div className={styles.subheader}>Password</div>
          <button className={styles.button} type="button">
            Change
          </button>
        </div>
      </div>
    </main>
  );
};

export default Profile;
