import { LibraryElement } from '../../api/types';
import { IProjectScreen } from '../../redux/project/types';

export const mockRoot = {
  id: '1',
  name: 'heading',
  type: 'heading',
  buoyancy: 0,
  image: null,
  parameters: {},
  styles: {},
  children: [
    {
      id: '2',
      name: 'heading',
      type: 'heading',
      buoyancy: 0,
      image: null,
      parameters: {},
      styles: {},
      children: [
        {
          id: '3',
          name: 'heading',
          type: 'heading',
          buoyancy: 0,
          image: null,
          parameters: {},
          styles: {},
          children: [],
        },
        {
          id: '4',
          name: 'heading',
          type: 'heading',
          buoyancy: 1,
          image: null,
          parameters: {},
          styles: {},
          children: [
            {
              id: '5',
              name: 'heading',
              type: 'heading',
              buoyancy: 0,
              image: null,
              parameters: {},
              styles: {},
              children: [],
            },
            {
              id: '6',
              name: 'heading',
              type: 'heading',
              buoyancy: 1,
              image: null,
              parameters: {},
              styles: {},
              children: [],
            },
          ],
        },
      ],
    },
  ],
} as LibraryElement<'heading'>;

export const mockRootWithStyles = {
  id: '1',
  name: 'heading',
  type: 'heading',
  buoyancy: 0,
  image: null,
  parameters: {},
  styles: {
    classNames: ['heading'],
    ownStyles: {
      color: 'blue',
      fontSize: '14px',
    },
  },
  children: [
    {
      id: '2',
      name: 'heading',
      type: 'heading',
      buoyancy: 0,
      image: null,
      parameters: {},
      styles: {
        classNames: ['heading'],
        ownStyles: {
          color: 'blue',
          fontSize: '14px',
        },
      },
      children: [
        {
          id: '3',
          name: 'heading',
          type: 'heading',
          buoyancy: 0,
          image: null,
          parameters: {},
          styles: {
            classNames: ['heading'],
            ownStyles: {
              color: 'blue',
              fontSize: '14px',
            },
          },
          children: [],
        },
        {
          id: '4',
          name: 'heading',
          type: 'heading',
          buoyancy: 1,
          image: null,
          parameters: {},
          styles: {
            classNames: ['heading'],
            ownStyles: {
              color: 'blue',
              fontSize: '14px',
            },
          },
          children: [
            {
              id: '5',
              name: 'heading',
              type: 'heading',
              buoyancy: 0,
              image: null,
              parameters: {},
              styles: {
                classNames: ['heading'],
                ownStyles: {
                  color: 'blue',
                  fontSize: '14px',
                },
              },
              children: [],
            },
            {
              id: '6',
              name: 'heading',
              type: 'heading',
              buoyancy: 1,
              image: null,
              parameters: {},
              styles: {
                classNames: ['heading'],
                ownStyles: {
                  color: 'blue',
                  fontSize: '14px',
                },
              },
              children: [],
            },
          ],
        },
      ],
    },
  ],
} as LibraryElement<'heading'>;

export const mockRootElement: LibraryElement<'root'> = {
  id: '1',
  name: 'root',
  type: 'root',
  buoyancy: 0,
  image: null,
  children: [],
  parameters: {},
  // @ts-ignore
  styles: {},
};

export const mockScreen: IProjectScreen = {
  status: 'in_progress',
  project: 7777,
  name: 'test_screen',
  buoyancy: 0,
  id: 3333,
  image: null,
  screenscenario: [11111],
  element: mockRootElement,
};
