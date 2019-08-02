
import {
  testSingleCompononetHHProject,
  testACNET2Project,
  testC302NetworkProject, testCa1Project,
  testPVDRNeuronProject
} from './NeuronalTestsLogic'


describe('Test UI Components', () => {
  beforeAll(async () => {
    jest.setTimeout(90000);
    
  });

  //describe('Single Component HH Project', () => testSingleCompononetHHProject());
  //describe('Acnet Project', () => testACNET2Project());
  //describe('C302 Network Project', () => testC302NetworkProject());
  //describe('Ca1 Project', () => testCa1Project());
  describe('PVDR Neuron Project', () => testPVDRNeuronProject());


  afterAll(async () => {
  })


});
