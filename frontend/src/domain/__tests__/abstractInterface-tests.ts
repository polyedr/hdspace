import * as ai from '../abstractInterface';
import * as m from './mocks';

describe('getItemParentID', () => {
  test('should return container parent id', () => {
    const payload = {
      containers: { 1: m.makeContainerMock({ parent_id: 2 }) },
      elements: {},
      itemID: '1s',
    };

    expect(ai.getItemParentID(payload.containers, payload.elements, payload.itemID)).toBe(2);
  });

  test('should return element parent id', () => {
    const payload = {
      containers: { 1: m.makeContainerMock({ parent_id: 2 }) },
      elements: { 1: m.makeElementMock({ parameters: { parent_id: 1 } }) },
      itemID: '1e',
    };
  
    expect(ai.getItemParentID(payload.containers, payload.elements, payload.itemID)).toBe(1);
  });
});

describe('moving child to new parent', () => {
  describe('removeChildFromParent', () => {
    test('should remove container from container', () => {
      const payload = {
        containers: {
          1: m.makeContainerMock({ parent_id: -1, parameters: { children: ['2s'] } }),
          2: m.makeContainerMock({ parent_id: 1, parameters: { children: ['3s', '4s'] } }),
          3: m.makeContainerMock({ parent_id: 2 }),
          4: m.makeContainerMock({ parent_id: 2 }),
        },
        parentID: '2s',
        itemID: '3s',
      };

      const newContainers = ai.removeChildFromParent(payload.containers, payload.parentID, payload.itemID);
      const parentContainer = newContainers[2];

      expect(parentContainer.parameters.children).not.toContain('3s');
    });

    test('should remove element from container', () => {
      const payload = {
        containers: {
          1: m.makeContainerMock({ parent_id: -1, parameters: { children: ['2s'] } }),
          2: m.makeContainerMock({ parent_id: 1, elements: [1], parameters: { children: ['1e', '3s'] } }),
          3: m.makeContainerMock({ parent_id: 2 }),
        },
        parentID: '2s',
        itemID: '1e',
      };
  
      const newContainers = ai.removeChildFromParent(payload.containers, payload.parentID, payload.itemID);
      const parentContainer = newContainers[2];

      expect(parentContainer.elements).not.toContain(1);
      expect(parentContainer.parameters.children).not.toContain('1e');
    });
  });

  describe('addChildToParent', () => {
    test('should add container to container', () => {
      const payload = {
        containers: {
          1: m.makeContainerMock({ parent_id: -1, parameters: { children: ['2s'] } }),
          2: m.makeContainerMock({ parent_id: 1, parameters: { children: ['3s', '4s'] } }),
          3: m.makeContainerMock({ parent_id: 2 }),
          4: m.makeContainerMock({ parent_id: 2 }),
        },
        elements: {},
        parentID: '1s',
        itemID: '3s',
      };

      const newRels = ai.addChildToParent(payload.containers, payload.elements, payload.parentID, payload.itemID);
      const parentContainer = newRels.scenarios[1];
      const childContainer = newRels.scenarios[3];
  
      expect(parentContainer.parameters.children).toContain('3s');
      expect(childContainer.parent_id).toBe(1);
    });
  
    test('should add element to container', () => {
      const payload = {
        containers: {
          1: m.makeContainerMock({ parent_id: -1, parameters: { children: ['2s'] } }),
          2: m.makeContainerMock({ parent_id: 1, parameters: { children: ['3s', '4s'] } }),
          3: m.makeContainerMock({ parent_id: 2 }),
          4: m.makeContainerMock({ parent_id: 2 }),
        },
        elements: { 1: m.makeElementMock({ parameters: { parent_id: 1 }, scenario: 1 }) },
        parentID: '3s',
        itemID: '1e',
      };

      const newRels = ai.addChildToParent(payload.containers, payload.elements, payload.parentID, payload.itemID);
      const parentContainer = newRels.scenarios[3];
      const childElement = newRels.elements[1];
  
      expect(parentContainer.parameters.children).toContain('1e');
      expect(parentContainer.elements).toContain(1);

      expect(childElement.scenario).toBe(3);
      expect(childElement.parameters.parent_id).toBe(3);
    });
  });
});

describe('wrapIntoContainer', () => {
  test('should wrap container with container', () => {
    const payload = {
      containers: {
        1: m.makeContainerMock({ parent_id: -1, parameters: { children: ['2s'] } }),
        2: m.makeContainerMock({ parent_id: 1 }),
      },
      elements: {},
      containerWrapper: m.makeContainerMock({ id: 111 }),
      itemToWrapID: '2s',
    };

    const newRels = ai.wrapIntoContainer(
      payload.containers,
      payload.elements,
      payload.containerWrapper,
      payload.itemToWrapID,
    );

    const parentContainer = newRels.scenarios[1];
    const containerWrapper = newRels.scenarios[111];
    const childContainer = newRels.scenarios[2];

    expect(parentContainer.parameters.children).not.toContain('2s');
    expect(parentContainer.parameters.children).toContain('111s');

    expect(containerWrapper.parent_id).toBe(1);
    expect(containerWrapper.parameters.children).toContain('2s');

    expect(childContainer.parent_id).toBe(111);
  });

  test('should wrap element with container', () => {
    const payload = {
      containers: {
        1: m.makeContainerMock({ parent_id: -1, parameters: { children: ['2s'] } }),
        2: m.makeContainerMock({ parent_id: 1, parameters: { children: ['3s', '4s'] } }),
        3: m.makeContainerMock({ parent_id: 2 }),
        4: m.makeContainerMock({ parent_id: 2, elements: [1], parameters: { children: ['1e'] } }),
      },
      elements: { 1: m.makeElementMock({ parameters: { parent_id: 4 }, scenario: 4 }) },
      containerWrapper: m.makeContainerMock({ id: 111 }),
      itemToWrapID: '1e',
    };

    const newRels = ai.wrapIntoContainer(
      payload.containers,
      payload.elements,
      payload.containerWrapper,
      payload.itemToWrapID,
    );

    const parentContainer = newRels.scenarios[4];
    const containerWrapper = newRels.scenarios[111];
    const childElement = newRels.elements[1];

    expect(parentContainer.parameters.children).not.toContain('1e');
    expect(parentContainer.elements).not.toContain(1);
    expect(parentContainer.parameters.children).toContain('111s');

    expect(containerWrapper.parent_id).toBe(4);
    expect(containerWrapper.parameters.children).toContain('1e');
    expect(containerWrapper.elements).toContain(1);

    expect(childElement.parameters.parent_id).toBe(111);
    expect(childElement.scenario).toBe(111);
  });
});

