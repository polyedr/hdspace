import { cssCamelize } from '@Utils/CSSConverter';
import {
  ElementGroup,
  Entity,
  LibraryElement,
  ProfileData,
  Project,
  ProjectClass,
  ProjectData,
  ProjectWithScreens,
  RecursiveElement,
  Screen,
  ServerElement,
  ServerProfileData,
  ServerProject,
  ServerProjectWithScreens,
  ServerRecursiveElement,
  ServerScreen,
  ServerUserData,
  UserData,
  ServerMarketplace,
  Marketplace,
} from '@Src/types';
import { capitalize } from '@Utils/stringHelper';
import { defaultFreeCanvasParams } from '@Domain/core';
import { DEFAULT_LAYOUT_LIST } from '@Constants/defaultParams';
import { NOT_SELECTED_FRAMEWORK } from '@Constants/frameworks';

const defaultParameters = {
  freeCanvas: defaultFreeCanvasParams,
  group: ElementGroup.UNDEFINED,
  layouts: DEFAULT_LAYOUT_LIST,
};
const getDefaultStyles = (struct_type: Entity) => ({
  classNames: [struct_type],
  ownStyles: {},
});

export const convertElementFromResponse = <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters'],
>({
  id,
  name,
  children,
  struct_type,
  buoyancy,
  image,
  parameters,
  styles,
}: ServerElement<T, Array<ServerElement<K>>, P>): LibraryElement<
  T,
  Array<LibraryElement<K>>,
  P
> => ({
  id: String(id),
  name: name || capitalize(struct_type) || 'Container',
  children: children
    .map((child) => convertElementFromResponse(child))
    .sort(
      (firstChild, secondChild) => firstChild.buoyancy - secondChild.buoyancy,
    ),
  // @ts-expect-error
  type: struct_type || 'container',
  buoyancy,
  image,
  // @ts-expect-error
  parameters: {
    ...defaultParameters,
    ...parameters,
  },
  styles: {
    ...getDefaultStyles(struct_type),
    ...styles,
    ownStyles: styles.ownStyles ? cssCamelize(styles.ownStyles) : {},
    pseudoClassStyles: styles.pseudoClassStyles
      ? Object.keys(styles.pseudoClassStyles).reduce(
          (pseudoStyles, className) => ({
            ...pseudoStyles,
            [className]: cssCamelize(styles.pseudoClassStyles[className]),
          }),
          {},
        )
      : {},
  },
});

export const convertNNElementFromResponse = <
  T extends Entity,
  K extends Entity,
  P extends ServerElement<T>['parameters'],
>({
  id,
  name,
  children,
  struct_type,
  buoyancy,
  image,
  parameters,
  styles,
}: ServerElement<T, Array<ServerElement<K>>, P>): LibraryElement<
  T,
  Array<LibraryElement<K>>,
  P
> => ({
  id: String(id),
  name: name || capitalize(struct_type) || 'Container',
  children: children
    .map((child) => convertNNElementFromResponse(child))
    .sort(
      (firstChild, secondChild) => firstChild.buoyancy - secondChild.buoyancy,
    ),
  // @ts-expect-error
  type: struct_type || 'container',
  buoyancy,
  image,
  // @ts-expect-error
  parameters: {
    ...defaultParameters,
    ...(parameters || {}),
  },
  styles: {
    ...getDefaultStyles(struct_type),
    pseudoClassStyles: {},
    ownStyles: styles ? cssCamelize(styles) : {},
  },
});

export const convertRecursiveElementFromResponse = (
  element: ServerRecursiveElement,
): RecursiveElement => {
  const { id, name, children } = element;

  return {
    id: String(id),
    name,
    children,
  };
};

export const convertProfileDataFromResponse = ({
  hourly_rate,
  ...rest
}: ServerProfileData): ProfileData => {
  if (!rest.parameters.profileDataParameters) {
    return {
      ...rest,
      hourlyRate: hourly_rate,
      parameters: {
        ...rest.parameters,
        profileDataParameters: {
          autoSwitchTabs: false,
          dropTargetBordersMode: true,
        },
      },
    };
  }
  return {
    hourlyRate: hourly_rate,
    ...rest,
  };
};

