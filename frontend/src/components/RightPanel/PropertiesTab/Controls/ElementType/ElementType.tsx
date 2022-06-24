import React from 'react';
import { StyledTextField } from '@Components/styledComponents';
import { MenuItem } from '@material-ui/core';
import {
  updateElement,
  updateElementParameters,
  setActiveElement,
  addChildToElement,
} from '@Redux/project/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import IMAGES from '@Constants/images';
import { ElementGroup, ConvertibleElementType } from '@Src/types';
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

      if (
        newElementType === ConvertibleElementType.CONTAINER ||
        newElementType === ConvertibleElementType.SECTION
      ) {
        param.group = ElementGroup.CONTAINERS;
      } else if (
        newElementType === ConvertibleElementType.TEXTINPUT ||
        newElementType === ConvertibleElementType.TEXTAREA
      ) {
        param.group = ElementGroup.FORM;
        param.placeholder = 'Placeholder';
      } else if (newElementType === ConvertibleElementType.BUTTON) {
        param.group = ElementGroup.FORM;
        param.textContent = newElementType;
      } else if (newElementType === ConvertibleElementType.CHECKBOX) {
        param.group = ElementGroup.FORM;
        param.value = newElementType;
      } else if (
        newElementType === ConvertibleElementType.TEXTBLOCK ||
        newElementType === ConvertibleElementType.LABEL ||
        newElementType === ConvertibleElementType.HEADING
      ) {
        param.group = ElementGroup.TYPOGRAPHY;
        param.textContent =
          newElementType === ConvertibleElementType.TEXTBLOCK
            ? 'This is a text block'
            : newElementType === ConvertibleElementType.HEADING
            ? 'Header'
            : 'This is a label';
      } else if (newElementType === ConvertibleElementType.SELECT) {
        param.group = ElementGroup.FORM;
      } else if (newElementType === ConvertibleElementType.GRID) {
        param.group = ElementGroup.OTHER;
      } else if (newElementType === ConvertibleElementType.CALENDAR) {
        param.group = ElementGroup.WIDGET;
      } else if (newElementType === ConvertibleElementType.PAEAGRAPH) {
        param.group = ElementGroup.TYPOGRAPHY;
        param.textContent =
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
      } else if (newElementType === ConvertibleElementType.IMAGE) {
        param.group = ElementGroup.IMAGE;
        param.imageURL = IMAGES.imageIcon;
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

      if (newElementType === ConvertibleElementType.SELECT) {
        dispatch(
          addChildToElement(
            'option',
            id,
            {
              name: 'New option 1',
              value: 'New option 1',
            },
            { screenId: currentScreenId },
          ),
        );
      }

      dispatch(setActiveElement(id));
    }, 1000);
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <StyledTextField
        fullWidth
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
    </div>
  );
};

export default ElementType;
