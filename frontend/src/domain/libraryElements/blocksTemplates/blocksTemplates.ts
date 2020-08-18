import { PageTemplateServerElement } from '$api/types';
import { CssLikeStyles } from '$utils/StyleHelper';
import { makeContainer, screenshot } from '../otherElements/otherElements';

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
      children: [screenshot],
      ownStyles: { height: '80px' } as Required<CssLikeStyles>, // TODO maybe need move into default styles
    }),
    makeContainer({
      children: [screenshot],
      ownStyles: { height: '150px' } as Required<CssLikeStyles>, // TODO remove type assertions
    }),
    makeContainer({
      children: [screenshot],
      ownStyles: { height: '80px' } as Required<CssLikeStyles>,
    }),
  ],
};
