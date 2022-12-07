import ElementsBlock from '@Components/RightPanel/ElementsTab/ElementsBlock';
import {
  TabsUnstyled,
  TabUnstyled,
  TabsListUnstyled,
  TabPanelUnstyled,
} from '@mui/base';
import { ElementData } from '@Src/types';
import React from 'react';
import AssetLists from './Assets/AssetLists';

interface Props {
  library: { [key: string]: { [key: string]: ElementData } };
  templates: { [key: string]: ElementData };
}

const LibraryMenu: React.FC<Props> = ({ library, templates }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabsUnstyled value={value} onChange={handleChange}>
      <TabsListUnstyled>
        <TabUnstyled>Assets</TabUnstyled>
        <TabUnstyled>Layouts</TabUnstyled>
        <TabUnstyled>Templates</TabUnstyled>
      </TabsListUnstyled>
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
