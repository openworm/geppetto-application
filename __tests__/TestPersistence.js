const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');

import { getCommandLineArg, getUrlFromProjectUrl } from './cmdline.js';
import { wait4selector, click } from './utils';

import { testProject } from './persistence_functions';
import * as ST from './selectors';

const baseURL = getCommandLineArg('--url', 'http://localhost:8080/org.geppetto.frontend/');

describe('Test Persistence', () => {
	beforeAll(async () => {
		jest.setTimeout(60000);

		page.on("dialog", (dialog) => {
			dialog.accept();
		});

	});

	/**Tests Dashboard is present with all default projects**/
	describe('Test Dashboard and Login-In', () => {
		it("Load Dashboard", async () => {
			await page.goto(baseURL);
		})
		
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
		const PROJECT_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		it.each(PROJECT_IDS)('Project width id %i from persistence are present', async id => {
			wait4selector(page, `div[project-id="${id}"]`, { timeout: 60000})
		})
	})
})
describe('Test First Project Before Persisted', () => {
	testProject(page,baseURL, true, 1);
})

describe('Test First Project Before Persisted', () => {
	testProject(page,baseURL, false, 2);
})

describe('Test First Project Before Persisted', () => {
	testProject(page,baseURL, false, 3);
})