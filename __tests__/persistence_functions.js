import * as ST from './selectors'
import { click, wait4selector } from './utils';
import { getUrlFromProjectId } from './cmdline.js';

var persistedProjectID = 0;

/**
 * Series of tests that get performed on project before it gets persisted. Widgets/components also get created so they can be saved
 * when project gets persisted, and then test their existence later when project gets persisted. Once tests and creation of wigets/components
 * is done, the project gets persisted.
 */
export const testProjectBeforePersistence= (page, baseURL, expect_popup, projectJSON) => {
	//Wait for landing page to finish loading with all expected components
	describe('Landing page', () => {
		it("Spinner goes away", async () => {
			await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true , timeout: 60000})
		})
		it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
			await wait4selector(page, selector, { visible: true, timeout: 60000 })
		})
		
		if(expect_popup){
			
			console.log("close error messags")
			it("Non persisted project message pop up appears", async () => {
				await wait4selector(page, ST.DIALOG_MODAL_SELECTOR, { visible : true, timeout: 30000 })
			})

			it("Non persisted project message pop up is closed", async () => {
				await click(page, ST.DIALOG_MODAL_BUTTON_SELECTOR);
				await wait4selector(page, ST.DIALOG_MODAL_SELECTOR, { visible: false, timeout: 30000 })
				console.log("error message went away")
				await page.waitFor(5000);
			})
		}
	})

	//Test Console. Makes sure it toggles, and that autocomplete works with commands for specific project
	describe('Test Commands in Console', () => {
		console.log("Perform console tests")
			for (var i =0; i< projectJSON.console_tests.length; i++) {
				testConsole(page,projectJSON.console_tests[i].input,projectJSON.console_tests[i].expected );
			}
	})

	//Test experiment table, that it toggles and rows are there with expected initial components
	describe('Test Initial Contents in Experiment Table', () => {
		testExperimentTable(page);
		testExperimentTableRow(page)
		testExperimentTableRowIcons(page, false, false,  false)

		it('The experiment table is correctly hidden.', async () => {
			await click(page, ST.EXPERIMENT_TABLE_SELECTOR);	
			await wait4selector(page, ST.EXPERIMENT_TABLE, { hidden : true});
		})
	})

	/**
	 * The next series events open a few widgets/components on a project before it gets persisted. The widgets/components are created so that when the project gets persisted, 
	 * they get saved with the persisted project, and then we can test the existence of these widgets/components on the persisted project.
	 */
	describe('Add wigets/components to project before persisting', () => {
		//Opens up tutorial widget, no tests performed other than visibility, opening it to make sure they get saved once project is persisted
		//Creates Canvas , Popup and connectivity widget, not testing any feature, opening them to make sure they get saved once project is persisted
		it("Add canvas widget ", async () => {
			await addCanvasWidget(page,projectJSON.canvas_widget_object_test);
		})
		it("Add connectivity widget ", async () => {
			await addConnectivityWidget(page);
		})
		it("Add popup widget ", async () => {
			await addPopupWidget(page,projectJSON.custom_handler_event);
		})
	})
	//Tests recorded variables and parameters don't work through spotlight component before project is persisted
	describe('Test Spotlight Before Project is Persisted', () => {
		testSpotlight(page, false,  projectJSON.recorded_variable_test, ST.WATCH_BUTTON_SELECTOR);
		testSpotlight(page, false, projectJSON.parameter_test, ST.SPOTLIGHT_PARAMETER_INPUT);
	})

	//Persist project and test persist button functionality
	describe('Test Persistence Button', () => {
		it("Persistence button is present and enabled", async () => {
			await wait4selector(page, ST.PERSIST_BUTTON, {visible : true})
			await page.evaluate(async () => { $("#Buttonbar1").hide()})
			await page.waitFor(1000)
		})
		it('Persist button is disabled, click went through', async () => {
			await click(page, ST.PERSIST_BUTTON);
			await wait4selector(page, 'i.fa-spin', {visible : true})
		})
		it('Project persisted, persist button stopped spinning', async () => {
			await wait4selector(page, 'i.fa-spin', {hidden : true, timeout : 100000})
			await page.waitFor(5000)
		})
	})
	
	describe('Reload persisted project', () => {
		it("Open Persisted Project",  async () => {
			let persistedProjectID = await page.evaluate(async () => Project.getId())
			console.log("persisted id ", persistedProjectID)
			await page.goto(getUrlFromProjectId(persistedProjectID));
		})
	})
	describe('Test First Project After Persisted',  () => {
		console.log("after persistence")
		testProjectAfterPersistence(page,projectJSON, expect_popup);	
	})

	describe('Test Delete Project After Persisted', () => {
		it("Open Dashboard",  async () => {
			persistedProjectID = await page.evaluate(async () => Project.getId())
			await page.goto(baseURL);
		})
		//testDeletePersistedProject(page, persistedProjectID);
		it('Dashboard Loaded', async () => {
			await wait4selector(page, ST.DASHBOAD_PROJECT_PREVIEW_SELECTOR, {visible : true, timeout : 20000})
		})
		it('Waited for scrolldown projects to appear in dashboard', async () => {
			console.log("delete id ", persistedProjectID)
			await page.evaluate(async () => { $("#projects").scrollTop($("#projects")[0].scrollHeight+1000);})
			await click(page, 'div[project-id=\"'+persistedProjectID+'\"]');
			await page.waitFor(1000);
		})
		it('waited for delete icon to delete project', async () => {
			await wait4selector(page, ST.DASHBOARD_DELETE_ICON_SELECTOR, {visible : true})
		})
		it('Correctly deleted persisted project using the dashboard', async () => {
			await click(page, ST.DASHBOARD_DELETE_PROJECT_SELECTOR);
			await wait4selector(page, ST.DASHBOARD_OPEN_PROJECT, {hidden : true})
		})
	})
};

