import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectEditableStyles } from '@Redux/project/selectors/base';
import { selectActiveElementId } from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import {
  removeElementStyles,
  removeSharedStyles,
  updateElementParameters,
  updateElementStyles,
  updateSharedStyles,
} from '../redux/project/actions';
import {
  Entity,
  LibraryElement,
  Params,
  PropertiesChangeProps,
  PropertyName,
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
    const activeElementId = useSelector(selectActiveElementId);
    const editableStyles = useSelector(selectEditableStyles);

    const removeStyles = useCallback(
      (ruleNames: PropertyName[], itemID?: string) => {
        if (editableStyles === 'ownStyles') {
          dispatch(
            removeElementStyles(itemID || activeElementId, ruleNames, {
              screenId: currentScreenId,
            }),
          );
        } else {
          dispatch(
            removeSharedStyles(editableStyles as Entity, ruleNames, {
              screenId: currentScreenId,
            }),
          );
        }
      },
      [dispatch, editableStyles, activeElementId, currentScreenId],
    );

    const updateStyles = useCallback(
      (styles: React.CSSProperties, itemID?: string) => {
        if (editableStyles === 'ownStyles') {
          dispatch(
            updateElementStyles(itemID || activeElementId, styles, {
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
      },
      [dispatch, activeElementId, editableStyles, currentScreenId],
    );

    const updateParams = useCallback(
      (params: Params<K>, itemID?: string) => {
        dispatch(
          updateElementParameters(itemID || activeElementId, params, {
            screenId: currentScreenId,
          }),
        );
      },
      [dispatch, activeElementId, currentScreenId],
    );

    return (
      <Component
        {...restProps}
        activeElementId={activeElementId}
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
