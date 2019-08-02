/**Default core projects**/
const CA1_PROJECT = 'CA1 Project';
const ACNET_PROJECT = 'ACNET Project';
const C_302_PROJECT = 'C 302 Project';
const NWB_PROJECT = 'NWB Sample Project';
const HH_CELL_PROJECT = 'HH Cell Project';
const EYE_WIRE_PROJECT = 'Eye wire Project';
const PHARYNGEAL_PROJECT = 'Pharyngeal Project';
const C_ELEGANS_PVDR_PROJECT = 'C-Elegans PVDR Project';
const C_ELEGANS_MUSCLE_PROJECT = 'C-Elegans Muscle Model Project';
const C_ELEGANS_CONNECTOME_PROJECT = 'C-Elegans Connectome Project';


export const getProjectNameById = id => {
  switch (id) {
  case 1:
    return HH_CELL_PROJECT;

  case 3:
    return CA1_PROJECT;

  case 4:
    return C_ELEGANS_MUSCLE_PROJECT;

  case 5:
    return ACNET_PROJECT;

  case 6:
    return C_302_PROJECT;

  case 8:
    return C_ELEGANS_PVDR_PROJECT;

  case 9:
    return EYE_WIRE_PROJECT;

  case 16:
    return C_ELEGANS_CONNECTOME_PROJECT;

  case 18:
    return NWB_PROJECT;

  case 58:
    return PHARYNGEAL_PROJECT;
  
  default:
    return '';
  }
};


const PERSISTENCE_PROJECT_1 = {
		name : "Hodgkin-Huxley Neuron",
		id : 1,
		test_name : "TEST 1",
		url : 'https://raw.githubusercontent.com/openworm/org.geppetto.samples/development/UsedInUnitTests/SingleComponentHH/project.json',
		console_tests : [ {input: 'hhcell.hhpop[0].v.getTi', expected: 'hhcell.hhpop[0].v.getTimeSeries()'}, {input: 'hhcell.isS', expected: 'hhcell.isSelected()'}],
		canvas_widget_object_test : "hhcell",
		parameter_test : 'Model.neuroml.pulseGen1.delay',
		recorded_variable_test : 'hhcell.hhpop[0].v',
		custom_handler_event : 'click'
}

const PERSISTENCE_PROJECT_2 = {
		name : "c302_A_Pharyngeal",
		id : 2,
		test_name : "TEST 2",
		url : 'https://raw.githubusercontent.com/openworm/org.geppetto.samples/development/UsedInUnitTests/pharyngeal/project.json',
		console_tests : [ {input: 'c302_A_Pharyngeal.isS', expected: 'c302_A_Pharyngeal.isSelected()'}],
		canvas_widget_object_test : "c302_A_Pharyngeal",
		parameter_test : 'Model.neuroml.generic_neuron_iaf_cell.C',
		recorded_variable_test : 'c302_A_Pharyngeal.M1[0].v',
		custom_handler_event : 'click'
}
const PERSISTENCE_PROJECT_3 =  {
		name : "Balanced_240cells_36926conns.net - net",
		id : 3,
		test_name : "TEST 3",
		url : 'https://raw.githubusercontent.com/openworm/org.geppetto.samples/development/UsedInUnitTests/balanced/project.json',
		console_tests : [{input: 'Balanced_240cells_36926conns.isS', expected: 'Balanced_240cells_36926conns.isSelected()'}],
		canvas_widget_object_test : "Balanced_240cells_36926conns",
		parameter_test : 'Model.neuroml.Balanced_240cells_36926conns.temperature',
		recorded_variable_test : 'Balanced_240cells_36926conns.popExc[0].biophys.membraneProperties.Na_all.Na.g',
		custom_handler_event : 'click'
}

export const getPersistenceProjectJSON = id => {
	switch (id) {
	case 1:
		return PERSISTENCE_PROJECT_1;
	case 2:
		return PERSISTENCE_PROJECT_2;
	case 3:
		return PERSISTENCE_PROJECT_3;

	default:
		return '';
	}
};	