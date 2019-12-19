import * as R from 'ramda';

import {
  ILibraryElements,
  IListSortable,
  ILSItem,
  IScenarioItem,
  IScenarioElements,
  IScenarioElement,
  IScenarios,
  ILibraryElement,
} from '$redux/project/types';
import { getBuoyancy } from '$utils/NumberHelper';
import { scenarioItemToLS, elementToLS } from '$utils/parseScenario';
import { DEFAULT_INDENTS } from '$constants/defaultParams';
import { IChooseElement } from '$components/ModalAddElements/MainBlock';

import { greaterBuoyancyFirst } from './model';

type IListElement = ILibraryElement & {
  id?: number;
  scenario?: number | null;
}

const getGroup = () => {
  const group = {
    scenario: 0,
    html_type: '',
    tags: '',
    block: 0,
    count: -1,
  };

  return (scenario: number, html_type: string, tags: string, block: number) => {
    if (group.scenario !== scenario
      || group.html_type !== html_type
      || group.tags !== tags
      || group.block !== block
    ) {
      group.scenario = scenario;
      group.html_type = html_type;
      group.tags = tags;
      group.block = block;
      group.count += 1;
    }
    return group.count;
  };
};

const getListElByType = (
  parentScenarioID: number,
  elementsToFormScenario: IChooseElement[],
  libraryElements: ILibraryElements,
  scenarioEl: IScenarioElements,
): IScenarioElement[] => {
  const existingElements = Object.values(scenarioEl);
  type NewListEl = ILibraryElement & { image: string | null };
  const newListEl = elementsToFormScenario.reduce((acc: NewListEl[], element) => {
    const libraryElement = libraryElements[element.type];

    const defaultEl: NewListEl = {
      ...libraryElement,
      // buoyancy: 0, // to add elements in the end of container
      image: element?.img?.file ?? null,
    };

    if (libraryElement.struct_type === 'map') {
      const newParameters = {
        ...libraryElement.parameters,
        map_props: {
          center: {
            lat: 50.00008,
            lng: 40.00008,
          },
          zoom: 10,
          markerText: 'A',
        },
      };

      defaultEl.parameters = newParameters;
    }

    return [...acc, defaultEl];
  }, []);

  if (!parentScenarioID) {
    // when parentScenarioID is not defined, is undefined and has NaN as value here
    const currGroup = getGroup();
    return newListEl.sort(greaterBuoyancyFirst)
      .map((el): IScenarioElement => {
        const htmlType = el.struct_type || '';
        const tags = el.parameters.tags || '';
        const parent_id = currGroup(parentScenarioID, htmlType, tags, parentScenarioID);

        return {
          ...el,
          scenario: -1000, // can't be null, according to invariant, but when we create items from elements up to blocks order, we don't know scenario while creating items; will be set to null before request to backend
          buoyancy: 0, // research what are these four props?
          dynamic_buoyancy: 0,
          name: 'Scenario element',
          id: -1000, // mock value, will be omitted before request to backend
          image: R.path(['img', 'file'], el) || null, // always null
          parameters: {
            ...el.parameters,
            parent_id,
          },
          styles: {
            ...el.styles,
            ...DEFAULT_INDENTS,
          },
        };
      });
  }

  const setParentScenarioID = <T>(x: T) => ({ ...x, scenario: parentScenarioID });
  // if parentScenarioID is specified
  const newListElWithScenarioID: (NewListEl & { scenario: number })[] = newListEl.map(setParentScenarioID);
  const allListEl = (newListElWithScenarioID as any).concat(existingElements).map((x: IScenarioElement) => {
    const scenario = x.scenario || parentScenarioID;

    return { ...x, scenario };
  }).sort((a: IScenarioElement, b: IScenarioElement) => a.scenario - b.scenario) as IScenarioElement[];

  const onEqualsB = <T extends { scenario: number }>(el1: T, el2: T) => el1.scenario === el2.scenario;
  const onEqualsG = <T extends { group_id?: string }>(el1: T, el2: T) => el1.group_id === el2.group_id;

  const firstGroupWith = R.groupWith(onEqualsB, allListEl).reduce((listB, groupB) => {
    const currGroup = getGroup();
    const listBlock = groupB.sort(greaterBuoyancyFirst).map((el): IScenarioElement => {
      const tags = el.parameters.tags ?? '';
      const html_type = el.struct_type || '';
      const parent_id = currGroup(el.scenario, html_type, tags, el.scenario);

      return {
        ...el,
        parameters: {
          ...R.prop('parameters', el),
          parent_id: R.path(['parameters', 'parent_id'], el) || parent_id,
        },
      };
    });

    const listGroup = R.groupWith(onEqualsG as any, listBlock).reduce((listG: any, groupG) => {
      const existingEl = groupG.find(el => !!R.prop('id', el));

      if (existingEl) {
        const parent_id = R.path(['parameters', 'parent_id'], existingEl);

        const updateGroup = groupG.map(el => ({
          ...R.omit(['group_id'], el),
          parameters: {
            ...el.parameters,
            parent_id,
          },
        }));

        return listG.concat(updateGroup);
      }

      return listG.concat(groupG);
    }, []);

    return listB.concat(listGroup);
  }, []);
  return firstGroupWith.reduce((listNewEl: IScenarioElement[], el) => {
    if (!el.id) {
      return [
        ...listNewEl,
        R.assoc('scenario', parentScenarioID, el),
      ];
    }

    return listNewEl;
  }, []);
};

