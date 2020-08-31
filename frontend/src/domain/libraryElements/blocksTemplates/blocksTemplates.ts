import {
  PageTemplateServerElement,
  SubscribeFormServerElement,
  CardsSectionServerElement,
  FeatureSectionServerElement,
} from '$api/types';
import { CssLikeStyles } from '$utils/StyleHelper';
import {
  makeContainer,
  makeScreenshot,
  makeImage,
} from '../otherElements/otherElements';
import {
  makeHeading,
  makeParagraph,
} from '../typographyElements/typographyElements';
import {
  makeLabel,
  makeTextinput,
  makeButton,
} from '../formElements/formElements';

export const pageTemplate: PageTemplateServerElement = {
  buoyancy: 0,
  func_type: 'pageTemplate',
  struct_type: 'pageTemplate',
  parameters: {
    group: 'containers',
  },
  styles: {
    classNames: ['pageTemplate'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'pageTemplate',
  children: [
    makeContainer({
      name: 'Header',
      children: [makeScreenshot()],
      ownStyles: {
        'padding-right': '5px',
        'padding-left': '5px',
        height: '80px',
      } as Required<CssLikeStyles>,
    }),
    makeContainer({
      children: [
        makeContainer({
          name: 'Left Panel',
          children: [makeScreenshot()],
          ownStyles: {
            'padding-top': '0px',
            'padding-right': '5px',
            'padding-bottom': '0px',
            'padding-left': '5px',
            width: '25%',
            'flex-grow': 1,
          } as Required<CssLikeStyles>,
        }),
        makeContainer({
          name: 'Main Content',
          children: [makeScreenshot()],
          buoyancy: 1,
          ownStyles: {
            'padding-top': '0px',
            'padding-right': '5px',
            'padding-bottom': '0px',
            'padding-left': '5px',
            width: '50%',
            'flex-grow': 3000,
          } as Required<CssLikeStyles>,
        }),
        makeContainer({
          name: 'Right Panel',
          children: [makeScreenshot()],
          buoyancy: 2,
          ownStyles: {
            'padding-top': '0px',
            'padding-right': '5px',
            'padding-bottom': '0px',
            'padding-left': '5px',
            width: '25%',
            'flex-grow': 1,
          } as Required<CssLikeStyles>,
        }),
      ],
      ownStyles: {
        height: '150px',
        display: 'flex',
        'padding-top': '5px',
        'padding-right': '0px',
        'padding-bottom': '5px',
        'padding-left': '0px',
        'flex-grow': 1,
      } as Required<CssLikeStyles>,
    }),
    makeContainer({
      name: 'Footer',
      children: [makeScreenshot()],
      ownStyles: {
        'padding-right': '5px',
        'padding-left': '5px',
        height: '80px',
      } as Required<CssLikeStyles>,
    }),
  ],
};

export const subscribeForm: SubscribeFormServerElement = {
  buoyancy: 1,
  func_type: 'subscribeForm',
  struct_type: 'subscribeForm',
  parameters: {
    group: 'containers',
  },
  styles: {
    classNames: ['subscribeForm'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'subscribeForm',
  children: [
    makeContainer({
      ownStyles: {
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        'max-width': '940px',
        'text-align': 'center',
      } as Required<CssLikeStyles>,
      children: [
        makeHeading({
          headingType: 'h2',
          textContent: 'Subscribe form',
          ownStyles: {
            'font-size': '32px',
            'line-height': '36px',
            'margin-top': '20px',
            'margin-bottom': '10px',
          } as Required<CssLikeStyles>,
        }),
        makeParagraph({
          ownStyles: {
            'font-size': '14px',
            'line-height': '20px',
            'text-align': 'center',
            'margin-bottom': '10px',
          } as Required<CssLikeStyles>,
          buoyancy: 1,
          textContent:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus!',
        }),
        makeContainer({
          buoyancy: 2,
          ownStyles: {
            width: 'auto',
            'margin-bottom': '15px',
          } as Required<CssLikeStyles>,
          children: [
            makeLabel({
              ownStyles: ({
                'font-size': '14px',
                'font-weight': '700',
                'margin-bottom': '5px',
              } as unknown) as Required<CssLikeStyles>,
              textContent: 'Email',
            }),
            makeContainer({
              buoyancy: 1,
              ownStyles: {
                display: 'flex',
                width: 'auto',
                'padding-top': '0px',
                'padding-right': '0px',
                'padding-bottom': '0px',
                'padding-left': '0px',
              } as Required<CssLikeStyles>,
              children: [
                makeTextinput({
                  ownStyles: {
                    width: '200px',
                    'padding-top': '12px',
                    'padding-right': '16px',
                    'padding-bottom': '12px',
                    'padding-left': '16px',
                    'font-size': '14px',
                    'line-height': '1.4',
                  } as Required<CssLikeStyles>,
                }),
                makeButton({
                  buoyancy: 1,
                  textContent: 'subscribe',
                  ownStyles: {
                    'padding-top': '9px',
                    'padding-right': '15px',
                    'padding-bottom': '9px',
                    'padding-left': '15px',
                    'font-size': '14px',
                  } as Required<CssLikeStyles>,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
};

export const cardsSection: CardsSectionServerElement = {
  buoyancy: 0,
  func_type: 'cardsSection',
  struct_type: 'cardsSection',
  parameters: {
    group: 'containers',
  },
  styles: {
    classNames: ['cardsSection'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'cardsSection',
  children: [
    makeContainer({
      ownStyles: {
        'max-width': '940px',
      } as Required<CssLikeStyles>,
      children: [
        makeHeading({
          headingType: 'h2',
          textContent: 'Cards Section',
          ownStyles: {
            'text-align': 'center',
            'font-size': '32px',
            'line-height': '36px',
            'margin-top': '20px',
            'margin-bottom': '10px',
          } as Required<CssLikeStyles>,
        }),
        makeParagraph({
          ownStyles: {
            'font-size': '14px',
            'line-height': '20px',
            'text-align': 'center',
            'margin-bottom': '10px',
          } as Required<CssLikeStyles>,
          buoyancy: 1,
          textContent:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus! Aut illum a minus cumque iste, quibusdam corporis atque odit magnam impedit esse possimus perspiciatis culpa non id tempore fugiat molestiae eos dolorem, labore maiores ratione? Sequi tenetur porro enim reprehenderit amet accusamus eos itaque saepe quidem quod, sit vero ab recusandae vitae, facere nobis cumque minima libero aut quos nihil labore eius. Soluta doloremque mollitia nihil voluptatibus, nostrum commodi eaque similique ipsam ad libero at tenetur.',
        }),
        makeContainer({
          buoyancy: 2,
          ownStyles: {
            display: 'flex',
            'justify-content': 'space-between',
          } as Required<CssLikeStyles>,
          children: [
            makeContainer({
              children: [
                makeImage({
                  ownStyles: {
                    width: '100%',
                  } as Required<CssLikeStyles>,
                }),
                makeHeading({
                  buoyancy: 1,
                  textContent: 'Card one',
                  ownStyles: {
                    'font-size': '24px',
                    'line-height': '30px',
                    'margin-top': '20px',
                    'margin-bottom': '10px',
                  } as Required<CssLikeStyles>,
                }),
                makeParagraph({
                  buoyancy: 2,
                  ownStyles: {
                    'font-size': '14px',
                    'line-height': '20px',
                    'margin-bottom': '10px',
                  } as Required<CssLikeStyles>,
                  textContent:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus!',
                }),
              ],
              ownStyles: {
                'padding-top': '0px',
                'padding-right': '20px',
                'padding-bottom': '0px',
                'padding-left': '20px',
                width: '33%',
                'flex-grow': 1,
              } as Required<CssLikeStyles>,
            }),
            makeContainer({
              children: [
                makeImage({
                  ownStyles: {
                    width: '100%',
                  } as Required<CssLikeStyles>,
                }),
                makeHeading({
                  buoyancy: 1,
                  textContent: 'Card two',
                  ownStyles: {
                    'font-size': '24px',
                    'line-height': '30px',
                    'margin-top': '20px',
                    'margin-bottom': '10px',
                  } as Required<CssLikeStyles>,
                }),
                makeParagraph({
                  buoyancy: 2,
                  ownStyles: {
                    'font-size': '14px',
                    'line-height': '20px',
                    'margin-bottom': '10px',
                  } as Required<CssLikeStyles>,
                  textContent:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus!',
                }),
              ],
              buoyancy: 1,
              ownStyles: {
                'padding-top': '0px',
                'padding-right': '20px',
                'padding-bottom': '0px',
                'padding-left': '20px',
                width: '33%',
                'flex-grow': 1,
              } as Required<CssLikeStyles>,
            }),
            makeContainer({
              children: [
                makeImage({
                  ownStyles: {
                    width: '100%',
                  } as Required<CssLikeStyles>,
                }),
                makeHeading({
                  buoyancy: 1,
                  textContent: 'Card three',
                  ownStyles: {
                    'font-size': '24px',
                    'line-height': '30px',
                    'margin-top': '20px',
                    'margin-bottom': '10px',
                  } as Required<CssLikeStyles>,
                }),
                makeParagraph({
                  buoyancy: 2,
                  ownStyles: {
                    'font-size': '14px',
                    'line-height': '20px',
                    'margin-bottom': '10px',
                  } as Required<CssLikeStyles>,
                  textContent:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus!',
                }),
              ],
              buoyancy: 2,
              ownStyles: {
                'padding-top': '0px',
                'padding-right': '20px',
                'padding-bottom': '0px',
                'padding-left': '20px',
                width: '33%',
                'flex-grow': 1,
              } as Required<CssLikeStyles>,
            }),
          ],
        }),
      ],
    }),
  ],
};

export const featureSection: FeatureSectionServerElement = {
  buoyancy: 0,
  func_type: 'featureSection',
  struct_type: 'featureSection',
  parameters: {
    group: 'containers',
  },
  styles: {
    classNames: ['featureSection'],
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'featureSection',
  children: [
    makeContainer({
      ownStyles: {
        display: 'flex',
        'align-items': 'center',
        'max-width': '940px',
      } as Required<CssLikeStyles>,
      children: [
        makeImage({
          ownStyles: {
            width: '100%',
            height: 'auto',
            'margin-right': '40px',
          } as Required<CssLikeStyles>,
        }),
        makeContainer({
          buoyancy: 1,
          ownStyles: {} as Required<CssLikeStyles>,
          children: [
            makeHeading({
              textContent: 'Feature section',
              ownStyles: {
                'font-size': '32px',
                'line-height': '36px',
                'margin-top': '20px',
                'margin-bottom': '10px',
              } as Required<CssLikeStyles>,
            }),
            makeParagraph({
              buoyancy: 1,
              ownStyles: {
                'font-size': '14px',
                'line-height': '20px',
                'margin-bottom': '16px',
              } as Required<CssLikeStyles>,
              textContent:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus!',
            }),
            makeParagraph({
              buoyancy: 2,
              ownStyles: {
                'font-size': '14px',
                'line-height': '20px',
                'margin-bottom': '16px',
              } as Required<CssLikeStyles>,
              textContent:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus!',
            }),
          ],
        }),
      ],
    }),
  ],
};
