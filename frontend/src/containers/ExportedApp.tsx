import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import RenderTree from '../components/RenderTree/RenderTree';
import { ReduxState } from '../redux/export';
import { selectSavedElementsValues } from '../redux/export/selectors';
import {
  updateSavedElementsValues,
  updateSavedElementValues,
} from '../redux/export/actions';
import { Page } from '../types';

const renderTreeInfo = window.renderTreeInfo as Page[];
const screensInfo =
  renderTreeInfo &&
  renderTreeInfo.map(({ screenInfo }) => ({
    ...screenInfo,
    name: screenInfo.name.replace(/\s+/g, '-').toLowerCase(),
  }));

export const LinkContext = React.createContext<Page['screenInfo'][] | null>(
  null,
);

const mapStateToProps = (state: ReduxState) => {
  return {
    savedElements: selectSavedElementsValues(state),
  };
};

const mapDispatchToProps = {
  updateSavedElementsValues,
  updateSavedElementValues,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const ExportedAppComponent: React.FC<Props> = ({
  savedElements,
  updateSavedElementsValues,
}) => {
  return (
    <LinkContext.Provider value={screensInfo}>
      <Router>
        <Switch>
          {renderTreeInfo.map(
            (
              { screenInfo: { name }, renderTree: { containers, elements } },
              index,
            ) => {
              const slug = name.replace(/\s+/g, '-').toLowerCase();

              useEffect(() => {
                const newSavedElements = elements.reduce(
                  (acc, element) => ({
                    ...acc,
                    [`${element.id}e`]: {
                      id: element.id,
                      savedValue: element.parameters.textContent || '',
                    },
                  }),
                  savedElements,
                );

                updateSavedElementsValues(newSavedElements);
              }, [elements, updateSavedElementsValues]);

              return (
                <Route
                  exact={index === 0}
                  path={index === 0 ? '/' : `/${slug}`}
                >
                  <RenderTree
                    item={containers.find(
                      (container) => container.parent_id === -1,
                    )}
                    scenarioList={containers}
                    elementList={elements}
                  />
                </Route>
              );
            },
          )}
          <Redirect from="/*" to="/" />
        </Switch>
      </Router>
    </LinkContext.Provider>
  );
};

export const ExportedApp = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportedAppComponent);
