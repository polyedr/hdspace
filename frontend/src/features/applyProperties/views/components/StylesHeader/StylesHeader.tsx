import React, { memo } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import RemoveStyles from '../../containers/RemoveStyles/RemoveStyles';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

type Props = {
  title: string;
  cssPropertiesNames: string[];
  onClick(cssPropertiesNames: string[]): void;
};

const StylesHeader: React.FC<Props> = ({ title, ...restProps }) => {
  const classes = useStyles();
  return (
    <header className={classes.header}>
      <h4>{title}</h4>

      <RemoveStyles {...restProps} />
    </header>
  );
};

export default memo(StylesHeader);
