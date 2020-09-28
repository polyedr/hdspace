import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ICONS } from '../../../domain/libraryElements/libraryElements';
import { selectCustomLibraryElements } from '../../../redux/project/selectors';
import { requestCustomLibraryElements } from '../../../redux/project/actions';

import ElementsBlock from '../ElementsBlock';

const CustomElementsBlock: React.FC<{}> = () => {
  const customLibraryElements = useSelector(selectCustomLibraryElements);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestCustomLibraryElements());
  }, []);

  const elements = useMemo(() => {
    return Object.keys(customLibraryElements).reduce((accumulator, id) => {
      const element = customLibraryElements[id];
      const { type, name } = element;
      accumulator[id] = {
        key: `custom-element-${element.id}`,
        id: element.id,
        type,
        name,
        custom: true,
        icon: ICONS[element.type],
      };
      return accumulator;
    }, {});
  }, [customLibraryElements]);

  return (
    <ElementsBlock
      key="custom"
      title="Custom UI"
      elements={elements}
      expandable
    />
  );
};

export default CustomElementsBlock;
