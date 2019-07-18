import {click, wait4selector, Projects} from "./utils";
import * as ST from "./selectors";
import {
    removeAllPlots,
    testCameraControls, testCameraControlsWithCanvasWidget,
    testInitialControlPanelValues,
    testMeshVisibility,
    testPlotWidgets
} from "./functions";
import {getUrlFromProjectId} from "./cmdline";
import { launchTest } from "./functions";

export function testSingleCompononetHHProject(){

    beforeAll(async() => {
        await page.goto(getUrlFromProjectId(Projects.HH_CELL));
    });

    describe('Landing page', () => {
        it("Spinner goes away", async () => {
            await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true })
        });

        it.each(ST.ELEMENTS_IN_LANDING_PAGE)('%s', async (msg, selector) => {
            await wait4selector(page, selector, { visible: true, timeout: 10000 })
        })
    });


    describe('Widgets', () => {
        it('Right amount of graph elements for Plot1', async () => {
            await wait4selector(page, ST.PLOT1_SELECTOR, { visible: true, timeout: 30000 });
            // watch out here (the labels in the plot appear a little after the plot)
            await page.waitFor(1500);
            await testPlotWidgets(page, "Plot1", 1);
        });

        it('Right amount of graph elements for Plot2', async () => {
            await testPlotWidgets(page, "Plot2", 3);
        });

        it('Initial amount of experiments for hhcell checked.', async () => {
            expect(
                await page.evaluate(async () => window.Project.getExperiments().length)
            ).toBe(1)
        });

        it('Top level instance present.', async () => {
            expect(
                await page.evaluate(async () => eval('hhcell') != null)
            ).toBeTruthy()
        });

        it('2 top Variables as expected for hhcell', async () => {
            expect(
                await page.evaluate(async () => window.Model.getVariables().map(v => v.getId()))
            ).toEqual(expect.arrayContaining(['hhcell', 'time']))
        });

        it('2 Libraries as expected for hhcell', async () => {
            expect(
                await page.evaluate(async () => window.Model.getLibraries() != undefined && window.Model.getLibraries().length == 2)
            ).toBeTruthy()
        });

        it('1 top level instance as expected for hhcell', async () => {
            expect(
                await page.evaluate(async () => window.Instances != undefined && window.Instances.length == 2 && window.Instances[0].getId() == 'hhcell')
            ).toBeTruthy()
        });

        it('Checking that time series length is 6001 in variable for hhcell project', async () => {
            expect(
                await page.evaluate(async () => eval('hhcell').hhpop[0].bioPhys1.membraneProperties.naChans.na.h.q.getTimeSeries().length == 6001)
            ).toBeTruthy()
        });

        it('REPEATED!! Right amount of graph elements for Plot1', async () => {
            await page.evaluate(async () => Plot1.plotData(eval('hhcell').hhpop[0].v));
            await testPlotWidgets(page, "Plot1", 1)
        });

        it('Remove data', async () => {
            await removeAllPlots(page, );
        });

        it('Camera controls', async () => {
            await testCameraControls(page, [0, 0, 30.90193733102435]);
        })

    });

    describe('Control Panel', () => {
        it('The control panel opened with right amount of rows.', async () => {
            await click(page, ST.CONTROL_PANEL_BUTTON);
            await testInitialControlPanelValues(page, 3);
        })
    });

    describe('Mesh', () => {
        it('Initial visibility correct', async () => {
            await testMeshVisibility(page, true, ST.HHCELL_SELECTOR);
        });

        it('Hide correct', async () => {
            await click(page, ST.HHCELL_CONTROL_PANEL_BUTTON_SELECTOR);
            await testMeshVisibility(page, false, ST.HHCELL_SELECTOR);
        });

        it('Visible again correct', async () => {
            await click(page, ST.HHCELL_CONTROL_PANEL_BUTTON_SELECTOR);
            await testMeshVisibility(page, true, ST.HHCELL_SELECTOR);
        })
    });

    describe('Plot from control panel', () => {
        it('Plot V.', async () => {
            await click(page, ST.STATE_VARIABLE_FILTER_BUTTON_SELECTOR);
            await click(page, ST.HHCELL_V_CONTROL_PANEL_BUTTON_SELECTOR);
            await wait4selector(page, ST.PLOT1_SELECTOR, { visible: true })
        });

        it('Remove all plots.', async () => {
            await click(page, ST.PROJECT_FILTER_BUTTON_SELECTOR);
            await removeAllPlots(page, );
        });

        it('Correct amount of rows for Global filter.', async () => {
            expect(
                await page.evaluate(async () => $(".standard-row").length)
            ).toBe(10);

            await page.evaluate(async selector => {
                $(selector).hide()
            }, ST.CONTROL_PANEL_CONTAINER_SELECTOR)
        })
    });


    describe('Spotlight', () => {
        it('Opens and shows correct butttons.', async () => {
            await click(page, ST.SPOT_LIGHT_BUTTON_SELECTOR);
            await wait4selector(page, ST.SPOT_LIGHT_SELECTOR, { visible: true });
        });

        it('Spotlight button exists', async () => {
            await page.focus(ST.SPOT_LIGHT_SEARCH_INPUT_SELECTOR);
            await page.keyboard.type(ST.HHCELL_V_SELECTOR);
            await page.keyboard.press(String.fromCharCode(13))
        });

        it('Spotlight button exists4', async () => {
            await page.waitForSelector(ST.SPOT_LIGHT_SELECTOR, { visible: true });
        });

        it('Plot visible', async () => {
            await click(page, ST.PLOT_BUTTON_SELECTOR);
            await wait4selector(page, ST.PLOT1_SELECTOR, { visible: true });
        });

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

    });

    describe('Tutorials', () => {
        it('Click tut button', async () => {
            if (await page.$(ST.TUTORIAL_BUTTON_SELECTOR) !== null){
                await click(page, ST.TUTORIAL_BUTTON_SELECTOR);
                await page.evaluate(async () => {
                    const nextBtnSelector = $(".nextBtn");
                    nextBtnSelector.click();
                    nextBtnSelector.click();
                })
            }
        })
    });


    describe('Widget canvas mesh', () => {
        it('Canvas widget has hhcell', async () => {
            expect(
                await page.evaluate(async selector => window.Canvas2.engine.getRealMeshesForInstancePath(selector).length, ST.HHCELL_SELECTOR)
            ).toBe(1)
        })
    });

    describe('Camera Controls on main Canvas and Canvas widget', () => {
        it('Canvas widget has hhcell', async () => {
            await testCameraControlsWithCanvasWidget(page, [0, 0, 30.90193733102435])
        }, 120000)
    });

    describe('Color Function', () => {
        it('More than one color function instance found.', async () => {
            const initialColorFunctions = await page.evaluate(async () => GEPPETTO.SceneController.getColorFunctionInstances().length);
            await page.evaluate(async () => {
                GEPPETTO.SceneController.addColorFunction(GEPPETTO.ModelFactory.instances.getInstance(GEPPETTO.ModelFactory.getAllPotentialInstancesEndingWith('.v'),false), window.voltage_color);
                Project.getActiveExperiment().play({ step:10 });
            });
            expect(
                await page.evaluate(async () => GEPPETTO.SceneController.getColorFunctionInstances().length)
            ).not.toBe(initialColorFunctions)
        })
    });

    describe('Widgets stored in View', () => {
        it('Reload page', async () => {
            /*
             * TODO? / FIXME? / OK?: I thought casper test was reloading the page at this point, but it is not.
             * await page.reload();
             */
            await wait4selector(page, ST.SPINNER_SELECTOR, { hidden: true })
        });

        it('Widgets stored in View state come up', async () => {
            await wait4selector(page, ST.CANVAS_2_DIV_SELECTOR, { visible: true });
            await wait4selector(page, ST.PLOT_1_DIV_SELECTOR, { visible: true });
            await wait4selector(page, ST.POPUP_1_DIV_SELECTOR, { visible: true });
            await wait4selector(page, ST.POPUP_2_DIV_SELECTOR, { visible: true })
        });

        describe('Tutorials', () => {
            it('Tutorial1 step restored correctly', async () => {
                if (await page.$(ST.TUTORIAL_BUTTON_SELECTOR) !== null){
                    await page.wait4selector(page, ST.TUTORIAL_1_DIV_SELECTOR, { visible: true });
                    expect(
                        await page.evaluate(async () => window.Tutorial1.state.currentStep)
                    ).toBe(2)
                }
            })
        });

        it('Popup1 message restored correctly.', async () => {
            expect(
                await page.evaluate(async selector => $(selector).html(), ST.POPUP_1_SELECTOR)
            ).toBe("Hhcell popup")
        });

        it('Popup2 custom handlers event restored correctly.', async () => {
            const popUpCustomHandler = await page.evaluate(async () => window.Popup2.customHandlers);
            expect(popUpCustomHandler.length).toBe(1);
            expect(popUpCustomHandler[0].event).toBe("click")
        });

        it('Canvas2 hhcell set correctly', async () => {
            expect(
                await page.evaluate(async selector => !!Canvas1.engine.meshes["hhcell.hhpop[0]"], ST.HHCELL_SELECTOR)
            ).toBeTruthy()
        })
    })
}

