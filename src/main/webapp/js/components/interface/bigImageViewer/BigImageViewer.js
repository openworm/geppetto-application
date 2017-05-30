define(function (require) {

	require("./BigImageViewer.less")

	var React = require('react');
	var OpenSeaDragon = require('openseadragon');
	var AbstractComponent = require('../../AComponent');

	return class BigImageViewer extends AbstractComponent {

		constructor(props) {
			super(props);
		}

		shouldComponentUpdate() {
			return false;
		}

		componentDidMount() {
			var viewer = OpenSeadragon({
				id: this.props.id + "_component",
				// FIXME: I have copied the images inside the images component folder. More info https://github.com/openseadragon/openseadragon/issues/792
				prefixUrl: "geppetto/js/components/interface/bigImageViewer/images/",
				tileSources: this.props.file,
				toolbar: "toolbarDiv",
				showNavigator: this.props.showNavigator
			})
		}

		render() {
			return (
				<div key={this.props.id + "_component"} id={this.props.id + "_component"} className="bigImageViewer">
					<div id="toolbarDiv" style={{ position: 'absolute', top: -1, left: -1, zIndex: 999 }}>
					</div>
				</div>
			)
		}
	};
});