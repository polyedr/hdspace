import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';
import { selectProjectClasses } from '../../../redux/project/selectors';
import { VIMEO_HEIGHT_RATIO } from '../../../constants/players';
import { StateElement } from '../../../types';

export const useElementClassNames = (element: StateElement) => {
  const projectClasses = useSelector(selectProjectClasses);

  const [entityClass, groupClass] = element.styles.classNames;
  const entityStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === entityClass)
      ?.rules || {};
  const groupStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === groupClass)
      ?.rules || {};

  return makeStyles({
    entityStyles: { ...(entityStyles as Object) },
    groupStyles: { ...(groupStyles as Object) },
    ownStyles: { ...(element.styles.ownStyles as Object) },
  })();
};

export const getWrapperStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  // @ts-ignore
  makeStyles({
    entityStyles: { ...(entityStyles as Object) },
    groupStyles: { ...(groupStyles as Object) },
    ownStyles: { ...(ownStyles as Object) },
  });

export const getIframeContainerClassStyles = (style: React.CSSProperties) => ({
  height: style.height,
  ...(style.height && {
    paddingTop: style.height === 'auto' ? `${VIMEO_HEIGHT_RATIO}%` : '0',
  }),
  overflow: 'hidden',
  position: 'relative' as React.CSSProperties['position'],
});

export const getIframeContainerStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    entityStyles: { ...getIframeContainerClassStyles(entityStyles) },
    groupStyles: { ...getIframeContainerClassStyles(groupStyles) },
    ownStyles: { ...getIframeContainerClassStyles(ownStyles) },
  });
