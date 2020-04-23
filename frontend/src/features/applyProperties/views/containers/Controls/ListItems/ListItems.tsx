import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, makeStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { AppReduxState } from '$shared/types/app';
import { ListItem } from '$redux/project/types';
import { selectors } from '$redux/project/';
import { withConfigurableProperties, PropertiesChangeProps } from '$utils/withConfigurableProperties';
import { generateUniqueName } from '$utils/generateUniqueName';
import { Button } from '$components/UI/Button';
import { Icon } from '$components/UI/Icon';

const styles = require('./ListItems.scss');

type StateProps = {
  listItems: ListItem[];
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectors.selectActiveItemParams(state) as any;

  return {
    listItems: activeItemParams.listItems,
  };
}

type Props = StateProps & PropertiesChangeProps;

const useStyles = makeStyles({
  root: {
  },

  content: {
  }
});

const Component: React.FC<Props> = ({
  listItems,
  updateParams,
}) => {
  const classes = useStyles();

  const handleTextContentFieldChange = useCallback((itemIndex: number, { target: { value } }) => {
    const updatedItems = listItems.map((item, index) => index === itemIndex ? { ...item, textContent: value as string } : item);
    updateParams({ listItems: updatedItems });
  }, [updateParams, listItems]);

  const handleUrlFieldChange = useCallback((itemIndex: number, { target: { value } }) => {
    const updatedItems = listItems.map((item, index) => index === itemIndex ? { ...item, link: value } : item);
    updateParams({ listItems: updatedItems });
  }, [updateParams, listItems]);

  const handleAddButtonClick = useCallback(() => {
    updateParams({ listItems: [ ...listItems, { textContent: 'New item', link: '' } ] });
  }, [listItems, updateParams]);

  const handleDeleteButtonClick = useCallback((itemIndex: number) => {
    const newItems = listItems.filter((item, index) => index !== itemIndex);
    updateParams({ listItems: newItems });
  }, [listItems, updateParams]);

  return (
    <div className="propsElementsBlock">
      <div className={styles.listItemsHeader}>
        <p className={styles.listItemsTitle}>List items</p>
        <Button
          className="addBtn"
          styleType="none"
          onClick={handleAddButtonClick}
        >
          <Icon icon="add" />
        </Button>
      </div>
      {listItems.map(({ textContent, link }, index) => (
        <ExpansionPanel key={index}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            // className={classes.root}
            classes={classes}
          >
            <div className={styles.listItemsSummary}>
              <div className={styles.listItemHeading}>{textContent}</div>
              <Button
                className="propsPanelImgBtn"
                styleType="none"
                onClick={() => handleDeleteButtonClick(index)}
              >
                <Icon icon="delete" />
              </Button>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={styles.listItemsBlock}>
              <p className="propsElementsBlockTitle">Item text</p>
              <div className="propsElementsInnerBlock">
                <textarea
                  className={styles.listItemsField}
                  name="text-content"
                  value={textContent}
                  onChange={event => handleTextContentFieldChange(index, event)}
                />
              </div>
              <p className="propsElementsBlockTitle">Item url</p>
              <div className="propsElementsInnerBlock">
                <textarea
                  className={styles.listItemsField}
                  name="link"
                  value={link}
                  onChange={event => handleUrlFieldChange(index, event)}
                />
                </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
};

export const ListItems = connect(mapState)(withConfigurableProperties(Component));
