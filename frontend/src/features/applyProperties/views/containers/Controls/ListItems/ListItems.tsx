import React from 'react';
import { connect } from 'react-redux';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Checkbox } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { AppReduxState } from '$shared/types/app';
import { ListItem, ElementParameters } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';
import { sharedClasses } from '$styles/sharedClasses';

const styles = require('./ListItems.scss');

type StateProps = {
  listItems?: ListItem[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as ElementParameters;

  return {
    listItems: activeItemParams.listItems,
  };
}

type Props = StateProps & PropertiesChangeProps;

const ListItems: React.FC<Props> = ({
  listItems = [],
  updateParams,
}) => {
  const handleTextContentFieldChange = (itemIndex: number, { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedItems = listItems.map((item, index) => index === itemIndex ? { ...item, textContent: value as string } : item);
    updateParams({ listItems: updatedItems });
  };

  const handleUrlFieldChange = (itemIndex: number, { target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedItems = listItems.map((item, index) => index === itemIndex ? { ...item, link: value } : item);
    updateParams({ listItems: updatedItems });
  };

  const handleAddButtonClick = () => {
    updateParams({ listItems: [ ...listItems, { textContent: 'New item', isLink: false, link: '' }] });
  };

  const handleDeleteButtonClick = (itemIndex: number) => {
    const newItems = listItems.filter((item, index) => index !== itemIndex);
    updateParams({ listItems: newItems });
  };

  const handleCheckboxChange = (itemIndex: number, { target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
    const updatedItems = listItems.map((item, index) => index === itemIndex ? { ...item, isLink: checked } : item);
    updateParams({ listItems: updatedItems });
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
      {listItems.map(({ textContent, isLink, link }, index) => (
        <ExpansionPanel key={index}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div className={styles.listItemsSummary}>
              <div className={styles.listItemHeading}>{textContent}</div>
              <Button
                className={sharedClasses.propsButton}
                styleType="none"
                onClick={() => handleDeleteButtonClick(index)}
              >
                <Icon icon="delete" />
              </Button>
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
                  onChange={event => handleTextContentFieldChange(index, event)}
                />
              </div>
              <div className={sharedClasses.propsContainer}>
                <p className={sharedClasses.propsTitle}>Make link</p>
                <Checkbox
                  color="default"
                  value="make link"
                  name="make link"
                  checked={isLink}
                  onChange={event => handleCheckboxChange(index, event)}
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
                      onChange={event => handleUrlFieldChange(index, event)}
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

const Component = connect(mapState)(withConfigurableProperties(ListItems));
export { Component as ListItems };
