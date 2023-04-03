import React from 'react';
import { makeStyles, Styles } from '@mui/styles';
import { omit } from 'ramda';
import { Theme } from '@mui/material';
import { RendererProps } from './types';

const getComputedStyle = (
  style: React.CSSProperties = {},
  stylesToOmit: string[] = [],
) => (stylesToOmit.length ? omit(stylesToOmit, style) : style);

export const getComputedComponentStyles = (
  props: RendererProps,
  stylesToOmit?: string[],
) => ({
  ownStyles: getComputedStyle(props.element.styles.ownStyles, stylesToOmit),
});

export const makeComponentStyles: any = (
  name: string,
  style: Styles<Theme, any, string> = {},
  stylesToOmit?: string[],
) =>
  makeStyles<Theme>(
    (theme) => ({
      ownStyles: (props: RendererProps) => {
        const { element } = props;
        const { styles } = element;
        return {
          zIndex: 1,
          ...getComputedStyle(
            styles.pseudoClassViewStyles || styles.ownStyles,
            stylesToOmit,
          ),
        };
      },
      ownPseudoStyles: ({ element }: RendererProps) => {
        const { styles } = element;
        return {
          ...(styles.pseudoClassStyles
            ? Object.keys(styles.pseudoClassStyles).reduce(
                (pseudoStyles, pseudoClassName) => {
                  const newPseudoStyles = { ...pseudoStyles };
                  if (styles.pseudoClassStyles) {
                    newPseudoStyles[`&:${pseudoClassName}`] =
                      styles.pseudoClassStyles[pseudoClassName];
                  }
                  return newPseudoStyles;
                },
                {},
              )
            : {}),
        };
      },
      disabled: {
        cursor: 'default',
        transition: 'none',
        '& > *': {
          pointerEvents: 'none',
        },
      },
      ...(style instanceof Function ? style(theme) : style),
    }),
    { name },
  );
