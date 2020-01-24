import React, { memo, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { ActiveItem } from '$redux/project/types';
import { ColorPicker } from '$components/UI/ColorPicker/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { CssLikeStyles } from '$utils/StyleHelper';
import { normalizeColor } from '$utils/ColorHelper';
import useCurrentColor from '../../../components/useCurrentColor';

type StateProps = {
  backgroundColor: string;
  activeItem: ActiveItem;
}

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = selectors.selectActiveItemStyles(state) as Required<CssLikeStyles>;
  const activeItem = selectors.selectActiveItem(state);

  return {
    backgroundColor: activeItemStyles['background-color'],
    activeItem,
  };
}

type Props = StateProps & PropertiesChangeProps;

export const Component: React.FC<Props> = memo((props) => {
  const {
    backgroundColor,
    updateStyles,
    activeItem,
  } = props;
  const [isBackgroundColorPickerOpen, setIsBackgroundColorPickerOpen] = useState<boolean>(false);
  const [currentBackgroundColor, setCurrentBackgroundColor] = useCurrentColor(
    backgroundColor,
    activeItem,
  );

  const handleColorChange = useCallback((color) => {
    const newColor = normalizeColor(color);

    setCurrentBackgroundColor(newColor);

    if (newColor.isValid) {
      updateStyles({ 'background-color': newColor.value })
    }
  }, [updateStyles]);

  const handleColorPickerClose = useCallback(() => {
    setIsBackgroundColorPickerOpen(!isBackgroundColorPickerOpen);
  }, [isBackgroundColorPickerOpen]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Background</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <ColorPicker
            display={isBackgroundColorPickerOpen}
            color={backgroundColor}
            onChangeComplete={color => handleColorChange(color)}
            onClose={handleColorPickerClose}
          />
          <input
            className={cn("colorField", { inputWithError: !currentBackgroundColor.isValid })}
            type="text"
            value={currentBackgroundColor.value}
            onBlur={() => handleColorChange(backgroundColor)}
            onChange={({ target: { value } }) => handleColorChange(value)}
          />
        </div>
      </div>
    </div>
  );
});

export const BackgroundBlock = connect(mapState)(withConfigurableProperties(Component));
