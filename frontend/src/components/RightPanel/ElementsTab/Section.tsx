import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Scrollbar from '../../UI/Scrollbar';

const useStyles = makeStyles({
  root: {
    flex: 1,
    overflow: 'auto',
  },
});

type Props = {
  title: string;
  activeSection: string;
};

const Section: React.FC<Props> = ({ activeSection, title, children }) => {
  const classes = useStyles();
  return (
    <section hidden={activeSection !== title} className={classes.root}>
      <Scrollbar
        style={{
          height: '100%',
        }}
        autoHeightMin="100%"
      >
        {children}
      </Scrollbar>
    </section>
  );
};

export default Section;
