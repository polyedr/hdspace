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
} from '$redux/project/reducer';
import { getBuoyancy } from '$utils/NumberHelper';
import { scenarioToLS } from '$utils/parseScenario';
import { DEFAULT_INDENTS } from '$constants/defaultParams';
import { IChooseElement } from '$components/ModalAddElements/MainBlock';


type TFormListEl = (
  screen_id: number,
  scenario_id: number,
  name: string,
  listElementType: IChooseElement[],
  libraryElements: ILibraryElements,
  scenarioEl: IScenarioElements,
) => { newEl: IScenarioElement[], existEl: IScenarioElement[] };

type TFormListGroup = (
  screenId: number,
  listElements: IScenarioElement[],
  scenarios: IScenarios,
) => { newGroups: IScenarioItem[], existGroups: IScenarioItem[] };

type TFormListBlock = (
  name: string,
  screen_id: number,
  listElement: IScenarioElement[],
  listGroup: IScenarioItem[],
  scenarios: IScenarios,
) => { newBlocks: IScenarioItem[], existBlocks: IScenarioItem[] };

type TCompleteLS = (
  scenarios: IScenarios,
  scenarioEl: IScenarioElements,
  parent: ILSItem,
) => IListSortable;

type IListElement = ILibraryElement & {
  id?: number,
  scenario?: number,
}

type TGetListElByType = (
  scenario_id: number,
  listElementType: IChooseElement[],
  libraryElements: ILibraryElements,
  scenarioEl: IScenarioElements,
) => IListElement[];

