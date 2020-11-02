import React, { memo, useCallback } from 'react';
import { JUSTIFY_VALUES, ALIGN_VALUES } from './constants';
import Button from '../../../../../components/UI/Button';
import { DropDown } from '../../../../../components/UI/DropDown';
import { Flex } from '../../../../../redux/project/types';

type Orientation = 'vertical' | 'horizontal';

type Props = {
  properties: Flex;
  onChange<T extends keyof Flex>(prop: T, value: Flex[T]): void;
};

const FlexProperties: React.FC<Props> = ({ properties, onChange }) => {
  const orientation: Orientation =
    properties.flexDirection === 'row' ||
    properties.flexDirection === 'row-reverse'
      ? 'horizontal'
      : 'vertical';

  const renderLabel = useCallback(
    (reversed: boolean) => (
      <span>
        {reversed ? 'Y-' : 'X-'}
        axis
      </span>
    ),
    [],
  );

  return (
    <>
      <div>
        <h4>Direction</h4>

        <div>
          <Button
            styleType="primary"
            onClick={() => onChange('flexDirection', 'row')}
          >
            Horizontal
          </Button>

          <Button
            styleType="primary"
            onClick={() => onChange('flexDirection', 'column')}
          >
            Vertical
          </Button>
        </div>
      </div>

      <div>
        <h4>Align</h4>

        <div>
          <div>
            {renderLabel(orientation === 'vertical')}

            <DropDown
              options={JUSTIFY_VALUES}
              defaultValue={properties.justifyContent}
              value={properties.justifyContent}
              onChange={(value) =>
                onChange('justifyContent', value as Flex['justifyContent'])
              }
            />
          </div>

          <div>
            {renderLabel(orientation === 'horizontal')}

            <DropDown
              options={ALIGN_VALUES}
              defaultValue={properties.alignItems}
              value={properties.alignItems}
              onChange={(value) =>
                onChange('alignItems', value as Flex['alignItems'])
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(FlexProperties);