describe('removeItem', () => {
  test('should remove container', () => {
    const payload = {
      containers: {
        1: m.makeContainerMock({ id: 1, parent_id: -1, parameters: { children: ['2s'] } }),
        2: m.makeContainerMock({ id: 2, parent_id: 1, elements: [2], parameters: { children: ['3s', '4s', '2e'] } }),
        3: m.makeContainerMock({ id: 3, parent_id: 2 }),
        4: m.makeContainerMock({ id: 4, parent_id: 2, elements: [1], parameters: { children: ['1e'] } }),
      },
      elements: {
        1: m.makeElementMock({ id: 1, parameters: { parent_id: 4 }, scenario: 4 }),
        2: m.makeElementMock({ id: 2, parameters: { parent_id: 2 }, scenario: 2 })
      },
      itemToRemove: '2s',
    };

    const newRels = ai.removeItem(
      payload.containers,
      payload.elements,
      ai.constructAIMap(payload.containers, payload.elements),
      payload.itemToRemove,
    );
  
    const parentContainer = newRels.scenarios[1];
    const { removedItems } = newRels;
  
    expect(parentContainer.parameters.children).not.toContain('2s');
    expect(parentContainer.elements).not.toContain(2);
    expect(removedItems.s).toEqual([2, 3, 4]);
    expect(removedItems.e).toEqual([1, 2]);
  
    [2,3,4].forEach(x => expect(newRels.scenarios).not.toHaveProperty(`${x}`));
    [1,2].forEach(x => expect(newRels.elements).not.toHaveProperty(`${x}`));
  });

  test('should remove element', () => {
    const payload = {
      containers: {
        1: m.makeContainerMock({ id: 1, parent_id: -1, parameters: { children: ['2s'] } }),
        2: m.makeContainerMock({ id: 2, parent_id: 1, elements: [2], parameters: { children: ['3s', '2e', '4s'] } }),
        3: m.makeContainerMock({ id: 3, parent_id: 2 }),
        4: m.makeContainerMock({ id: 4, parent_id: 2 }),
      },
      elements: {
        2: m.makeElementMock({ id: 2, parameters: { parent_id: 2 }, scenario: 2 })
      },
      itemToRemove: '2e',
    };

    const newRels = ai.removeItem(
      payload.containers,
      payload.elements,
      ai.constructAIMap(payload.containers, payload.elements),
      payload.itemToRemove,
    );
  
    const parentContainer = newRels.scenarios[2];
    const { removedItems } = newRels;
  
    expect(parentContainer.parameters.children).not.toContain('2e');
    expect(parentContainer.elements).not.toContain(2);
    expect(removedItems.s).toEqual([]);
    expect(removedItems.e).toEqual([2]);
    expect(newRels.elements).not.toHaveProperty(`${2}`);
  });
});

test('constructAIMap: should construct abstract interface map', () => {
  const payload = {
    containers: {
      1: m.makeContainerMock({ id: 1, parent_id: -1, parameters: { children: ['2s'] } }),
      2: m.makeContainerMock({ id: 2, parent_id: 1, elements: [2], parameters: { children: ['3s', '4s', '2e'] } }),
      3: m.makeContainerMock({ id: 3, parent_id: 2 }),
      4: m.makeContainerMock({ id: 4, parent_id: 2, elements: [1], parameters: { children: ['1e'] } }),
    },
    elements: {
      1: m.makeElementMock({ id: 1, parameters: { parent_id: 4 }, scenario: 4 }),
      2: m.makeElementMock({ id: 2, parameters: { parent_id: 2 }, scenario: 2 })
    },
  };

  expect(ai.constructAIMap(payload.containers, payload.elements)).toEqual({
    root: {
      id: 1,
      type: 'root',
      children: ['2s'],
    },
    '2s': {
      id: 2,
      type: 'container',
      children: ['3s', '4s', '2e'],
    },
    '3s': {
      id: 3,
      type: 'container',
      children: [],
    },
    '4s': {
      id: 4,
      type: 'container',
      children: ['1e'],
    },
    '2e': {
      id: 2,
      type: 'textinput',
      children: [],
    },
    '1e': {
      id: 1,
      type: 'textinput',
      children: [],
    },
  });
});
