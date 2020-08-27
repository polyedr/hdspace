import React from 'react';

const styles = require('../../Navigator.scss');

export default () => (
  <svg
    className={styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    id="icon-chevron-down"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