/**
 * Tests that a project got persisted. Tests the existence of a few widgets/components that were saved when the project got persisted.
 */
export const testProjectAfterPersistence = async (page,projectJSON, expect_popup) => {
	it("Spinner goes away", async () => {
		await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true , timeout: 60000})
	})
	it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
		await wait4selector(page, selector, { visible: true, timeout: 60000 })
	})
	
	if(expect_popup){
		it("Non persisted project message pop up appears", async () => {
			await wait4selector(page, ST.DIALOG_MODAL_SELECTOR, { visible : true, timeout: 30000 })
		})

		it("Non persisted project message pop up is closed", async () => {
			await click(page, ST.DIALOG_MODAL_BUTTON_SELECTOR);
			await wait4selector(page, ST.DIALOG_MODAL_SELECTOR, { hidden: true, timeout: 30000 })
			await page.waitFor(2000);
		})
	}

	//Test the existence of Popup widget on persisted project, if project got persisted the widget should exist
	describe('Test Popup1 is opened after project is persisted', () => {
		it('Popup1 is correctly open on reload', async () => {
			await wait4selector(page, ST.POPUP_1_DIV_SELECTOR, {visible : true, timeout : 10000})
		})
		it('Popup1 custom handlers restored correctly', async () => {
			expect(
					await page.evaluate(async () => Popup1.customHandlers[0]['event'])
			).toBe(projectJSON.custom_handler_event)
		})
	})
	//Test the existence of Connectivity widget on persisted project, if project got persisted the widget should exist
	it('Connectivity1 is correctly open on reload', async () => {
		await wait4selector(page, ST.CONNECTIVITY_1_DIV_SELECTOR, {visible : true, timeout : 10000})
	})

	//Test the existence of Canvas widget on persisted project, if project got persisted the widget should exist
	describe('Test Canvas2 widget after project is persisted', () => {
		it('Canvas2 is correctly open on reload', async () => {
			await wait4selector(page, ST.CANVAS_2_SELECTOR, {visible : true, timeout : 10000})
		})
		it('Canvas2 has mesh set correctly', async () => {
			expect(
					await page.evaluate(async () => $.isEmptyObject(Canvas2.engine.meshes))
			).toBe(false)
		})
	})

	describe('Test Spotlight After Project is Persisted', () => {
		testSpotlight(page, true,  projectJSON.parameter_test, ST.SPOTLIGHT_PARAMETER_INPUT);
	})
	
	describe('Test Experiment Table', () => {
		testExperimentTable(page);
		testExperimentTableRow(page)
		testExperimentTableRowIcons(page, false, false, true)

		it('The experiment table is correctly hidden.', async () => {
			await click(page, ST.EXPERIMENT_TABLE_SELECTOR);	
			await wait4selector(page, ST.EXPERIMENT_TABLE, { hidden : true});
		})
	})
};