export const formingListEl = (
  parentScenarioID: number,
  elementsToFormScenario: IChooseElement[],
  libraryElements: ILibraryElements,
  scenarioEls: IScenarioElements,
): { newEl: IScenarioElement[], existEl: IScenarioElement[] } => {

  const existingElements = Object.values(scenarioEls);
  const existingElementsIDs = existingElements.map(el => el.id);
  const newListElement = getListElByType(parentScenarioID, elementsToFormScenario, libraryElements, scenarioEls);

  return existingElements
    .concat(newListElement)
    .reduce(
      (acc: ReturnType<typeof formingListEl>, el) => {
      if (existingElementsIDs.indexOf(el.id) !== -1) {
        return {
          ...acc,
          existEl: [...acc.existEl, el],
        };
      }

      return {
        ...acc,
        newEl: [...acc.newEl, el],
      };
    }, { newEl: [], existEl: [] });
};

export const formingListGroup = (
  screenID: number,
  elements: IScenarioElement[],
  scenarios: IScenarios,
): { newGroups: IScenarioItem[], existGroups: IScenarioItem[] } => {
  const existingGroupsIDs = Object.keys(scenarios).reduce((acc: number[], key) => (
    scenarios[key].struct_type === 'group' ? [...acc, Number(key)] : acc
  ), []);

  const elementsGroupsIDs = R.uniq(elements.map(el => el.parameters.parent_id));
  const allGroups = elementsGroupsIDs.map((group_id): IScenarioItem => {
    const elementsOfCurrentGroup = elements.filter(el => el.parameters.parent_id === group_id);
    const buoyancy = getBuoyancy(elementsOfCurrentGroup);

    if (existingGroupsIDs.indexOf(group_id) !== -1) {
      return scenarios[group_id];
    }

    return {
      // id: R.path(['parameters', 'parent_id'], existingEl) as number || group_id,
      id: group_id,
      name: 'group',
      struct_type: 'group',
      screen: screenID,
      parent_id: elementsOfCurrentGroup[0].scenario || 0,
      buoyancy,
      direction: 'vertical',
      elements: [],
      parameters: {
        children: [],
      },
      styles: {
        ...DEFAULT_INDENTS,
        'display': 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        'justify-content': 'center',
        // 'width': '100%',
        // 'width': 'auto',
      },
    };
  });

  return allGroups.reduce((acc: ReturnType<typeof formingListGroup>, group) => {
    const children = elements.reduce((acc: string[], el) => (
      el.parameters.parent_id === group.id ? acc.concat(`${el.id}e`) : acc
    ), []);

    if (existingGroupsIDs.indexOf(group.id) !== -1) {
      return {
        ...acc,
        existGroups: [
          ...acc.existGroups,
          {
            ...group,
            parameters: {
              ...group.parameters,
              children,
            },
          },
        ],
      };
    }

    return {
      ...acc,
      newGroups: [
        ...acc.newGroups,
        {
          ...group,
          parameters: {
            ...group.parameters,
            children,
          },
        },
      ],
    };
  }, { newGroups: [], existGroups: [] });
};

