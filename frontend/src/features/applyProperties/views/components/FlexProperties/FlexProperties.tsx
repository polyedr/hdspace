import React, { memo, useCallback } from 'react';
import cn from 'classnames';
import ControlTitle from '../ControlTitle/ControlTitle';
import { JUSTIFY_VALUES, ALIGN_VALUES } from './constants';
import Button from '../../../../../components/UI/Button';
import { DropDown } from '../../../../../components/UI/DropDown';
import { Flex } from '../../../../../redux/project/types';

const styles = require('./FlexProperties.scss');

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
      <span className={styles.axis__label}>
        {reversed ? 'Y-' : 'X-'}
        {' axis'}
      </span>
    ),
    [],
  );

  return (
    <>
      <section className="propsElementsBlock">
        <header className={styles.header}>
          <ControlTitle content="Direction" />
        </header>
        <div className={styles.content}>
          <Button
            styleType="primary"
            className={cn(
              'propsPanelBtn',
              styles.orientationBtn,
              orientation === 'horizontal' && 'propsPanelBtn_active',
            )}
            onClick={() => onChange('flexDirection', 'row')}
          >
            Horizontal
          </Button>
          <Button
            styleType="primary"
            className={cn(
              'propsPanelBtn',
              styles.orientationBtn,
              styles.orientationBtn_vertical,
              orientation === 'vertical' && 'propsPanelBtn_active',
            )}
            onClick={() => onChange('flexDirection', 'column')}
          >
            Vertical
          </Button>
        </div>
      </section>
      <section className="propsElementsBlock">
        <header className={styles.header}>
          <ControlTitle content="Align" />
        </header>
        <div
          className={cn(
            styles.axises,
            orientation === 'vertical' && styles.axises_reversed,
          )}
        >
          <div className={styles.axises__axis}>
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
          <div className={styles.axises__axis}>
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
      </section>
    </>
  );
};

export default memo(FlexProperties);
