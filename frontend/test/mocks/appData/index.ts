import {
  IListProject, IScenarioItem,
} from '$redux/project/types';

export const mockProject = (id: number, name: string, status: string, projectscreen) => ({
  id,
  name,
  status,
  projectscreen,
});

export const mockListProject: IListProject[] = [
  {
    "id":14,
    "preview":"8zpSaadvohNrqCL8_aBCCw",
    "status":"pending",
    "name":"project",
    "projectscreen":[
      {
        "id": 1,
        "status":"in_progress",
        "project":14,
        "screenscenario":[],
        "name": "screen-1",
      },
      {
        "id": 2,
        "status":"in_progress",
        "project":14,
        "screenscenario":[],
        "name": "screen-2",
      }
    ],
  },
  {
    "id":15,
    "preview":"hSg5Bm9OD8btB1qbbVs1FQ",
    "status":"pending",
    "name":"test",
    "projectscreen":[],
  }
];

export const mockProjectScreens = [
  { id: 23, name: 'screen - 1' },
  { id: 29, name: 'screen - 2' },
];

export const mockScreen = {
  29: {
    "status": "in_progress",
    "project": 14,
    "name": "11",
    "id": 29,
    "image": null,
    "screen_data_text": "",
    "screen_data_json": [{
      "id": 1557295850814,
      "type": "block",
      "children": [{
        "id": 1557295862830,
        "type": "group",
        "children": [{
          "id": 1557295886407,
          "type": "elem",
          "children": [],
          "props": {
            "html_type": "elem",
            "buoyancy": 0,
            "width": "auto",
            "height": 24,
            "align": "auto",
            "margin": "4px 4px 4px 4px",
            "padding": "0 0 0 0"
          }
        }, {
          "id": 1557295888423,
          "type": "input",
          "children": [],
          "props": {
            "html_type": "input",
            "buoyancy": 0,
            "width": "auto",
            "height": "auto",
            "align": "auto",
            "margin": "4px 4px 4px 4px",
            "padding": "0 0 0 0"
          }
        }, {
          "id": 1557295890463,
          "type": "button",
          "children": [],
          "props": {
            "html_type": "button",
            "buoyancy": 0,
            "width": "auto",
            "height": 24,
            "align": "auto",
            "margin": "4px 4px 4px 4px",
            "padding": "0 0 0 0"
          }
        }, {
          "id": 1557295892143,
          "type": "hyperLine",
          "children": [],
          "props": { "margin": "4px 4px 4px 4px", "padding": "0 0 0 0" }
        }],
        "props": { "width": "100%", "height": null, "margin": "4px 4px 4px 4px", "padding": "0 0 0 0" }
      }],
      "props": { "margin": "4px 4px 4px 4px", "padding": "0 0 0 0" }
    }]
  },
  23: {
    "status": "in_progress",
    "project": 14,
    "name": "12",
    "id": 23,
    "image": null,
    "screen_data_text": "",
    "screen_data_json": [{
      "id": 3,
      "type": "block",
      "children": [{
        "id": 6,
        "type": "group",
        "children": [{
          "id": 7,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 100,
            "html_type": "text_title",
            "height": 50,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }, {
          "id": 8,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 98,
            "html_type": "text_description",
            "height": 40,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }],
        "orientation": "vertical",
        "props": { "margin": "4px 4px 4px 4px", "padding": "0px 0px 0px 0px", "width": "100%" },
        "scenarioId": 2
      }, {
        "id": 7,
        "type": "group",
        "children": [{
          "id": 9,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 64,
            "html_type": "input_firstname",
            "height": 80,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }, {
          "id": 10,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 61,
            "html_type": "input_lastname",
            "height": 80,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }],
        "orientation": "vertical",
        "props": { "margin": "4px 4px 4px 4px", "padding": "0px 0px 0px 0px", "width": "100%" }
      }, {
        "id": 8,
        "type": "group",
        "children": [{
          "id": 11,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 54,
            "html_type": "select_day",
            "height": 20,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }, {
          "id": 12,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 54,
            "html_type": "select_month",
            "height": 20,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }, {
          "id": 13,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 54,
            "html_type": "select_year",
            "height": 20,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }],
        "orientation": "horizontal",
        "props": { "margin": "4px 4px 4px 4px", "padding": "0px 0px 0px 0px", "width": "100%" }
      }, {
        "id": 2,
        "type": "group",
        "children": [{
          "id": 2,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 10,
            "html_type": "input_password",
            "height": 80,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }, {
          "id": 3,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 10,
            "html_type": "input_password",
            "height": 80,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }],
        "orientation": "vertical",
        "props": { "margin": "4px 4px 4px 4px", "padding": "0px 0px 0px 0px", "width": "100%" }
      }, {
        "id": 4,
        "type": "group",
        "children": [{
          "id": 5,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 1,
            "html_type": "button_end_composite_scenario",
            "height": 80,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }],
        "orientation": "vertical",
        "props": { "margin": "4px 4px 4px 4px", "padding": "0px 0px 0px 0px", "width": "100%" }
      }],
      "props": { "margin": "4px 4px 4px 4px", "padding": "0px 0px 0px 0px", "width": "100%" }
    }, {
      "id": 1,
      "type": "block",
      "children": [{
        "id": 1,
        "type": "group",
        "children": [{
          "id": 0,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 86,
            "html_type": "input_phone",
            "height": 80,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }, {
          "id": 1,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 10,
            "html_type": "input_password",
            "height": 80,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }],
        "orientation": "vertical",
        "props": { "margin": "4px 4px 4px 4px", "padding": "0px 0px 0px 0px", "width": "100%" }
      }, {
        "id": 3,
        "type": "group",
        "children": [{
          "id": 4,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 1,
            "html_type": "button_end_composite_scenario",
            "height": 80,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }],
        "orientation": "vertical",
        "props": { "margin": "4px 4px 4px 4px", "padding": "0px 0px 0px 0px", "width": "100%" }
      }],
      "props": { "margin": "4px 4px 4px 4px", "padding": "0px 0px 0px 0px", "width": "100%" }
    }, {
      "id": 2,
      "type": "block",
      "children": [{
        "id": 5,
        "type": "group",
        "children": [{
          "id": 6,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 2,
            "html_type": "hyperlink_end simple_scenario",
            "height": 80,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }],
        "orientation": "vertical",
        "props": { "margin": "4px 4px 4px 4px", "padding": "0px 0px 0px 0px", "width": "100%" }
      }],
      "props": { "margin": "4px 4px 4px 4px", "padding": "0px 0px 0px 0px", "width": "100%" }
    }, {
      "id": 4,
      "type": "block",
      "children": [{
        "id": 9,
        "type": "group",
        "children": [{
          "id": 14,
          "type": "elem",
          "children": [],
          "props": {
            "width": "auto",
            "buoyancy": 0,
            "html_type": "button_end simple_scenario",
            "height": 80,
            "margin": "4px 4px 4px 4px",
            "padding": "0px 0px 0px 0px"
          }
        }],
        "orientation": "vertical",
        "props": { "margin": "4px 4px 4px 4px", "padding": "0px 0px 0px 0px", "width": "100%" }
      }],
      "props": { "margin": "4px 4px 4px 4px", "padding": "0px 0px 0px 0px", "width": "100%" }
    }]
  },
};

export const mockScenarios: IScenarioItem[] = [
  {
    "id":2,
    "name":"test",
    "type":"login",
    "screen": 29,
    "buoyancy": 1,
    "elements":[],
    "parameters":{},
  },
  {
    "id":3,
    "name":"test_1",
    "type":"common_scenario",
    "screen": 29,
    "buoyancy": 0,
    "elements":[],
    "parameters":{},
  },
  {
    "id":4,
    "name":"test_2",
    "type":"login",
    "screen": 29,
    "buoyancy": 0,
    "elements":[],
    "parameters":{},
  },
];

export const mockElements = null;
