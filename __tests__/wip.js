import * as ST from './selectors'
import { click, wait4selector } from './utils';

const zoomClicks = 50;
const panClicks = 10;
const rotateClicks = 20;

export const resetCameraTest = async expectedCameraPosition => {
  await click(ST.PAN_HOME_BUTTON_SELECTOR);
  await testCameraPosition(expectedCameraPosition);
};


export const resetCameraTestWithCanvasWidget = async expectedCameraPosition => {
  await click(ST.PAN_HOME_BUTTON_SELECTOR);
  await page.evaluate(async selector => {
    $(selector).find(".position-toolbar").find(".pan-home").click();
  }, ST.CANVAS_2_SELECTOR);

  testCameraPosition(expectedCameraPosition);
};


export const testInitialControlPanelValues = async values => {
  await wait4selector(ST.CONTROL_PANEL_SELECTOR, { visible: true })
  const rows = await page.evaluate(async selector => $(selector).length, ST.STANDARD_ROW_SELECTOR);
  expect(rows).toEqual(values);
}


export const removeAllPlots = async () => {
  await page.evaluate(async selector => $(selector).remove(), ST.PLOTLY_SELECTOR);
  await page.waitFor(1000);
}


export const removeAllDialogs = async () => {
  await page.evaluate(async selector => $(selector).remove(), ST.DIALOG_SELECTOR);
}


export const testVisibility = async (variableName, buttonSelector) => {

  await testMeshVisibility(true, variableName);

  await click(buttonSelector);
  
  await testMeshVisibility(false, variableName);
  
  await click(buttonSelector);
  
  await testMeshVisibility(true, variableName);
  
}


export const testMeshVisibility = async (visible,variableName) => {
  expect(
    await page.evaluate(async variableName => Canvas1.engine.getRealMeshesForInstancePath(variableName)[0].visible, variableName)
  ).toBe(visible)

}


export const testCameraPosition = async expectedCamPosition => {
  const camPosition = await page.evaluate(async () => Canvas1.engine.camera.position.toArray());

  camPosition.forEach((value, index) => {
    expect(value).toBeCloseTo(expectedCamPosition[index], 2)
  })
}


export const getMeshColor = async (variableName, index = 0) => 
  await page.evaluate(async (variableName, index) => 
    Canvas1.engine.getRealMeshesForInstancePath(variableName)[index].material.color.toArray(), variableName, index)


export const test3DMeshColor = (testColor,variableName,index) => {
  const color = getMeshColor(variableName, index)
  expect(color).toEqual(testColor);
}


export const test3DMeshOpacity = async (opactityExpected, variableName, index = 0) => {
  expect(
    await page.evaluate((variableName, index) => Canvas1.engine.getRealMeshesForInstancePath(variableName)[index].material.opacity, variableName, index)
  ).toBe(opactityExpected)
}


export const test3DMeshColorNotEquals = async (testColor, variableName, index = 0) => {
  expect(
    await getMeshColor(variableName, index)
  ).not.toEqual(testColor);
}


export const testSelection = async (variableName, selectColorVarName) => {
  await click(ST.SPOT_LIGHT_BUTTON_SELECTOR);
 
  await wait4selector(ST.SPOT_LIGHT_SELECTOR, { visible: true });
   
  await page.focus(ST.SPOT_LIGHT_SEARCH_INPUT_SELECTOR);
  await page.keyboard.type(variableName);
  await page.keyboard.press(String.fromCharCode(13))
  
  await wait4selector(ST.BUTTON_ONE_SELECTOR, { visible: true });
  
  await click(ST.BUTTON_ONE_SELECTOR);
  await page.waitFor(500);

  test3DMeshColor([1, 0.8, 0], selectColorVarName, 0);
}


export const closeSpotlight = async () => {
  await page.evaluate(async selector => $(selector).hide(), ST.SPOT_LIGHT_SELECTOR)
}


export const testSpotlight = async (variableName,plotName,expectButton,testSelect, selectionName, selectColorVarName) => {  
  await click(ST.SEARCH_ICON_SELECTOR);

  await wait4selector(ST.SEARCH_ICON_SELECTOR, { visible: true });

  await page.focus(ST.SPOT_LIGHT_SEARCH_INPUT_SELECTOR);
  await page.keyboard.type(variableName);
  await page.keyboard.press(String.fromCharCode(13))
  
  await page.waitForSelector(ST.SEARCH_ICON_SELECTOR, { visible: true });

  if (expectButton) {
    await wait4selector(ST.PLOT_BUTTON_SELECTOR, { visible: true });
    await page.click("#plot");
    await wait4selector(plotName, { visible: true });

  } else {
    await page.waitFor(1000);
    await wait4selector(ST.PLOT_BUTTON_SELECTOR, { hidden: true });
    await wait4selector(ST.WATCH_BUTTON_SELECTOR, { hidden: true });
  }
  if (testSelect){
    testSelection(selectionName, selectColorVarName);
  }
}


export const testCameraControls = async expectedCameraPosition => {
  const scheduler = [
    [zoomClicks, ST.ZOOM_BUTTON_SELECTOR],
    [panClicks, ST.PAN_RIGHT_BUTTON_SELECTOR],
    [rotateClicks, ST.ROTATE_RIGHT_BUTTON_SELECTOR]
  ];

  for (const [ repetitions, selector ] of scheduler) {
    for (const i of Array(repetitions)) {
      await page.click(selector)
    }
    await resetCameraTest(expectedCameraPosition);
    console.log(selector)
  }
}


export const testCameraControlsWithCanvasWidget = expectedCameraPosition => {
  
  const scheduler = [
    [zoomClicks * 2, ST.ZOOM_BUTTON_SELECTOR, ST.ZOOM_BUTTON_CANVAS_2_SELECTOR],
    [panClicks * 2, ST.PAN_RIGHT_BUTTON_SELECTOR, ST.PAN_RIGHT_BUTTON_CANVAS_2_SELECTOR],
    [rotateClicks * 2, ST.ROTATE_RIGHT_BUTTON_SELECTOR, ST.ROTATE_RIGHT_BUTTON_CANVAS_2_SELECTOR]
  ];

  scheduler.forEach( ([repetitions, firstSelector, secondSelector]) => {
    Array(repetitions).forEach(async () => {
      await page.click(firstSelector);
      await page.click(secondSelector);
    })
    resetCameraTest(expectedCameraPosition);
  })
}


export const testVisualGroup = (variableName, expectedMeshes,expectedColors) => {
  
  Array(expectedMeshes).forEach(async (el, index) => {
    const color = await page.evaluate( (variableName, index) => Canvas1.engine.getRealMeshesForInstancePath(variableName)[index + 1].material.color.toArray(), variableName, index)
    test3DMeshColorNotEquals(color, variableName);
    test3DMeshColor(expectedColors[index], variableName, index + 1);
  })
}


export const testingConnectionLines = async expectedLines => {
  expect(
    await page.evaluate(() => Object.keys(Canvas1.engine.connectionLines).length)
  ).toBe(expectedLines);
}


export const testMoviePlayerWidget = async id => {
  await wait4selector('div[id="' + id + '"]');
  await wait4selector('iframe[id="widget6"]');
}


export const testPlotWidgets = async (widget, expectedGElements) => {
  await wait4selector(`div[id="${widget}"]`, { visible: true, timeout: 5000 }); 
  expect(
    await page.evaluate(async selector => $(selector)[0].getElementsByClassName("legendtoggle").length, `#${widget}`)
  ).toBe(expectedGElements)
}
