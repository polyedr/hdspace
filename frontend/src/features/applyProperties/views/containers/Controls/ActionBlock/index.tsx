import React, { useEffect } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import { Icon } from '$components/UI/Icon/';
import { Button } from '$components/UI/Button/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { LinkParams, InternalLink, ExternalLink } from '$redux/project/types';

const styles = require('./styles.scss');

type StateProps = {
  screensIDs: number[];
  action: LinkParams;
}

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;

  return {
    screensIDs: selectors.selectCurrentProject(state).projectscreen,
    action: activeItemParams.action,
  };
}

type Props = StateProps & PropertiesChangeProps;

const Component: React.FC<Props> = (props) => {
  const {
    action,
    screensIDs,
    updateParams,
  } = props;

  const [isExternalLink, setIsExternalLink] = React.useState<boolean>(!!(action && action.type === 'external-link'));

  const getCurrentUrl =  React.useCallback((currentType: InternalLink['type'] | ExternalLink['type']): string => {
    return action && currentType === action.type && (action.type === 'external-link' ? action.url : String(action.screenID)) || '';
  }, [action]);
 
  const handlePageLinkButtonClick = React.useCallback(() => {
    setIsExternalLink(false);
  }, [setIsExternalLink]);

  const handleExternalLinkButtonClick = React.useCallback(() => {
    setIsExternalLink(true);
  }, [setIsExternalLink]);

  const handleExternalUrlInputChange = React.useCallback(({ target: { value } }) => {
    const newActionParams: LinkParams = value ? { type: 'external-link', url: value } : null;
    updateParams({ action: newActionParams });
  }, [updateParams]);

  const handlePageUrlDropdownChange = React.useCallback(value => {
    const newActionParams: LinkParams = value ? { type: 'internal-link', screenID: Number(value) } : null;
    updateParams({ action: newActionParams });
  }, [updateParams]);

  useEffect(() => {
    action && action.type === 'external-link' && action.url && setIsExternalLink(true);
    action && action.type === 'internal-link' && action.screenID && setIsExternalLink(false);
  }, [action]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Action</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <Button
            className={classNames('mainImgBtn', !isExternalLink && 'mainImgBtn_active')}
            styleType="none"
            onClick={handlePageLinkButtonClick}
          >
            <Icon icon="link" />
          </Button>
          <Button
            className={classNames('mainImgBtn', isExternalLink && 'mainImgBtn_active')}
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
                options={
                  [{ label: 'No screen', value: '' }].concat(
                    screensIDs.map((screenId, elIndex) => ({
                      label: `Screen ${elIndex}`,
                      value: `${screenId}`,
                  })))
                }
                onChange={handlePageUrlDropdownChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ActionBlock = connect(mapState)(withConfigurableProperties(Component));
