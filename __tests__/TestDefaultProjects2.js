
import {
  testSingleComponentHHProject,
  testACNET2Project,
  testC302NetworkProject,
  testCa1Project,
  testPVDRNeuronProject,
  testPMuscleCellProject,
  testC302Connectome,
  testCylindersProject,
  testPharyngealProject,
  testEyeWireProject
} from './NeuronalTestsLogic'
import {testDashboard} from "./functions";


describe('Test Default Projects', () => {
  beforeAll(async () => {
    jest.setTimeout(600000);
    await jestPuppeteer.resetPage()
  });
  describe('Test Dashboard', () => testDashboard());
  describe('Single Component HH Project', () => testSingleComponentHHProject());
  describe('Acnet Project', () => testACNET2Project());
  describe('cElegansMuscleModel Project', () => testPMuscleCellProject());
  describe('cElegansPVDR Project', () => testPVDRNeuronProject());

  //describe('Cylinders Project', () => testCylindersProject());


});
