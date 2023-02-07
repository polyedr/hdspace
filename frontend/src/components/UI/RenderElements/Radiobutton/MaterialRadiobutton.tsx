import React from 'react';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { updateElementParameters } from '@Redux/project/actions';
import { selectAllElements } from '@Redux/project/selectors/element';
import { RendererProps } from '../types';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('radiobutton', {});

const MaterialRadiobutton = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const dispatch = useDispatch();
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props, {});
    const allElements = useSelector(selectAllElements);
    const currentScreenId = useSelector(selectCurrentScreenId);
    const parent = element?.parent ? allElements[element.parent] : null;

    const setSelectedRadioButton = () => {
      if (parent?.id) {
        dispatch(
          updateElementParameters(
            parent?.id,
            { selectedRadioElementId: element?.id },
            { screenId: currentScreenId },
          ),
        );
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'mdc-touch-target-wrapper',
          className,
          groupClass,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
          classes.ownStyles,
        )}
        data-ls-id={element.id}
        {...eventHandlers}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="mdc-radio mdc-radio--touch">
          <input
            id={element.id}
            className="mdc-radio__native-control"
            type="radio"
            name={element.parameters.name}
            checked={
              !isDisabled &&
              element.id === parent?.parameters.selectedRadioElementId
            }
            onChange={setSelectedRadioButton}
          />
          <div className="mdc-radio__background">
            <div className="mdc-radio__outer-circle" />
            <div className="mdc-radio__inner-circle" />
          </div>
          <div className="mdc-radio__ripple" />
        </div>

        <label htmlFor={element.id}>{element.parameters.label}</label>
      </div>
    );
  },
);

export default MaterialRadiobutton;
