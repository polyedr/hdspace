import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';

import { RenderTree } from '$components/RenderTree/RenderTree';
import { Page } from '$redux/project/types';
import { selectors, actionsCreators, ReduxState } from '$redux/export';

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
    savedElements: selectors.selectSavedElementsValues(state),
  };
};

const mapDispatchToProps = {
  updateSavedElementsValues: actionsCreators.updateSavedElementsValues,
  updateSavedElementValues: actionsCreators.updateSavedElementValues,
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
