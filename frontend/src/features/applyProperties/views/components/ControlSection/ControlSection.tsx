import React from 'react';

import { sharedClasses } from '$styles/sharedClasses';

type Props = {
  title: string;
  children: React.ReactElement;
};

const ControlSection = (props: Props) => {
  const { title } = props;

  return (
    <div className={sharedClasses.propsSection}>
      <p className={sharedClasses.propsTitle}>{title}</p>
      <div className={sharedClasses.propsContent}>
        <div className={sharedClasses.propsContainer}>{props.children}</div>
      </div>
    </div>
  );
};

export { ControlSection };
