import React, { useState, useEffect } from 'react';
import { splitWords } from '@Utils/stringHelper';
import {
  PropertyAccordianSummary,
  PropertyAccordion,
  PropertyAccordionDetails,
} from '@Components/styledComponents';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
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
      <PropertyAccordianSummary expandIcon={<ArrowDropDownIcon />}>
        {splitWords(title)}
      </PropertyAccordianSummary>

      <PropertyAccordionDetails>
        <div style={{ flex: 1 }}>{children}</div>
      </PropertyAccordionDetails>
    </PropertyAccordion>
  );
};

export default ControlSection;
