import * as ST from './selectors'
import { click, wait4selector } from './utils';

export const testProjectSequence= async (page) => {
	describe('Landing page', () => {
		it("Spinner goes away", async () => {
			await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true , timeout: 60000})
		})

		it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
			await wait4selector(page, selector, { visible: true, timeout: 60000 })
		})

		it('Initial Plot1 Created', async () => {
			await wait4selector(page, ST.PLOT1_SELECTOR, { visible: true, timeout: 30000 });
		})

	})
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
};