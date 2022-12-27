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

function GeneratedElementsBlocks() {
  const libraryElements = useSelector(selectCustomLibraryElements);
  const dispatch = useDispatch();
  const hasNext = useSelector(selectCustomElementsHasNext);
  const lastElementRef = useRef();
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
      {elements.otherElements.length > 0 && (
        <CustomElementsBlock
          name="Generated Elements Blocks"
          elements={elements.otherElements.filter((element) =>
            element.name.toLowerCase().includes('generated'),
          )}
        />
      )}
    </div>
  );
}

export default memo(GeneratedElementsBlocks);
