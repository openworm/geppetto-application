import * as ST from './selectors'
import { click, wait4selector } from './utils';

/**
 * Series of tests that get performed on project before it gets persisted. Widgets/components also get created so they can be saved
 * when project gets persisted, and then test their existence later when project gets persisted. Once tests and creation of wigets/components
 * is done, the project gets persisted.
 */
export const testProjectBeforePersistence= async (page, projectJSON) => {
	//Wait for landing page to finish loading with all expected components
	describe('Landing page', () => {
		it("Spinner goes away", async () => {
			await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true , timeout: 60000})
		})
		it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
			await wait4selector(page, selector, { visible: true, timeout: 60000 })
		})
	})

	//Test Console. Makes sure it toggles, and that autocomplete works with commands for specific project
	describe('Test Console', () => {
		it('Console exists and autocompletion of expected command works', async () => {
			await testConsole(page,projectJSON.autocomplete_test_1.input,projectJSON.autocomplete_test_1.expected );
		})
		it('Console exists and autocompletion of expected command works', async () => {
			await testConsole(page,projectJSON.autocomplete_test_2.input,projectJSON.autocomplete_test_2.expected);
		})
	})

	//Test experiment table, that it toggles and rows are there with expected initial components
	describe('Test Experiment Table', () => {
		async () => {
			await textExperimentTable(page);
		}
		async () => {
			await testExperimentTableRow(page)
		}
	})

	/**
	 * The next series events open a few widgets/components on a project before it gets persisted. The widgets/components are created so that when the project gets persisted, 
	 * they get saved with the persisted project, and then we can test the existence of these widgets/components on the persisted project.
	 */
	describe('Add wigets/components to project before persisting', () => {
		//Opens up tutorial widget, no tests performed other than visibility, opening it to make sure they get saved once project is persisted
		it("Tutorial widget created", async () => {
			await click(page, ST.TUTORIAL_BUTTON_SELECTOR);
			await wait4selector(page, ST.TUTORIAL_1_DIV_SELECTOR ,  {visible: true })
		})

		//On tutorial, click on button 'Next' to navigate to second page of tutorial. The tutorial is now on step 2
		async () => {
			await page.evaluate(async () => {
				$(".nextBtn").click();
				$(".nextBtn").click();
			})
		}

		//Creates Canvas , Popup and connectivity widget, not testing any feature, opening them to make sure they get saved once project is persisted
		it('Canvas widget created ', async () => {
			await addCanvasWidget(page,projectJSON.canvas_widget_object);
		})
		it('Connectivity widget created ', async () => {
			await addConnectivityWidget(page);
		})
		it('Popup widget created ', async () => {
			await addPopupWidget(page,projectJSON.customHandlerEvent);
		})
	})
	//Tests recorded variables and parameters don't work through spotlight component before project is persisted
	describe('Test Spotlight Before Project is Persisted', () => {
		it("Recorded Variables in spotlight", async () => {
			await testSpotlight(page, projectJSON.recorded_variable_test, false, true);
		})
		it("Parameters in spotlight", async () => {
			await testSpotlight(page, projectJSON.parameter_test, false, false);
		})
	})

	async () => {await page.waitFor(1500);}

	//Persist project and test persist button functionality
	describe('Test Persistence Button', () => {
		it("Persistence button is present and enabled", async () => {
			await wait4selector(page, ST.PERSIST_BUTTON)
		})
		it('Persist button is disabled, click went through', async () => {
			await click(page, ST.PERSIST_BUTTON);
			await wait4selector(page, ST.PERSIST_BUTTON_DISABLED)
		})
		it('Project persisted, persist button stopped spinning', async () => {
			await wait4selector(page, ST.PERSIST_BUTTON_ACTIVE)
		})
	})
};

/**
 * Tests that a project got persisted. Tests the existence of a few widgets/components that were saved when the project got persisted.
 */
export const testProjectAfterPersistence = async (page,projectJSON) => {
	it("Spinner goes away", async () => {
		await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true , timeout: 60000})
	})
	it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
		await wait4selector(page, selector, { visible: true, timeout: 60000 })
	})

	//Test the existence of Popup widget on persisted project, if project got persisted the widget should exist
	describe('Test Popup1 is opened after project is persisted', () => {
		it('Popup1 is correctly open on reload', async () => {
			await wait4selector(page, ST.POPUP_1_DIV_SELECTOR)
		})
		it('Popup1 custom handlers restored correctly', async () => {
			expect(
					await page.evaluate(async () => Popup1.customHandlers)
			).toBe(projectJSON.expectedTutorialHandlers)

			expect(
					await page.evaluate(async () => Popup1.customHandlers[0]['event'])
			).toBe(projectJSON.customHandlerEvent)
		})
	})
	//Test the existence of Connectivity widget on persisted project, if project got persisted the widget should exist
	it('Connectivity1 is correctly open on reload', async () => {
		await wait4selector(page, ST.CONNECTIVITY_1_DIV_SELECTOR)
	})

	//Test the existence of Canvas widget on persisted project, if project got persisted the widget should exist
	describe('Test Canvas2 widget after project is persisted', () => {
		it('Canvas2 is correctly open on reload', async () => {
			await wait4selector(page, ST.CANVAS_2_SELECTOR)
		})
		it('Canvas2 has mesh set correctly', async () => {
			expect(
					await page.evaluate(async () => $.isEmptyObject(Canvas1.engine.meshes))
			).toBe(false)
		})
	})

	//Test the existence of Tutorial widget on persisted project, if project got persisted the widget should exist
	describe('Test Tutorial after project is persisted', () => {
		it('Tutorial1 is correctly open on reload', async () => {
			await wait4selector(page, ST.TUTORIAL_BUTTON_SELECTOR)
		})
		it('Tutorial1 step restored correctly', async () => {
			expect(
					await page.evaluate(async () => Tutorial1.state.currentStep)
			).toBe(2)
		})
	})

	describe('Test Spotlight After Project is Persisted', () => {
		it("Parameters in spotlight ", async () => {
			await testSpotlight(page, projectJSON.parameter_test, true, false);
		})
	})
};

