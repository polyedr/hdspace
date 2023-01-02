import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Scrollbar from '../../UI/Scrollbar';

const useStyles = makeStyles({
  root: {
    flex: 1,
    overflow: 'auto',
  },
});

interface Props {
  title: string;
  activeSection: string;
  className?: string;
}

const Section: React.FC<Props> = ({
  activeSection,
  title,
  children,
  className,
}) => {
  const classes = useStyles();
  return (
    <section
      hidden={activeSection !== title}
      className={cn(classes.root, className)}
    >
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
