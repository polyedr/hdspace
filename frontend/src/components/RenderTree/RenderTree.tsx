import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { EXPORT_RENDERERS } from '$components/UI/RenderElements';
import { convertPropCSS } from '$utils/StyleHelper';
import { SavedElementsValues } from '$redux/project/types';
import { T } from '$redux/project';
import { selectors, actionsCreators, ReduxState } from '$redux/export';

type OwnProps = {
  elementList: T.IScenarioElement[];
  scenarioList: T.IScenarioItem[];
  item?: T.IScenarioItem;
  savedElements: SavedElementsValues;
};

const mapStateToProps = (state: ReduxState) => {
  return {
    savedElements: selectors.selectSavedElementsValues(state),
  };
};

const mapDispatchToProps = {
  updateSavedElementsValues: actionsCreators.updateSavedElementsValues,
  updateSavedElementValues: actionsCreators.updateSavedElementValues,
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

const RenderTreeComponent: React.FC<Props> = ({
  elementList,
  scenarioList,
  item,
  savedElements,
  updateSavedElementValues,
}) => {
  const handleRenderElementChange = useCallback(
    (id, props) => {
      updateSavedElementValues(id, props);
    },
    [updateSavedElementValues],
  );

  return (
    <>
      {item &&
        item.parameters.children &&
        item.parameters.children.map((itemID) => {
          const currentItem =
            scenarioList.find((elem) => elem.id === parseInt(itemID)) ||
            elementList.find((elem) => elem.id === parseInt(itemID));

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
            );
          }

          // @ts-ignore
          const ElementRenderer = EXPORT_RENDERERS[struct_type];

          return ElementRenderer ? (
            <ElementRenderer
              id={itemID}
              key={itemID}
              params={parameters}
              name={name}
              style={parsedStyles}
              savedElement={savedElements[itemID]}
              onChange={handleRenderElementChange}
            />
          ) : null;
        })}
    </>
  );
};

export const RenderTree = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RenderTreeComponent);
