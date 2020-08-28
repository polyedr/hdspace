import {
  PageTemplateServerElement,
  SubscribeFormServerElement,
} from '$api/types';
import { CssLikeStyles } from '$utils/StyleHelper';
import { makeContainer, makeScreenshot } from '../otherElements/otherElements';
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
    ownStyles: {
      width: '100%',
      height: '100%',
      display: 'flex',
      'flex-direction': 'column',
    } as Required<CssLikeStyles>,
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
    ownStyles: {
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      'justify-content': 'center',
      'padding-top': '20px',
      'padding-right': '20px',
      'padding-bottom': '20px',
      'padding-left': '20px',
    } as Required<CssLikeStyles>,
  },
  name: 'subscribeForm',
  children: [
    makeHeading({ textContent: 'Subscribe form' }),
    makeParagraph({
      ownStyles: {
        'margin-bottom': '20px',
      } as Required<CssLikeStyles>,
      buoyancy: 1,
      textContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id labore error ipsum laboriosam necessitatibus aperiam facere aut quo quibusdam, possimus quia odit placeat nostrum, similique pariatur corporis nobis sint rerum laborum architecto natus! Aut illum a minus cumque iste, quibusdam corporis atque odit magnam impedit esse possimus perspiciatis culpa non id tempore fugiat molestiae eos dolorem, labore maiores ratione? Sequi tenetur porro enim reprehenderit amet accusamus eos itaque saepe quidem quod, sit vero ab recusandae vitae, facere nobis cumque minima libero aut quos nihil labore eius. Soluta doloremque mollitia nihil voluptatibus, nostrum commodi eaque similique ipsam ad libero at tenetur.',
    }),
    makeContainer({
      buoyancy: 2,
      ownStyles: {
        width: 'auto',
      } as Required<CssLikeStyles>,
      children: [
        makeLabel({
          ownStyles: ({
            'font-weight': '700',
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
            makeTextinput(),
            makeButton({ buoyancy: 1, textContent: 'subscribe' }),
          ],
        }),
      ],
    }),
  ],
};
