import React, { PropTypes } from 'react';

const propTypes = {
  id: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  text: PropTypes.string,
};

const defaultProps = {
  text: 'Hello World',
};

// Stateless component
function BlinkText(props) {
  return (
    <div className="blinker">{this.props.children}</div>
  );
}

class Link extends React.Component {
  static methodsAreOk() {
    return true;
  }

  render() {
    return <a href={this.props.url} data-id={this.props.id}>{this.props.text}</a>;
  }
}

Link.propTypes = propTypes;
Link.defaultProps = defaultProps;

export default Link;

/***************************************************************
Ordering for React.createClass
-----------------------------------------------------------------
  displayName
  propTypes
  contextTypes
  childContextTypes
  mixins
  statics
  defaultProps
  getDefaultProps
  getInitialState
  getChildContext
  componentWillMount
  componentDidMount
  componentWillReceiveProps
  shouldComponentUpdate
  componentWillUpdate
  componentDidUpdate
  componentWillUnmount
  clickHandlers or eventHandlers like onClickSubmit() or onChangeDescription()
  getter methods for render like getSelectReason() or getFooterContent()
  optional render methods like renderNavigation() or renderProfilePicture()
  render
******************************************************************/