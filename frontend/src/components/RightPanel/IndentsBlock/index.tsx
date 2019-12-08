import React, {
  memo,
  useCallback,
  CSSProperties,
} from 'react';
import classNames from 'classnames';

import * as Actions from '$redux/project/actions';
import { T as ProjectT } from '$redux/project';
import { LIST_SCENARIO_TYPE } from '$constants/defaultParams';
import { IPanelEditProps } from '$components/RightPanel/PanelEditProps';
import { safeParseInt } from '$utils/NumberHelper';

const styles = require('./styles.scss');

const MIN_PADDING = 0;

interface IComponentProps {
  styleItem: IPanelEditProps['styleItem'],
  activeItem: ProjectT.ActiveItem,
  updateElementStyles: typeof Actions.updateElementStyles,
  updateScenarioStyles: typeof Actions.updateScenarioStyles,
}

export type TChangeIndent = (type: string, value: string, isMargin?: boolean) => void;

export const IndentsBlock: React.FunctionComponent<IComponentProps> = memo(({
  styleItem,
  activeItem,
  updateElementStyles,
  updateScenarioStyles,
}) => {
  const handleChangeIndent = useCallback<TChangeIndent>((type, value) => {
    const newIndent: CSSProperties = {
      ...styleItem,
      [type]: value,
    };

    if (LIST_SCENARIO_TYPE.indexOf(activeItem.itemType) !== -1) {
      updateScenarioStyles(activeItem.itemId, newIndent);
    } else {
      updateElementStyles(activeItem.itemId, newIndent);
    }
  }, [activeItem, styleItem, updateElementStyles, updateScenarioStyles]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Margins & Paddings</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <div className={styles.indentsController}>
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_margin,
                styles.indentsInput_margin_top,
              )}
              type="number"
              value={safeParseInt(styleItem['margin-top'], 10) || 0}
              onChange={event => handleChangeIndent('margin-top', `${event.target.value}px`)}
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_margin,
                styles.indentsInput_margin_right,
              )}
              type="number"
              value={safeParseInt(styleItem['margin-right'], 10) || 0}
              onChange={event => handleChangeIndent('margin-right', `${event.target.value}px`)}
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_margin,
                styles.indentsInput_margin_bottom,
              )}
              type="number"
              value={safeParseInt(styleItem['margin-bottom'], 10) || 0}
              onChange={event => handleChangeIndent('margin-bottom', `${event.target.value}px`)}
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_margin,
                styles.indentsInput_margin_left,
              )}
              type="number"
              value={safeParseInt(styleItem['margin-left'], 10) || 0}
              onChange={event => handleChangeIndent('margin-left', `${event.target.value}px`)}
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_padding,
                styles.indentsInput_padding_top,
              )}
              type="number"
              value={safeParseInt(styleItem['padding-top'], 10) || 0}
              min={MIN_PADDING}
              onChange={event => handleChangeIndent('padding-top', `${event.target.value}px`, false)}
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_padding,
                styles.indentsInput_padding_right,
              )}
              type="number"
              value={safeParseInt(styleItem['padding-right'], 10) || 0}
              min={MIN_PADDING}
              onChange={event => handleChangeIndent('padding-right', `${event.target.value}px`, false)}
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_padding,
                styles.indentsInput_padding_bottom,
              )}
              type="number"
              value={safeParseInt(styleItem['padding-bottom'], 10) || 0}
              min={MIN_PADDING}
              onChange={event => handleChangeIndent('padding-bottom', `${event.target.value}px`, false)}
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_padding,
                styles.indentsInput_padding_left,
              )}
              type="number"
              value={safeParseInt(styleItem['padding-left'], 10) || 0}
              min={MIN_PADDING}
              onChange={event => handleChangeIndent('padding-left', `${event.target.value}px`, false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
