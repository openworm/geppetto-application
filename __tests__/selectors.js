export const SIM_TOOLBAR_SELECTOR = 'div[id="sim-toolbar"]';
export const SIM_TOOLBAR_MESSAGE = "Geppetto loads the initial simulation controls";

export const CONTROLS_SELECTOR = 'div[id="controls"]';
export const CONTROLS_MESSAGE = 'Geppetto loads the initial camera controls';

export const FOREGROUND_TOOLBAR_SELECTOR = 'div[id="foreground-toolbar"]';
export const FOREGROUND_MESSAGE = "Geppetto loads the initial foreground controls";

export const SPOT_LIGHT_SELECTOR = 'div[id="spotlight"]';
export const SPOT_LIGHT_MESSAGE = "Spotlight is visible.";

export const PLOT_BUTTON_SELECTOR = 'button#plot';
export const PLOT_BUTTON_VISIBLE_MESSAGE = 'Plot variables button became visible correctly';
export const PLOT_BUTTON_INVISIBLE_MESSAGE = 'Plot button correctly hidden';

export const ZOOM_BUTTON_SELECTOR = 'button#zoomInBtn';
export const PAN_RIGHT_BUTTON_SELECTOR = 'button#panRightBtn';
export const ROTATE_RIGHT_BUTTON_SELECTOR = 'button#rotateRightBtn';

export const CANVAS_2_SELECTOR = '#Canvas2_component';
export const ZOOM_BUTTON_CANVAS_2_SELECTOR = '#Canvas2 ' + ZOOM_BUTTON_SELECTOR;
export const PAN_RIGHT_BUTTON_CANVAS_2_SELECTOR = '#Canvas2 ' + PAN_RIGHT_BUTTON_SELECTOR;
export const ROTATE_RIGHT_BUTTON_CANVAS_2_SELECTOR = '#Canvas2 ' + ROTATE_RIGHT_BUTTON_SELECTOR;

export const WATCH_BUTTON_SELECTOR = 'button#watch';
export const WATCH_BUTTON_VISIBLE_MESSAGE = 'Watch button correctly hidden';

export const PAN_HOME_BUTTON_SELECTOR = '#panHomeBtn';
export const SPOT_LIGHT_BUTTON_SELECTOR = '#spotlightBtn';
export const SPOT_LIGHT_SEARCH_INPUT_SELECTOR = 'input#typeahead';
export const SPOT_LIGHT_DIV= 'div#spotlight';

export const CONTROL_PANEL_SELECTOR = 'div#controlpanel';
export const CONTROL_PANEL_MESSAGE = "The control panel is correctly open.";
export const CONTROL_PANEL_BUTTON = '#controlPanelBtn';
export const CONTROL_PANEL_CONTAINER_SELECTOR = '#controlpanel';

export const SEARCH_ICON_SELECTOR = 'i.fa.search';
export const SEARCH_ICON_MESSAGE = 'Attempting to open spotlight';


export const CONSOLE_SELECTOR = 'div.fa.fa-terminal';
export const CONSOLE_OUTPUT_SELECTOR = '#undefined_console';

export const DRAWER_SELECTOR = 'div[class*="consoleContainer"]';
export const DRAWER_MINIMIZE_ICON_SELECTOR = '.minIcons';
export const DRAWER_MAXIMIZE_ICON_SELECTOR = '.maxIcons';
export const DRAWER_CLOSE_ICON_SELECTOR = '.closeIcons';
export const DRAWER_CONTAINER_SELECTOR = '.drawer,.react-draggable';
export const DRAWER_CMD_INPUT_SELECTOR = '#commandInputArea';

export const HELP_BUTTON_SELECTOR = '#genericHelpBtn';
export const HELP_MODAL_SELECTOR = '#help-modal';

export const MINIMIZE_WIDGETS_CONTAINER_SELECTOR = '#dialog-extend-fixed-container';

export const STANDARD_ROW_SELECTOR = '.standard-row';

export const PLOTLY_SELECTOR = 'div.js-plotly-plot';
export const DIALOG_SELECTOR = 'div.dialog';

export const BUTTON_ONE_SELECTOR = 'button#buttonOne';

export const POPUP = ['Popups' , 1, 'Popup1', { width: 490, height: 394 }];
export const PLOT = ['Plots' , 0, 'Plot1', { width: 350, height: 300 }];
export const TREE = ['Trees' , 3, "TreeVisualiserDAT1", { width: 350, height: 260 }];
export const VAR_LIST = ['Variables', 5, "VarVis1", { width: 350, height: 120 }];

export const WIDGET_LIST = [ POPUP, PLOT, TREE, VAR_LIST ];

export const HHCELL_SELECTOR = 'hhcell.hhpop[0]';
export const HHCELL_V_SELECTOR = 'hhcell.hhpop[0].v';
export const HHCELL_CONTROL_PANEL_BUTTON_SELECTOR = '#hhcell_hhpop_0__visibility_ctrlPanel_btn';
export const HHCELL_V_CONTROL_PANEL_BUTTON_SELECTOR = 'button[id="hhcell_hhpop_0__v_plot_ctrlPanel_btn"]';

export const ACNET2_SELECTOR = 'acnet2.pyramidals_48[0]';
export const ACNET2_V1_SELECTOR = 'acnet2.pyramidals_48[1].soma_0.v';
export const ACNET2_CONTROL_PANEL_BUTTON_SELECTOR = "acnet2_pyramidals_48_0__visibility_ctrlPanel_btn";
export const ACNET2_V_CONTROL_PANEL_BUTTON_SELECTOR = 'acnet2_pyramidals_48_0__soma_0_v_plot_ctrlPanel_btn';
export const ACNET2_V_CONTROL_PANEL_BUTTON = `button[id="${ACNET2_V_CONTROL_PANEL_BUTTON_SELECTOR}"]`;


export const STATE_VARIABLE_FILTER_BUTTON_SELECTOR = '#stateVariablesFilterBtn';

export const PROJECT_FILTER_BUTTON_SELECTOR = '#anyProjectFilterBtn';

export const PLOT1_SELECTOR = 'div[id="Plot1"]';

export const TUTORIAL_BUTTON_SELECTOR = 'button#tutorialBtn';

export const CANVAS_2_DIV_SELECTOR = 'div#Canvas2';
export const PLOT_1_DIV_SELECTOR = 'div#Plot1';
export const POPUP_1_DIV_SELECTOR = 'div#Popup1';
export const POPUP_2_DIV_SELECTOR = 'div#Popup2';
export const POPUP_1_SELECTOR = '#Popup1';

export const TUTORIAL_1_DIV_SELECTOR = 'div#Tutorial1';

export const LOADING_SPINNER = 'div[id="loading-spinner"]';

export const ELEMENTS_IN_LANDING_PAGE = [
  [ SIM_TOOLBAR_MESSAGE, SIM_TOOLBAR_SELECTOR ],
  [ CONTROLS_MESSAGE, CONTROLS_SELECTOR],
  [ FOREGROUND_MESSAGE, FOREGROUND_TOOLBAR_SELECTOR]
];
