import React from 'react';
import { connect, useSelector } from 'react-redux';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Checkbox,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { AppReduxState } from '$shared/types/app';
import { selectors, actionsCreators } from '$redux/project/';
import {
  withConfigurableProperties,
  PropertiesChangeProps,
} from '$utils/withConfigurableProperties';
import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';
import { sharedClasses } from '$styles/sharedClasses';
import { ListItemElement } from '$api/types';
import { selectCurrentScreenId } from '$redux/project/selectors';

const styles = require('./ListItems.scss');

type StateProps = {
  listItems: ListItemElement[];
};

function mapState(state: AppReduxState): StateProps {
  const listItems = selectors.selectActiveItemChildren(
    state,
    'listItem',
  ) as ListItemElement[];

  return {
    listItems,
  };
}

const mapDispatch = {
  addChildToElement: actionsCreators.addChildToElement,
  deleteChildFromElement: actionsCreators.deleteItem,
};

type Props = StateProps &
  PropertiesChangeProps<ListItemElement> &
  typeof mapDispatch;

const ListItems: React.FC<Props> = ({
  activeItemID,
  listItems,
  updateParams,
  addChildToElement,
  deleteChildFromElement,
}) => {
  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleTextContentFieldChange = (
    listItemID: string,
    { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    updateParams({ textContent: value }, listItemID);
  };

  const handleUrlFieldChange = (
    listItemID: string,
    { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    updateParams({ link: value }, listItemID);
  };

  const handleAddButtonClick = () => {
    addChildToElement(
      'listItem',
      activeItemID,
      {
        textContent: 'New item',
        isLink: false,
        link: '',
      },
      currentScreenId,
    );
  };

  const handleDeleteButtonClick = (listItemID: string) => {
    deleteChildFromElement(listItemID, currentScreenId);
  };

  const handleCheckboxChange = (
    listItemID: string,
    { target: { checked } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateParams({ isLink: checked }, listItemID);
  };

  return (
    <div className={sharedClasses.propsSection}>
      <div className={styles.listItemsHeader}>
        <p className={styles.listItemsTitle}>List items</p>
        <Button
          className={sharedClasses.addButton}
          styleType="none"
          onClick={handleAddButtonClick}
        >
          <Icon icon="add" />
        </Button>
      </div>
      {listItems.map(({ id, parameters: { textContent, isLink, link } }) => (
        <ExpansionPanel key={id}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div className={styles.listItemsSummary}>
              <div className={styles.listItemHeading}>{textContent}</div>
              {listItems.length > 1 && (
                <Button
                  className={sharedClasses.propsButton}
                  styleType="none"
                  onClick={() => handleDeleteButtonClick(id)}
                >
                  <Icon icon="delete" />
                </Button>
              )}
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={styles.listItemsBlock}>
              <p className={sharedClasses.propsTitle}>Item text</p>
              <div className={sharedClasses.propsContainer}>
                <textarea
                  className={styles.listItemsField}
                  name="text-content"
                  value={textContent}
                  onChange={(event) => handleTextContentFieldChange(id, event)}
                />
              </div>
              <div className={sharedClasses.propsContainer}>
                <p className={sharedClasses.propsTitle}>Make link</p>
                <Checkbox
                  color="default"
                  value="make link"
                  name="make link"
                  checked={isLink}
                  onChange={(event) => handleCheckboxChange(id, event)}
                />
              </div>
              {isLink && (
                <>
                  <p className={sharedClasses.propsTitle}>Item url</p>
                  <div className={sharedClasses.propsContainer}>
                    <textarea
                      className={styles.listItemsField}
                      name="link"
                      value={link}
                      onChange={(event) => handleUrlFieldChange(id, event)}
                    />
                  </div>
                </>
              )}
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
};

const Component = connect(
  mapState,
  mapDispatch,
)(withConfigurableProperties(ListItems));
export { Component as ListItems };
