import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { findParentByChildID } from '@Utils/ElementsTreeHelper';
import { updateSavedElementValues } from '@Redux/project/actions';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import { ChildrenElements, ElementEntity, ProjectClass } from '@Src/types';
import { toClassName } from '@Utils/stringHelper';
import {
  selectActiveElementId,
  selectCurrentRootElement,
  selectCurrentRootId,
  selectElementBeingEdited,
  selectElementById,
  selectElementCanBeEdited,
  selectSavedElementsValues,
} from '@Redux/project/selectors/element';
import {
  selectScreenLoader,
  selectShowingBorders,
} from '@Redux/project/selectors/base';
import { SharedRendererProps } from '../../UI/RenderElements/types';

const isElementStructType = (type: string): type is ElementEntity => {
  return type in LIBRARY_ELEMENTS;
};

type ElementProps = {
  currentValue?: any;
  isBorderVisible?: boolean;
  params?: any;
  childrenElements?: ChildrenElements;
  isChecked?: boolean;
  projectClasses?: ProjectClass[];
} & Omit<SharedRendererProps, 'children'>;

const useElementProps = (elementId: string): ElementProps | null => {
  const element = useSelector(selectElementById(elementId));
  const root = useSelector(selectCurrentRootElement);
  const rootID = useSelector(selectCurrentRootId);
  const savedElements = useSelector(selectSavedElementsValues);
  const disableInteractions = useSelector(selectIsPrototypeMode);
  const activeElementId = useSelector(selectActiveElementId);
  const showBorders = useSelector(selectShowingBorders);
  const screenLoader = useSelector(selectScreenLoader);
  const canBeEdited = useSelector(selectElementCanBeEdited(elementId));
  const isBeingEdited = useSelector(selectElementBeingEdited(elementId));

  const dispatch = useDispatch();

  const additionalProps = useMemo(() => {
    if (!element) {
      return null;
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.nativeEvent || !event.nativeEvent.target) {
        return;
      }
      dispatch(
        updateSavedElementValues(
          elementId,
          (event.nativeEvent.target as HTMLInputElement).value,
        ),
      );
    };

    const { id } = element;

    const getIsActive = !disableInteractions && element.id === activeElementId;

    const isBorderedElement =
      findParentByChildID(root, id)?.id === rootID || id === rootID;
    const isBorderVisible =
      (isBorderedElement && showBorders) || (isBorderedElement && getIsActive);

    switch (element.type) {
      case 'container':
      case 'smartHeader':
      case 'smartFooter':
      case 'smartForm':
      case 'smartWebpage':
      case 'divBlock': {
        return {
          isBorderVisible,
          params: element.parameters,
        };
      }
      case 'textinput': {
        return {
          currentValue: String(savedElements[id]?.savedValue),
          onChange,
          params: element.parameters,
        };
      }

      case 'textarea': {
        return {
          currentValue: savedElements[id]?.savedValue,
          onChange,
          params: element.parameters,
        };
      }

      case 'dropdownMenu': {
        return {
          params: element.parameters,
          parentId: element.parent,
        };
      }
      case 'button':
      case 'hyperlink': {
        return {
          type: element.type,
          params: element.parameters,
        };
      }
      case 'checkbox':
      case 'radiobutton':
      case 'select':
      case 'selectMenu':
      case 'option':
      default:
        return {
          params: element.parameters,
        };
    }
  }, [
    element,
    disableInteractions,
    activeElementId,
    root,
    rootID,
    showBorders,
    dispatch,
    elementId,
    savedElements,
  ]);

  if (!element) {
    return null;
  }

  const { id, type, styles } = element;

  const [className, groupClass] = element.styles.classNames || [];
  const commonRendererProps: Omit<SharedRendererProps, 'children'> = {
    id: id === rootID ? 'root' : id,
    className,
    isDisabled: !disableInteractions,
    contentEditable: canBeEdited || isBeingEdited,
    ownStyles: styles.ownStyles,
    groupClass: toClassName(groupClass),
    active: !disableInteractions && id === activeElementId,
  };

  if (screenLoader || !isElementStructType(type)) {
    return null;
  }

  return {
    ...commonRendererProps,
    ...additionalProps,
  } as ElementProps;
};

export default useElementProps;