export const formingListBlock = (
  screenName: string,
  screenID: number,
  actualScenariosElements: IScenarioElement[],
  actualGroups: IScenarioItem[],
  scenarios: IScenarios,
): { newBlocks: IScenarioItem[], existBlocks: IScenarioItem[] } => {
  const onEquals = <T extends { parent_id: number }>(group1: T, group2: T) => group1.parent_id === group2.parent_id;

  return R.groupWith(onEquals, actualGroups).reduce((acc: ReturnType<typeof formingListBlock>, group) => {
    const { parent_id = 0 } = group[0];
    const currGroupElements = actualScenariosElements.filter(
      ({ parameters: { parent_id: groupID } }) => parent_id === groupID,
    );
    const children = group.map(({ id }) => `${id}s`);
    const elements = group.reduce((acc: number[], g) => (
      acc.concat(g.parameters.children.map(id => parseInt(id, 10)))
    ), []);
    const buoyancy = getBuoyancy(currGroupElements);
    const currBlock = scenarios[parent_id];

    if (currBlock) {
      return {
        ...acc,
        existBlocks: [
          ...acc.existBlocks,
          {
            ...currBlock,
            buoyancy,
            elements,
            parameters: {
              ...currBlock.parameters,
              children,
            },
          },
        ] as IScenarioItem[],
      };
    }

    return {
      ...acc,
      newBlocks: [
        ...acc.newBlocks,
        {
          name: screenName,
          screen: screenID,
          parent_id: 0,
          struct_type: 'block',
          direction: 'vertical',
          buoyancy,
          elements,
          parameters: {
            children,
          },
          styles: {
            ...DEFAULT_INDENTS,
            'display': 'flex',
            'flex-direction': 'column',
            'align-items': 'center',
            'justify-content': 'center',
            width: '100%'
          },
        },
      ] as IScenarioItem[],
    };
  }, { newBlocks: [], existBlocks: [] });
};

export const completeLS = (
  scenarios: IScenarios,
  scenariosElements: IScenarioElements,
  root: ILSItem,
): IListSortable => {
  const childrenToLS = (rawChildrenIDs: string[]): IListSortable => rawChildrenIDs.reduce((acc: IListSortable, rawChildID) => {
    const isScenario = rawChildID.slice(-1) === 's';
    const childID = parseInt(rawChildID);
    if (isScenario) {
      const scenario = scenarios[childID];
      return { ...acc, [rawChildID]: scenarioItemToLS(scenario), ...childrenToLS(scenario.parameters.children) };
    }
    const element = scenariosElements[childID];
    return { ...acc, [rawChildID]: elementToLS(element) };
  }, { root });

  const listSortable = childrenToLS(root.children);
  return listSortable;
};

