import React from 'react';
import { connect, useSelector } from 'react-redux';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '../../../../../../components/UI/Button';
import Icon from '../../../../../../components/UI/Icon';
import { ListItemElement } from '../../../../../../api/types';
import {
  selectActiveItemChildren,
  selectCurrentScreenId,
} from '../../../../../../redux/project/selectors';
import { AppReduxState } from '../../../../../../shared/types/app';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import {
  addChildToElement,
  deleteItem,
} from '../../../../../../redux/project/actions';

const useStyles = makeStyles({
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
});

type StateProps = {
  listItems: ListItemElement[];
};

function mapState(state: AppReduxState): StateProps {
  const listItems = selectActiveItemChildren(
    state,
    'listItem',
  ) as ListItemElement[];

  return {
    listItems,
  };
}

const mapDispatch = {
  addChildToElement,
  deleteChildFromElement: deleteItem,
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
  const classes = useStyles();
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
      { screenId: currentScreenId },
    );
  };

  const handleDeleteButtonClick = (listItemID: string) => {
    deleteChildFromElement(listItemID, { screenId: currentScreenId });
  };

  const handleCheckboxChange = (
    listItemID: string,
    { target: { checked } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateParams({ isLink: checked }, listItemID);
  };

  return (
    <div>
      <div>
        <h5>List items</h5>

        <Button styleType="none" onClick={handleAddButtonClick}>
          <Icon icon="add" />
        </Button>
      </div>

      {listItems.map(({ id, parameters: { textContent, isLink, link } }) => (
        <Accordion key={id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div>{textContent}</div>

            {listItems.length > 1 && (
              <Button
                styleType="none"
                onClick={() => handleDeleteButtonClick(id)}
              >
                <Icon icon="delete" />
              </Button>
            )}
          </AccordionSummary>

          <AccordionDetails className={classes.details}>
            <div>
              <h5>Item text</h5>

              <textarea
                name="text-content"
                value={textContent}
                onChange={(event) => handleTextContentFieldChange(id, event)}
              />
            </div>

            <div>
              <h5>Make link</h5>

              <Checkbox
                value="make link"
                name="make link"
                checked={isLink}
                onChange={(event) => handleCheckboxChange(id, event)}
              />
            </div>

            {isLink && (
              <div>
                <h5>Item url</h5>

                <textarea
                  name="link"
                  value={link}
                  onChange={(event) => handleUrlFieldChange(id, event)}
                />
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default connect(
  mapState,
  mapDispatch,
)(withConfigurableProperties(ListItems));
