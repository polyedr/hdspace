// import { useMemo } from 'react';
// import { LibraryElementUnion } from '../../../api/types';
import { SharedRendererProps } from '../../UI/RenderElements/types';
// import { convertPropCSS } from '../../../utils/StyleHelper';
// import { findParentByChildID } from '../../../utils/ElementsTreeHelper';
// import { SavedElementsValues } from '../../../redux/project/types';

type CommonRendererProps = Omit<SharedRendererProps, 'children'>;

const useItemProps = (/* item: LibraryElementUnion */) => {
  /* const { id, styles, children } = item;
  


  const isRadioChecked = (
    value: string,
    checkedRadio: SavedElementsValues[string],
  ) => value === checkedRadio?.savedValue;

  const isCheckboxChecked = (itemId: string) =>
    Boolean(savedElements[itemId]?.savedValue);

  const getIsActive = !disableInteractions && item.id === activeItemId;

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

  const isBorderedElement =
    findParentByChildID(root, id)?.id === rootID || id === rootID;
  const isBorderVisible =
    (isBorderedElement && showBorders) || (isBorderedElement && getIsActive);

  const commonRendererProps: Omit<SharedRendererProps, 'children'> = {
    ...(disableInteractions && { className: '' }),
    id: id === rootID ? 'root' : id,
    isDisabled: !disableInteractions,
    ownStyles,
    entityStyles: convertedEntityStyles,
    groupStyles: convertedGroupStyles,
    active: !disableInteractions && id === activeItemId,
    sortableId: id,
    elementRef: null,
  };

  const getAdditionalProps = useMemo(() => {
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
      active: !disableInteractions && id === activeItemId,
      sortableId: id,
      elementRef: null,
      }
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
          onElementChange: updateSavedElementValues,
          params: item.parameters,
        };
      }

      case 'textarea': {
        return {
          currentValue: savedElements[id]?.savedValue,
          onElementChange: updateSavedElementValues,
          params: item.parameters,
        };
      }

      case 'checkbox': {
        return {
          currentValue: savedElements[id]?.savedValue,
          isCheckboxChecked: isCheckboxChecked(id),
          onElementChange: updateSavedElementValues,
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
  }, [item]); */
};

export default useItemProps;
