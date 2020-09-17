import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LibraryElementUnion, ProjectClass } from '../../../api/types';
import { SharedRendererProps } from '../../UI/RenderElements/types';
import { convertPropCSS } from '../../../utils/StyleHelper';
import { findParentByChildID } from '../../../utils/ElementsTreeHelper';
import { SavedElementsValues } from '../../../redux/project/types';
import {
  selectActiveElement,
  selectCurrentProject,
  selectCurrentRootElement,
  selectCurrentRootId,
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

const useElementProps = (item: LibraryElementUnion): ElementProps | null => {
  const { id, type, styles, children } = item;
  const root = useSelector(selectCurrentRootElement);
  const rootID = useSelector(selectCurrentRootId);
  const savedElements = useSelector(selectSavedElementsValues);
  const disableInteractions = useSelector(selectIsPrototypeMode);
  const activeElement = useSelector(selectActiveElement);
  const showBorders = useSelector(selectShowingBorders);
  const screenLoader = useSelector(selectScreenLoader);
  const currentProject = useSelector(selectCurrentProject);
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

  const getIsActive = !disableInteractions && item.id === activeElement.id;

  const ownStyles = convertPropCSS(styles.ownStyles);

  const [entityClass, groupClass] = item.styles.classNames;

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
    sortableId: id,
    elementRef: null,
  };

  const additionalProps = useMemo(() => {
    const isBorderedElement =
      findParentByChildID(root, id)?.id === rootID || id === rootID;
    const isBorderVisible =
      (isBorderedElement && showBorders) || (isBorderedElement && getIsActive);

    const commonRendererProps = {
      ...(disableInteractions && { className: '' }),
      id: id === rootID ? 'root' : id,
      isDisabled: !disableInteractions,
      ownStyles,
      entityStyles: convertedEntityStyles,
      groupStyles: convertedGroupStyles,
      active: !disableInteractions && id === activeElement.id,
      sortableId: id,
      elementRef: null,
    };
    switch (item.type) {
      case 'container':
      case 'divBlock': {
        return {
          isBorderVisible,
        };
      }
      case 'textinput': {
        return {
          ...commonRendererProps,
          currentValue: String(savedElements[id]?.savedValue),
          onElementChange,
          params: item.parameters,
        };
      }

      case 'textarea': {
        return {
          currentValue: savedElements[id]?.savedValue,
          onElementChange,
          params: item.parameters,
        };
      }

      case 'checkbox': {
        return {
          currentValue: savedElements[id]?.savedValue,
          isCheckboxChecked: isCheckboxChecked(id),
          onElementChange,
          params: item.parameters,
        };
      }

      case 'radiobutton': {
        return {
          currentValue: savedElements[id]?.savedValue,
          isRadioChecked: isRadioChecked(
            item.parameters.value,
            savedElements[item.parameters.name],
          ),
          onElementChange: updateSavedElementValues,
          params: item.parameters,
        };
      }

      case 'select': {
        return {
          currentValue: savedElements[id]?.savedValue,
          onElementChange: updateSavedElementValues,
          childrenElements: children,
          params: item.parameters,
          projectClasses,
        };
      }

      default:
        return {
          params: item.parameters,
        };
    }
  }, [item]);

  if (screenLoader || !isElementStructType(type)) {
    return null;
  }
  return {
    ...commonRendererProps,
    ...additionalProps,
  } as ElementProps;
};

export default useElementProps;
