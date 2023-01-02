import React, { useState } from 'react';
import { splitWords } from '@Utils/stringHelper';
import { AccordionDetails } from '@mui/material';
import {
  PropertyAccordianSummary,
  PropertyAccordion,
} from '@Components/styledComponents';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { setImageList } from '@Redux/project/actions';
import { useDispatch } from 'react-redux';

type Props = {
  title: string;
  expanded: boolean;
};

const ControlSection: React.FC<Props> = ({ title, children, expanded }) => {
  const [isCollapse, setIsCollapse] = useState(expanded);
  const dispatch = useDispatch();

  const toggle = () => {
    setIsCollapse(!isCollapse);
    dispatch(setImageList(false));
  };

  return (
    <PropertyAccordion expanded={isCollapse} onChange={() => toggle()}>
      <PropertyAccordianSummary expandIcon={<ExpandMoreIcon />}>
        {splitWords(title)}
      </PropertyAccordianSummary>

      <AccordionDetails>{children}</AccordionDetails>
    </PropertyAccordion>
  );
};

export default ControlSection;
