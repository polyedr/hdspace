import {
  CardsSectionServerElement,
  ElementGroup,
  FeatureSectionServerElement,
  PageTemplateServerElement,
  SectionServerElement,
  SubscribeFormServerElement,
} from '@Src/types';
import { DEFAULT_LAYOUT_LIST } from '@Constants/defaultParams';
import {
  makeContainer,
  makeImage,
  makeSmartFooter,
  makeSmartHeader,
  makeSmartWebpage,
} from '../otherElements/otherElements';
import {
  makeHeading,
  makeParagraph,
} from '../typographyElements/typographyElements';
import {
  makeButton,
  makeLabel,
  makeTextinput,
} from '../formElements/formElements';

import { defaultFreeCanvasParams } from '../../core';

export const makePageTemplate = (
  withoutContainers: boolean = false,
  UID: string = 'master',
): PageTemplateServerElement => ({
  id: `page-template-${UID}`,
  buoyancy: 0,
  func_type: withoutContainers ? 'emptyPageTemplate' : 'pageTemplate',
  struct_type: withoutContainers ? 'emptyPageTemplate' : 'pageTemplate',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    group: ElementGroup.CONTAINERS,
    freeCanvas: defaultFreeCanvasParams,
  },
  styles: {
    classNames: ['pageTemplate'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: withoutContainers ? 'emptyPageTemplate' : 'pageTemplate',
  children: [
    makeContainer({
      UID: 'header',
      name: 'Header',
      children: withoutContainers
        ? []
        : [
            makeSmartHeader({
              UID: 'header',
              name: 'Header',
              ownStyles: {
                height: '100%',
                overflow: 'hidden',
              },
            }),
          ],
      ownStyles: {
        padding: '0 5px',
        height: '80px',
      },
    }),
    makeContainer({
      UID: 'body',
      children: [
        makeContainer({
          UID: 'left',
          name: 'Left Panel',
          children: withoutContainers
            ? []
            : [
                makeSmartWebpage({
                  name: 'Left Panel',
                  ownStyles: {
                    height: '100%',
                    overflow: 'hidden',
                  },
                }),
              ],
          ownStyles: {
            padding: '0px 5px',
            width: '25%',
            flexGrow: 1,
          },
        }),
        makeContainer({
          UID: 'main',
          name: 'Main Content',
          children: withoutContainers
            ? []
            : [
                makeSmartWebpage({
                  name: 'Main Content',
                  ownStyles: {
                    height: '100%',
                    overflow: 'hidden',
                  },
                }),
              ],
          buoyancy: 1,
          ownStyles: {
            padding: '0 5px',
            width: '50%',
            flexGrow: 3000,
          },
        }),
        makeContainer({
          UID: 'right',
          name: 'Right Panel',
          children: withoutContainers
            ? []
            : [
                makeSmartWebpage({
                  name: 'Right Panel',
                  ownStyles: {
                    height: '100%',
                    overflow: 'hidden',
                  },
                }),
              ],
          buoyancy: 2,
          ownStyles: {
            padding: '0px 5px',
            width: '25%',
            flexGrow: 1,
          },
        }),
      ],
      ownStyles: {
        height: '150px',
        display: 'flex',
        padding: '5px 0',
        flexGrow: 1,
      },
    }),
    makeContainer({
      name: 'Footer',
      children: withoutContainers
        ? []
        : [
            makeSmartFooter({
              name: 'Footer',
              ownStyles: {
                height: '100%',
                overflow: 'hidden',
              },
            }),
          ],
      ownStyles: {
        padding: '0 5px',
        height: '80px',
      },
    }),
  ],
});

export const makeEmptyPageTemplate = () => makePageTemplate(true);

export const makeSubscribeForm = (): SubscribeFormServerElement => ({
  id: 'subscribe-form',
  buoyancy: 1,
  func_type: 'subscribeForm',
  struct_type: 'subscribeForm',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.CONTAINERS,
  },
  styles: {
    classNames: ['subscribeForm'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'subscribeForm',
  children: [
    makeContainer({
      UID: 'form-center',
      ownStyles: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '940px',
        textAlign: 'center',
      },
      children: [
        makeHeading({
          UID: 'form-heading',
          headingType: 'h2',
          textContent: 'Subscribe form',
          ownStyles: {
            fontSize: '32px',
            lineHeight: '36px',
            marginTop: '20px',
            marginBottom: '10px',
          },
        }),
        makeParagraph({
          UID: 'form-paragraph',
          ownStyles: {
            fontSize: '14px',
            lineHeight: '20px',
            textAlign: 'center',
            marginBottom: '10px',
          },
          buoyancy: 1,
          textContent:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus!',
        }),
        makeContainer({
          UID: 'form-container',
          buoyancy: 2,
          ownStyles: {
            width: 'auto',
            marginBottom: '15px',
          },
          children: [
            makeLabel({
              UID: 'form-label',
              ownStyles: {
                fontSize: '14px',
                fontWeight: 700,
                marginBottom: '5px',
              },
              textContent: 'Email',
            }),
            makeContainer({
              buoyancy: 1,
              ownStyles: {
                display: 'flex',
                width: 'auto',
                padding: '0',
              },
              children: [
                makeTextinput({
                  ownStyles: {
                    width: '200px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    lineHeight: '1.4',
                  },
                }),
                makeButton({
                  buoyancy: 1,
                  textContent: 'subscribe',
                  ownStyles: {
                    padding: '9px 15px',
                    fontSize: '14px',
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});

export const makeCardsSection = (): CardsSectionServerElement => ({
  id: 'cards-section',
  buoyancy: 0,
  func_type: 'cardsSection',
  struct_type: 'cardsSection',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.CONTAINERS,
  },
  styles: {
    classNames: ['cardsSection'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'cardsSection',
  children: [
    makeContainer({
      UID: 'cards-main',
      ownStyles: {
        maxWidth: '940px',
      },
      children: [
        makeHeading({
          UID: 'cards-heading',
          headingType: 'h2',
          textContent: 'Cards Section',
          ownStyles: {
            textAlign: 'center',
            fontSize: '32px',
            lineHeight: '36px',
            marginTop: '20px',
            marginBottom: '10px',
          },
        }),
        makeParagraph({
          UID: 'cards-paragraph',
          ownStyles: {
            fontSize: '14px',
            lineHeight: '20px',
            textAlign: 'center',
            marginBottom: '10px',
          },
          buoyancy: 1,
          textContent:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus! Aut illum a minus cumque iste, quibusdam corporis atque odit magnam impedit esse possimus perspiciatis culpa non id tempore fugiat molestiae eos dolorem, labore maiores ratione? Sequi tenetur porro enim reprehenderit amet accusamus eos itaque saepe quidem quod, sit vero ab recusandae vitae, facere nobis cumque minima libero aut quos nihil labore eius. Soluta doloremque mollitia nihil voluptatibus, nostrum commodi eaque similique ipsam ad libero at tenetur.',
        }),
        makeContainer({
          UID: 'cards-container',
          buoyancy: 2,
          ownStyles: {
            display: 'flex',
            justifyContent: 'space-between',
          },
          children: [
            makeContainer({
              UID: 'card-section-one',
              children: [
                makeImage({
                  UID: 'card-image-one',
                  ownStyles: {
                    width: '100%',
                  },
                }),
                makeHeading({
                  UID: 'card-heading-one',
                  buoyancy: 1,
                  textContent: 'Card one',
                  ownStyles: {
                    fontSize: '24px',
                    lineHeight: '30px',
                    marginTop: '20px',
                    marginBottom: '10px',
                  },
                }),
                makeParagraph({
                  UID: 'card-paragraph-one',
                  buoyancy: 2,
                  ownStyles: {
                    fontSize: '14px',
                    lineHeight: '20px',
                    marginBottom: '10px',
                  },
                  textContent:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus!',
                }),
              ],
              ownStyles: {
                padding: '0 20px',
                width: '33%',
                flexGrow: 1,
              },
            }),
            makeContainer({
              UID: 'card-section-two',
              children: [
                makeImage({
                  UID: 'card-image-two',
                  ownStyles: {
                    width: '100%',
                  },
                }),
                makeHeading({
                  UID: 'card-heading-two',
                  buoyancy: 1,
                  textContent: 'Card two',
                  ownStyles: {
                    fontSize: '24px',
                    lineHeight: '30px',
                    marginTop: '20px',
                    marginBottom: '10px',
                  },
                }),
                makeParagraph({
                  UID: 'card-paragraph-two',
                  buoyancy: 2,
                  ownStyles: {
                    fontSize: '14px',
                    lineHeight: '20px',
                    marginBottom: '10px',
                  },
                  textContent:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus!',
                }),
              ],
              buoyancy: 1,
              ownStyles: {
                padding: '0 20px',
                width: '33%',
                flexGrow: 1,
              },
            }),
            makeContainer({
              UID: 'card-section-three',
              children: [
                makeImage({
                  UID: 'card-image-three',
                  ownStyles: {
                    width: '100%',
                  },
                }),
                makeHeading({
                  UID: 'card-heading-three',
                  buoyancy: 1,
                  textContent: 'Card three',
                  ownStyles: {
                    fontSize: '24px',
                    lineHeight: '30px',
                    marginTop: '20px',
                    marginBottom: '10px',
                  },
                }),
                makeParagraph({
                  UID: 'card-paragraph-three',
                  buoyancy: 2,
                  ownStyles: {
                    fontSize: '14px',
                    lineHeight: '20px',
                    marginBottom: '10px',
                  },
                  textContent:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus!',
                }),
              ],
              buoyancy: 2,
              ownStyles: {
                padding: '0 20px',
                width: '33%',
                flexGrow: 1,
              },
            }),
          ],
        }),
      ],
    }),
  ],
});

export const makeFeatureSection = (): FeatureSectionServerElement => ({
  id: 'feature-section',
  buoyancy: 0,
  func_type: 'featureSection',
  struct_type: 'featureSection',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    freeCanvas: defaultFreeCanvasParams,
    group: ElementGroup.CONTAINERS,
  },
  styles: {
    classNames: ['featureSection'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'featureSection',
  children: [
    makeContainer({
      UID: 'feature-section-body',
      ownStyles: {
        display: 'flex',
        alignItems: 'center',
        maxWidth: '940px',
      },
      children: [
        makeImage({
          UID: 'feature-section-image',
          ownStyles: {
            width: '100%',
            height: 'auto',
            marginRight: '40px',
          },
        }),
        makeContainer({
          UID: 'feature-section-main',
          buoyancy: 1,
          ownStyles: {},
          children: [
            makeHeading({
              UID: 'feature-section-heading',
              textContent: 'Feature section',
              ownStyles: {
                fontSize: '32px',
                lineHeight: '36px',
                marginTop: '20px',
                marginBottom: '10px',
              },
            }),
            makeParagraph({
              UID: 'feature-section-paragraph',
              buoyancy: 1,
              ownStyles: {
                fontSize: '14px',
                lineHeight: '20px',
                marginBottom: '16px',
              },
              textContent:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus!',
            }),
            makeParagraph({
              UID: 'feature-section-paragraph-2',
              buoyancy: 2,
              ownStyles: {
                fontSize: '14px',
                lineHeight: '20px',
                marginBottom: '16px',
              },
              textContent:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus!',
            }),
          ],
        }),
      ],
    }),
  ],
});

export const makeSection = (): SectionServerElement => ({
  id: 'section',
  buoyancy: 0,
  func_type: 'section',
  struct_type: 'section',
  parameters: {
    layouts: DEFAULT_LAYOUT_LIST,
    group: ElementGroup.CONTAINERS,
    freeCanvas: defaultFreeCanvasParams,
  },
  styles: {
    classNames: ['section'],
    ownStyles: {},
    pseudoClassStyles: {},
  },
  name: 'section',
  children: [],
});
