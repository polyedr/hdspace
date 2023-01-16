// import { AppReduxState } from '@Redux/types';

export interface Params {}
export type MapParams = Params & {
  apiKey: string;
};

export interface ExportedResource<T extends Params> {
  type: 'css' | 'script' | 'font';
  links: [string];
  params: T;
}

/* export const getResources = (state: AppReduxState) => {
  const { elements } = state.project.data;
  const resources: ExportedResource<Params> = [];
  Object.keys(elements).map((id: string) => {
    const element = elements[id];
    switch (element.type) {
      case 'select':
      case 'checkbox':
      case 'radio':
      case 'list':
      case 'menu':
      default: {
      }
    }
  });
}; */
