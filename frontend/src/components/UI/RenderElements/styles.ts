import React from 'react';
import { Styles } from '@material-ui/core/styles/withStyles';
import { omit } from 'ramda';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { RendererProps } from './types';

const getComputedStyle = (
  style: React.CSSProperties = {},
  stylesToOmit: Array<string> = [],
) => {
  return stylesToOmit.length ? omit(stylesToOmit, style) : style;
};

export const getComputedComponentStyles = (
  props: RendererProps,
  stylesToOmit?: Array<string>,
) => ({
  ownStyles: getComputedStyle(props.element.styles.ownStyles, stylesToOmit),
});

export const makeComponentStyles: any = (
  name: string,
  style: Styles<Theme, any, string> = {},
  stylesToOmit?: Array<string>,
) =>
  makeStyles(
    (theme) => ({
      ownStyles: (props: RendererProps) => {
        const { element } = props;
        const { styles } = element;
        console.log(
          'TEST!!',
          element.styles.ownStyles,
          styles.pseudoClassViewStyles,
        );
        const pseudoClassStyles = styles.pseudoClassViewStyles
          ? Object.keys(styles.pseudoClassViewStyles).reduce(
              (pseudoStyles, pseudoClassName) => {
                const newPseudoStyles = { ...pseudoStyles };
                if (styles.pseudoClassViewStyles) {
                  newPseudoStyles[`&:${pseudoClassName}`] =
                    styles.pseudoClassViewStyles[pseudoClassName];
                }
                return newPseudoStyles;
              },
              {},
            )
          : {};
        console.log('PSEUDO CLASS STYLES!!', pseudoClassStyles);
        return {
          ...getComputedStyle(
            styles.pseudoClassViewStyles || styles.ownStyles,
            stylesToOmit,
          ),
        };
      },
      disabled: {
        cursor: 'default',
        transition: 'none',
        '& > *': {
          pointerEvents: 'none !important',
        },
      },
      ...(style instanceof Function ? style(theme) : style),
    }),
    { name },
  );
