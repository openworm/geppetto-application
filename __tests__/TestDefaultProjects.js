
import {
  testSingleComponentHHProject,
  testACNET2Project,
  testC302NetworkProject,
  testCa1Project,
  testPVDRNeuronProject,
  testPMuscleCellProject,
  testC302Connectome,
  testCylindersProject
} from './NeuronalTestsLogic'


describe('Test Default Projects', () => {
  beforeAll(async () => {
    jest.setTimeout(200000);

  });

  //describe('Single Component HH Project', () => testSingleComponentHHProject());
  //describe('Acnet Project', () => testACNET2Project());
  //describe('C302 Network Project', () => testC302NetworkProject());
  //describe('Ca1 Project', () => testCa1Project());


  //describe('cElegansConnectome Project', () => testC302Connectome());
  describe('cElegansMuscleModel Project', () => testPMuscleCellProject());
  //describe('cElegansPVDR Project', () => testPVDRNeuronProject());
  //describe('Cylinders Project', () => testCylindersProject());


  afterAll(async () => {
  })


});
