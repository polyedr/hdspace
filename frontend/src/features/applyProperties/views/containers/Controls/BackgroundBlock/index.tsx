import React, { memo, useState, useCallback } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { ColorPicker } from '$components/UI/ColorPicker/';
import { DEFAULT_BACKGROUND } from '$constants/defaultParams';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { CssLikeStyles } from '$utils/StyleHelper';

type StateProps = {
  backgroundColor: string;
}

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = selectors.selectActiveItemStyles(state) as Required<CssLikeStyles>;

  return {
    backgroundColor: activeItemStyles['background-color'],
  };
}

type Props = StateProps & PropertiesChangeProps;

export const Component : React.FC<Props> = memo(({
  backgroundColor,
  updateStyles,
}) => {
  const [isBackgroundColorPickerOpen, setIsBackgroundColorPickerOpen] = useState<boolean>(false);

  const handleChangeColor = useCallback((newColor) => {
    if (newColor.length > 7) {
      return;
    }

    updateStyles({ 'background-color': newColor })
  }, [updateStyles]);

  const handleActiveColorPicker = useCallback(() => {
    setIsBackgroundColorPickerOpen(!isBackgroundColorPickerOpen);
  }, [isBackgroundColorPickerOpen]);

  const handleChangeOpacity = useCallback(() => {
    console.log();
  }, []);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Background</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <ColorPicker
            display={isBackgroundColorPickerOpen}
            color={backgroundColor}
            onChangeComplete={color => handleChangeColor(color.hex)}
            onClose={handleActiveColorPicker}
          />
          <input
            className="colorField"
            type="text"
            value={backgroundColor || DEFAULT_BACKGROUND['background-color']}
            onChange={({ target: { value } }) => handleChangeColor(value)}
          />
          <input
            className="colorField"
            type="text"
            value={1}
            onChange={handleChangeOpacity}
          />
        </div>
      </div>
    </div>
  );
});

export const BackgroundBlock = connect(mapState)(withConfigurableProperties(Component));
