import { PageTemplateServerElement } from '$api/types';
import { CssLikeStyles } from '$utils/StyleHelper';
import { makeContainer, makeScreenshot } from '../otherElements/otherElements';

export const pageTemplate: PageTemplateServerElement = {
  buoyancy: 0,
  func_type: 'pageTemplate',
  struct_type: 'pageTemplate',
  parameters: {
    group: 'templates',
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
      } as Required<CssLikeStyles>, // TODO maybe need move into default styles
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
          } as Required<CssLikeStyles>, // TODO maybe need move into default styles
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
          } as Required<CssLikeStyles>, // TODO maybe need move into default styles
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
          } as Required<CssLikeStyles>, // TODO maybe need move into default styles
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
      } as Required<CssLikeStyles>, // TODO remove type assertions
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
