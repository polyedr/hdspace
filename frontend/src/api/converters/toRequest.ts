import getDefaultStyles from '@Utils/getDefaultStyles';
import { cssDecamelize } from '@Utils/CSSConverter';
import { DEFAULT_ELEMENTS_STYLES } from '@Domain/libraryElements/defaultStyles';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import {
  CreatedServerProject,
  Entity,
  LibraryElement,
  ProfileData,
  Project,
  Screen,
  ProjectClass,
  ServerElement,
  ServerProfileData,
  ServerProject,
  ServerScreen,
  ServerUserData,
  StateElement,
  UserData,
} from '@Src/types';

export const convertCreatedElementToRequest = <
  T extends Entity,
  K extends ServerElement<T>['parameters'],
>(
  elementType: T,
  parentID: string | null,
  elementName?: string | null,
  parameters?: any,
  shared?: boolean,
  styles?: any,
): ServerElement<T, Array<ServerElement<Entity>>, K> => {
  const libraryElement = LIBRARY_ELEMENTS[
    elementType
  ]() as unknown as ServerElement<T, Array<ServerElement<Entity>>, K>;
  const { name } = libraryElement;
  return {
    ...libraryElement,
    id: -1,
    name: elementName || name,
    ...(parentID && { scenario: parseInt(parentID) }),
    parameters: {
      ...libraryElement.parameters,
      ...(parameters || {}),
    },
    shared: shared || false,
    styles: styles || {},
  };
};

export const convertElementToRequest = <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters'],
>(
  element: LibraryElement<T, Array<LibraryElement<K>>, P>,
  convertFn?: (
    originalEl: LibraryElement<T, Array<LibraryElement<K>>, P>,
    convertedEl: ServerElement<T, Array<ServerElement<K>>, P>,
  ) => ServerElement<T, Array<ServerElement<K>>, P>,
): ServerElement<T, Array<ServerElement<K>>, P> => {
  const { id, name, children, type, buoyancy, image, parameters, styles } =
    element;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pseudoClassViewStyles, ...serverStyles } = styles;
  const serverEl: ServerElement<T, Array<ServerElement<K>>, P> = {
    id: Number(id),
    name,
    children: children.map((child) =>
      convertElementToRequest(
        child as any as LibraryElement<T, Array<LibraryElement<K>>, P>,
        convertFn,
      ),
    ) as any[],
    struct_type: type,
    func_type: type,
    buoyancy,
    image,
    parameters,
    styles: {
      ...serverStyles,
      ownStyles: cssDecamelize(styles.ownStyles),
      pseudoClassStyles: Object.keys(styles.pseudoClassStyles).reduce(
        (pseudoStyles, className) => ({
          ...pseudoStyles,
          [className]: cssDecamelize(styles.pseudoClassStyles[className]),
        }),
        {},
      ),
    },
  };
  return convertFn ? convertFn(element, serverEl) : serverEl;
};

export const convertElementToPatchRequest = <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters'],
>(
  element: LibraryElement<T, Array<LibraryElement<K>>, P>,
): ServerElement<T, Array<ServerElement<K>>, P> => {
  const { id, name, type, buoyancy, parameters, styles, shared } = element;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pseudoClassViewStyles, ...serverStyles } = styles;
  return {
    id: Number(id),
    name,
    children: [],
    struct_type: type,
    func_type: type,
    buoyancy,
    parameters,
    styles: {
      ...serverStyles,
      ownStyles: cssDecamelize(styles.ownStyles),
      pseudoClassStyles: Object.keys(styles.pseudoClassStyles).reduce(
        (pseudoStyles, className) => ({
          ...pseudoStyles,
          [className]: cssDecamelize(styles.pseudoClassStyles[className]),
        }),
        {},
      ),
    },
    shared,
  };
};

export const convertStateElementToPatchRequest = (
  element: StateElement,
): ServerElement<Entity> => {
  const { id, name, type, buoyancy, parameters, styles, shared } = element;
  return {
    id: Number(id),
    name,
    children: [],
    struct_type: type,
    func_type: type,
    buoyancy,
    image: null,
    parameters,
    styles: {
      ...styles,
      ownStyles: cssDecamelize(styles.ownStyles),
      pseudoClassStyles: Object.keys(styles.pseudoClassStyles).reduce(
        (pseudoStyles, className) => ({
          ...pseudoStyles,
          [className]: cssDecamelize(styles.pseudoClassStyles[className]),
        }),
        {},
      ),
    },
    shared,
  } as ServerElement<Entity>;
};

export const convertCreatedProjectToRequest = (
  name: string,
  board,
): CreatedServerProject => {
  const projectClasses: ProjectClass[] = Object.keys(
    DEFAULT_ELEMENTS_STYLES,
  ).map((elementName) => ({
    className: elementName,
    supportedElement: elementName as Entity,
    rules: getDefaultStyles(elementName as Entity),
  }));

  return {
    name,
    status: 'pending',
    projectscreen: [],
    project_data_text: '',
    project_data_trello_json: JSON.stringify(board),
    project_data_json: JSON.stringify({
      defaultStyles: {
        indents: {
          marginTop: 0,
          marginLeft: 0,
          marginBottom: 0,
          marginRight: 0,
          paddingTop: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          paddingRight: 0,
        },
        typography: {
          color: '#323232',
          fontFamily: '"Arial", sans-serif',
          fontSize: '14px',
          fontWeight: 100,
          textAlign: 'center',
        },
        headingType: {
          fontSize: '40px',
        },
        colors: {
          color: '#323232',
        },
        accentColor: {
          'accent-color': 'transparent',
        },
        screenBackgroundColor: {
          background: 'transparent',
        },
        fontColorOverlay: {
          color: '#323232',
        },
        elementsBackgroundColor: {
          'background-color': 'transparent',
        },
        borderColor: {
          'border-color': 'transparent',
        },
        border: {
          borderRadius: '0%',
        },
      },
      classes: projectClasses.map((cls: ProjectClass) => ({
        ...cls,
        // rules: cssDecamelize(cls.rules),
      })),
    }),
  };
};

export const convertProjectToPatchRequest = (
  project: Project,
): Omit<
  ServerProject,
  'created' | 'updated' | 'project_data_text' | 'user'
> => {
  const {
    id,
    name,
    status,
    projectscreen,
    projectData,
    tags,
    projectTrelloJSON,
  } = project;

  return {
    id,
    name,
    status,
    projectscreen,
    tags,
    project_data_trello_json: JSON.stringify(projectTrelloJSON),
    project_data_json: JSON.stringify({
      ...projectData,
      classes: projectData.classes.map((cls: ProjectClass) => ({
        ...cls,
      })),
    }),
  };
};

export const convertScreenToPatchRequest = (
  screen: Screen,
): Omit<ServerScreen, 'id' | 'project' | 'screenscenario' | 'element'> => {
  const { name, status, image, buoyancy, screenData } = screen;
  return {
    name,
    status,
    image,
    buoyancy,
    screen_data_json: JSON.stringify(screenData),
  };
};

export const convertUserDataToRequest = ({
  firstName,
  dateJoined,
  isActive,
  lastName,
  profile,
  ...rest
}: Partial<UserData>): Partial<ServerUserData> => ({
  first_name: firstName,
  date_joined: dateJoined?.toString(),
  is_active: isActive,
  last_name: lastName,
  profile: undefined,
  ...rest,
});

export const convertProfileDataToRequest = ({
  hourlyRate,
  ...rest
}: Partial<ProfileData>): Partial<ServerProfileData> => ({
  hourly_rate: hourlyRate,
  ...rest,
});
