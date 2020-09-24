import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ProjectClass } from '../../../api/types';
import { SharedRendererProps } from '../../UI/RenderElements/types';
import { convertPropCSS } from '../../../utils/StyleHelper';
import { findParentByChildID } from '../../../utils/ElementsTreeHelper';
import { SavedElementsValues } from '../../../redux/project/types';
import {
  selectActiveElement,
  selectCurrentProject,
  selectCurrentRootElement,
  selectCurrentRootId,
  selectElementById,
  selectSavedElementsValues,
  selectScreenLoader,
  selectShowingBorders,
} from '../../../redux/project/selectors';
import { updateSavedElementValues } from '../../../redux/project/actions';
import { selectIsPrototypeMode } from '../../../redux/user/selectors';
import {
  ChildrenElements,
  LIBRARY_ELEMENTS,
} from '../../../domain/libraryElements/libraryElements';
import { ElementEntity } from '../../../domain/core';
import { AppReduxState } from '../../../shared/types/app';

const isElementStructType = (type: string): type is ElementEntity => {
  return type in LIBRARY_ELEMENTS;
};

export type ElementProps = {
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
  const {
    element,
    root,
    rootID,
    savedElements,
    disableInteractions,
    activeElement,
    showBorders,
    screenLoader,
    currentProject,
  } = useSelector((state: AppReduxState) => ({
    element: selectElementById(elementId)(state),
    root: selectCurrentRootElement(state),
    rootID: selectCurrentRootId(state),
    savedElements: selectSavedElementsValues(state),
    disableInteractions: selectIsPrototypeMode(state),
    activeElement: selectActiveElement(state),
    showBorders: selectShowingBorders(state),
    screenLoader: selectScreenLoader(state),
    currentProject: selectCurrentProject(state),
  }));

  const projectClasses = currentProject.projectData.classes;

  const dispatch = useDispatch();

  const onElementChange = (item, value) =>
    dispatch(updateSavedElementValues(item, value));

  const isRadioChecked = (
    value: string,
    checkedRadio: SavedElementsValues[string],
  ) => value === checkedRadio?.savedValue;

  const isCheckboxChecked = (itemId: string) =>
    Boolean(savedElements[itemId]?.savedValue);

  const additionalProps = useMemo(() => {
    if (!element) {
      return null;
    }

    const { id, children } = element;

    const getIsActive = !disableInteractions && element.id === activeElement.id;

    const isBorderedElement =
      findParentByChildID(root, id)?.id === rootID || id === rootID;
    const isBorderVisible =
      (isBorderedElement && showBorders) || (isBorderedElement && getIsActive);

    switch (element.type) {
      case 'container':
      case 'divBlock': {
        return {
          isBorderVisible,
        };
      }
      case 'textinput': {
        return {
          currentValue: String(savedElements[id]?.savedValue),
          onElementChange,
          params: element.parameters,
        };
      }

      case 'textarea': {
        return {
          currentValue: savedElements[id]?.savedValue,
          onElementChange,
          params: element.parameters,
        };
      }

      case 'checkbox': {
        return {
          currentValue: savedElements[id]?.savedValue,
          isCheckboxChecked: isCheckboxChecked(id),
          onElementChange,
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
          onElementChange: updateSavedElementValues,
          params: element.parameters,
        };
      }

      case 'select': {
        return {
          currentValue: savedElements[id]?.savedValue,
          onElementChange: updateSavedElementValues,
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
  }, [element]);

  if (!element) {
    return null;
  }

  const { id, type, styles } = element;

  const ownStyles = convertPropCSS(styles.ownStyles);

  const [entityClass, groupClass] = element.styles.classNames;

  const entityStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === entityClass)
      ?.rules || {};
  const groupStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === groupClass)
      ?.rules || {};

  const convertedEntityStyles = convertPropCSS(entityStyles);
  const convertedGroupStyles = convertPropCSS(groupStyles);

  const commonRendererProps: Omit<SharedRendererProps, 'children'> = {
    ...(disableInteractions && { className: '' }),
    id: id === rootID ? 'root' : id,
    isDisabled: !disableInteractions,
    ownStyles,
    entityStyles: convertedEntityStyles,
    groupStyles: convertedGroupStyles,
    active: !disableInteractions && id === activeElement.id,
    elementRef: null,
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
