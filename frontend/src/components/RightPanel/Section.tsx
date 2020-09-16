import React from 'react';
import Scrollbar from '../UI/Scrollbar';

const styles = require('./styles.scss');

type Props = {
  title: string;
  activeSection: string;
};

const Section: React.FC<Props> = ({ activeSection, title, children }) => {
  return (
    <section hidden={activeSection !== title} className={styles.section}>
      <Scrollbar autoHeightMin="100%">{children}</Scrollbar>
    </section>
  );
};

export default Section;
