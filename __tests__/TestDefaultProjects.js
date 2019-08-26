
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
    jest.setTimeout(500000);

  });

  describe('Test Dashboard', () => testDashboard());
  describe('Single Component HH Project', () => testSingleComponentHHProject());
  describe('Acnet Project', () => testACNET2Project());
  describe('C302 Network Project', () => testC302NetworkProject());
  describe('Ca1 Project', () => testCa1Project());
  describe('EyeWire Project', () => testEyeWireProject());
  describe('Pharyngeal Project', () => testPharyngealProject());
  describe('cElegansConnectome Project', () => testC302Connectome());
  describe('cElegansMuscleModel Project', () => testPMuscleCellProject());
  describe('cElegansPVDR Project', () => testPVDRNeuronProject());
  describe('Cylinders Project', () => testCylindersProject());
});
