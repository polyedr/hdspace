/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useMemo,
  useEffect,
  useRef,
  MutableRefObject,
  memo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCustomLibraryElements,
  selectCustomElementsHasNext,
} from '@Redux/project/selectors/element';
import { loadCustomElements } from '@Redux/project/actions';
import isInViewport from '@Utils/isInViewport';
import { createArrayCustomElements } from '@Utils/createCategoryCustomElement';
import { CustomElementsCategory } from '@Src/types';
import CustomElementsBlock from './CustomElementsBlock';

const GeneratedElementsBlocks = () => {
  const libraryElements = useSelector(selectCustomLibraryElements);
  const dispatch = useDispatch();
  const hasNext = useSelector(selectCustomElementsHasNext);
  const lastElementRef = useRef() as MutableRefObject<HTMLButtonElement>;
  const lastDom = lastElementRef && lastElementRef.current;

  const rootRef = useRef<HTMLDivElement>(null);
  const rootDom = rootRef?.current;

  useEffect(() => {
    if (isInViewport(rootDom)) {
      dispatch(loadCustomElements(true));
    }
  }, [dispatch, rootDom]);

  const elements: CustomElementsCategory = useMemo(
    () => createArrayCustomElements(libraryElements),
    [libraryElements],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNext) {
          dispatch(loadCustomElements(false));
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.01,
      },
    );
    if (lastDom) {
      observer.observe(lastDom);
    }
    return () => {
      if (lastDom) {
        observer.unobserve(lastDom);
      }
    };
  }, [lastDom]);
  return (
    <div ref={rootRef}>
      {elements.bigBlocks.length > 0 && (
        <CustomElementsBlock name="Big block" elements={elements.bigBlocks} />
      )}
      {elements.mediumBlocks.length > 0 && (
        <CustomElementsBlock
          name="Medium block"
          elements={elements.mediumBlocks}
        />
      )}
      {elements.smallBlocks.length > 0 && (
        <CustomElementsBlock
          name="Small block"
          elements={elements.smallBlocks}
        />
      )}
      {elements.htmlElements.length > 0 && (
        <CustomElementsBlock
          name="Html block"
          elements={elements.htmlElements}
        />
      )}
      {elements.otherElements.length > 0 && (
        <CustomElementsBlock
          name="Other block"
          elements={elements.otherElements.filter(
            (element) => !element.name.toLowerCase().includes('generated'),
          )}
        />
      )}
    </div>
  );
};

export default memo(GeneratedElementsBlocks);
