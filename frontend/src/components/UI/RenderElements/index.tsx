import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { GMap } from '$components/UI/GMap';
import { CalendarWidget } from '$components/UI/Calendar';
import { ClockWidget } from '$components/UI/Clock';
import { Entity } from '$domain/core';

import { withAction } from '../../../utils/withAction';
import { Action } from './Action/Action';
import { Checkbox } from './Checkbox/Checkbox';
import { Radiobutton } from './Radiobutton/Radiobutton';
import { Input } from './Input/Input';
import { Select } from './Select/Select';
import { Heading } from './Heading/Heading';
import { Paragraph } from './Paragraph/Paragraph';
import { Link } from './Link/Link';
import { TextBlock } from './TextBlock/TextBlock';
import { List } from './List/List';
import { Textarea } from './Textarea/Textarea';
import { Label } from './Label/Label';
import { Dropdown } from './Dropdown/Dropdown';
import { Video } from './Video/Video';
import { ListItem } from './ListItem/ListItem';
import { SelectMenu } from './SelectMenu/SelectMenu';
import { MenuItem } from './MenuItem/MenuItem';
import { DropdownMenu } from './DropdownMenu/DropdownMenu';
import { DropdownItem } from './DropdownItem/DropdownItem';
import { ImageRendererProps, MapRendererProps, ClockRendererProps, SharedRendererProps, ContainerRendererProps } from './types';
import { sharedClasses } from '$styles/sharedClasses';
import { actionsCreators } from '$redux/project';
import { connect } from 'react-redux';
const styles = require('./styles.scss');

const mapDispatch = {
  setActiveItem: actionsCreators.setActiveItem,
};

const ContainerRenderer = (props: ContainerRendererProps) => {
  const {
    name,
    id,
    sortableId,
    style,
    isDisabled,
    children,
    className,
    elementRef,
    isSecondLevelContainer,
    showBorders,
    active,
    isOuterContainer,
    setActiveItem,
  } = props;

  const isRoot = id === 'root';

  const isBorderedElement = isRoot || isOuterContainer || isSecondLevelContainer;
  const isBorderVisible = isBorderedElement && showBorders || isBorderedElement && active;

  const borderColor = active && !isRoot ? 'red' : '#1cc09f';

  const handleLabelClick = (event) => {
    event.preventDefault();
    document.activeElement?.blur();
    setActiveItem({
      itemId: id,
      itemType: name,
      name,
    })
  };

  return (
    <>
      <div
        ref={elementRef}
        id={id}
        data-ls-id={id}
        data-id={sortableId}
        key={id}
        className={cn(
          className,
          isRoot && styles.root,
          styles.addedElem
          /* showBorders && isSecondLevelContainer && styles.withBorders,
          showBorders && isRoot && styles.withBorders,
          showBorders && isRoot && styles.withBorders_inner,
          showBorders && isOuterContainer && styles.withBorders_inner,
          active && isSecondLevelContainer && styles.withBorders,
          active && isRoot && styles.withBorders,
          active && isSecondLevelContainer && styles.withBorders_active,
          active && isRoot && styles.withBorders_active,
          active && isRoot && styles.withBorders_inner,
          active && isOuterContainer && styles.withBorders_inner, */
        )}
        style={{ ...style, position: 'relative' }}
        tabIndex={isDisabled ? 0 : -1}
        data-name={isRoot ? 'root' : name}
      >
        {isBorderVisible && (
          <>
            <span
              className={cn(
                sharedClasses.unsortable,
                styles.borderLabel,
                active && styles.borderLabel_active,
                (isOuterContainer || isRoot) && styles.borderLabel_outer,
                isRoot && styles.borderLabel_right,
                isRoot && styles.borderLabel_hidden,
              )}
              onClick={handleLabelClick}
            >
              {isRoot ? 'root' : name}
            </span>
            <span
              className={cn(sharedClasses.unsortable, styles.border, isRoot && !showBorders && styles.border_hidden)}
              style={{
                //...(isOuterContainer && !active && { zIndex: -1 }),
                ...((isRoot || active) && { zIndex: 4 }),
                position: 'absolute',
                top: isRoot || isOuterContainer ? 0 : '-1px',
                right: 0,
                left: 0,
                border: `1px solid ${borderColor}`,
              }}
              onClick={handleLabelClick}
            ></span>
            <span
            className={cn(sharedClasses.unsortable, styles.border, isRoot && !showBorders && styles.border_hidden)}
              style={{
                ...((isRoot || active) && { zIndex: 4 }),
                position: 'absolute',
                top: isRoot ? 0 : '-1px',
                right: 0,
                bottom: isRoot ? 0 : '-1px',
                border: `1px solid ${borderColor}`,
              }}
              onClick={handleLabelClick}
            ></span>
            <span
            className={cn(sharedClasses.unsortable, styles.border, isRoot && !showBorders && styles.border_hidden)}
              style={{
                ...((isRoot || active) && { zIndex: 4 }),
                position: 'absolute',
                right: 0,
                bottom: isRoot ? 0 : '-1px',
                left: 0,
                border: `1px solid ${borderColor}`,
              }}
              onClick={handleLabelClick}
            ></span>
            <span
            className={cn(sharedClasses.unsortable, styles.border, isRoot && !showBorders && styles.border_hidden)}
              style={{
                ...((isRoot || active) && { zIndex: 4 }),
                position: 'absolute',
                top: isRoot ? 0 : '-1px',
                bottom: isRoot ? 0 : '-1px',
                left: 0,
                border: `1px solid ${borderColor}`,
              }}
              onClick={handleLabelClick}
            ></span>
          </>
        )}

        {children}
      </div>
    </>
  );
}