/**
 * Deletes persisted project using the dashboard
 */
export const testDeletePersistedProject = async (page, projectID) => {
	//Test the existence of Popup widget on persisted project, if project got persisted the widget should exist
	describe('Delete persisted project', () => {
		it('Dashboard Loaded', async () => {
			await wait4selector(page, ST.DASHBOAD_PROJECT_PREVIEW_SELECTOR)
		})
		it('Waited for scrolldown projects to appear in dashboard', async () => {
			await page.evaluate(async () => { $("#projects").scrollTop($("#projects")[0].scrollHeight+1000);})
			await click(page, 'div[project-id=\"'+projectID+'\"]');
			await page.waitFor(1000);
		})
		it('waited for delete icon to delete project', async () => {
			await wait4selector(page, ST.DASHBOARD_DELETE_ICON_SELECTOR, {visible : true})
		})
		it('Correctly deleted persisted project using the dashboard', async () => {
			await click(page, ST.DASHBOARD_DELETE_ICON_SELECTOR);
			window.confirm = jest.fn(() => true) // always click 'yes'
			expect(window.confirm).toBeCalled() // or whatev
			await wait4selector(page, ST.DASHBOARD_OPEN_PROJECT, {hidden : true, timeout : 30000})
		})
	})
}


const testCreateExperiment = async (page) => {
	async () => {
		await page.evaluate(async () => { window.Project.newExperiment();})
		await page.waitFor(1000)
	}
	
	it('New experiment created using persisted project', async () => {
		expect(
				await page.evaluate(async () =>  window.Project.getExperiments().length===4)
		).toBe(4)
	})
};

const testCloneExperiment = async (page) => {
	async () => {
		window.Project.getExperiments()[0].clone();
		await page.waitFor(1000)
	}
	
	it('Experiment cloned using persisted project', async () => {
		expect(
				await page.evaluate(async () =>  window.Project.getExperiments().length===4)
		).toBe(4)
	})
	
	it('"Clone Experiment - Simulator Configuration duration checked', async () => {
		expect(
				await page.evaluate(async () =>  Project.getExperiments()[0].simulatorConfigurations["hhcell"].length ===
					Project.getExperiments()[Project.getExperiments().length-1].simulatorConfigurations["hhcell"].length)
		).toBe(true)
	})
	
	it('Clone Experiment - Simulator Configuration time step checked', async () => {
		expect(
				await page.evaluate(async () =>  Project.getExperiments()[0].simulatorConfigurations["hhcell"].timeStep===
					Project.getExperiments()[Project.getExperiments().length-1].simulatorConfigurations["hhcell"].timeStep)
		).toBe(true)
	})
	
	it('Clone Experiment - Simulator Configuration service id checked', async () => {
		expect(
				await page.evaluate(async () =>  Project.getExperiments()[0].simulatorConfigurations["hhcell"].simulatorId===
					Project.getExperiments()[Project.getExperiments().length-1].simulatorConfigurations["hhcell"].simulatorId)
		).toBe(true)
	})
};

