import React, { Component } from 'react';
import { SELECT } from 'geppetto-client/js/common/actions/actions';

var GEPPETTO = require('geppetto');
var Rnd = require('react-rnd').default;

export default class Test2 extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      instanceName: "no_DATA",
      error: undefined
    }
  }

  componentDidMount () {
    var that = this;
    GEPPETTO.EventManager.eventsCallback[GEPPETTO.EventManager.clientActions.SELECT].list.push(action => {
      if (GEPPETTO.EventManager.store.getState().client.instance_selected !== undefined) {
        console.log('la action pushata dentro l handler dal middleware e')
        console.log(action);
        that.setState({ instanceName: GEPPETTO.EventManager.store.getState().client.instance_selected.scope.name });
      }
    });
  }

  render () {
    return (
      <Rnd
        enableResizing={{
          top: true, right: true, bottom: true, left: true,
          topRight: true, bottomRight: true, bottomLeft: true,
          topLeft: true
        }}
        default={{
          x: 600, y: 250,
          height: 150,
          width: 150
        }}
        className="widgetTest"
        disableDragging={false}
        ref={e => {
          this.rnd = e;
        }}
        style={{ "backgroundColor": "#010101" }} >
        <div style={{ color: "white" }}>
          <p>{"I use GEPPETTO. EventManager. eventsCallBack"}</p>
          <p>{"PRE state triggered"}</p>
          {this.state.instanceName}
        </div>
      </Rnd>
      
    );
  }
}