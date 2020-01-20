import React, { useCallback } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { selectors } from '$redux/project';
import { AppReduxState } from '$shared/types/app';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { CssLikeStyles } from '$utils/StyleHelper';

const styles = require('./styles.scss');

const MIN_PADDING = 0;

type StateProps = {
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
};

type Props = StateProps & PropertiesChangeProps;

function mapState(state: AppReduxState): StateProps {
  const activeItemStyles = selectors.selectActiveItemStyles(state) as Required<CssLikeStyles>;

  return {
    marginTop: activeItemStyles['margin-top'],
    marginRight: activeItemStyles['margin-right'],
    marginBottom: activeItemStyles['margin-bottom'],
    marginLeft: activeItemStyles['margin-left'],
    paddingTop: activeItemStyles['padding-top'],
    paddingRight: activeItemStyles['padding-right'],
    paddingBottom: activeItemStyles['padding-bottom'],
    paddingLeft: activeItemStyles['padding-left'],
  };
}

export const Component: React.FC<Props> = (props) => {
  const {
    updateStyles,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  } = props;

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

export const IndentsBlock = connect(mapState)(withConfigurableProperties(Component));
