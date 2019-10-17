import React, { useCallback } from 'react';

const styles = require('./styles.scss');

interface IComponentProps {
  parent: number,
  children?: any,
  className,
  styles_root?: React.CSSProperties,
  onclick: (event: React.FormEventHandler) => void,
}

export const CleanRecursiveElement: React.FunctionComponent<IComponentProps> = ({
  parent,
  children,
  className,
  styles_root,
  onclick,
}) => {
  const handleClick = useCallback((event) => {
    onclick(event);
  }, [onclick]);
  return (
    <React.Fragment>
      {
        parent === 0 && (
          <div
            id="root"
            className={styles.root}
            style={{ ...styles_root }}
            onClick={handleClick}
          >
            {children}
          </div>
        )
      }
      {
        parent !== 0 && (
          <React.Fragment>
            {
              React.Children.map(children, child => React.cloneElement(child))
            }
          </React.Fragment>
        )
      }
    </React.Fragment>
  );
};
