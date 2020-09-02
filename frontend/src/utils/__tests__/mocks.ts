import { LibraryElement } from '../../api/types';

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
