import * as ST from './selectors'
import { click, wait4selector } from './utils';
import { 
	testConsole,
	testExperimentTable
} from './functions';

export const testProjectBeforePersistence= async (page, projectJSON) => {
	describe('Landing page', () => {
		it("Spinner goes away", async () => {
			await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true , timeout: 60000})
		})
		it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
			await wait4selector(page, selector, { visible: true, timeout: 60000 })
		})
	})
	
	describe('Test Console', () => {
		it('Console exists and autocompletion of expected command works', async () => {
			await testConsole(page,projectJSON.autocomplete_test_1.input,projectJSON.autocomplete_test_1.expected );
		})
		it('Console exists and autocompletion of expected command works', async () => {
			await testConsole(page,projectJSON.autocomplete_test_2.input,projectJSON.autocomplete_test_2.expected);
		})
	})

	describe('Test Experiment Table', () => {
		async () => {
			await textExperimentTable(page);
		}
		
		async () => {
			await testExperimentTableRow(page)
		}
	})
	
	it('Console exists and autocompletion of expected command works', async () => {
		await testCanvasWidget(page,projectJSON.canvas_widget_object);
	})

	describe('Test Spotlight Before Project is Persisted', () => {
		it("Recorded Variables in spotlight", async () => {
			await testSpotlight(page, projectJSON.recorded_variable_test, false, true);
		})
		it("Parameters in spotlight ", async () => {
			await testSpotlight(page, projectJSON.parameter_test, false, false);
		})
	})
	
	async () => {await page.waitFor(1500);}
	
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
	
	describe('Test Spotlight After Project is Persisted', () => {
		it("Parameters in spotlight ", async () => {
			await testSpotlight(page, projectJSON.parameter_test, true, false);
		})
	})
};

export const testProjectAfterPersistence = async (page, url, id) => {
};


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

const testSpotlight = async (page) => {
	
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

	expect(
			await page.evaluate(async (input_area) => $(input_area).val(), ST.DRAWER_CMD_INPUT_SELECTOR)
	).toBe(expectedAutoComplete);
}

const testCanvasWidget = async (page, canvasObject) => {
	await page.evaluate(async (widgetCanvasObject) => {
		var canvasObject = null;
		if(widgetCanvasObject=="hhcell"){
			canvasObject = hhcell;
		}else if(widgetCanvasObject=="c302_A_Pharyngeal"){
			canvasObject = c302_A_Pharyngeal;
		}else if(widgetCanvasObject=="Balanced_240cells_36926conns"){
			canvasObject = Balanced_240cells_36926conns;
		}
		G.addWidget(6);
		GEPPETTO.ComponentFactory.addWidget('CANVAS', {name: '3D Canvas', id: "Canvas2"}, function () {this.setName('Widget Canvas');this.setPosition();this.display([canvasObject])});
		G.addWidget(1).then(w=>{w.setMessage("Hhcell popup").addCustomNodeHandler(function(){},'click');});
		$(".nextBtn").click();
		$(".nextBtn").click();
	}, canvasObject)
}