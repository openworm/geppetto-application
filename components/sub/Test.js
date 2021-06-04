import React, { Component } from 'react';

var GEPPETTO = require('geppetto');
var Rnd = require('react-rnd').default;

export default class Test extends React.Component {

  constructor (props) {
    super(props);
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
          x: 400, y: 250,
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
          <p>{"I use the connect method provided by react-redux"}</p>
          <p>{"POST state triggered"}</p>
          {this.props.instanceName}
        </div>
      </Rnd>
      
    );
  }
}