/**
 * Deletes persisted project using the dashboard
 */
export const testDeletePersistedProject = async (page) => {
	
}


const testCreateExperiment = async (page) => {
};

const testCloneExperiment = async (page) => {
};

const testDeleteExperiment = async (page) => {
};

const testSaveExperiment = async (page) => {
};

const testSaveProject = async (page) => {
};

const testDownloadExperimentResults = async (page) => {
};

const testDownloadExperimentModel = async (page) => {
};

const testSpotlight = async (page, persisted, checkComponent) => {
	it('Spotlight opens', async () => {
		await click(page, ST.SEARCH_ICON_SELECTOR);
		await wait4selector(page, ST.SEARCH_ICON_SELECTOR, { visible: true });;

		await page.focus(ST.SPOT_LIGHT_SEARCH_INPUT_SELECTOR);
		await page.keyboard.type(variableName);
		await page.keyboard.press(String.fromCharCode(13))

		await page.waitForSelector(ST.SEARCH_ICON_SELECTOR, { visible: true });
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
				await wait4selector(page, ST.WATCH_BUTTON_SELECTOR, { visible: false });
			})
		}else if(checkComponent == ST.SPOTLIGHT_PARAMETER_INPUT){
			it('Parameter input field correctly hidden in spotlight', async () => {
				await wait4selector(page, ST.SPOTLIGHT_PARAMETER_INPUT, { visible: false });
			})
		}
	}
	
	it('Spotlight goes away', async () => {
		await click(page, ST.SEARCH_ICON_SELECTOR);
		await wait4selector(page, ST.SEARCH_ICON_SELECTOR, { visible: true });;
	})
}

const testExperimentTable = async (page) => {
	it('The experiments table is correctly hidden.', async () => {
		await wait4selector(page, ST.TABBER_ANCHOR, { visible: true });
		await wait4selector(page, ST.EXPERIMENT_TABLE, { visible : false});
	})
	
	it('The console panel is correctly visible.', async () => {
		await click(page, ST.EXPERIMENT_TABLE_SELECTOR);	
		await wait4selector(page, ST.EXPERIMENT_TABLE, { visible : true});
	})
	
	it('The experiments table is correctly hidden.', async () => {
		await click(page, ST.EXPERIMENT_TABLE_SELECTOR);	
		await wait4selector(page, ST.EXPERIMENT_TABLE, { visible : false});
	})
	
};

const testExperimentTableRow = async (page) => {
	it('The experiment table is correctly visible.', async () => {
		await click(page, ST.EXPERIMENT_TABLE_SELECTOR);	
		await wait4selector(page, ST.EXPERIMENT_TABLE, { visible : true});
	})
	
	it('Experiment table column expanded and variables content exists', async () => {
		await click(page, ST.EXPERIMENT_TABLE_COLUMN_1);	
		await wait4selector(page, ST.EXPERIMENT_TABLE_EXTENDED_ROW_VARS, { visible : true});
	})
	
	it('Experiment table column expanded and parameters content exists', async () => {
		await wait4selector(page, ST.EXPERIMENT_TABLE_EXTENDED_ROW_PARAMS, { visible : true});
	})
};

const testConsole = async (page, command, autoCompleteCommand) => {
	it('The console panel is correctly hidden.', async () => {
		await wait4selector(page, ST.TABBER_ANCHOR, { visible: true })
		await wait4selector(page, ST.DRAWER_SELECTOR, { visible : false})
	})

	it('The console panel is correctly visible.', async () => {
		await click(page, ST.CONSOLE_SELECTOR)
		await wait4selector(page, ST.DRAWER_SELECTOR, { visible: true });
	})

	it('The console input area autocomplete works with command: ' + autoCompleteCommand, async () => {
		await page.waitFor(500);
		await testConsoleInputArea(page,command, autoCompleteCommand)
	})

	it('The console panel is correctly hidden.', async () => {
		await click(page, ST.DRAWER_MINIMIZE_ICON_SELECTOR);
		await wait4selector(page, ST.DRAWER_SELECTOR, { hidden: true });
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
	}, canvasObject)
}

/**Adds connectivity widget to project */
const addConnectivityWidget = async (page) => {
	await page.evaluate(async () => { G.addWidget(6);})
}

/**Adds popup widget to project*/
const addPopupWidget = async (page, customHandler) => {
	await page.evaluate(async (customHandlerEvent) => { G.addWidget(1).then(w=>{w.setMessage("Hhcell popup").addCustomNodeHandler(function(){},customHandlerEvent);});}, customHandler)
}