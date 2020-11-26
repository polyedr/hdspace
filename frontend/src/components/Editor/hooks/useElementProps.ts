import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SharedRendererProps } from '../../UI/RenderElements/types';
import { findParentByChildID } from '../../../utils/ElementsTreeHelper';
import {
  selectActiveElement,
  selectCurrentProject,
  selectCurrentRootElement,
  selectCurrentRootId,
  selectElementBeingEdited,
  selectElementById,
  selectElementCanBeEdited,
  selectSavedElementsValues,
  selectScreenLoader,
  selectShowingBorders,
} from '../../../redux/project/selectors';
import { updateSavedElementValues } from '../../../redux/project/actions';
import { selectIsPrototypeMode } from '../../../redux/user/selectors';
import { LIBRARY_ELEMENTS } from '../../../domain/libraryElements/libraryElements';
import {
  ChildrenElements,
  ElementEntity,
  ProjectClass,
  SavedElementsValues,
} from '../../../types';

const isElementStructType = (type: string): type is ElementEntity => {
  return type in LIBRARY_ELEMENTS;
};

type ElementProps = {
  currentValue?: any;
  isBorderVisible?: boolean;
  params?: any;
  onElementChange?: (item, value) => void;
  childrenElements?: ChildrenElements;
  isRadioChecked?: boolean;
  isCheckboxChecked?: boolean;
  projectClasses?: ProjectClass[];
} & Omit<SharedRendererProps, 'children'>;

const useElementProps = (elementId: string): ElementProps | null => {
  const element = useSelector(selectElementById(elementId));
  const root = useSelector(selectCurrentRootElement);
  const rootID = useSelector(selectCurrentRootId);
  const savedElements = useSelector(selectSavedElementsValues);
  const disableInteractions = useSelector(selectIsPrototypeMode);
  const activeElement = useSelector(selectActiveElement);
  const showBorders = useSelector(selectShowingBorders);
  const screenLoader = useSelector(selectScreenLoader);
  const currentProject = useSelector(selectCurrentProject);
  const canBeEdited = useSelector(selectElementCanBeEdited(elementId));
  const isBeingEdited = useSelector(selectElementBeingEdited(elementId));

  const projectClasses = currentProject.projectData.classes;

  const dispatch = useDispatch();

  const additionalProps = useMemo(() => {
    if (!element) {
      return null;
    }

    const isRadioChecked = (
      value: string,
      checkedRadio: SavedElementsValues[string],
    ) => value === checkedRadio?.savedValue;

    const isCheckboxChecked = (itemId: string) =>
      Boolean(savedElements[itemId]?.savedValue);

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

    const { id, children } = element;

    const getIsActive = !disableInteractions && element.id === activeElement.id;

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

      case 'checkbox': {
        return {
          currentValue: savedElements[id]?.savedValue,
          isCheckboxChecked: isCheckboxChecked(id),
          onChange,
          params: element.parameters,
        };
      }

      case 'radiobutton': {
        return {
          currentValue: savedElements[id]?.savedValue,
          isRadioChecked: isRadioChecked(
            element.parameters.value,
            savedElements[element.parameters.name],
          ),
          onChange,
          params: element.parameters,
        };
      }

      case 'select': {
        return {
          onElementChange: onChange,
          childrenElements: children,
          params: element.parameters,
          projectClasses,
        };
      }

      default:
        return {
          params: element.parameters,
        };
    }
  }, [
    element,
    disableInteractions,
    activeElement.id,
    root,
    rootID,
    showBorders,
    savedElements,
    dispatch,
    elementId,
    projectClasses,
  ]);

  if (!element) {
    return null;
  }

  const { id, type, styles } = element;

  const [entityClass, groupClass] = element.styles.classNames;

  const entityStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === entityClass)
      ?.rules || {};
  const groupStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === groupClass)
      ?.rules || {};

  const commonRendererProps: Omit<SharedRendererProps, 'children'> = {
    ...(disableInteractions && { className: '' }),
    id: id === rootID ? 'root' : id,
    isDisabled: !disableInteractions,
    contentEditable: canBeEdited || isBeingEdited,
    ownStyles: styles.ownStyles,
    entityStyles,
    groupStyles,
    active: !disableInteractions && id === activeElement.id,
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
