import React, { useMemo, useEffect, useRef, MutableRefObject } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import {
  selectCustomElementsHasNext,
  selectCustomLibraryElements,
} from '../../../redux/project/selectors';
import { loadCustomElements } from '../../../redux/project/actions';
import { useStyles as useElementBlockStyles } from '../ElementsTab/ElementsBlock';
import ElementButton from '../ElementsTab/ElementButton';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from '../../styledComponents';

const CustomElementsBlock: React.FC = () => {
  const libraryElements = useSelector(selectCustomLibraryElements);
  const dispatch = useDispatch();
  const styles = useElementBlockStyles();
  const hasNext = useSelector(selectCustomElementsHasNext);

  const lastElementRef = useRef() as MutableRefObject<HTMLButtonElement>;
  const lastDom = lastElementRef && lastElementRef.current;

  useEffect(() => {
    dispatch(loadCustomElements(true));
  }, [dispatch]);

  const elements = useMemo(
    () =>
      libraryElements.map((element) => ({
        key: `custom-element-${element.id}`,
        id: element.id,
        type: element.type,
        name: element.name,
        custom: true,
        icon: HelpOutlineIcon,
      })),
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
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Custom UI
      </StyledAccordionSummary>

      <StyledAccordionDetails className={styles.elementsBlock}>
        {elements.map((element, index) => {
          if (index === elements.length - 1) {
            return (
              <ElementButton
                elementData={element}
                key={element.key}
                ref={lastElementRef}
              />
            );
          }
          return <ElementButton elementData={element} key={element.key} />;
        })}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default CustomElementsBlock;
