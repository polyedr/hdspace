import { LoremIpsum } from 'lorem-ipsum';
import { DEFAULT_LAYOUT_LIST } from '@Constants/defaultParams';
import { defaultFreeCanvasParams } from '@Domain/core';
import {
  ElementGroup,
  ButtonGeneratorElement,
  ButtonServerElement,
} from '@Src/types';
import FONTS from '@Constants/fonts';
import { makeButton } from '../formElements/formElements';
import { makeContainer } from '../otherElements/otherElements';

// Return a random string of RGB values e.g. "255, 255, 255" for backgroundColor, Color, borderColor
const RandomRGBColor = (color = null) => {
  if (color === null) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r.toString()}, ${g.toString()}, ${b.toString()})`;
  }
  return `rgb(${color})`;
};

// Set SetBorderWidth()
const setBorderWidth = (width = null || String || Number) => {
  // No width given so set to random
  if (width === null) {
    return `${Math.floor(Math.random() * 14).toString()}px`;
  }
  // Set to provided color
  return `${width.toString()}px`;
};

const setBorderStyle = (style = undefined) => {
  // No width given so set to random
  if (style === null) {
    const styles = [
      'none',
      'hidden',
      'dotted',
      'dashed',
      'solid',
      'double',
      'groove',
      'ridge',
      'inset',
      'outset',
      'initial',
      'inherit',
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }
  return style;
};

const setPaddingTop = (style = undefined) => {
  if (style === undefined) {
    return `${Math.floor(Math.random() * 9).toString()}px`;
  }
  return style;
};
const setPaddingRight = (style = undefined) => {
  if (style === undefined) {
    return `${Math.floor(Math.random() * 15).toString()}px`;
  }
  return style;
};
const setPaddingBottom = (style = undefined) => {
  if (style === undefined) {
    return `${Math.floor(Math.random() * 9).toString()}px`;
  }
  return style;
};
const setPaddingLeft = (style = undefined) => {
  if (style === undefined) {
    return `${Math.floor(Math.random() * 15).toString()}px`;
  }
  return style;
};

const setFontSize = (style = undefined) => {
  if (style === undefined) {
    return `${Math.floor(Math.random() * 28).toString()}px`;
  }
  return style;
};

const setFontFamily = (style = undefined) => {
  if (style === undefined) {
    return FONTS[Math.floor(Math.random() * FONTS.length)].value;
  }
  return style;
};

const setFontStyle = (style = undefined) => {
  if (style === undefined) {
    return Math.floor(Math.random() * 2) === 0 ? 'italic' : '';
  }
  return style;
};

const setBorderRadius = (style = undefined) => {
  if (style === undefined) {
    return `${Math.floor(Math.random() * 10).toString()}px`;
  }
  return style;
};

export const setTextContent = () => {
  const lorem = new LoremIpsum();
  const retText = lorem.generateWords(Math.floor(Math.random() * 5));
  return retText;
};

export const makeButtons = (keys = {}) => {
  const buttons: ButtonServerElement[] = [];
  let button;
  for (let i = 0; i < 10; i++) {
    if (Object.keys(keys).length === 0) {
      button = makeButton({
        buoyancy: 1,
        textContent: setTextContent(),
        ownStyles: {
          backgroundColor: RandomRGBColor(),
          borderColor: RandomRGBColor(),
          color: RandomRGBColor(),
          borderWidth: setBorderWidth(),
          borderStyle: setBorderStyle(),
          paddingTop: setPaddingTop(),
          paddingRight: setPaddingRight(),
          paddingBottom: setPaddingBottom(),
          paddingLeft: setPaddingLeft(),
          fontSize: setFontSize(),
          fontFamily: setFontFamily(),
          fontStyle: setFontStyle(),
          borderRadius: setBorderRadius(),
          marginRight: '20px',
        },
      });
    } else {
      button = makeButton({
        buoyancy: 1,
        textContent: setTextContent(),
        ownStyles: {
          backgroundColor: RandomRGBColor(),
          borderColor: RandomRGBColor(),
          color: RandomRGBColor(),
          borderWidth: setBorderWidth(),
          borderStyle: setBorderStyle(),
          paddingTop: setPaddingTop(),
          paddingRight: setPaddingRight(),
          paddingBottom: setPaddingBottom(),
          paddingLeft: setPaddingLeft(),
          fontSize: setFontSize(),
          fontFamily: setFontFamily(),
          fontStyle: setFontStyle(),
          borderRadius: setBorderRadius(),
          marginRight: '20px',
          ...keys,
        },
      });
    }

    buttons.push(button);
  }
  return buttons;
};
export const makeButtonGenerator = (): ButtonGeneratorElement => ({
  id: 'button-generator',
  buoyancy: 1,
  func_type: 'buttonGenerator',
  struct_type: 'buttonGenerator',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.CONTAINERS,
  },
  styles: {
    classNames: ['buttonGenerator'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'button-generator',
  children: [
    makeContainer({
      UID: 'form-center',
      name: 'generator',
      ownStyles: {
        display: 'flex',
        // flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '940px',
      },
      children: makeButtons(),
    }),
  ],
});
