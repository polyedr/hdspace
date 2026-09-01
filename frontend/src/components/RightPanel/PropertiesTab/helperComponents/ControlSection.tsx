import React, { useState } from 'react';
import { AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
import { splitWords } from '@Utils/stringHelper';
import {
  PropertyAccordionSummary,
  PropertyAccordion,
} from '@Components/styledComponents';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { setImageList } from '@Redux/project/actions';

interface Props {
  title: string;
  expanded: boolean;
}

const ControlSection: React.FC<Props> = ({ title, children, expanded }) => {
  const [isCollapse, setIsCollapse] = useState(expanded);
  const dispatch = useDispatch();

  const toggle = () => {
    setIsCollapse(!isCollapse);
    dispatch(setImageList(false));
  };

  return (
    <PropertyAccordion expanded={isCollapse} onChange={() => toggle()}>
      <PropertyAccordionSummary expandIcon={<ExpandMoreIcon />}>
        {splitWords(title)}
      </PropertyAccordionSummary>

      <AccordionDetails>{children}</AccordionDetails>
    </PropertyAccordion>
  );
};

export default ControlSection;
