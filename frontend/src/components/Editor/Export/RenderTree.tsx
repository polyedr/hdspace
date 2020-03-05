import React from 'react';
import * as R from 'ramda';

// import { ILSItem, IScenarioElements, IScenarios, IListSortable } from '$redux/project/types';
import { convertPropCSS } from '$utils/StyleHelper';
import { RENDERERS } from '$components/UI/RenderElements';
import { getParams } from '$utils/parseScenario';
import { T } from '$redux/project';

type Props = {
  elementList: T.IScenarioElement[],
  scenarioList: T.IScenarioItem[],
  item?: T.IScenarioItem,
}

const RenderTree: React.FC<Props> = (props) => {
  const { elementList, scenarioList, item } = props;

  return (<>
    {item && item.parameters.children && item.parameters.children.map((itemId) => {
          const elId = parseInt(itemId, 10);

          /* if (itemId.slice(-1) === 'e' ? !R.prop(elId, elementList) : !R.prop(elId, scenarioList)) {
            return null;
          } */

          const currentItem = scenarioList.find(item => item.id === parseInt(itemId)) || elementList.find(item => item.id === parseInt(itemId));

          if (!currentItem) return;
          
          const { struct_type, parameters, styles, name } = currentItem;

          const parsedStyles = convertPropCSS(styles);

          if (struct_type === 'container') {
            // console.log(item);
            return (
              <div key={itemId} id={itemId} style={parsedStyles}>
                <RenderTree
                  elementList={elementList}
                  scenarioList={scenarioList}
                  item={currentItem}
                />
              </div>
            )
          }
          
          console.log(item);

          // @ts-ignore
          const RenderedElement = RENDERERS[struct_type];
          
          return RenderedElement ? (
            <RenderedElement
              key={itemId}
              id={itemId}
              params={parameters}
              name={name}
              style={parsedStyles}
              projectID={288}
              screensIDs={[534]}
            />
          ) : null;
        })}
  </>)
}

export { RenderTree };