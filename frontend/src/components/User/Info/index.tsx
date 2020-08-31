import React from 'react';

const styles = require('./Info.scss');

export const Info: React.FC = () => {
  return (
    <div className={styles.infoContainer}>
      <h2 className={styles.infoTitle}>adevi</h2>
      <p className={styles.infoDescription}>
        AI Assistant for App Development that is excellent for:
      </p>
      <ul>
        <li className={styles.infoListItem}>
          * Non-technical people to build full length web or mobile application
        </li>
        <li className={styles.infoListItem}>
          * Developers to quickly generate the most complete front-end code
        </li>
      </ul>
    </div>
  );
};

export default Info;
