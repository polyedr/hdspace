import React from 'react';

/* import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project';
import * as R from 'ramda';
import { convertPropCSS } from '$utils/StyleHelper';
import { getItemsPair, idToLSId, getParams } from '$utils/parseScenario'; */
// import { IListSortable, ILSItem, IProjectScreen } from '$redux/project/types';
import { T } from '$redux/project';
import { RenderTree } from './RenderTree';

import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { createBrowserHistory } from 'history';

/* import { ConnectedRouter } from 'connected-react-router';
import { history } from '$redux/store'; */

/* const mapStateToProps = (state: AppReduxState, props: OwnProps) => {
  const { listSortable } = selectors.selectCurrentScreen(state);
  const scenarios = selectors.selectScenarios(state);
  const scenarioElements = selectors.selectScenariosElements(state);

  const currId = idToLSId(props.item.id, props.item.type);
  const itemParent = listSortable[currId];

  const currListSortable = itemParent.children.reduce((items: IListSortable, childID) => ({
    ...items,
    [childID]: listSortable[childID],
  }), { [currId]: listSortable[currId] });
  
  const { scenarioList, elementList } = getItemsPair(currListSortable, scenarios, scenarioElements);
  
  return {
    scenarioList,
    elementList,
    listSortable: currListSortable,
  };
}; */

const mapDispatchToProps = {
  
};

export type Page = {
  name: string,
  renderTree: {
    scenarios: T.IScenarioItem[],
    scenarioElements: T.IScenarioElement[],
  },
}

export type OwnProps = {
  renderTreeInfo: Page[],
}

type Props = OwnProps /* & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps */;

