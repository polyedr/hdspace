import React, { useState } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Switch from '@mui/material/Switch';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import InlineEditable from '@Components/UI/InlineEditable';
import { useElement } from '@Src/hooks';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('switch', {
  row: {
    display: 'flex !important',
    alignItems: 'center !important',
  },
  column: {
    paddingRight: '0 !important',
  },
});

const SwitchMui = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const { id, styles } = element;
    const [className, groupClass] = styles.classNames;
    const eventHandlers = useEventHandlers(props);

    const [isChecked, setIsChecked] = useState<boolean>(false);
    const classes = useStyles(props);
    const { isLink, link, screenLink, screenName } = element.parameters;
    const history = useHistory();
    const isProtoMode = useSelector(selectIsPrototypeMode);
    const exportScreenFlag = useSelector(selectExportScreenFlag);
    const changeScreen = () => {
      history.push(`/project/${screenLink}`);
    };

    const isLinkInProtoOrExportedFlag =
      isLink && (isProtoMode || exportScreenFlag);
    const isScreenLinkInProtoMode =
      screenLink && screenName && isProtoMode && !exportScreenFlag;
    const isScreenLinkInProtoModeOrExportedFlag =
      screenLink && screenName && (isProtoMode || exportScreenFlag);

    const getHref = (screenName) =>
      isProtoMode
        ? exportScreenFlag
          ? `../${screenName}/index.html`
          : '#'
        : exportScreenFlag
        ? `../${screenName}/index.html`
        : '';

    const { updateParams } = useElement(element.id);

    const handleUpdateValue = (value) => {
      updateParams({ value });
    };

    return (
      <div
        ref={ref}
        data-ls-id={id}
        className={cn(
          className,
          groupClass,
          classes.ownStyles,
          classes.row,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
        )}
        {...eventHandlers}
      >
        <Switch
          color="primary"
          onChange={() => {
            if (!isDisabled) {
              setIsChecked(!isChecked);
            }
          }}
        />
        <div>
          {isLinkInProtoOrExportedFlag ? (
            <a
              aria-label={`Link-${element.id}`}
              target={exportScreenFlag ? '_self' : '_blank'}
              href={link}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
              rel="noreferrer"
            >
              <InlineEditable
                text={element.parameters.value}
                elementId={element.id}
                onUpdated={handleUpdateValue}
                renderElement={(value, props) => (
                  <span
                    dangerouslySetInnerHTML={{ __html: value }}
                    {...props}
                  />
                )}
              />
            </a>
          ) : isScreenLinkInProtoMode ? (
            <label
              ref={
                ref as unknown as React.MutableRefObject<HTMLLabelElement | null>
              }
              id={id}
              role="presentation"
              onClick={() =>
                isProtoMode && !exportScreenFlag ? changeScreen() : undefined
              }
              style={{ cursor: 'pointer' }}
              data-ls-id={id}
            >
              <InlineEditable
                text={element.parameters.value}
                elementId={element.id}
                onUpdated={handleUpdateValue}
                renderElement={(value, props) => (
                  <span
                    dangerouslySetInnerHTML={{ __html: value }}
                    {...props}
                  />
                )}
              />
            </label>
          ) : isScreenLinkInProtoModeOrExportedFlag ? (
            <a
              aria-label={`Link-${element.id}`}
              target="_self"
              href={getHref(screenName)}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
              rel="noreferrer"
            >
              <InlineEditable
                text={element.parameters.value}
                elementId={element.id}
                onUpdated={handleUpdateValue}
                renderElement={(value, props) => (
                  <span
                    dangerouslySetInnerHTML={{ __html: value }}
                    {...props}
                  />
                )}
              />
            </a>
          ) : (
            <label
              ref={
                ref as unknown as React.MutableRefObject<HTMLLabelElement | null>
              }
              id={id}
              data-ls-id={id}
            >
              <InlineEditable
                text={element.parameters.value}
                elementId={element.id}
                onUpdated={handleUpdateValue}
                renderElement={(value, props) => (
                  <span
                    dangerouslySetInnerHTML={{ __html: value }}
                    {...props}
                  />
                )}
              />
            </label>
          )}
        </div>
      </div>
    );
  },
);

export default SwitchMui;