const getGroup = () => {
  const group = {
    scenario: 0,
    html_type: '',
    tags: '',
    block: 0,
    count: -1,
  };

  return (scenario, html_type, tags, block) => {
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

const getListElByType: TGetListElByType = (
  scenario_id, listElementType, libraryElements, scenarioEl,
) => {
  const existingListEl = Object.keys(scenarioEl).map(key => scenarioEl[key]);
  const newListEl = listElementType.reduce((arr, el) => {
    const defaultEl = {
      ...libraryElements[el.type],
      image: R.path(['img', 'file'], el) || null,
    };

    if (!defaultEl) return arr;

    if (libraryElements[el.type].struct_type === 'map') {
      const newParameters = {
        ...libraryElements[el.type].parameters,
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

    return [...arr, defaultEl];
  }, []);

  if (!scenario_id) {
    const currGroup = getGroup();
    return newListEl.sort((a, b) => b.buoyancy - a.buoyancy)
      .map((el) => {
        const html_type = el.struct_type || '';
        const tags = R.path(['parameters', 'tags'], el) || '';
        const parent_id = currGroup(scenario_id, html_type, tags, scenario_id);

        return {
          ...el,
          scenario: null,
          image: R.path(['img', 'file'], el) || null,
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

  const allListEl = newListEl.concat(existingListEl).map((el) => {
    const scenario = el.scenario || scenario_id;

    return { ...el, scenario };
  }).sort((a, b) => a.scenario - b.scenario);

  const onEqualsB = (el1, el2) => el1.scenario === el2.scenario;
  const onEqualsG = (el1, el2) => el1.group_id === el2.group_id;

  return R.groupWith(onEqualsB, allListEl).reduce((listB, groupB) => {
    const currGroup = getGroup();
    const listBlock = groupB.sort((a, b) => b.buoyancy - a.buoyancy).map((el) => {
      const tags = R.path(['parameters', 'tags'], el) || '';
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

    const listGroup = R.groupWith(onEqualsG, listBlock).reduce((listG, groupG) => {
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
  }, []).reduce((listNewEl, el) => {
    if (!el.id) {
      return [
        ...listNewEl,
        R.assoc('scenario', scenario_id, el),
      ];
    }

    return listNewEl;
  }, []);
};

export const formingListEl: TFormListEl = (
  screen_id, scenario_id, name, listElementType, libraryElements, scenarioEl,
) => {
  const existingEl = Object.keys(scenarioEl).reduce((list, key) => [...list, scenarioEl[key]], []);
  const existingElKey = existingEl.map(el => el.id);
  const newListElement = getListElByType(scenario_id, listElementType, libraryElements, scenarioEl);

  return existingEl.concat(newListElement).reduce((result, el) => {
    if (existingElKey.indexOf(el.id) !== -1) {
      return {
        ...result,
        existEl: [...result.existEl, el],
      };
    }

    return {
      ...result,
      newEl: [...result.newEl, el],
    };
  }, { newEl: [], existEl: [] });
};

export const formingListGroup: TFormListGroup = (screenId, listElement, scenarios) => {
  const existingGroupKeys: number[] = Object.keys(scenarios).reduce((list, key) => (
    (scenarios[key].struct_type === 'group' && [...list, Number(key)]) || list
  ), []);

  const listGroupId: number[] = listElement.map(el => Number(R.path(['parameters', 'parent_id'], el)))
    .filter((group_id, index, arr) => arr.indexOf(group_id) === index);
  const newListGroup = listGroupId.map((group_id) => {
    const listEl = listElement.filter(el => R.path(['parameters', 'parent_id'], el) === group_id);
    const buoyancy = getBuoyancy(listEl);

    if (existingGroupKeys.indexOf(group_id) !== -1) {
      return scenarios[group_id];
    }

    return {
      // id: R.path(['parameters', 'parent_id'], existingEl) as number || group_id,
      id: group_id,
      name: 'group',
      struct_type: 'group',
      screen: screenId,
      parent_id: listEl[0].scenario || 0,
      buoyancy,
      direction: 'vertical',
      elements: [],
      parameters: {},
      styles: {
        ...DEFAULT_INDENTS,
        'flex-direction': 'column',
        // 'width': 'auto',
      },
    };
  });

  return newListGroup.reduce((result, group) => {
    const children = listElement.reduce((list, el) => {
      if (el.parameters.parent_id === group.id) {
        return [...list, `${el.id}e`];
      }

      return list;
    }, []);

    if (existingGroupKeys.indexOf(group.id) !== -1) {
      return {
        ...result,
        existGroups: [
          ...result.existGroups,
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
      ...result,
      newGroups: [
        ...result.newGroups,
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

export const formingListBlock: TFormListBlock = (
  name, screen_id, listElement, listGroup, scenarios,
) => {
  const onEquals = (group1, group2) => group1.parent_id === group2.parent_id;

  return R.groupWith(onEquals, listGroup).reduce((result, itemsGroup) => {
    const { parent_id = 0 } = itemsGroup[0];
    const listGroupEl = listElement.filter(({ parameters: { parent_id: groupId } }) => (
      parent_id === groupId
    ));
    const children = itemsGroup.map(({ id }) => `${id}s`);
    const elements = itemsGroup.reduce((list, g) => (
      list.concat(g.parameters.children.map(id => parseInt(id, 10)))
    ), []);
    const buoyancy = getBuoyancy(listGroupEl);
    const currBlock = scenarios[parent_id];

    if (currBlock) {
      return {
        ...result,
        existBlocks: [
          ...result.existBlocks,
          {
            ...currBlock,
            buoyancy,
            elements,
            parameters: {
              ...currBlock.parameters,
              children,
            },
          },
        ],
      };
    }

    return {
      ...result,
      newBlocks: [
        ...result.newBlocks,
        {
          name,
          screen: screen_id,
          parent_id: 0,
          struct_type: 'block',
          direction: 'vertical',
          buoyancy,
          elements,
          parameters: {
            children,
          },
          styles: { ...DEFAULT_INDENTS, 'flex-direction': 'column' },
        },
      ],
    };
  }, { newBlocks: [], existBlocks: [] });
};

export const completeLS: TCompleteLS = (scenarios, scenarioEl, parent) => {
  const parentChildren = Object.keys(scenarios).reduce((result, key) => {
    if (R.path([key, 'parent_id'], scenarios) === 0) {
      return [...result, scenarios[key]];
    }

    return result;
  }, []).sort((a, b) => b.buoyancy - a.buoyancy);
  const itemsLS = scenarioToLS(parentChildren, scenarios, scenarioEl);
  const newLS = {
    root: {
      ...parent,
      children: parentChildren.map(({ id }) => `${id}s`),
    },
    ...itemsLS,
  };

  return newLS;
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
