const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');

import { baseURL, getCommandLineArg, getUrlFromProjectUrl } from './cmdline.js';
import { wait4selector, click } from './utils';

import { 
	testConsole
	} from './functions';
	
import * as ST from './selectors';

const PERSISTENCE_PROJECT_1 = 'https://raw.githubusercontent.com/openworm/org.geppetto.samples/development/UsedInUnitTests/SingleComponentHH/GEPPETTO.json'
const PERSISTENCE_PROJECT_2 = 'https://raw.githubusercontent.com/openworm/org.geppetto.samples/development/UsedInUnitTests/pharyngeal/project.json'
const PERSISTENCE_PROJECT_3 =  'https://raw.githubusercontent.com/openworm/org.geppetto.samples/development/UsedInUnitTests/balanced/project.json'
		
describe('Test Persistence', () => {
	beforeAll(async () => {
		jest.setTimeout(60000);
		
		console.log("persirtence ", baseURL)
		await page.goto(baseURL);
	});

	afterAll(async () => {
	})
	
		/**Tests Dashboard is present with all default projects**/
	describe('Test Dashboard and Login-In', () => {
		it("Waiting for Geppetto Logo to appear on Landing Page", async () => {
			await wait4selector(page, ST.GEPPETTO_LOGO, { hidden: true , timeout: 60000})
		})

		it("Loging out", async () => {
			await page.goto(baseURL + "/logout");
		})

		it("Login in as 'guest1' user", async () => {
			await page.goto(baseURL + "/login?username=guest1&password=guest");
		})
	})

	describe('Test Dashboard', () => {
		const PROJECT_IDS = [1, 2];
		it.each(PROJECT_IDS)('Project width id %i from persistence are present', async id => {
			wait4selector(page, `div[project-id="${id}"]`, { timeout: 60000})
		})

		it("Open Single Component HH Project", async () => {
			await page.goto(getUrlFromProjectUrl(PERSISTENCE_PROJECT_1));
		})
	})

	describe('Test First Persistence Project', () => {
		describe('Landing page', () => {
			it("Spinner goes away", async () => {
				await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true , timeout: 60000})
			})

			it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
				await wait4selector(page, selector, { visible: true, timeout: 60000 })
			})
		})
		
		describe('Test Console', () => {
			it("Spinner goes away", async () => {
		          await testConsole(page);
			})
		})
	})
})