const ExportTree: React.FC<Props> = (props) => {
  const { renderTreeInfo } = props;
  const history = createBrowserHistory();

  // const renderTreeInfo: Page[] = [{"name":"558","renderTree":{"scenarios":[{"id":5171,"screen":558,"name":"Root","parent_id":-1,"type":"login","struct_type":"container","direction":"vertical","buoyancy":0,"elements":[9845],"parameters":{"children":["9845e"]},"styles":{"background-color":"rgba(255, 255, 255, 100)","background-image":"none","background-repeat":"no-repeat","background-size":"cover","display":"block","min-height":"100%","min-width":"100%"}}],"scenarioElements":[{"id":9845,"scenario":5171,"name":"Element","struct_type":"button","func_type":"end_composite_scenario","buoyancy":0,"image":null,"parameters":{"parent_id":5171,"group":"button","textContent":"button","actionUrl":"557"},"styles":{"margin-top":"0px","margin-right":"0px","margin-bottom":"0px","margin-left":"0px","padding-top":"5px","padding-right":"5px","padding-bottom":"5px","padding-left":"5px","width":"auto","height":"auto","display":"inline-block","flex-direction":"row","justify-content":"flex-start","align-items":"stretch","color":"#ffffff","font-family":"\"Arial\", \"Verdana\", sans-serif\"","font-size":"14px","font-style":"none","font-weight":400,"line-height":"16px","text-align":"left","border-width":"1px","border-color":"#1890ff","border-style":"solid","border-radius":"4px","background-color":"#1890ff","background-image":"none","background-repeat":"no-repeat","background-size":"cover"}}]}},{"name":"557","renderTree":{"scenarios":[{"id":5170,"screen":557,"name":"Root","parent_id":-1,"type":"login","struct_type":"container","direction":"vertical","buoyancy":0,"elements":[9844,9843,9842,9841,9840],"parameters":{"children":["9840e","9841e","9842e","9843e","9844e"]},"styles":{"background-color":"rgba(255, 255, 255, 100)","background-image":"none","background-repeat":"no-repeat","background-size":"cover","display":"block","min-height":"100%","min-width":"100%"}}],"scenarioElements":[{"id":9844,"scenario":5170,"name":"Element","struct_type":"button","func_type":"end_composite_scenario","buoyancy":0,"image":null,"parameters":{"parent_id":5170,"group":"button","textContent":"button","actionUrl":"558"},"styles":{"margin-top":"0px","margin-right":"0px","margin-bottom":"0px","margin-left":"0px","padding-top":"5px","padding-right":"5px","padding-bottom":"5px","padding-left":"5px","width":"auto","height":"auto","display":"inline-block","flex-direction":"row","justify-content":"flex-start","align-items":"stretch","color":"#ffffff","font-family":"\"Arial\", \"Verdana\", sans-serif\"","font-size":"14px","font-style":"none","font-weight":400,"line-height":"16px","text-align":"left","border-width":"1px","border-color":"#1890ff","border-style":"solid","border-radius":"4px","background-color":"#1890ff","background-image":"none","background-repeat":"no-repeat","background-size":"cover"}},{"id":9843,"scenario":5170,"name":"Element","struct_type":"textinput","func_type":"password","buoyancy":0,"image":null,"parameters":{"parent_id":5170,"group":"input","placeholder":"Enter a label for the field"},"styles":{"margin-top":"0px","margin-right":"0px","margin-bottom":"0px","margin-left":"0px","padding-top":"5px","padding-right":"5px","padding-bottom":"5px","padding-left":"5px","width":"auto","height":"auto","color":"#323232","font-family":"\"Arial\", \"Verdana\", sans-serif\"","font-size":"14px","font-style":"none","font-weight":400,"line-height":"16px","text-align":"left","border-width":"1px","border-color":"#d9d9d9","border-style":"solid","border-radius":"4px","background-color":"rgba(255, 255, 255, 100)","background-image":"none","background-repeat":"no-repeat","background-size":"cover"}},{"id":9842,"scenario":5170,"name":"Element","struct_type":"textinput","func_type":"firstname","buoyancy":0,"image":null,"parameters":{"parent_id":5170,"group":"input","placeholder":"Enter a label for the field","tags":"#username_horizontal"},"styles":{"margin-top":"0px","margin-right":"0px","margin-bottom":"0px","margin-left":"0px","padding-top":"5px","padding-right":"5px","padding-bottom":"5px","padding-left":"5px","width":"auto","height":"auto","color":"#323232","font-family":"\"Arial\", \"Verdana\", sans-serif\"","font-size":"14px","font-style":"none","font-weight":400,"line-height":"16px","text-align":"left","border-width":"1px","border-color":"#d9d9d9","border-style":"solid","border-radius":"4px","background-color":"rgba(255, 255, 255, 100)","background-image":"none","background-repeat":"no-repeat","background-size":"cover"}},{"id":9841,"scenario":5170,"name":"Element","struct_type":"textinput","func_type":"lastname","buoyancy":0,"image":null,"parameters":{"parent_id":5170,"group":"input","placeholder":"Enter a label for the field","tags":"#username_horizontal"},"styles":{"margin-top":"0px","margin-right":"0px","margin-bottom":"0px","margin-left":"0px","padding-top":"5px","padding-right":"5px","padding-bottom":"5px","padding-left":"5px","width":"auto","height":"auto","color":"#323232","font-family":"\"Arial\", \"Verdana\", sans-serif\"","font-size":"14px","font-style":"none","font-weight":400,"line-height":"16px","text-align":"left","border-width":"1px","border-color":"#d9d9d9","border-style":"solid","border-radius":"4px","background-color":"rgba(255, 255, 255, 100)","background-image":"none","background-repeat":"no-repeat","background-size":"cover"}},{"id":9840,"scenario":5170,"name":"Element","struct_type":"textinput","func_type":"email","buoyancy":0,"image":null,"parameters":{"parent_id":5170,"group":"input","placeholder":"Enter a label for the field"},"styles":{"margin-top":"0px","margin-right":"0px","margin-bottom":"0px","margin-left":"0px","padding-top":"5px","padding-right":"5px","padding-bottom":"5px","padding-left":"5px","width":"auto","height":"auto","color":"#323232","font-family":"\"Arial\", \"Verdana\", sans-serif\"","font-size":"14px","font-style":"none","font-weight":400,"line-height":"16px","text-align":"left","border-width":"1px","border-color":"#d9d9d9","border-style":"solid","border-radius":"4px","background-color":"rgba(255, 255, 255, 100)","background-image":"none","background-repeat":"no-repeat","background-size":"cover"}}]}}];
      
// console.log(renderTreeInfo);

  return (
    <Router>
      <Switch>
        {renderTreeInfo.map(({ name, renderTree: { scenarios, scenarioElements } }) => (
          <div>
            <Route path={`/${name}`}>
              <RenderTree
                item={scenarios.find(scenario => scenario.parent_id === -1)}
                scenarioList={scenarios}
                elementList={scenarioElements}
              />
            </Route>
            <Redirect from="/*" to="/569" />
          </div>
        ))}
      </Switch>
    </Router>
  )

  /* {item.children.map((itemId) => {
    const elId = parseInt(itemId, 10);

    const currentItem = listSortable[itemId];
    const { struct_type, parameters, styles, name } = getParams(itemId, elementList, scenarioList);

    if (struct_type === 'container') {
      return (
        <ExportTree
          key={`element-${itemId}`}
          item={currentItem}
        />
      )
    } 

    // @ts-ignore
    const RenderedElement = RENDERERS[struct_type];
    const parsedStyles = convertPropCSS(styles);
    
    return RenderedElement ? (
      <RenderedElement
        key={itemId}
        id={itemId}
        params={parameters}
        name={name}
        style={parsedStyles}
       />
    ) : null;
  })} */
}

export { ExportTree };