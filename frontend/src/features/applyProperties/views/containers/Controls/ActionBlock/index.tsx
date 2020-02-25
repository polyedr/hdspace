import React, { useEffect } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import { Icon } from '$components/UI/Icon/';
import { Button } from '$components/UI/Button/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';

const styles = require('./styles.scss');

type StateProps = {
  screensIDs: number[];
  content: string;
  url: string;
}

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;

  return {
    screensIDs: selectors.selectCurrentProject(state).projectscreen,
    content: activeItemParams.actionContent,
    url: activeItemParams.actionUrl,
  };
}

type Props = StateProps & PropertiesChangeProps;

const Component: React.FC<Props> = (props) => {
  const {
    url,
    content,
    screensIDs,
    updateParams,
  } = props;

  const isExternalUrl = React.useCallback(() => {
    return !screensIDs.includes(Number(url));
  }, [url, screensIDs]);

  const [isExternalLink, setIsExternalLink] = React.useState<boolean>(isExternalUrl());
 
  const handlePageLinkButtonClick = React.useCallback(() => {
    setIsExternalLink(false);
  }, [setIsExternalLink, url]);

  const handleExternalLinkButtonClick = React.useCallback(() => {
    setIsExternalLink(true);
  }, [setIsExternalLink, url]);

  const handleLinkTitleInputChange = React.useCallback(({ target: { value } }) => {
    updateParams({ actionContent: value });
  }, [updateParams]);

  const handleExternalUrlInputChange = React.useCallback(({ target: { value } }) => {
    updateParams({ actionUrl: value });
  }, [updateParams, url]);

  const handlePageUrlDropdownChange = React.useCallback(value => {
    updateParams({ actionUrl: value });
  }, [updateParams, url]);

  useEffect(() => {
    setIsExternalLink(isExternalUrl())
  }, [url]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Action</p>
      <div className="propsElementsContentBlock">
        <div className="propsElementsInnerBlock">
          <input
            className={styles.textContentField}
            type="text"
            placeholder="Enter link text content"
            value={content}
            onChange={handleLinkTitleInputChange}
          />
        </div>
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
                value={isExternalUrl() ? url : ''}
                onChange={handleExternalUrlInputChange}
              />
            ) : (
              <DropDown
                defaultValue={!isExternalUrl() ? url : ''}
                value={!isExternalUrl() ? url : ''}
                options={
                  screensIDs.map((screenId, elIndex) => ({ // TODO: restore when screens will be preloaded
                    label: `Screen ${elIndex}`,
                    value: `${screenId}`,
                  }))
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
