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

render(
  <Router>
    <Switch>
      {renderTreeInfo.map(({ name, renderTree: { containers, elements } }) => (
        <Route path={`/${name}`}>
          <RenderTree
            item={containers.find(container => container.parent_id === -1)}
            scenarioList={containers}
            elementList={elements}
          />
        </Route>
      ))}
      <Redirect from="/*" to={`/${renderTreeInfo[0].name}`} />
    </Switch>
  </Router>,
  document.getElementById('root'),
);
