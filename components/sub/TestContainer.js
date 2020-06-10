import { connect } from 'react-redux';
import Test from './Test';

const mapStateToProps = state => ({
  instanceName: (state.client.instance_selected !== undefined ? state.client.instance_selected.scope.name : "no data selected"),
  error: state.client.error
});

const TestContainer = connect(mapStateToProps)(Test);

export default TestContainer;
