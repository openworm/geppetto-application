const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');

import { getCommandLineArg, getUrlFromProjectId } from './cmdline.js';
import { wait4selector, click } from './utils';

import { 
	  testPlotWidgets, 
	  removeAllPlots, 
	  testCameraControls, 
	  testInitialControlPanelValues, 
	  testMeshVisibility,
	  testCameraControlsWithCanvasWidget
	} from './functions';
	
import * as ST from './selectors';

const COLLAPSE_WIDGET_HEIGHT = 35;

describe('Test Persistence', () => {
	beforeAll(async () => {
		jest.setTimeout(60000);

		await page.goto(getUrlFromProjectId(5));
	});

	afterAll(async () => {
	})
	
		/**Tests Dashboard is present with all default projects**/
	describe('Test Dashboard and Login-In', () => {
		it("Waiting for Geppetto Logo to appear on Landing Page", async () => {
			await wait4selector(page, ST.GEPPETTO_LOGO, { hidden: true , timeout: 60000})
		})

		it("Loging out", async () => {
			await page.goto(baseURL + "/org.geppetto.frontend/logout");
		})

		it("Login in as 'guest1' user", async () => {
			await page.goto(baseURL + "/org.geppetto.frontend/login?username=guest1&password=guest");
		})

		describe('Test Dashboard', () => {
			const PROJECT_IDS = [1, 2];
			it.each(PROJECT_IDS)('Project width id %i from persistence are present', async id => {
				wait4selector(page, `div[project-id="${id}"]`, { timeout: 60000})
			})
		})
	})
})