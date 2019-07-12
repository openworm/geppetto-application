const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');

import { getCommandLineArg, getUrlFromProjectId } from './cmdline.js';
import { wait4selector, click } from './utils';

import * as ST from './selectors';

const COLLAPSE_WIDGET_HEIGHT = 35;
const baseURL = getCommandLineArg('--url', 'http://live.geppetto.org');


describe('Test Geppetto Model', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    
    await page.goto(baseURL);
  });

  afterAll(async () => {
  })

  
  describe('Test Dashboard', () => {
    const PROJECT_IDS = [1, 3, 4, 5, 6, 8, 9, 16, 18, 58];
    it.each(PROJECT_IDS)('Project width id %i from core bundle are present', async id => {
      await page.waitForSelector(`div[project-id="${id}"]`);
    })
  })
})