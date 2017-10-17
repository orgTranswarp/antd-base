import React from 'react';
import ReactDOM from 'react-dom';
import { DatePicker, message, Icon } from 'antd';

import PropTypes from 'prop-types';

import { TreeSelect } from 'antd';
const TreeNode = TreeSelect.TreeNode;

import 'babel-polyfill';
import { render } from 'react-dom';

const SHOW_ALL = TreeSelect.SHOW_ALL;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const SHOW_CHILD = TreeSelect.SHOW_CHILD;

const treeData = [{
  label: 'Node1-label',
  value: '0-0-val',
  key: '0-0-key',
  children: [{
    label: 'Child Node1',
    value: '0-0-1-val',
    key: '0-0-1-key',
  },{
    label: 'Child Node2',
    value: '0-0-2-val',
    key: '0-0-2-key',
/*    children: [{
      label: 'Child Child Node1',//ag1
      value: '0-0-0-1-val',//ag0
      key: '0-0-1-key',
    },{
      label: 'Child Child Node2',
      value: '0-0-0-2-val',
      key: '0-0-2-key',
    }]*/
  }],
}, {
  label: 'Node2',
  value: '0-1',
  key: '0-1',
  children: [{
    label: 'Child Node3',
    value: '0-1-0',
    key: '0-1-0',
  }, {
    label: 'Child Node4',
    value: '0-1-1',
    key: '0-1-1',
  }, {
    label: 'Child Node5',
    value: '0-1-2',
    key: '0-1-2',
  }],
}];

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    value: ''
    // {
    //   label: 'label',
    //   value: 'value'
    // },
  }
  onChange = (value) => {
    this.setState({ value });
  }

  render() {
    const tProps = {
      treeData,
      value: this.state.value,//.label,
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_ALL,
      searchPlaceholder: 'Please select',
      style: {
        width: 300,
      },
      // labelInValue: true
    };

    return (
      <div style={{ width: 700, margin: '100px auto' }}>
        <TreeSelect {...tProps} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
