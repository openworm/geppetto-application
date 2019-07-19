import * as ST from './selectors'
import { click, wait4selector } from './utils';

export const testProjectSequence= async (page) => {
	
};

export const testDeleteProject = async (page, url, id) => {
};

export const testReloadProject = async (page,) => {
};

export const testCreateExperiment = async (page) => {
};

export const testCloneExperiment = async (page) => {
};

export const testDeleteExperiment = async (page) => {
};

export const testSaveExperiment = async (page) => {
};

export const testSaveProject = async (page) => {
};

export const testExperimentTable = async (page) => {
};

export const testDownloadExperimentResults = async (page) => {
};

export const testDownloadExperimentModel = async (page) => {
};

export const testExperimentTableRow = async (page) => {
};

export const testConsole = async (page) => {
	await wait4selector(page, ST.TABBER_ANCHOR, { visible: true })
	await wait4selector(page, ST.DRAWER_SELECTOR, { visible : true})

	await page.evaluate(async () => {
		$('.fa-terminal').click();
	})
	await page.waitForSelector(ST.CONSOLE_SELECTOR, { visible: true });

	await page.waitFor(500);

	await testConsoleInputArea(page, 'hhcell.hhpop[0].v.getTi', 'hhcell.hhpop[0].v.getTimeSeries()')

	await testConsoleInputArea(page, 'hhcell.isS', 'hhcell.isSelected()')
	console.log("test console")
};

const testConsoleInputArea = async (page, input, expectedAutoComplete) => {
	await page.evaluate(async (value) => {
		$(ST.DRAWER_CMD_INPUT_SELECTOR).val(value);
		$(ST.DRAWER_CMD_INPUT_SELECTOR).trigger('keydown');
		console.log("value ", value)
	}, input)

	await page.waitFor(5000);

	expect(
			await page.evaluate(async (input_area) => $(input_area).val())
	).toBe(expectedAutoComplete))

	await page.focus(ST.DRAWER_CMD_INPUT_SELECTOR);
	await page.keyboard.type("");
	await page.keyboard.press(String.fromCharCode(13))
}