const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');

import { baseURL, getCommandLineArg, getUrlFromProjectUrl } from './cmdline.js';
import { wait4selector, click } from './utils';

import { 
	testProjectAfterPersistence,
	testProjectBeforePersistence	
} from './persistence_functions';
import { 
	getPersistenceProjectURL
} from './projects';
import * as ST from './selectors';

const baseURL = getCommandLineArg('--url', 'http://localhost:8080/org.geppetto.frontend/');

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
	})

	describe('Test First Project Before Persisted', () => {
		const project_1 = getPersistenceProjectJSON(1);
		
		it("Open Single Component HH Project",  () => {
			await page.goto(getUrlFromProjectUrl(project_1.url));
		})

		describe("Test First Project",  () => {
			await testProjectAfterPersistence(page,project_1);
		})

		describe('Test First Project After Persisted',  () => {
			await testProjectBeforePersistence(page,project_1);
		})
	})
	
})