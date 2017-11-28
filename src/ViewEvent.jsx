import React from 'react';
import PropTypes from 'prop-types';

export default class ViewEvent extends React.Component {
	static propTypes = {
		type: PropTypes.string.isRequired,
		resourceId: PropTypes.string.isRequired,

		context: PropTypes.any, //Array, or Promise that fulfills with Array
		rootContextId: PropTypes.string,

		children: PropTypes.any,
	}

	static contextTypes: {
		analyticsManager: PropTypes.object.isRequired
	}

	render () {
		return this.props.children || null;
	}
}
