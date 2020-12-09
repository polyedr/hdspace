import { Entity, ServerElement } from '@Src/types';
import { convertCreatedElementToRequest } from '@Api/converters/toRequest';

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

const ejectCSSStyleDeclaration = (style: CSSStyleDeclaration) => {
  const res = {} as any;
  for (let i = 0; i < style.length; i += 1) {
    const name = style.item(i);
    res[name] = style[name];
  }
  return res;
};

const convertHtml = (element: HTMLElement): ServerElement<any> | null => {
  const type = tagMap[element.tagName];
  if (!type) return null;

  const { style: inlineStyle } = element;
  const computedStyle = window.getComputedStyle(element);

  const ownStyles = {
    ...ejectCSSStyleDeclaration(inlineStyle),
    ...ejectCSSStyleDeclaration(computedStyle),
  };

  const adeviElement = convertCreatedElementToRequest(type, null, type, {
    textContent: element.textContent,
    ...(type === 'heading' && { headingType: element.tagName.toLowerCase() }),
  });

  return {
    ...adeviElement,
    children: [...element.children]
      .map((child) => convertHtml(child as HTMLElement))
      .filter((child) => !!child),
    styles: {
      ...adeviElement.styles,
      ownStyles,
    },
  };
};

export default convertHtml;
