import React from 'react';

import { EXPORT_RENDERERS } from '$components/UI/RenderElements';
import { convertPropCSS } from '$utils/StyleHelper';
import { T } from '$redux/project';

type Props = {
  elementList: T.IScenarioElement[],
  scenarioList: T.IScenarioItem[],
  item?: T.IScenarioItem,
}

const RenderTree: React.FC<Props> = (props) => {
  const { elementList, scenarioList, item } = props;

  return (
    <>
      {item && item.parameters.children && item.parameters.children.map((itemID) => {
        const currentItem = scenarioList.find(item => item.id === parseInt(itemID))
          || elementList.find(item => item.id === parseInt(itemID));

        if (!currentItem) return;
        
        const { struct_type, parameters, styles, name } = currentItem;

        const parsedStyles = convertPropCSS(styles);

        if (struct_type === 'container' && currentItem) {
          return (
            <div key={itemID} style={parsedStyles}>
              <RenderTree
                elementList={elementList}
                scenarioList={scenarioList}
                item={currentItem as T.IScenarioItem}
              />
            </div>
          )
        }

        // @ts-ignore
        const ElementRenderer = EXPORT_RENDERERS[struct_type];
        
        return ElementRenderer ? (
          <ElementRenderer
            key={itemID}
            params={parameters}
            name={name}
            style={parsedStyles}
          />
        ) : null;
      })}
    </>
  )
}

export { RenderTree };