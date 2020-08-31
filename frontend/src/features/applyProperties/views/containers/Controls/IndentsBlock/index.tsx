import React, { useCallback } from 'react';
import classNames from 'classnames';

import { connect } from 'react-redux';
import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import { LibraryElement } from '$api/types';
import { Entity } from '$domain/core';
import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project';

import StylesHeader from '../../../components/StylesHeader/StylesHeader';

const styles = require('./styles.scss');

const MIN_PADDING = 0;

function mapState(state: AppReduxState) {
  return {
    marginTop: selectors.selectCurrentEditableStyles(state, 'margin-top'),
    marginRight: selectors.selectCurrentEditableStyles(state, 'margin-right'),
    marginBottom: selectors.selectCurrentEditableStyles(state, 'margin-bottom'),
    marginLeft: selectors.selectCurrentEditableStyles(state, 'margin-left'),
    paddingTop: selectors.selectCurrentEditableStyles(state, 'padding-top'),
    paddingRight: selectors.selectCurrentEditableStyles(state, 'padding-right'),
    paddingBottom: selectors.selectCurrentEditableStyles(
      state,
      'padding-bottom',
    ),
    paddingLeft: selectors.selectCurrentEditableStyles(state, 'padding-left'),
  };
}

type Props = ReturnType<typeof mapState> &
  PropertiesChangeProps<LibraryElement<Entity>>;

const IndentsBlock: React.FC<Props> = (props) => {
  const {
    updateStyles,
    removeStyles,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  } = props;

  const handleIndentChange = useCallback(
    (type: string, value: string) => {
      updateStyles({ [type]: value });
    },
    [updateStyles],
  );

  return (
    <div className="propsElementsBlock">
      <StylesHeader
        title="Margins & Paddings"
        onClick={removeStyles}
        cssPropertiesNames={[
          'margin-top',
          'margin-right',
          'margin-bottom',
          'margin-left',
          'padding-top',
          'padding-right',
          'padding-bottom',
          'padding-left',
        ]}
      />
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
              value={parseInt(marginTop)}
              onChange={(event) =>
                handleIndentChange('margin-top', `${event.target.value}px`)
              }
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_margin,
                styles.indentsInput_margin_right,
              )}
              type="number"
              value={parseInt(marginRight)}
              onChange={(event) =>
                handleIndentChange('margin-right', `${event.target.value}px`)
              }
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_margin,
                styles.indentsInput_margin_bottom,
              )}
              type="number"
              value={parseInt(marginBottom)}
              onChange={(event) =>
                handleIndentChange('margin-bottom', `${event.target.value}px`)
              }
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_margin,
                styles.indentsInput_margin_left,
              )}
              type="number"
              value={parseInt(marginLeft)}
              onChange={(event) =>
                handleIndentChange('margin-left', `${event.target.value}px`)
              }
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_padding,
                styles.indentsInput_padding_top,
              )}
              type="number"
              value={parseInt(paddingTop)}
              min={MIN_PADDING}
              onChange={(event) =>
                handleIndentChange('padding-top', `${event.target.value}px`)
              }
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_padding,
                styles.indentsInput_padding_right,
              )}
              type="number"
              value={parseInt(paddingRight)}
              min={MIN_PADDING}
              onChange={(event) =>
                handleIndentChange('padding-right', `${event.target.value}px`)
              }
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_padding,
                styles.indentsInput_padding_bottom,
              )}
              type="number"
              value={parseInt(paddingBottom)}
              min={MIN_PADDING}
              onChange={(event) =>
                handleIndentChange('padding-bottom', `${event.target.value}px`)
              }
            />
            <input
              className={classNames(
                styles.indentsInput,
                styles.indentsInput_padding,
                styles.indentsInput_padding_left,
              )}
              type="number"
              value={parseInt(paddingLeft)}
              min={MIN_PADDING}
              onChange={(event) =>
                handleIndentChange('padding-left', `${event.target.value}px`)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(IndentsBlock));
