import React, { useState } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import { useHistory } from 'react-router';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('checkbox', {
  row: {
    display: 'flex !important',
    alignItems: 'center !important',
  },
  column: {
    paddingRight: '0 !important',
  },
});

const MaterialCheckbox = React.forwardRef<HTMLDivElement, RendererProps>(
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

    return (
      <div
        ref={ref}
        data-ls-id={id}
        className={cn(
          'mdc-touch-target-wrapper',
          className,
          groupClass,
          classes.ownStyles,
          classes.row,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
        )}
        style={{ width: 'fit-content' }}
        {...eventHandlers}
      >
        <div className={cn('mdc-checkbox mdc-checkbox--touch', classes.column)}>
          <input
            type="checkbox"
            className="mdc-checkbox__native-control"
            id={id}
            onChange={() => {
              if (!isDisabled) {
                setIsChecked(!isChecked);
              }
            }}
          />
          <div className="mdc-checkbox__background">
            <svg className="mdc-checkbox__checkmark" viewBox="0 0 24 24">
              <path
                className="mdc-checkbox__checkmark-path"
                fill="none"
                d="M1.73,12.91 8.1,19.28 22.79,4.59"
              />
            </svg>
            <div className="mdc-checkbox__mixedmark" />
          </div>
          <div className="mdc-checkbox__ripple" />
        </div>
        <div>
          {isLink && (isProtoMode || exportScreenFlag) ? (
            <a
              aria-label={`Link-${element.id}`}
              target={exportScreenFlag ? '_self' : '_blank'}
              href={link}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
              rel="noreferrer"
              dangerouslySetInnerHTML={{ __html: element.parameters.value }}
            />
          ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
            <label
              ref={
                ref as unknown as React.MutableRefObject<HTMLLabelElement | null>
              }
              id={id}
              role="presentation"
              onClick={() =>
                isProtoMode && !exportScreenFlag ? changeScreen() : ''
              }
              style={{ cursor: 'pointer' }}
              data-ls-id={id}
              dangerouslySetInnerHTML={{ __html: element.parameters.value }}
            />
          ) : screenLink && screenName && (isProtoMode || exportScreenFlag) ? (
            <a
              aria-label={`Link-${element.id}`}
              target="_self"
              href={
                isProtoMode
                  ? exportScreenFlag
                    ? `../${screenName}/index.html`
                    : '#'
                  : exportScreenFlag
                  ? `../${screenName}/index.html`
                  : ''
              }
              style={{ textDecoration: 'none', cursor: 'pointer' }}
              rel="noreferrer"
              dangerouslySetInnerHTML={{ __html: element.parameters.value }}
            />
          ) : (
            <label
              ref={
                ref as unknown as React.MutableRefObject<HTMLLabelElement | null>
              }
              id={id}
              data-ls-id={id}
              dangerouslySetInnerHTML={{ __html: element.parameters.value }}
            />
          )}
        </div>
      </div>
    );
  },
);

export default MaterialCheckbox;
