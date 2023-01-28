import sagaHelper from 'redux-saga-testing';
import { select, put } from 'redux-saga/effects';
import * as Actions from '@Redux/project/actions';
import { beforeSagaTest, mockStateElement } from '@Utils/__tests__/test-utils';
import { setEnabledPseudoClass } from '@Redux/project/sagas/element';
import {
  selectActiveElementId,
  selectElementById,
  selectEnabledPseudoClass,
} from '@Redux/project/selectors/element';

describe('setEnabledPseudoClass', () => {
  beforeAll(beforeSagaTest);

  describe('when pseudo class is set without specified element', () => {
    const action = Actions.setEnabledPseudoClass('hover');
    const it = sagaHelper(setEnabledPseudoClass(action));

    it('should select previous class', (result) => {
      expect(result).toEqual(select(selectEnabledPseudoClass));
      return 'focus';
    });

    it('should select active element id', (result) => {
      expect(result).toEqual(select(selectActiveElementId));
      return mockStateElement.id;
    });

    it('should select element for pseudo selector class', (result) => {
      expect(result).toEqual(select(selectElementById, '2'));
      return mockStateElement;
    });

    it('should update state element', (result) => {
      expect(result).toEqual(
        put(
          Actions.updateStateElement(mockStateElement.id, {
            styles: {
              ...mockStateElement.styles,
              pseudoClassViewStyles: {},
            },
          }),
        ),
      );
    });

    it('should set enabled pseudo class', (result) => {
      expect(result).toEqual(put(Actions.setStatePseudoClass('hover')));
    });
  });

  describe('when pseudo class is set with specified element', () => {
    const action = Actions.setEnabledPseudoClass('active', mockStateElement.id);
    const it = sagaHelper(setEnabledPseudoClass(action));

    it('should select previous class', (result) => {
      expect(result).toEqual(select(selectEnabledPseudoClass));
      return 'focus';
    });

    it('should select active element id', (result) => {
      expect(result).toEqual(select(selectActiveElementId));
      return 'active element id';
    });

    it('should select element for pseudo selector class', (result) => {
      expect(result).toEqual(select(selectElementById, mockStateElement.id));
      return mockStateElement;
    });

    it('should update state element', (result) => {
      expect(result).toEqual(
        put(
          Actions.updateStateElement(mockStateElement.id, {
            styles: {
              ...mockStateElement.styles,
              pseudoClassViewStyles: {},
            },
          }),
        ),
      );
    });
  });

  describe('when previous pseudo class is the same as previous one', () => {
    const action = Actions.setEnabledPseudoClass('active', mockStateElement.id);
    const it = sagaHelper(setEnabledPseudoClass(action));

    it('should select previous class', (result) => {
      expect(result).toEqual(select(selectEnabledPseudoClass));
      return 'active';
    });

    it('should NOT call further actions', (result) => {
      expect(result).toBeUndefined();
    });
  });
});
