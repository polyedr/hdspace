import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { StateElement } from '../../../redux/project/types';
import { Entity } from '../../../domain/core';
import { selectProjectClasses } from '../../../redux/project/selectors';

const useRendererStyles = makeStyles({
  renderer: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    minWidth: '100%',
    minHeight: '100%',
  },
});

const useElementClassNames = (element: StateElement) => {
  const projectClasses = useSelector(selectProjectClasses);

  const [entityClass, groupClass] = element.styles.classNames;
  const entityStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === entityClass)
      ?.rules || {};
  const groupStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === groupClass)
      ?.rules || {};

  return makeStyles({
    entityStyles: {
      ...entityStyles,
    },

    groupStyles: {
      ...groupStyles,
    },

    ownStyles: {
      ...element.styles.ownStyles,
    },
  })();
};

type Props = {
  element: StateElement;
};

const TextElement: React.FC<Props> = ({ element }) => {
  const { parameters } = element;

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  const { renderer } = useRendererStyles();

  return (
    <div className={cn(entityStyles, groupStyles, ownStyles, renderer)}>
      {parameters.textContent}
    </div>
  );
};

const Button: React.FC<Props> = ({ element }) => {
  const { parameters } = element;

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  const { renderer } = useRendererStyles();

  return (
    <div
      className={cn(entityStyles, groupStyles, ownStyles, renderer)}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          textTransform: 'uppercase',
        }}
      >
        {parameters.textContent}
      </span>
    </div>
  );
};

const FREE_CANVAS_RENDERERS: Partial<Record<Entity, React.FC<any>>> = {
  paragraph: TextElement,
  ocrtext: TextElement,
  textBlock: TextElement,
  heading: TextElement,
  hyperlink: TextElement,
  label: TextElement,
  button: Button,
};

export default FREE_CANVAS_RENDERERS;
