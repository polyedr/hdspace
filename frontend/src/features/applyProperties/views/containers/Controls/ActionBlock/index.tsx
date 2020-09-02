import React, { useEffect } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import { IProjectScreen } from '$redux/project/types';
import {
  LinkParams,
  InternalLink,
  ExternalLink,
  HyperlinkElement,
} from '$api/types';
import Button from '../../../../../../components/UI/Button';
import Icon from '../../../../../../components/UI/Icon';
import { DropDown } from '../../../../../../components/UI/DropDown';

const styles = require('./styles.scss');

type StateProps = {
  screens: IProjectScreen[];
  action: LinkParams;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams<HyperlinkElement>(
    state,
  );

  return {
    screens: selectors.selectScreens(state),
    action: activeItemParams.action,
  };
}

type Props = StateProps & PropertiesChangeProps<HyperlinkElement>;

const ActionBlock: React.FC<Props> = ({ action, screens, updateParams }) => {
  const [isExternalLink, setIsExternalLink] = React.useState<boolean>(
    action && action.type === 'external-link',
  );

  const getCurrentUrl = React.useCallback(
    (currentType: InternalLink['type'] | ExternalLink['type']): string => {
      return (
        (action &&
          currentType === action.type &&
          (action.type === 'external-link'
            ? action.url
            : String(action.screenID))) ||
        ''
      );
    },
    [action],
  );

  const handlePageLinkButtonClick = React.useCallback(() => {
    setIsExternalLink(false);
  }, []);

  const handleExternalLinkButtonClick = React.useCallback(() => {
    setIsExternalLink(true);
  }, []);

  const handleExternalUrlInputChange = React.useCallback(
    ({ target: { value } }) => {
      updateParams({ action: { type: 'external-link', url: value } });
    },
    [updateParams],
  );

  const handlePageUrlDropdownChange = React.useCallback(
    (value) => {
      updateParams({
        action: {
          type: 'internal-link',
          screenID: value === 'noScreen' ? value : Number(value),
        },
      });
    },
    [updateParams],
  );

  useEffect(() => {
    if (action && action.type === 'external-link') {
      setIsExternalLink(true);
    }
    if (action && action.type === 'internal-link') {
      setIsExternalLink(false);
    }
  }, [action]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Action</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <Button
            className={classNames(
              'mainImgBtn',
              !isExternalLink && 'mainImgBtn_active',
            )}
            styleType="none"
            onClick={handlePageLinkButtonClick}
          >
            <Icon icon="link" />
          </Button>
          <Button
            className={classNames(
              'mainImgBtn',
              isExternalLink && 'mainImgBtn_active',
            )}
            styleType="none"
            onClick={handleExternalLinkButtonClick}
          >
            <Icon icon="page" />
          </Button>
          <div className={styles.inputsBlock}>
            {isExternalLink ? (
              <input
                type="text"
                placeholder="Enter a page URL"
                value={getCurrentUrl('external-link')}
                onChange={handleExternalUrlInputChange}
              />
            ) : (
              <DropDown
                defaultValue={getCurrentUrl('internal-link')}
                value={getCurrentUrl('internal-link')}
                options={[{ label: 'No screen', value: 'noScreen' }].concat(
                  screens.map((screen) => ({
                    label: `${screen.name}`,
                    value: `${screen.id}`,
                  })),
                )}
                onChange={handlePageUrlDropdownChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(ActionBlock));
