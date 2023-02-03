import React, { memo } from 'react';
import { CircularProgress } from '@mui/material';
import styles from './styles.module.scss';

interface Props {
  active?: boolean;
}

const Spinner: React.FC<Props> = ({ active = false }) =>
  active ? (
    <div className={styles.spinnerWrapper}>
      <CircularProgress size={80} />
    </div>
  ) : null;

export default memo(Spinner);
