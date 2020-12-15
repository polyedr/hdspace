import { Entity, ServerElement } from '@Src/types';
import { convertCreatedElementToRequest } from '@Api/converters/toRequest';
import FONTS from '@Constants/fonts';

const tagMap: Record<Element['tagName'], Entity | null> = {
  A: 'hyperlink',
  ABBR: 'textBlock',
  ADDRESS: 'textBlock',
  AREA: null,
  ARTICLE: 'container',
  ASIDE: 'container',
  AUDIO: null,
  B: 'textBlock',
  BDO: 'textBlock',
  BLOCKQUOTE: 'paragraph',
  BODY: 'container',
  BR: null,
  BUTTON: 'button',
  CANVAS: null,
  CAPTION: 'textBlock',
  CITE: 'paragraph',
  CODE: 'paragraph',
  COL: null,
  COLGROUP: null,
  COMMAND: null,
  DATALIST: 'select',
  DD: 'listItem',
  DEL: 'textBlock',
  DETAILS: 'container',
  DFN: 'textBlock',
  DIV: 'container',
  DL: 'list',
  DT: 'listItem',
  EM: 'textBlock',
  EMBED: null,
  FIELDSET: 'container',
  FIGCAPTION: 'textBlock',
  FIGURE: 'container',
  FOOTER: 'container',
  FORM: 'container',
  H1: 'heading',
  H2: 'heading',
  H3: 'heading',
  H4: 'heading',
  H5: 'heading',
  H6: 'heading',
  HEAD: 'container',
  HEADER: 'container',
  HR: null,
  I: 'textBlock',
  IMG: 'image',
  INPUT: 'textinput',
  INS: 'textBlock',
  KBD: 'textBlock',
  LABEL: 'label',
  LEGEND: 'textBlock',
  LI: 'listItem',
  MAP: null,
  MARK: 'textBlock',
  MENU: 'list',
  METER: null,
  NAV: 'container',
  NOSCRIPT: null,
  OBJECT: null,
  OL: 'list',
  OPTGROUP: null,
  OPTION: 'selectItem',
  OUTPUT: 'textBlock',
  P: 'paragraph',
  PARAM: null,
  PRE: 'paragraph',
  PROGRESS: null,
  Q: 'textBlock',
  RP: null,
  RT: null,
  RUBY: null,
  S: 'textBlock',
  SAMP: 'textBlock',
  SECTION: 'section',
  SELECT: 'select',
  SMALL: 'textBlock',
  SOURCE: null,
  SPAN: 'textBlock',
  STRIKE: 'textBlock',
  STRONG: 'textBlock',
  STYLE: null,
  SUB: 'textBlock',
  SUP: 'textBlock',
  TABLE: null,
  TBODY: null,
  TD: null,
  TEXTAREA: 'textarea',
  TFOOT: null,
  TH: null,
  THEAD: null,
  TIME: 'textBlock',
  TR: null,
  TRACK: null,
  U: 'textBlock',
  UL: 'list',
  VAR: 'textBlock',
  VIDEO: 'video',
  WBR: null,
};

const convertFontFamily = (srcFontString: string) => {
  const families = srcFontString.split(',').map((family) => family.trim());

  // eslint-disable-next-line no-restricted-syntax
  for (const family of families) {
    if (FONTS.map((fonts) => fonts.label).includes(family)) {
      return FONTS.find((font) => font.label === family)?.value;
    }
  }
  return FONTS[0].value;
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
  });

  return {
    ...adeviElement,
    children: [...element.childNodes]
      .map((node) => {
        if (node.nodeType === 1) {
          return htmlElementToAdeviElement(node as HTMLElement, cssRules, doc);
        }
        if (node.nodeType === 3) {
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
