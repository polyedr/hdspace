import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';
import { ElementData } from '@Src/types';
import ElementsBlock from '@Components/RightPanel/ElementsTab/ElementsBlock';
import AssetLists from './Assets/AssetLists';

interface Props {
  library: Record<string, Record<string, ElementData>>;
  templates: Record<string, ElementData>;
}

const LibraryMenu: React.FC<Props> = ({ library, templates }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        sx={{
          borderBottom: '1px solid #E4E6EB',
          px: 1.5,
          minHeight: 40,
          '& .MuiTab-root': {
            minHeight: 40,
            textTransform: 'uppercase',
            fontSize: 10,
            fontWeight: 600,
            color: '#81818E',
          },
        }}
      >
        <Tab label="Assets" />
        <Tab label="Layouts" />
        <Tab label="Templates" />
      </Tabs>
      {value === 0 && <AssetLists />}
      {value === 1 &&
        Object.entries(library).map(([key, items]) => (
          <ElementsBlock key={key} title={key} elements={items} expandable />
        ))}
      {value === 2 && <ElementsBlock elements={templates} expandable={false} />}
    </Box>
  );
};

export default LibraryMenu;
