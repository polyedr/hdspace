import React from 'react';
import { StyledTextField } from '@Components/styledComponents';
import { MenuItem } from '@material-ui/core';
import {
  updateElement,
  updateElementParameters,
  setActiveElement,
} from '@Redux/project/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import TYPE from './constants';

const ElementType: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useSelector(selectActiveElement);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const handleDropdownChange = (ev) => {
    const newElementType = ev.target.value;

    dispatch(
      updateElement({
        elementID: id,
        data: {
          type: newElementType,
          name: newElementType,
          styles: {
            classNames: [newElementType],
            ownStyles: {},
            pseudoClassStyles: {},
          },
          children: [],
        },
        active: true,
      }),
    );

    setTimeout(() => {
      const param: any = {};
      param.placeholder = '';
      param.textContent = '';
      param.imageURL = '';
      param.keepAspectRatio = false;
      param.title = '';
      param.freeCanvas = {};

      if (newElementType === 'container' || newElementType === 'section') {
        param.group = 'containers';
      } else if (
        newElementType === 'textinput' ||
        newElementType === 'textarea'
      ) {
        param.group = 'form';
        param.placeholder = 'Placeholder';
      } else if (newElementType === 'button' || newElementType === 'checkbox') {
        param.group = 'form';
        param.textContent = newElementType;
      } else if (newElementType === 'textBlock' || newElementType === 'label') {
        param.group = 'typography';
        param.textContent =
          newElementType === 'textBlock'
            ? 'This is a text block'
            : 'This is a label';
      } else if (newElementType === 'select') {
        param.group = 'form';
      } else if (newElementType === 'grid') {
        param.group = 'other';
      } else if (newElementType === 'calendar') {
        param.group = 'widget';
      } else if (newElementType === 'paragraph') {
        param.group = 'paragraph';
        param.textContent =
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
      } else if (newElementType === 'image') {
        param.group = 'image';
        param.imageURL = '/a1b7d632cc3b0a2993e8c1be2da723bb.svg';
        param.keepAspectRatio = false;
        param.title = '';
        param.freeCanvas = {
          height: 100,
          left: 20,
          top: 20,
          width: 300,
          zIndex: 0,
        };
      }

      dispatch(
        updateElementParameters(id, param, { screenId: currentScreenId }),
      );
      dispatch(setActiveElement(id));
    }, 1000);
  };

  return (
    <StyledTextField
      margin="dense"
      label="New element type"
      onChange={handleDropdownChange}
      select
      value=""
    >
      {TYPE.map(({ label, value }) => (
        <MenuItem value={value} key={value} dense>
          {label}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default ElementType;
