import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { StateElement } from '../../../redux/project/types';
import { Entity } from '../../../domain/core';
import { selectProjectClasses } from '../../../redux/project/selectors';

type Props = {
  element: StateElement;
};

const TextElement: React.FC<Props> = ({ element }) => {
  const { styles, parameters } = element;

  const projectClasses = useSelector(selectProjectClasses);

  const [entityClass, groupClass] = styles.classNames;
  const entityStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === entityClass)
      ?.rules || {};
  const groupStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === groupClass)
      ?.rules || {};

  const classes = makeStyles({
    entityStyles: {
      ...entityStyles,
    },

    groupStyles: {
      ...groupStyles,
    },

    ownStyles: {
      ...styles.ownStyles,
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      minWidth: '100%',
      minHeight: '100%',
    },
  })();

  return (
    <div
      className={cn(
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
    >
      {parameters.textContent}
    </div>
  );
};

const FREE_CANVAS_RENDERERS: Partial<Record<Entity, React.FC<any>>> = {
  paragraph: TextElement,
  textBlock: TextElement,
  heading: TextElement,
};

export default FREE_CANVAS_RENDERERS;
