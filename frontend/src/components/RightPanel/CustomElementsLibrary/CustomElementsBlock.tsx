import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ICONS } from '../../../domain/libraryElements/libraryElements';
import { selectCustomLibraryElements } from '../../../redux/project/selectors';
import { requestCustomElements } from '../../../redux/project/actions';

import {
  useStyles as useElementBlockStyles,
  StyledAccordion,
  StyledAccordionSummary,
  StyledAccordionDetails,
} from '../ElementsBlock';
import ElementButton from '../ElementButton';

const CustomElementsBlock: React.FC<{}> = () => {
  const libraryElements = useSelector(selectCustomLibraryElements);
  const dispatch = useDispatch();
  const styles = useElementBlockStyles();

  useEffect(() => {
    dispatch(requestCustomElements());
  }, []);

  const elements = useMemo(
    () =>
      libraryElements.map((element) => ({
        key: `custom-element-${element.id}`,
        id: element.id,
        type: element.type,
        name: element.name,
        custom: true,
        icon: ICONS[element.type],
      })),
    [libraryElements],
  );

  return (
    <StyledAccordion defaultExpanded>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        Custom UI
      </StyledAccordionSummary>

      <StyledAccordionDetails className={styles.elementsBlock}>
        {elements.map((element) => (
          <ElementButton elementData={element} key={element.key} />
        ))}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default CustomElementsBlock;
