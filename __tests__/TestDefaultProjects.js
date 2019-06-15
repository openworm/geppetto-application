const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');

import { getCommandLineArg, getUrlFromProjectId } from './cmdline.js';
import { wait4selector, click } from './utils';
import { 
  testPlotWidgets, 
  removeAllPlots, 
  testCameraControls, 
  testInitialControlPanelValues, 
  testMeshVisibility,
  testSpotlight
} from './wip';
import * as ST from './selectors';

const COLLAPSE_WIDGET_HEIGHT = 35;
const baseURL = getCommandLineArg('--url', 'http://localhost:8080/org.geppetto.frontend');


describe('Test UI Components', () => {

  beforeAll(async () => {
    jest.setTimeout(30000);
    await page.goto(getUrlFromProjectId(1));
  });

  afterAll(async () => {
  })

  describe('Single Component HH Project', () => {
    
    describe('Landing page', () => {
      it("Spinner goes away", async () => {
        await wait4selector(ST.SPINNER_SELECTOR, { hidden: true })
      })
      
      it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
        await wait4selector(selector, { visible: true })
      })
    })


    describe('Widgets', () => {
      it('Right amount of graph elements for Plot1', async () => {
        await wait4selector('div[id="Plot1"]', { visible: true, timeout: 5000 }); 
        await page.waitFor(1000);
        await testPlotWidgets("Plot1", 1);
      })

      it('Right amount of graph elements for Plot2', async () => {
        await testPlotWidgets("Plot2", 3);
      })

      it('Initial amount of experiments for hhcell checked.', async () => {
        expect(
          await page.evaluate(async () => window.Project.getExperiments().length)
        ).toBe(1)
      })

      it('Top level instance present.', async () => {
        expect(
          await page.evaluate(async () => eval('hhcell') != null)
        ).toBeTruthy()
      })

      it('2 top Variables as expected for hhcell', async () => {
        expect(
          await page.evaluate(async () => window.Model.getVariables().map(v => v.getId()))
        ).toEqual(expect.arrayContaining(['hhcell', 'time']))
      })

      it('2 Libraries as expected for hhcell', async () => {
        expect(
          await page.evaluate(async () => window.Model.getLibraries() != undefined && window.Model.getLibraries().length == 2)
        ).toBeTruthy()
      })

      it('1 top level instance as expected for hhcell', async () => {
        expect(
          await page.evaluate(async () => window.Instances != undefined && window.Instances.length == 2 && window.Instances[0].getId() == 'hhcell')
        ).toBeTruthy()
      })

      it('Checking that time series length is 6001 in variable for hhcell project', async () => {
        expect(
          await page.evaluate(async () => eval('hhcell').hhpop[0].bioPhys1.membraneProperties.naChans.na.h.q.getTimeSeries().length == 6001)
        ).toBeTruthy()
      })

      it('REPEATED!! Right amount of graph elements for Plot1', async () => {
        await page.evaluate(async () => Plot1.plotData(eval('hhcell').hhpop[0].v))
        await testPlotWidgets("Plot1", 1)
      })

      it('Remove data', async () => {
        await removeAllPlots();
      })

      it('Camera controls', async () => {
        await testCameraControls([0, 0, 30.90193733102435]);
      })

    })

    describe('Control Panel', () => {
      it('The control panel opened with right amount of rows.', async () => {
        await click(ST.CONTROL_PANEL_BUTTON);
        await testInitialControlPanelValues(3);
      })
    })

    describe('Mesh', () => {
      it('Initial visibility correct', async () => {
        await testMeshVisibility(true, ST.HHCELL_SELECTOR);
      })
      it('Hide correct', async () => {
        await click(ST.HHCELL_CONTROL_PANEL_BUTTON_SELECTOR);
        await testMeshVisibility(false, ST.HHCELL_SELECTOR);
      })
      it('Visible again correct', async () => {
        await click(ST.HHCELL_CONTROL_PANEL_BUTTON_SELECTOR);
        await testMeshVisibility(true, ST.HHCELL_SELECTOR);
      })
    })

    describe('Plot from control panel', () => {
      it('Plot V.', async () => {
        await click(ST.STATE_VARIABLE_FILTER_BUTTON_SELECTOR)
        await click(ST.HHCELL_V_CONTROL_PANEL_BUTTON_SELECTOR)
        await wait4selector(ST.PLOT1_SELECTOR, { visible: true })
      })
      
      it('Remove all plots.', async () => {
        await click(ST.PROJECT_FILTER_BUTTON_SELECTOR);
        removeAllPlots();
      })

      it('Correct amount of rows for Global filter.', async () => {
        expect(
          await page.evaluate(async () => $(".standard-row").length)
        ).toBe(10)

        await page.evaluate(async selector => {
          $(selector).hide()
        }, ST.CONTROL_PANEL_CONTAINER_SELECTOR)
      })
    })


    describe('Spotlight', () => {
      it('Opens and shows correct butttons.', async () => {
        await click(ST.SPOT_LIGHT_BUTTON_SELECTOR);
        await wait4selector(ST.SPOT_LIGHT_SELECTOR, { visible: true });
      })

      it('Spotlight button exists', async () => {
        await page.focus(ST.SPOT_LIGHT_SEARCH_INPUT_SELECTOR);
        
      })
      it('Spotlight button exists2', async () => {
        
        await page.keyboard.type(ST.HHCELL_V_SELECTOR);
        
      })
      it('Spotlight button exists3', async () => {
        
        await page.keyboard.press(String.fromCharCode(13))
        
      })
      it('Spotlight button exists4', async () => {
        
        await page.waitForSelector(ST.SPOT_LIGHT_SELECTOR, { visible: true });
      })

      it('Plot visible', async () => {
        await click(ST.PLOT_BUTTON_SELECTOR);
        await wait4selector(ST.PLOT1_SELECTOR, { visible: true });
      })

      it('Close', async () => {
        await page.evaluate(async selector => $(selector).hide(), ST.SPOT_LIGHT_SELECTOR);
        await page.evaluate(async () => {
          const instance = eval('hhcell');
          GEPPETTO.ComponentFactory.addWidget('CANVAS', { name: '3D Canvas', id: "Canvas2" }, function () {
            this.setName('Widget Canvas');this.setPosition();this.display([instance])
          });
          Plot1.setPosition(0,300);
          G.addWidget(1).then(w => {
            w.setMessage("Hhcell popup");
          });
          G.addWidget(1).then(w => {
            w.setMessage("Hhcell popup 2").addCustomNodeHandler(function (){},'click');
          });
        })
      })
    
    })


    /*
     *   casper.then(function () {
     *     // toggle tutorial if tutorial button exists
     *     if (casper.exists('#tutorialBtn')){
     *       casper.mouseEvent('click', 'button#tutorialBtn', "attempting to open tutorial");
     *       // click on next step for Tutorial
     *       casper.evaluate(function () {
     *         var nextBtnSelector = $(".nextBtn");
     *         nextBtnSelector.click();
     *         nextBtnSelector.click();
     *       });
     *     }
     *   });
     */

    /*
     *   casper.then(function () {
     *     // tests widget canvas has mesh
     *     var mesh = casper.evaluate(function (){
     *       var mesh = Canvas2.engine.getRealMeshesForInstancePath("hhcell.hhpop[0]").length;
     *       return mesh;
     *     });
     *     test.assertEquals(mesh, 1, "Canvas widget has hhcell");
     *   });
     */

    /*
     *   casper.then(function (){	
     *     casper.echo("-------Testing Camera Controls on main Canvas and Canvas widget--------");
     *     testCameraControlsWithCanvasWidget(test, [0,0,30.90193733102435]);
     *   });
     */

    /*
     *   // test color Function
     *   casper.then(function (){
     *     var initialColorFunctions = casper.evaluate(function (){
     *       return GEPPETTO.SceneController.getColorFunctionInstances().length;
     *     });
     *     casper.echo("-------Testing Color Function--------");
     *     // add color Function
     *     casper.evaluate(function (){
     *       GEPPETTO.SceneController.addColorFunction(GEPPETTO.ModelFactory.instances.getInstance(GEPPETTO.ModelFactory.getAllPotentialInstancesEndingWith('.v'),false), window.voltage_color);
     *       Project.getActiveExperiment().play({ step:10 });
     *     });
     *     var colorFunctionInstances = casper.evaluate(function (){
     *       return GEPPETTO.SceneController.getColorFunctionInstances().length;
     *     });
     *     test.assertNotEquals(initialColorFunctions,colorFunctionInstances, "More than one color function instance found");
     *     // test3DMeshColorNotEquals(test,defaultColor,"hhcell.hhpop[0]");
     *     casper.echo("Done Playing, now exiting");
     *   });
     */

    /*
     *   // reload test, needed for testing view comes up
     *   casper.then(function (){
     *     launchTest(test,"Hhcell",30000);
     *   });
     */

    /*
     *   // testing widgets stored in View state come up
     *   casper.then(function (){
     *     test.assertVisible('div#Canvas2', "Canvas2 is correctly open on reload.");
     *     test.assertVisible('div#Plot1', "Plot1 is correctly open on reload");
     *     test.assertVisible('div#Popup1', "Popup1 is correctly open on reload");
     *     test.assertVisible('div#Popup2', "Popup2 is correctly open on reload");
     */

    /*
     *     // if tutorial button exists, tests existence of Tutorial
     *     if (casper.exists('#tutorialBtn')){
     *       test.assertVisible('div#Tutorial1', "Tutorial1 is correctly open on reload");
     *       var tutorialStep = casper.evaluate(function () {
     *         return Tutorial1.state.currentStep;
     *       });
     *       test.assertEquals(tutorialStep, 2, "Tutorial1 step restored correctly");
     *     }
     *     // Tests content of Popup1 
     *     var popUpMessage = casper.evaluate(function () {
     *       return $("#Popup1").html();
     *     });
     *     test.assertEquals(popUpMessage, "Hhcell popup", "Popup1 message restored correctly");
     */

    /*
     *     // Tests popup has custom handlers
     *     var popUpCustomHandler = casper.evaluate(function () {
     *       return Popup2.customHandlers;
     *     });
     *     test.assertEquals(popUpCustomHandler.length, 1, "Popup2 custom handlers restored correctly");
     *     test.assertEquals(popUpCustomHandler[0]["event"], "click", "Popup2 custom handlers event restored correctly");
     */

    /*
     *     // Test canvas widget has mesh 
     *     var meshInCanvas2Exists = casper.evaluate(function () {
     *       var mesh = Canvas1.engine.meshes["hhcell.hhpop[0]"];
     *       if (mesh != null && mesh != undefined){
     *         return true;
     *       }
     *       return false;
     *     });
     *     test.assertEquals(meshInCanvas2Exists, true, "Canvas2 hhcell set correctly");
     *   })
     * }
     */
  })

})
