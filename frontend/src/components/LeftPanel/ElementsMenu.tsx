import { GroupedVirtuoso } from 'react-virtuoso';
import React, { useMemo } from 'react';
import { Grid } from '@mui/material';
import { ElementsHierarchy } from '@Src/types';
import ElementButton from '@Components/RightPanel/ElementsTab/ElementButton';
import ElementDropdown from '@Components/RightPanel/ElementsTab/ElementDropdown';

export const ElementsMenu = ({
  elements,
}: {
  elements: ElementsHierarchy['elements'];
}) => {
  const groupsNames = Object.keys(elements);

  const groupCounts = Object.values(elements).map((items) => {
    const val = Math.ceil(Object.values(items).length / 3);
    return val;
  });

  const generateEmptyElements = (count: number) => {
    return new Array(count).fill(0).map(() => null);
  };

  const allElements = useMemo(() => {
    let _elements = [];

    Object.values(elements).forEach((items) => {
      let groupItems = [];

      Object.values(items).forEach((item) => {
        groupItems.push(item);
      });

      if (groupItems.length % 3 !== 0) {
        const upperValue = Math.ceil(groupItems.length / 3) * 3;
        const diff = upperValue - groupItems.length;

        groupItems = [...groupItems, ...generateEmptyElements(diff)];
      }

      _elements = [..._elements, ...groupItems];
    });

    return _elements;
  }, [elements]);

  const renderElement = (index) => {
    const element = allElements[index];

    if (!element) {
      return <div />;
    }

    if (Array.isArray(element)) {
      return <ElementDropdown options={element} />;
    }
    return <ElementButton elementData={element} />;
  };

  const makeRange = (start: number, end: number) => {
    return new Array(end - start).fill(1).map((_, i) => start + i);
  };

  return (
    <GroupedVirtuoso
      groupCounts={groupCounts}
      groupContent={(index) => {
        return (
          <div
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              fontWeight: 600,
              minHeight: 32,
              backgroundColor: '#F3F4F6',
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {groupsNames[index]}
          </div>
        );
      }}
      itemContent={(index) => {
        const currentIndex = index * 3;

        return (
          <Grid item container>
            {React.Children.toArray(
              makeRange(currentIndex, currentIndex + 3).map((index) => (
                <Grid item xs={4}>
                  {renderElement(index)}
                </Grid>
              )),
            )}
          </Grid>
        );
      }}
    />
  );
};
