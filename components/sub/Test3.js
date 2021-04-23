import React from 'react';
import Rnd from 'react-rnd';

var GEPPETTO = require('geppetto');

export default class Test3 extends React.Component {

  constructor (props) {
    super(props);
    
    this.state = {
      instanceName: "no_data",
      error: undefined
    }

    this.unsubscriber = undefined;
  }
    
  componentDidMount () {
    let currentValue = "no_data";

    var handleChange = action => {
      let previousValue = currentValue;
      if (GEPPETTO.StoreManager.store.getState().client.instance_selected !== undefined) {
        currentValue = GEPPETTO.StoreManager.store.getState().client.instance_selected.scope.name;
      }
      if (previousValue !== currentValue) {
        this.setState({ instanceName: currentValue });
      }
    }

    this.unsubscriber = GEPPETTO.StoreManager.store.subscribe(handleChange);
  }

  componentWillUnmount () {
    this.unsubscriber();
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
          x: 800, y: 250,
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
          <p>{"I use redux subscribe method."}</p>
          <p>{"POST state triggered"}</p>
          {this.state.instanceName}
        </div>
      </Rnd>
      
    );
  }
}
