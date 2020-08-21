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
    ownStyles: {} as Required<CssLikeStyles>,
  },
  name: 'pageTemplate',
  children: [
    makeContainer({
      children: [makeScreenshot()],
      ownStyles: { height: '80px' } as Required<CssLikeStyles>, // TODO maybe need move into default styles
    }),
    makeContainer({
      children: [
        makeScreenshot({
          ownStyles: { 'margin-right': '5px', width: '25%' } as Required<
            CssLikeStyles
          >,
        }),
        makeScreenshot({
          ownStyles: {
            'margin-right': '5px',
            'margin-left': '5px',
            width: '50%',
          } as Required<CssLikeStyles>,
        }),
        makeScreenshot({
          ownStyles: { 'margin-left': '5px', width: '25%' } as Required<
            CssLikeStyles
          >,
        }),
      ],
      ownStyles: { height: '150px', display: 'flex' } as Required<
        CssLikeStyles
      >, // TODO remove type assertions
    }),
    makeContainer({
      children: [makeScreenshot()],
      ownStyles: { height: '80px' } as Required<CssLikeStyles>,
    }),
  ],
};