const testDeleteExperiment = async (page) => {
	async () => {
		await page.evaluate(async () => { window.Project.getExperiments()[(window.Project.getExperiments().length-1)].deleteExperiment();})
		await page.waitFor(1000)
	}
	
	it('Experiment deleted using persisted project', async () => {
		expect(
				await page.evaluate(async () =>  window.Project.getExperiments().length===3)
		).toBe(4)
		
		await page.evaluate(async () => document.getElementById('infomodal-btn').click())
	})
};

const testSaveExperiment = async (page) => {
};

const testSaveProject = async (page) => {
};

const testDownloadExperimentResults = async (page) => {
};

const testDownloadExperimentModel = async (page) => {
};

const testUpload2DropBoxFeature = async (page) => {
	
}

const testSpotlight = async (page,persisted,  variableName, checkComponent) => {
	it('Opens and shows correct buttons.', async () => {
		await click(page, ST.SPOT_LIGHT_BUTTON_SELECTOR);
		await page.waitFor(1000);
		console.log("Open spotlight")
		await wait4selector(page, ST.SPOT_LIGHT_SELECTOR, { visible: true , timeout : 20000});
	})

	it('Spotlight button exists', async () => {
		await page.focus(ST.SPOT_LIGHT_SEARCH_INPUT_SELECTOR);
		await page.keyboard.type(variableName);
		await page.keyboard.press(String.fromCharCode(13))
	})
	if(persisted){
		if(checkComponent == ST.WATCH_BUTTON_SELECTOR){
			it('Record variable icon correctly visible in spotlight', async () => {
				await wait4selector(page, ST.WATCH_BUTTON_SELECTOR, { visible: true });
			})
		}else if(checkComponent == ST.SPOTLIGHT_PARAMETER_INPUT){
			it('Parameter input field correctly visible in spotlight', async () => {
				await wait4selector(page, ST.SPOTLIGHT_PARAMETER_INPUT, { visible: true });
			})
		}
	}else{
		if(checkComponent == ST.WATCH_BUTTON_SELECTOR){
			it('Record variable icon correctly hidden in spotlight', async () => {
				await wait4selector(page, ST.WATCH_BUTTON_SELECTOR, { hidden: true });
			})
		}else if(checkComponent == ST.SPOTLIGHT_PARAMETER_INPUT){
			it('Parameter input field correctly hidden in spotlight', async () => {
				await wait4selector(page, ST.SPOTLIGHT_PARAMETER_INPUT, { hidden: true });
			})
		}
	}
	
	it('Spotlight goes away', async () => {
		await page.focus(ST.SPOT_LIGHT_SEARCH_INPUT_SELECTOR);
		await page.keyboard.press("Escape")
		await wait4selector(page, ST.SEARCH_ICON_SELECTOR, { hidden: true });;
	})
}

const testExperimentTable = async (page) => {
	it('The experiments table button is present.', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_SELECTOR, { visible : false, timeout : 20000});
	})
	
	it('The expriments table is correctly visible.', async () => {
		await click(page, ST.EXPERIMENT_TABLE_SELECTOR);	
		await wait4selector(page, ST.EXPERIMENT_TABLE_CONTAINER, { visible : true, timeout : 20000});
	})
	
	it('The experiments table is correctly hidden.', async () => {
		await click(page, ST.EXPERIMENT_TABLE_SELECTOR);	
		await wait4selector(page, ST.EXPERIMENT_TABLE_CONTAINER, { visible : false, timeout : 20000});
	})
	
};

const testExperimentTableRow = async (page) => {
	it('The experiment table is correctly visible.', async () => {
		await click(page, ST.EXPERIMENT_TABLE_SELECTOR);	
		await wait4selector(page, ST.EXPERIMENT_TABLE_CONTAINER, { visible : true, timeout : 20000});
	})
	
	it('Experiment table column expanded and variables content exists', async () => {
		await click(page, ST.EXPERIMENT_TABLE_COLUMN_1_SELECTOR);	
		await wait4selector(page, ST.EXPERIMENT_TABLE_EXTENDED_ROW_VARS_SELECTOR, { visible : true, timeout : 20000});
	})
	
	it('Experiment table column expanded and parameters content exists', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_EXTENDED_ROW_PARAMS_SELECTOR, { visible : true, timeout : 20000});
	})
};

