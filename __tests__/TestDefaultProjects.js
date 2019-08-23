
import {
  testSingleComponentHHProject,
  testACNET2Project,
  testC302NetworkProject,
  testCa1Project,
  testPVDRNeuronProject,
  testPMuscleCellProject,
  testC302Connectome,
  //testCylindersProject,
  testPharyngealProject,
  testEyeWireProject
} from './NeuronalTestsLogic'
//import {testDashboard} from "./functions";


describe('Test Default Projects', () => {
  beforeAll(async () => {
    jest.setTimeout(200000);

  });
  //describe('Test Dashboard', () => testDashboard());
  describe('Single Component HH Project', () => testSingleComponentHHProject());
});

describe('Test Default Projects', () => {
	  beforeAll(async () => {
	    jest.setTimeout(200000);

	  });
	  //describe('Test Dashboard', () => testDashboard());
	  describe('C302 Network Project', () => testC302NetworkProject());
	  describe('Ca1 Project', () => testCa1Project());
	});

describe('Test Default Projects', () => {
	  beforeAll(async () => {
	    jest.setTimeout(200000);

	  });
	  describe('C302 Network Project', () => testC302NetworkProject());
	});

describe('Test Default Projects', () => {
	  beforeAll(async () => {
	    jest.setTimeout(200000);

	  });
	  describe('EyeWire Project', () => testEyeWireProject());
	});


describe('Test Default Projects', () => {
	  beforeAll(async () => {
	    jest.setTimeout(200000);

	  });
	  describe('Pharyngeal Project', () => testPharyngealProject());
	});

describe('Test Default Projects', () => {
	  beforeAll(async () => {
	    jest.setTimeout(200000);

	  });
	  describe('cElegansConnectome Project', () => testC302Connectome());

	});

describe('Test Default Projects', () => {
	  beforeAll(async () => {
	    jest.setTimeout(200000);

	  });
	  describe('cElegansMuscleModel Project', () => testPMuscleCellProject());
	  // describe('Cylinders Project', () => testCylindersProject());
	});

describe('Test Default Projects', () => {
	  beforeAll(async () => {
	    jest.setTimeout(200000);

	  });
	  describe('cElegansPVDR Project', () => testPVDRNeuronProject());
	  // describe('Cylinders Project', () => testCylindersProject());
	});

