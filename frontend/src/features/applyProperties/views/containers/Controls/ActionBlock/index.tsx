import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { actionsCreators, selectors } from '$redux/project/';
import { DropDown } from '$components/UI/DropDown/';
import { Icon } from '$components/UI/Icon/';
import { Button } from '$components/UI/Button/';
import { withParamsChangeHandler, ParamsChangeHandler } from '$utils/withParamsChangeHandler';

const styles = require('./styles.scss');

type StateProps = {
  activeItemID: string;
  screensIDs: number[];
  content: string;
  url: string;
}

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;

  return {
    activeItemID: selectors.selectActiveItem(state).itemId,
    screensIDs: selectors.selectCurrentProject(state).projectscreen,
    content: activeItemParams.content,
    url: activeItemParams.url,
  };
}

const mapDispatch = {
  updateElementParameters: actionsCreators.updateElementParameters,
};

type Props = StateProps & typeof mapDispatch & ParamsChangeHandler;

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
            value={content || url || ''}
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
                value={url || ''}
                onChange={handleLinkUrlChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionBlock = connect(mapState, mapDispatch)(withParamsChangeHandler(Component));
export { ActionBlock };