/* export const init = (
  screenElements: IScenarioElements,
  libraryElements: ILibraryElements,
  scenarios: IScenarios = {},
) => {
  const currGroup = getGroup();
  const arr_352 = Object.keys(screenElements)
    .map(key => screenElements[key])
    .sort((a, b) => b.buoyancy - a.buoyancy)
    .map((el: IScenarioElement) => {
      const {
        id,
        scenario = 1,
        func_type,
        styles,
        buoyancy = 0,
        dynamic_buoyancy = 0,
        parameters,
      } = el;
      const html_type = R.path([func_type, 'struct_type'], libraryElements) || '';
      const tags = R.prop('tags', parameters) || '';

      return {
        id,
        scenario,
        html_type,
        object: func_type,
        buoyancy,
        source_img: R.prop('source', parameters),
        dynamic_buoyancy,
        tags,
        block: scenario,
        group: currGroup(scenario, html_type, tags, scenario),
        placeholder: R.prop('placeholder', parameters),
        dynamic_placeholder: R.prop('dynamic_placeholder', parameters) || '',
        map_props: R.prop('map_props', parameters) || DEFAULT_MAP_PROPS,
        content: R.prop('content', parameters) || '',
        ...completeStyles({ ...styles, ...parameters.location }),
      };
    });

  const listGroup = arr_352.sort((a, b) => a.group - b.group).reduce((obj, el) => (
    {
      ...obj,
      [el.group]: el.group,
    }
  ), {});

  const sort_group_sum = Object.keys(listGroup).reduce((arr, group) => {
    const listEl = arr_352.filter(el => el.group === strToNumber(group));
    const maxWidthG: number = Math.max.apply(null, (listEl.map(e => e.width)));
    const sumWidth: number = listEl.reduce((a, b) => a + Number(b.width || 0), 0);

    const result = {
      group: strToNumber(group),
      block: listEl[0].block,
      scenario: listEl[0].scenario,
      buoyancy: getBuoyancy(listEl),
      maxWidthG,
      sumWidth,
    };

    return R.append(result, arr);
  }, []);

  const listBlock = arr_352.sort((a, b) => a.block - b.block).reduce((obj, el) => (
    {
      ...obj,
      [el.block]: el.block,
    }
  ), {});

  const ui_struct: ISortableItem[] = [];

  const sort_block = Object.keys(listBlock).reduce((arr, block) => {
    const listEl = arr_352.filter(el => el.block === strToNumber(block));
    const result = {
      group: listEl[0].group,
      block: listEl[0].block,
      scenario: listEl[0].scenario,
      buoyancy: getBuoyancy(listEl),
    };

    return R.append(result, arr);
  }, []).sort((a, b) => b.buoyancy - a.buoyancy);

  sort_block.forEach((item) => {
    const background_block: IScreenBackground = R.path([item.scenario, 'styles', 'background'], scenarios) || DEFAULT_BACKGROUND;
    const border_block: IScreenBorders = R.path([item.scenario, 'styles', 'border'], scenarios);
    const typography: IScreenTypography = R.path([item.scenario, 'styles', 'typography'], scenarios);
    const indents_block: IScreenIndents = R.path([item.scenario, 'styles', 'indents'], scenarios);
    const new_block = {
      id: item.block,
      type: 'block',
      scenarioId: item.scenario,
      children: [],
      props: {
        background: background_block,
        border: border_block,
        typography,
        indents: indents_block,
      },
    };
    const df_filt_block = sort_group_sum
      .filter(el => el.block === item.block)
      .sort((a, b) => b.buoyancy - a.buoyancy);

    df_filt_block.forEach((item1) => {
      const df_group = arr_352
        .filter(el => el.group === item1.group)
        .sort((a, b) => b.dynamic_buoyancy - a.dynamic_buoyancy);
      const indents_group: IScreenIndents = R.path(
        [item.scenario, 'styles', 'groupStyles', item1.group, 'indents'],
        scenarios,
      ) || DEFAULT_INDENTS;
      const background_group: IScreenBackground = R.path(
        [item.scenario, 'styles', 'groupStyles', item1.group, 'background'],
        scenarios,
      ) || DEFAULT_BACKGROUND;
      const border_group: IScreenBorders = R.path(
        ['styles', 'groupStyles', item1.group, 'border'],
        scenarios[item.scenario],
      ) || DEFAULT_BORDER;
      const typography_group: IScreenTypography = R.path(
        [item.scenario, 'styles', 'groupStyles', item1.group, 'typography'],
        scenarios,
      );
      const orientation_group: string = R.path(
        [item.scenario, 'parameters', 'orientation'],
        scenarios,
      ) || '';
      const new_group = {
        id: item1.group,
        type: 'group',
        children: [],
        orientation: orientation_group,
        scenarioId: item1.scenario,
        props: {
          indents: indents_group,
          background: background_group,
          border: border_group,
          typography: typography_group,
        },
      };

      df_group.forEach((item2) => {
        const new_elem = {
          id: item2.id,
          type: item2.html_type,
          children: [],
          scenarioId: item2.scenario,
          props: {
            placeholder: R.prop('placeholder', item2),
            dynamic_placeholder: R.prop('dynamic_placeholder', item2),
            map_props: R.prop('map_props', item2),
            content: R.prop('content', item2),
            width: item2.width,
            height: item2.height,
            indents: item2.indents,
            border: item2.border,
            background: item2.background,
            typography: item2.typography,
            buoyancy: item2.buoyancy,
            dynamic_buoyancy: item2.dynamic_buoyancy,
            html_type: `${item2.object}`,
            source_img: item2.source_img,
          },
        };

        const { maxWidthG, sumWidth } = sort_group_sum.find(el => el.group === item1.group);
        if (new_group.orientation === '') {
          const isHorizontal: boolean = (item2.tags.indexOf('horizontal') !== -1) && (sumWidth <= maxWidthG);

          const isFirst: boolean = new_group.children.length === 0;

          if (isFirst && isHorizontal) {
            new_group.orientation = 'horizontal';
          } else if (isFirst && !isHorizontal) {
            new_group.orientation = 'vertical';
          }
        }

        new_group.children.push(new_elem);
      });

      new_block.children.push(new_group);
    });

    ui_struct.push(new_block);
  });

  return ui_struct;
}; */
