import React from 'react';
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
    content: activeItemParams.content,
    url: activeItemParams.url,
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

  const [isPage, setPageType] = React.useState<boolean>(true);

  const handleChangeLinkUrl = React.useCallback(() => {
    console.log('меняет адрес внешней страницы ссылки');
  }, []);

  const handlePageLinkType = React.useCallback(() => {
    setPageType(true);
  }, []);

  const handleUrlLinkType = React.useCallback(() => {
    setPageType(false);
  }, []);

  const handleLinkContentChange = React.useCallback(({ target: { value } }) => {
    updateParams({ content: value });
  }, [updateParams]);

  const handleLinkUrlChange = React.useCallback(({ target: { value } }) => {
    updateParams({ url: value });
  }, [updateParams]);

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
            onChange={handleLinkContentChange}
          />
        </div>
        <div className="propsElementsInnerBlock">
          <Button
            className={classNames('mainImgBtn', isPage && 'mainImgBtn_active')}
            styleType="none"
            onClick={handlePageLinkType}
          >
            <Icon icon="link" />
          </Button>
          <Button
            className={classNames('mainImgBtn', !isPage && 'mainImgBtn_active')}
            styleType="none"
            onClick={handleUrlLinkType}
          >
            <Icon icon="page" />
          </Button>
          <div className={styles.inputsBlock}>
            { isPage && (
              <DropDown
                options={
                  screensIDs.map((_, elIndex) => ({ // TODO: restore when screens will be preloaded
                    label: `Screen ${elIndex}`,
                    value: `Screen ${elIndex}`,
                  }))
                }
                onChange={handleChangeLinkUrl}
              />
            )}
            { !isPage && (
              <input
                type="text"
                placeholder="Enter a page URL"
                value={url}
                onChange={handleLinkUrlChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ActionBlock = connect(mapState)(withConfigurableProperties(Component));
