const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');

import { getCommandLineArg, getUrlFromProjectUrl } from './cmdline.js';
import { wait4selector, click } from './utils';

import { testProjectAfterPersistence, testProjectBeforePersistence } from './persistence_functions';
import { getPersistenceProjectJSON } from './projects';
import * as ST from './selectors';

const baseURL = getCommandLineArg('--url', 'http://localhost:8080/org.geppetto.frontend/');

describe('Test Persistence', () => {
	beforeAll(async () => {
		jest.setTimeout(60000);

		console.log("persirtence ", baseURL)
		await page.goto(baseURL);
	});

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

		describe("Test First Project", () => {
			it("Open Single Component HH Project",  async () => {
				await page.goto(getUrlFromProjectUrl(project_1.url));
			})
			async () => {
				await testProjectBeforePersistence(page,project_1);				
			}
		})

		describe('Test First Project After Persisted',  () => {
			it("Open Single Component HH Project",  async () => {
				const persistedProjectID = await page.evaluate(async () => Project.getId())
				await page.goto(getUrlFromProjectUrl(project_1.url));
			})
			async () => {
				await testProjectAfterPersistence(page,project_1, persistedProjectID);				
			}
		})

		describe('Test Delete Project After Persisted', () => {
			it("Open Dashboard",  async () => {
				await page.goto(baseURL);
			})
			async () => {
				await testDeletePersistedProject(page,project_1, persistedProjectID);				
			}
		})
	})

})