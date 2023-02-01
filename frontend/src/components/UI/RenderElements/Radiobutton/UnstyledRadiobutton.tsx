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

const UnstyledRadiobutton = React.forwardRef<HTMLInputElement, RendererProps>(
  (props, ref) => {
    const dispatch = useDispatch();
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);
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

    const { value, name, label } = element.parameters;

    return (
      <label
        htmlFor={element.id}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <input
          type="radio"
          ref={ref}
          id={element.id}
          data-ls-id={element.id}
          className={cn(
            className,
            groupClass,
            isDisabled ? classes.disabled : classes.ownPseudoStyles,
            classes.ownStyles,
          )}
          value={value}
          name={name}
          {...eventHandlers}
          checked={
            !isDisabled &&
            element.id === parent?.parameters.selectedRadioElementId
          }
          onChange={setSelectedRadioButton}
        />

        {label}
      </label>
    );
  },
);

export default UnstyledRadiobutton;