export const convertUserDataFromResponse = ({
  first_name,
  last_name,
  date_joined,
  is_active,
  profile,
  ...rest
}: ServerUserData): UserData => ({
  firstName: first_name,
  lastName: last_name,
  dateJoined: new Date(date_joined),
  isActive: is_active,
  profile: convertProfileDataFromResponse(profile),
  ...rest,
});

export function convertProjectFromResponse({
  id,
  name,
  status,
  projectscreen,
  created,
  updated,
  user,
  project_data_json,
  project_data_trello_json,
  tags,
}: ServerProject): Project {
  const projectDataJSON = JSON.parse(project_data_json);
  const projectTrelloJSON = JSON.parse(project_data_trello_json);
  return {
    id,
    name,
    status,
    projectscreen,
    projectLoader: false,
    created: new Date(created),
    updated: new Date(updated),
    tags,
    projectTrelloJSON,
    user: convertUserDataFromResponse(user),
    projectData: {
      ...projectDataJSON,
      classes:
        projectDataJSON.classes?.map(
          (cls: ProjectClass) =>
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            ({
              ...cls,
              rules: cssCamelize(cls.rules),
            } as ProjectClass),
        ) || [],
      uiFramework: projectDataJSON.uiFramework || NOT_SELECTED_FRAMEWORK,
    },
  };
}
export function convertTemplatesFromResponse({
  id,
  name,
  status,
  projectscreen,
  created,
  updated,
  user,
  project_data_json,
  project_data_trello_json,
  tags,
}: ServerMarketplace): Marketplace {
  const projectDataJSON = JSON.parse(project_data_json);
  const projectTrelloJSON = JSON.parse(project_data_trello_json);
  return {
    id,
    name,
    status,
    projectscreen,
    TemplateLoader: false,
    created: new Date(created),
    updated: new Date(updated),
    tags,
    projectTrelloJSON,
    user: convertUserDataFromResponse(user),
    marketplaceData: {
      ...projectDataJSON,
      classes:
        projectDataJSON.classes?.map(
          (cls: ProjectClass) =>
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            ({
              ...cls,
              rules: cssCamelize(cls.rules),
            } as ProjectClass),
        ) || [],
      uiFramework: projectDataJSON.uiFramework || NOT_SELECTED_FRAMEWORK,
    },
  };
}
export function convertScreenFromResponse({
  id,
  name,
  status,
  project,
  image,
  screenscenario,
  buoyancy,
  element,
  screen_data_json,
}: ServerScreen): Screen {
  const screenDataJSON = JSON.parse(screen_data_json);
  return {
    id,
    name,
    status,
    project,
    image,
    screenscenario,
    buoyancy,
    element,
    screenData: {
      meta: screenDataJSON.meta || {},
      uiFramework: screenDataJSON.uiFramework || NOT_SELECTED_FRAMEWORK,
      freeCanvas: screenDataJSON.freeCanvas,
      editableScreenUser: screenDataJSON.editableScreenUser || [],
      wireframePosition: screenDataJSON?.wireframePosition || undefined,
    },
  };
}

export function convertNNScreenFromResponse({
  id,
  name,
  status,
  project,
  image,
  screenscenario,
  buoyancy,
  element,
  screen_data_json,
}: ServerScreen): Screen {
  return {
    id,
    name,
    status,
    project,
    image,
    screenscenario,
    buoyancy,
    element,
    screenData: {
      uiFramework: NOT_SELECTED_FRAMEWORK,
      nnResult: screen_data_json,
      freeCanvas: false,
      editableScreenUser: [],
    },
  };
}

export function convertProjectWithScreensFromResponse({
  id,
  name,
  status,
  projectscreen,
  created,
  updated,
  user,
  project_data_json,
  project_data_trello_json,
  tags,
}: ServerProjectWithScreens): ProjectWithScreens {
  const projectDataJSON = JSON.parse(project_data_json || '{}') as ProjectData;
  const projectTrelloJSON = JSON.parse(project_data_trello_json);
  return {
    id,
    name,
    status,
    projectscreen: projectscreen.map(convertScreenFromResponse),
    projectLoader: false,
    created: new Date(created),
    updated: new Date(updated),
    user: convertUserDataFromResponse(user),
    tags,
    projectTrelloJSON,
    projectData: {
      ...projectDataJSON,
      classes:
        projectDataJSON.classes?.map(
          (cls: ProjectClass) =>
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            ({
              ...cls,
              rules: cssCamelize(cls.rules),
            } as ProjectClass),
        ) || [],
    },
  };
}
