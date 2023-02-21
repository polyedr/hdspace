import { createSelector } from 'reselect';
import { AppReduxState, Link } from '@Redux/types';
import { selectAllElements } from '@Redux/project/selectors/element';
import { selectScreens } from '@Redux/project/selectors/screen';

export const selectCurrentWireframeScreen = (state: AppReduxState) =>
  state.wireframe.activeScreen;
export const selectCurrentWireframeElement = (state: AppReduxState) =>
  state.wireframe.activeElement;

export const selectElementLinks = createSelector(
  selectAllElements,
  selectScreens,
  (allElements, screens) => {
    let links: Link[] = [];

    Object.values(screens).forEach((screen) => {
      function getLinks(elementId, screen) {
        let _links: Link[] = [];
        const element = allElements[elementId];

        if (element?.name !== 'Root') {
          if (element.parameters?.screenLink) {
            const [projectId, destinationScreenId] =
              element.parameters?.screenLink.split('/');
            _links.push({
              projectId,
              screenId: screen.id,
              destinationScreenId,
              elementId: element.id,
              isExternalLink: false,
            });
          } else if (element.parameters?.link) {
            _links.push({
              isExternalLink: true,
              link: element.parameters.link,
              screenId: screen.id,
              elementId: element.id,
            });
          }
        }

        element.children.forEach((childId) => {
          _links = [..._links, ...getLinks(childId, screen)];
        });

        return _links;
      }

      links = [...links, ...getLinks(screen.element, screen)];
    });
    return links;
  },
);

export const selectScreenLinks = createSelector(selectElementLinks, (links) => {
  return links.filter((link) => !link.isExternalLink);
});
