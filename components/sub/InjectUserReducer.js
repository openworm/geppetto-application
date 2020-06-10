import React from 'react';
import Rnd from 'react-rnd';

var GEPPETTO = require('geppetto');

export default class InjectUserReducer extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      instanceName: "no_data",
      error: undefined
    }

    this.unsubscriber = undefined;
  }

  /*
   * componentDidMount () {
   *   const userInitState = { user: undefined }
   */

  /*
   *   GEPPETTO.StoreManager.store.reduceManager.add("test2",
   *     function (state = userInitState, action) {
   *       console.log('ue ue sono iniettato');
   *       console.log(action);
   *       return state;
   *     });
   * }
   */

  /*
   * componentWillUnmount () {
   *   this.unsubscriber();
   * }
   */

  render () {
    return (
      <Rnd
        enableResizing={{
          top: true, right: true, bottom: true, left: true,
          topRight: true, bottomRight: true, bottomLeft: true,
          topLeft: true
        }}
        default={{
          x: 500, y: 500,
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
          <p>{"Check my componentDidMount if you need a blue print to inject a reducer."}</p>
        </div>
      </Rnd>

    );
  }
}
