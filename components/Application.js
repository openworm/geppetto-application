import React, { Component } from 'react';

import {
  Logo,
  Canvas,
  Console,
  Spotlight,
  SaveControl,
  ControlPanel,
  ExperimentsTable,
  SimulationControls
} from '@geppettoengine/geppetto-client/components/reduxConnector';

import Share from '@geppettoengine/geppetto-client/components/interface/share/Share';
import LinkButton from '@geppettoengine/geppetto-client/components/interface/linkButton/LinkButton';
import TabbedDrawer from '@geppettoengine/geppetto-client/components/interface/drawer/TabbedDrawer';
import ForegroundControls from '@geppettoengine/geppetto-client/components/interface/foregroundControls/ForegroundControls';
// import InjectUserReducer from './sub/InjectUserReducer';

// import Test2 from './sub/Test2';

// import Test3 from './sub/Test3';

// import TestContainer from './sub/TestContainer';

const Home = require('@geppettoengine/geppetto-client/components/interface/home/HomeButton');
var $ = require('jquery');
var GEPPETTO = require('geppetto');

require('../css/Application.less');

export default class Application extends Component {

  constructor (props) {
    super(props);

    this.state = {};

    this.voltage_color = this.voltage_color.bind(this);

    this.passThroughDataFilter = function (entities) {
      return entities;
    };

    this.reducerUnsubscriber = undefined;
  }

  voltage_color (x) {
    x = (x + 0.07) / 0.1; // normalization
    if (x < 0) {
      x = 0;
    }
    if (x > 1) {
      x = 1;
    }
    if (x < 0.25) {
      return [0, x * 4, 1];
    } else if (x < 0.5) {
      return [0, 1, (1 - (x - 0.25) * 4)];
    } else if (x < 0.75) {
      return [(x - 0.5) * 4, 1, 0];
    } else {
      return [1, (1 - (x - 0.75) * 4), 0];
    }
  }

  /* React functions */

  componentWillMount () {
    window.voltage_color = function (x) {
      return this.voltage_color(x);
    }.bind(this);
  }

  componentWillUnmount () {
    this.unsubscriber();
  }

  componentDidMount () {
    const applicationInitState = { application: {} }

    GEPPETTO.StoreManager.store.reduceManager.add("application",
      // The function here is the application reducer injected
      function (state = applicationInitState, action) {
        /*
         * console.log("the action arriving to the application reducer is:");
         * console.log(action);
         */
        return state;
      });

    GEPPETTO.G.setIdleTimeOut(-1);
    GEPPETTO.G.enableLocalStorage(false);

    if (this.refs.canvasRef !== undefined) {
      this.refs.canvasRef.getWrappedInstance().displayAllInstances();
    }

    if (this.refs.controlPanelRef !== undefined) {
      this.refs.controlPanelRef.getWrappedInstance().setDataFilter(this.passThroughDataFilter);
    }

    if (this.refs.spotlightRef !== undefined) {
      this.refs.spotlightRef.getWrappedInstance().addSuggestion(GEPPETTO.Spotlight.plotSample, GEPPETTO.Resources.PLAY_FLOW);
    }
  }

  render () {

    return (
      <div id='controls' style={{ height: '100%', width: '100%' }}>
        <Logo
          logo='gpt-gpt_logo'
          id="geppettologo" />

        <div id="github-logo">
          <LinkButton
            left={41}
            top={390}
            icon='fa fa-github'
            url='https://github.com/openworm/org.geppetto' />
        </div>

        <div id="HomeButton">
          <Home />
        </div>

        <div id="share-button">
          <Share />
        </div>

        <div id="SaveButton">
          <SaveControl />
        </div>

        <div id="sim-toolbar">
          <SimulationControls />
        </div>

        <div id="foreground-toolbar">
          <ForegroundControls dropDown={false} />
        </div>

        <div id="sim">
          <Canvas
            id="Canvas1"
            name={"Canvas"}
            ref="canvasRef" />
        </div>

        <div id="spotlight" style={{ top: 0 }}>
          <Spotlight ref="spotlightRef" icon={"styles.Modal"} />
        </div>

        <div id="controlpanel" style={{ top: 0 }}>
          <ControlPanel ref="controlPanelRef" icon={"styles.Modal"} enableInfiniteScroll={true}
            useBuiltInFilters={true} resultsPerPage={10} enablePagination={true} />
        </div>

        <div id="footer">
          <div id="footerHeader">
            <TabbedDrawer labels={["Console", "Experiments"]} iconClass={["fa fa-terminal", "fa fa-flask"]} >
              <Console id="Console" />
              <ExperimentsTable />
            </TabbedDrawer>
          </div>
        </div>
      </div>
    );
  }
}
