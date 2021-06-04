global.jQuery = require("jquery");
global.GEPPETTO_CONFIGURATION = require('./GeppettoConfiguration.json');

jQuery(function () {
  require('@geppettoengine/geppetto-client-initialization');
  const React = require('react');
  const ReactDOM = require('react-dom');
  const Route = require('react-router-dom').Route;
  const Switch = require('react-router-dom').Switch;
  const Redirect = require('react-router-dom').Redirect;
  const Router = require('react-router-dom').BrowserRouter;
  const Application = require('./components/Application').default;
  const { Provider } = require('react-redux');
  const { createStore } = require("@geppettoengine/geppetto-client/common");

  const store = createStore(
    {},
    {},
    [],
    {}
  )

  ReactDOM.render(
    <Provider store={store}>
      <Router basename={GEPPETTO_CONFIGURATION.contextPath}>
        <Switch>
          <Route path="/geppetto" component={Application} />
          <Redirect from="/" to="/geppetto" />
        </Switch>
      </Router>
    </Provider>
    , document.getElementById('mainContainer'));
});
