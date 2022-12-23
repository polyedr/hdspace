import ElementsBlock from '@Components/RightPanel/ElementsTab/ElementsBlock';
import {
  TabsUnstyled,
  TabUnstyled,
  TabsListUnstyled,
  TabPanelUnstyled,
} from '@mui/base';
import { styled } from '@mui/material';
import { ElementData } from '@Src/types';
import React from 'react';
import AssetLists from './Assets/AssetLists';

interface Props {
  library: { [key: string]: { [key: string]: ElementData } };
  templates: { [key: string]: ElementData };
}

const CustomTabsListUnstyled = styled(TabsListUnstyled)({
  padding: 15,
  borderBottom: '1px solid #E4E6EB',

  '& button': {
    backgroundColor: '#ffffff',
    border: '1px solid #F3F4F6',
    padding: '10px 0',
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#81818E',
    fontWeight: 600,
    width: '33%',
    cursor: 'pointer',

    '&:nth-child(2)': {
      borderLeft: 'none',
      borderRight: 'none',
    },

    '&:nth-child(1)': {
      borderRadius: '4px 0 0 4px',
    },

    '&:nth-child(3)': {
      borderRadius: '0 4px 4px 0',
    },

    '&.Mui-selected': {
      backgroundColor: '#F3F4F6',
      color: '#2A2A2D',
    },
  },
});

const LibraryMenu: React.FC<Props> = ({ library, templates }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabsUnstyled value={value} onChange={handleChange}>
      <CustomTabsListUnstyled>
        <TabUnstyled>Assets</TabUnstyled>
        <TabUnstyled>Layouts</TabUnstyled>
        <TabUnstyled>Templates</TabUnstyled>
      </CustomTabsListUnstyled>
      <TabPanelUnstyled value={0}>
        <AssetLists />
      </TabPanelUnstyled>
      <TabPanelUnstyled value={1}>
        {Object.entries(library).map(([key, value]) => (
          <ElementsBlock key={key} title={key} elements={value} expandable />
        ))}
      </TabPanelUnstyled>
      <TabPanelUnstyled value={2}>
        <ElementsBlock elements={templates} expandable={false} />
      </TabPanelUnstyled>
    </TabsUnstyled>
  );
};

export default LibraryMenu;
