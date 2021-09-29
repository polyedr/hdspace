import { Entity, ServerElement } from '@Src/types/types';
import { convertCreatedElementToRequest } from '@Api/converters/toRequest';
import FONTS from '@Constants/fonts';

const containerElements = {
  ASIDE: 'container',
  BODY: 'container',
  DETAILS: 'container',
  DIV: 'container',
  FIELDSET: 'container',
  FIGURE: 'container',
  FOOTER: 'container',
  FORM: 'container',
  HEADER: 'container',
  MAIN: 'container',
  NAV: 'container',
} as const;
const unsupportedElement = {
  AREA: null,
  AUDIO: null,
  BR: null,
  CANVAS: null,
  COL: null,
  COLGROUP: null,
  COMMAND: null,
  DATA: null,
  DIALOG: null,
  EMBED: null,
  HEAD: null,
  HR: null,
  IFRAME: null,
  LINK: null,
  MAP: null,
  META: null,
  METER: null,
  NOSCRIPT: null,
  OBJECT: null,
  OPTGROUP: null,
  PARAM: null,
  PICTURE: null,
  PROGRESS: null,
  RB: null,
  RP: null,
  RT: null,
  RTC: null,
  RUBY: null,
  SCRIPT: null,
  SOURCE: null,
  STYLE: null,
  TABLE: null,
  TBODY: null,
  TD: null,
  TEMPLATE: null,
  TFOOT: null,
  TH: null,
  THEAD: null,
  TITLE: null,
  TR: null,
  TRACK: null,
  WBR: null,
} as const;

const tagMap: Record<Element['tagName'], Entity | null> = {
  ABBR: 'textBlock',
  ADDRESS: 'textBlock',
  ARTICLE: 'container',
  B: 'textBlock',
  BDI: 'textBlock',
  BDO: 'textBlock',
  BLOCKQUOTE: 'paragraph',
  BUTTON: 'button',
  CAPTION: 'textBlock',
  CITE: 'paragraph',
  CODE: 'paragraph',
  DATALIST: 'select',
  DD: 'listItem',
  DEL: 'textBlock',
  DFN: 'textBlock',
  DL: 'list',
  DT: 'listItem',
  EM: 'textBlock',
  FIGCAPTION: 'textBlock',
  H1: 'heading',
  H2: 'heading',
  H3: 'heading',
  H4: 'heading',
  H5: 'heading',
  H6: 'heading',
  I: 'textBlock',
  IMG: 'image',
  INPUT: 'textinput',
  INS: 'textBlock',
  KBD: 'textBlock',
  LABEL: 'label',
  LEGEND: 'textBlock',
  LI: 'listItem',
  MARK: 'textBlock',
  MENU: 'list',
  OL: 'list',
  OPTION: 'option',
  OUTPUT: 'textBlock',
  P: 'paragraph',
  PRE: 'paragraph',
  Q: 'textBlock',
  S: 'textBlock',
  SAMP: 'textBlock',
  SECTION: 'section',
  SELECT: 'select',
  SMALL: 'textBlock',
  SPAN: 'textBlock',
  STRIKE: 'textBlock',
  STRONG: 'textBlock',
  SUB: 'textBlock',
  SUMMARY: 'textBlock',
  SUP: 'textBlock',
  TEXTAREA: 'textarea',
  TIME: 'textBlock',
  U: 'textBlock',
  UL: 'list',
  VAR: 'textBlock',
  VIDEO: 'video',
  ...containerElements,
  ...unsupportedElement,
};

const convertFontFamily = (srcFontString: string) => {
  const families = srcFontString
    .split(',')
    .map((family) => family.trim().replace(/["'`]/g, ''));

  const match = families.find((family) =>
    FONTS.map(({ label }) => label).includes(family),
  );
  return FONTS.find(({ label }) => label === match)?.value || FONTS[0].value;
};

const extractCSSStyleDeclaration = (style: CSSStyleDeclaration) => {
  const res = {} as any;
  for (let i = 0; i < style.length; i += 1) {
    const name = style[i];
    if (name === 'font-family') {
      res[name] = convertFontFamily(style[name]);
      // eslint-disable-next-line no-continue
      continue;
    }
    res[name] = style[name];
  }
  return res;
};

const extractStyles = (
  element: HTMLElement,
  cssRules: CSSStyleRule[],
  doc: Document,
) => {
  const reducer = (acc: React.CSSProperties, curr: CSSStyleRule) => {
    try {
      const collection = [...doc.querySelectorAll(curr.selectorText)];
      if (collection.includes(element)) {
        return {
          ...acc,
          ...extractCSSStyleDeclaration(curr.style),
        };
      }
      return acc;
    } catch (e) {
      return acc;
    }
  };

  return cssRules.reduce(reducer, {});
};

const htmlElementToAdeviElement = (
  element: HTMLElement,
  cssRules: CSSStyleRule[],
  doc: Document,
): ServerElement<any> | null => {
  const type = tagMap[element.tagName];
  if (!type) return null;

  const { style: inlineStyle } = element;

  const ownStyles = {
    ...extractStyles(element, cssRules, doc),
    ...extractCSSStyleDeclaration(inlineStyle),
  };

  const adeviElement = convertCreatedElementToRequest(type, null, type, {
    textContent: element.textContent?.trim(),
    ...(type === 'heading' && { headingType: element.tagName.toLowerCase() }),
    ...(type === 'image' && { imageURL: element.getAttribute('src') }),
  });

  return {
    ...adeviElement,
    children: [...element.childNodes]
      .map((node) => {
        if (node.nodeType === 1) {
          return htmlElementToAdeviElement(node as HTMLElement, cssRules, doc);
        }
        if (
          node.nodeType === 3 &&
          !!node.textContent?.trim() &&
          element.tagName in containerElements
        ) {
          return convertCreatedElementToRequest(
            'paragraph',
            null,
            'paragraph',
            {
              textContent: node.textContent,
            },
          );
        }
        return null;
      })
      .filter((child) => !!child),
    styles: {
      ...adeviElement.styles,
      ownStyles,
    },
  };
};

const convertHtml = (doc: Document, cssRules: CSSStyleRule[]) =>
  htmlElementToAdeviElement(doc.body, cssRules, doc);

export default convertHtml;
