import React, { useCallback } from 'react';
import classNames from 'classnames';

import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { CssLikeStyles } from '$utils/StyleHelper';

const styles = require('./styles.scss');

const MIN_PADDING = 0;

type OwnProps = {
  activeItemStyles: Required<CssLikeStyles>;
};

type Props = OwnProps & PropertiesChangeProps;

const IndentsBlock: React.FC<Props> = (props) => {
  const { updateStyles, activeItemStyles } = props;

  const marginTop = activeItemStyles['margin-top'];
  const marginRight = activeItemStyles['margin-right'];
  const marginBottom = activeItemStyles['margin-bottom'];
  const marginLeft = activeItemStyles['margin-left'];
  const paddingTop = activeItemStyles['padding-top'];
  const paddingRight = activeItemStyles['padding-right'];
  const paddingBottom = activeItemStyles['padding-bottom'];
  const paddingLeft = activeItemStyles['padding-left'];

  const handleIndentChange = useCallback((type: string, value: string) => {
    updateStyles({ [type]: value });
  }, [updateStyles]);

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
              value={parseInt(marginTop, 10)}
              onChange={event => handleIndentChange('margin-top', `${event.target.value}px`)}
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_margin,
                styles.indentsInput_margin_right,
              )}
              type="number"
              value={parseInt(marginRight, 10)}
              onChange={event => handleIndentChange('margin-right', `${event.target.value}px`)}
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_margin,
                styles.indentsInput_margin_bottom,
              )}
              type="number"
              value={parseInt(marginBottom, 10)}
              onChange={event => handleIndentChange('margin-bottom', `${event.target.value}px`)}
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_margin,
                styles.indentsInput_margin_left,
              )}
              type="number"
              value={parseInt(marginLeft, 10)}
              onChange={event => handleIndentChange('margin-left', `${event.target.value}px`)}
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_padding,
                styles.indentsInput_padding_top,
              )}
              type="number"
              value={parseInt(paddingTop, 10)}
              min={MIN_PADDING}
              onChange={event => handleIndentChange('padding-top', `${event.target.value}px`)}
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_padding,
                styles.indentsInput_padding_right,
              )}
              type="number"
              value={parseInt(paddingRight, 10)}
              min={MIN_PADDING}
              onChange={event => handleIndentChange('padding-right', `${event.target.value}px`)}
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_padding,
                styles.indentsInput_padding_bottom,
              )}
              type="number"
              value={parseInt(paddingBottom, 10)}
              min={MIN_PADDING}
              onChange={event => handleIndentChange('padding-bottom', `${event.target.value}px`)}
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_padding,
                styles.indentsInput_padding_left,
              )}
              type="number"
              value={parseInt(paddingLeft, 10)}
              min={MIN_PADDING}
              onChange={event => handleIndentChange('padding-left', `${event.target.value}px`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Component = withConfigurableProperties(IndentsBlock);
export { Component as IndentsBlock };
