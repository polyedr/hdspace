import React from 'react';
import { render } from 'react-dom';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import 'antd/dist/antd.css';

import { RenderTree } from '$components/RenderTree/RenderTree';
import { Page } from '$redux/project/types';

const renderTreeInfo = window.renderTreeInfo as Page[];
const screensInfo = renderTreeInfo && renderTreeInfo.map(({ screenInfo }) => ({ ...screenInfo, name: screenInfo.name.replace(/\s+/g, '-').toLowerCase() }));

export const LinkContext = React.createContext<Page['screenInfo'][] | null>(null);

const ExportedApp: React.FC = () => {
  return (
    <LinkContext.Provider value={screensInfo}>
      <Router>
        <Switch>
          {renderTreeInfo.reverse().map(({ screenInfo: { name }, renderTree: { containers, elements } }, index) => {
              const slug = name.replace(/\s+/g, '-').toLowerCase();

              return (
                <Route exact={index === 0} path={index === 0 ? '/' : `/${slug}`}>
                  <RenderTree
                    item={containers.find(container => container.parent_id === -1)}
                    scenarioList={containers}
                    elementList={elements}
                  />
                </Route>
              )
            })}
          <Redirect from="/*" to={`/`} />
        </Switch>
      </Router>
    </LinkContext.Provider>
  )
}

export { ExportedApp };
