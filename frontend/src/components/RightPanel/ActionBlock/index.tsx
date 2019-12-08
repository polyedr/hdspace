import React from 'react';
import classNames from 'classnames';

import { DropDown } from '$components/UI/DropDown/';
import { Icon } from '$components/UI/Icon/';
import { Button } from '$components/UI/Button/';
import { EditorProps } from '$containers/EditorLogic';
import * as Actions from '$redux/project/actions';
import { IPanelEditProps } from '$components/RightPanel/PanelEditProps';
import { T as ProjectT } from '$redux/project';
import { elementTypes } from '$constants/menu';

const styles = require('./styles.scss');

interface IComponentProps {
  project: EditorProps['currentProject'],
  params: IPanelEditProps['params'],
  activeItem: ProjectT.ActiveItem,
  itemType: string,
  updateElementParameters: typeof Actions.updateElementParameters,
}

const Component: React.FunctionComponent<IComponentProps> = ({
  project: { projectscreen },
  params,
  activeItem,
  itemType,
  updateElementParameters,
}) => {
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
    updateElementParameters(activeItem.itemId, { content: value });
  }, [updateElementParameters, activeItem]);

  const handleLinkUrlChange = React.useCallback(({ target: { value } }) => {
    updateElementParameters(activeItem.itemId, { url: value });
  }, [updateElementParameters, activeItem]);

  return (
    <div className="propsElementsBlock">
      <p className="propsElementsBlockTitle">Action</p>
      <div className="propsElementsContentBlock">
        {
          itemType === elementTypes.hyperLine && (
            <div className="propsElementsInnerBlock">
              <input
                className={styles.textContentField}
                type="text"
                placeholder="Enter link text content"
                value={params.content || params.url || ''}
                onChange={handleLinkContentChange}
              />
            </div>
          )
        }
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
                  projectscreen.map(element => ({
                    label: element.name,
                    value: element.name,
                  }))
                }
                onChange={handleChangeLinkUrl}
              />
            )}
            { !isPage && (
              <input
                type="text"
                placeholder="Enter a page URL"
                value={params.url || ''}
                onChange={handleLinkUrlChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ActionBlock = React.memo(Component);
