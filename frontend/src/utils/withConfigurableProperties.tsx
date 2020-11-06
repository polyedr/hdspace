import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveElement,
  selectCurrentScreenId,
  selectEditableStyles,
} from '../redux/project/selectors';
import {
  removeElementStyles,
  removeSharedStyles,
  updateElementParameters,
  updateElementStyles,
  updateSharedStyles,
} from '../redux/project/actions';
import {
  CssLikeStyles,
  Entity,
  LibraryElement,
  Params,
  PropertiesChangeProps,
} from '../types';

// potentially pass config with needed styles/params first
function withConfigurableProperties<
  K extends LibraryElement<Entity>,
  T extends PropertiesChangeProps<K>
>(
  Component: React.ComponentType<T>,
): React.FC<Omit<T, keyof PropertiesChangeProps<K>>> {
  function WrapperComponent({ ...restProps }: any) {
    const dispatch = useDispatch();
    const currentScreenId = useSelector(selectCurrentScreenId);
    const { id: activeItemID } = useSelector(selectActiveElement);
    const editableStyles = useSelector(selectEditableStyles);

    const removeStyles = (ruleName: string[], itemID?: string) => {
      if (editableStyles === 'ownStyles') {
        dispatch(
          removeElementStyles(itemID || activeItemID, ruleName, {
            screenId: currentScreenId,
          }),
        );
      } else {
        dispatch(
          removeSharedStyles(editableStyles as Entity, ruleName, {
            screenId: currentScreenId,
          }),
        );
      }
    };

    const updateStyles = (styles: CssLikeStyles, itemID?: string) => {
      if (editableStyles === 'ownStyles') {
        dispatch(
          updateElementStyles(itemID || activeItemID, styles, {
            screenId: currentScreenId,
          }),
        );
      } else {
        dispatch(
          updateSharedStyles(editableStyles as Entity, styles, {
            screenId: currentScreenId,
          }),
        );
      }
    };

    const updateParams = useCallback(
      (params: Params<K>, itemID?: string) => {
        dispatch(
          updateElementParameters(itemID || activeItemID, params, {
            screenId: currentScreenId,
          }),
        );
      },
      [activeItemID, currentScreenId],
    );

    return (
      <Component
        {...restProps}
        activeItemID={activeItemID}
        removeStyles={removeStyles}
        updateStyles={updateStyles}
        updateParams={updateParams}
      />
    );
  }

  // potentially need to makeMapState and makeMapDispatch for each WrapperComponent
  return WrapperComponent;
}
export default withConfigurableProperties;