export function testACNET2Project() {

    beforeAll(async() => {
        await launchTest(Projects.ACNET);
    });

    describe('Primary Auditory Cortary', () => {
        it("Initial amount of experiments for ACNE2 checked", async () => {
            expect(
                await page.evaluate(async () => window.Project.getExperiments().length)
            ).toBe(2)
        });

        it('Top level instance present.', async () => {
            expect(
                await page.evaluate(async () => eval('acnet2') != null)
            ).toBeTruthy()
        });

        it("Instances exploded as expected", async () => {
            expect(
                await page.evaluate(async () => acnet2.baskets_12[3] !== undefined &&
                    acnet2.pyramidals_48[12] !== undefined)
            ).toBeTruthy();
        });

        it("bask and pyramidal connections check after resolveAllImportTypes() call", async () => {
            await page.evaluate(async () =>  Model.neuroml.resolveAllImportTypes(window.callPhantom));
            expect(
                await page.evaluate(async () => acnet2.baskets_12[9].getConnections().length===60 &&
                    acnet2.pyramidals_48[23].getConnections().length===22)
            ).toBeTruthy();
        });

        it("Test number of Visual Groups on pyramidals", async () => {
            expect(
                await page.evaluate(async () => acnet2.pyramidals_48[23].getVisualGroups().length)
            ).toBe(5);
        });

        it("2 top Variables as expected for ACNET2", async () => {
            expect(
                await page.evaluate(async () => window.Model.getVariables() !== undefined &&
                    window.Model.getVariables().length === 2 &&
                    window.Model.getVariables()[0].getId() === 'acnet2' &&
                    window.Model.getVariables()[1].getId() === 'time')
            ).toBeTruthy();
        });

        it("2 Libraries as expected for ACNET2", async () => {
            expect(
                await page.evaluate(async () => window.Model.getLibraries() !== undefined &&
                    window.Model.getLibraries().length === 2)
            ).toBeTruthy();
        });

        it("1 top level instance as expected for ACNET2", async () => {
            expect(
                await page.evaluate(async () => window.Instances !== undefined &&
                    window.Instances.length === 2 &&
                    window.Instances[0].getId() === 'acnet2')
            ).toBeTruthy();
        });

        it("Remove Plots", async () => {
            await removeAllPlots(page);
        });

/*        it('Camera controls', async () => {
            await testCameraControls(page, [231.95608349343888,508.36555704435455,1849.839]);
        })*/
    });

}
