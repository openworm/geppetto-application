
import {
  testSingleComponentHHProject,
  testACNET2Project,
  testC302NetworkProject,
  testCa1Project,
  testPVDRNeuronProject,
  testPMuscleCellProject,
  testC302Connectome,
} from './NeuronalTestsLogic'
import { testDashboard } from "./functions";


describe('Test Neuronal Projects', () => {
  beforeAll(async () => {
    jest.setTimeout(600000);
    await jestPuppeteer.resetPage()

  });

  describe('Test Dashboard', () => testDashboard());
  describe('Single Component HH Project', () => testSingleComponentHHProject());
  describe('Acnet Project', () => testACNET2Project());

  describe('cElegansConnectome Project', () => testC302Connectome());


});