const ImgRenderer = (props: ImageRendererProps) => {
  const { id, params, sortableId, style, isDisabled, className, elementRef } = props;

  return (
    <img
      ref={elementRef}
      src={params.imageURL}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, styles.addedElem)}
      style={style}
      alt={id}
      tabIndex={isDisabled ? 0 : -1}
    />
  );
}

const MapWidgetRenderer = (props: MapRendererProps) => {
  const { id, params, isDisabled, style, sortableId, className, elementRef } = props;
  return (
    <div
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, styles.addedWidget, isDisabled && styles.disabled)}
      style={style}
      onClick={event => isDisabled && event.preventDefault()}
      tabIndex={isDisabled ? 0 : -1}
    >
      <GMap
        center={params.map_props.center}
        zoom={params.map_props.zoom}
        markerText={params.map_props.markerText}
      />
    </div>
  );
};

const CalendarWidgetRenderer = (props: SharedRendererProps) => {
  const { id, style, isDisabled, sortableId, className, elementRef } = props;
  return (
    <div
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, styles.addedCalendar, isDisabled && styles.disabled)}
      style={style}
      tabIndex={isDisabled ? 0 : -1}
    >
      <CalendarWidget />
    </div>
  );
}

const ClockWidgetRenderer = (props: ClockRendererProps) => {
  const { id, params, style, sortableId, isDisabled, className, elementRef } = props;
  return (
    <div
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, styles.addedCalendar)}
      style={style}
      tabIndex={isDisabled ? 0 : -1}
    >
      <ClockWidget
        size={typeof params.width === 'number' ? params.width : undefined}
      />
    </div>
  );
}

const UndefinedRenderer = (props: SharedRendererProps) => {
  const { id, style, sortableId, isDisabled, className, elementRef } = props;
  return (
    <div
      ref={elementRef}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(className, styles.addedContainer)}
      style={style}
      tabIndex={isDisabled ? 0 : -1}
    />
  );
}

export const RENDERERS: Record<Entity, React.FunctionComponent<any>> = {
  root: ContainerRenderer,
  container: connect(null, mapDispatch)(ContainerRenderer),
  button: withAction(Action, 'button'),
  textinput: Input,
  radiobutton: Radiobutton,
  checkbox: Checkbox,
  textarea: Textarea,
  heading: Heading,
  paragraph: Paragraph,
  ocrtext: Paragraph,
  text_block: TextBlock,
  list: List,
  listItem: ListItem,
  label: Label,
  hyperlink: withAction(Link, 'link'),
  image: ImgRenderer,
  select: Select,
  selectMenu: SelectMenu,
  selectItem: MenuItem,
  map: MapWidgetRenderer,
  calendar: CalendarWidgetRenderer,
  clock: ClockWidgetRenderer,
  dropdown: Dropdown,
  dropdownMenu: DropdownMenu,
  dropdownItem: DropdownItem,
  video: Video,
  undefined: UndefinedRenderer,
};

export const EXPORT_RENDERERS: Record<Entity, React.FunctionComponent<any>> = {
  ...RENDERERS,
  button: withAction(Action, 'button', true),
  hyperlink: withAction(Link, 'link', true),
};