const testExperimentTableRowIcons = async (page, activeButtonVisibility, downloadResultsButtonVisibility, visible) => {	
	async () => {
		await click(page, ST.EXPERIMENT_TABLE_COLUMN_1_SELECTOR);	
	}
	
	it('Active button exists with correct visibility', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_ACTIVE_ICON_SELECTOR, { visible : activeButtonVisibility});
	})
	
	it('Delete button exists with correct visibility', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_DELETE_ICON_SELECTOR, { visible : visible});
	})
	
	it('Clone button exists with correct visibility', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_CLONE_ICON_SELECTOR, { visible : visible});
	})
	
	it('Download results button exists with correct visibility', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_DOWNLOAD_RESULTS_ICON_SELECTOR, { visible : downloadResultsButtonVisibility});
	})
	
	it('Download model button exists with correct visibility', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_DOWNLOAD_MODELS_ICON_SELECTOR, { visible : true});
	})
}

const testConsole = async (page, command, autoCompleteCommand) => {
	it('The console tab is correctly visible.', async () => {
		await wait4selector(page, ST.CONSOLE_SELECTOR, { visible: true , timeout : 40000});
	})
	it('The console panel is correctly visible.', async () => {
		console.log("Open console")
		await click(page, ST.CONSOLE_SELECTOR);
		await wait4selector(page, ST.DRAWER_SELECTOR, { visible: true , timeout : 40000});
	})

	it('The console input area autocomplete works with command: ' + autoCompleteCommand, async () => {
		await page.waitFor(500);
		await testConsoleInputArea(page,command, autoCompleteCommand)
	})

	it('The console panel is correctly hidden.', async () => {
		await click(page, ST.DRAWER_MINIMIZE_ICON_SELECTOR);
		await wait4selector(page, ST.DRAWER_SELECTOR, { hidden: true, timeout : 20000 });
	})	
};

const testConsoleInputArea = async (page, input, expectedAutoComplete) => {
	await page.evaluate(async (value, selector) => {
		$(selector).val(value);
		$(selector).trigger('keydown');
		console.log("value ", value)
	}, input, ST.DRAWER_CMD_INPUT_SELECTOR)

	await page.waitFor(5000);
	expect(await page.evaluate(async (input_area) => $(input_area).val(), ST.DRAWER_CMD_INPUT_SELECTOR)).toBe(expectedAutoComplete);
}

/**Adds canvas widget to project*/
const addCanvasWidget = async (page, canvasObject) => {
	expect( 
			await page.evaluate(async (widgetCanvasObject) => {
				var canvasObject = null;
				if(widgetCanvasObject=="hhcell"){
					canvasObject = hhcell;
				}else if(widgetCanvasObject=="c302_A_Pharyngeal"){
					canvasObject = c302_A_Pharyngeal;
				}else if(widgetCanvasObject=="Balanced_240cells_36926conns"){
					canvasObject = Balanced_240cells_36926conns;
				}
				GEPPETTO.ComponentFactory.addWidget('CANVAS', {name: '3D Canvas', id: "Canvas2"}, function () {this.setName('Widget Canvas');this.setPosition();this.display([canvasObject])});
				return true;
			}, canvasObject)
	).toBe(true)
}

/**Adds connectivity widget to project */
const addConnectivityWidget = async (page) => {
	expect( 
			await page.evaluate(async () => { G.addWidget(6); return true;})
	).toBe(true)
}

/**Adds popup widget to project*/
const addPopupWidget = async (page, customHandler) => {
	expect(
			await page.evaluate(async (customHandlerEvent) => { G.addWidget(1).then(w=>{w.setMessage("Hhcell popup").addCustomNodeHandler(function(){},customHandlerEvent);}); return true;}, customHandler)
	).toBe(true)
}