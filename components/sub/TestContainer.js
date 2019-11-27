import { connect } from 'react-redux';
import Test from './Test';

const mapStateToProps = state => ({
  instanceName: (state.client.selected !== undefined ? state.client.selected.scope.name : "no data selected"),
  error: state.client.error
});

const TestContainer = connect(mapStateToProps)(Test);

export default TestContainer;
