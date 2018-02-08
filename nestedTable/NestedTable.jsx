import React from 'react';
import ReactDOM from 'react-dom';
import { Table } from 'antd';
import './style.css';

export default class NestedTable extends React.Component {
  
  state = {};

  constructor(props, context, updater) {
    super(props);
    this.expandedRowRender = this.expandedRowRender.bind(this);
    this.renderNormal = this.renderNormal.bind(this);
    this.renderExpanded = this.renderExpanded.bind(this);
    this.eventsEmitter = this.eventsEmitter.bind(this);
  }

  componentDidMount() {
    const list = this.getData();
    this.setState({
      data: list
    })
  }

  getData() {
    const data = [];
    const response = this.props.response || {
      "code": 0, 
      "message": "", 
      "status": 200, 
      "data": {
        "hdfsconnection": [
          {"name": "test_import_hdfs01", "can_overwrite": true},
          {"name": "test_import_hdfs02", "can_overwrite": true}
        ], 
        "database": [{"name": "test_import_hdfs02", "can_overwrite": true}], 
        "slice": [{"name": "test_import_hdfs03", "can_overwrite": true}], 
        "dataset": [{"name": "test_import_hdfs04", "can_overwrite": true}], 
        "dashboard": [{"name": "test_import_hdfs05", "can_overwrite": true}] 
      }
    };

    for (let i in response.data) {

      let arr = response.data[i];
      let obj = {};
      let children = [];
      let can_overwrite = true;

      for (var j=0; j<arr.length; j++){

        children.push({
          key: i + '_child_' + j,
          name: arr[j]['name'],
          can_overwrite: arr[j].can_overwrite
        });
        if (arr[j].can_overwrite === false) {
          console.log('fuck you:', false)
          can_overwrite = false;
        }
      }

      data.push({
        key: i + '_parent',
        name: i,
        can_overwrite: can_overwrite,
        children: children
      });
    };
    return data;
  }

  renderNormal(text, record, index) {
    const skipId = record.key + '_skip',
    overrideId = record.key + '_overwrite',
    renameId = record.key + '_rename';

    return (
      <span className="table-operation">
        <input 
          type="radio" 
          id={skipId} 
          name={record.key} 
          checked={true}
          onChange={_=> _}
        />
        <label htmlFor={skipId}>跳过</label>

        { record.can_overwrite? 
            <input 
              type="radio" 
              id={overrideId} 
              name={record.key} 
              onChange={(e) => {
                this.eventsEmitter(e, record, {
                  isSub: false,
                  index: 2
                });
              }}
            />: 
            <input 
              type="radio" 
              id={overrideId} 
              name={record.key} disabled 
              onChange={(e) => {
                this.eventsEmitter(e, record, {
                  isSub: false,
                  index: 2
                });
              }}
            />
        }
        <label htmlFor={overrideId}>覆盖</label>

        <input 
          type="radio" 
          id={renameId} 
          name={record.key} 
          onChange={(e) => {
            this.eventsEmitter(e, record, {
              isSub: false,
              index: 2
            });
          }}
        />
        <label htmlFor={renameId}>重命名</label>
      </span>
    )
  }

  renderExpanded(text, record, index) {

    const skipId = record.key + '_skip',
      overrideId = record.key + '_overwrite',
      renameId = record.key + '_rename';

    return (
        <span 
          className="table-operation" 
          onClick={(e) => {
            this.eventsEmitter(e, record, {
              isSub: true
            });
          }} 
        >
          <input 
            type="radio" 
            id={skipId} 
            name={record.key} 
            checked={true}
            onChange={_ => _}
            key="1" 
          />
          <label htmlFor={skipId}>跳过</label>

          { record.can_overwrite? 
              <input type="radio" id={overrideId} name={record.key} key="2" />: 
              <input type="radio" id={overrideId} name={record.key} disabled  key="2" />
          }
          <label htmlFor={overrideId}>覆盖</label>

          <input type="radio" id={renameId} name={record.key} key="3" />
          <label htmlFor={renameId}>重命名</label>
          
          <input 
            type="text" 
            style={{width: 130, heihgt: 24, border:'1px #ddd solid'}} 
            disabled 
            id={record.key}
          />
        </span>
      );
  }

  eventsEmitter(e, record, {
    index,
    isSub
  } = {
    index: 0,
    isSub: false
  }) {

    if(isSub) {
      document.querySelector('#' + record.key).disabled = (index === 3 ? false : true);
    } else {

    }
  }

  expandedRowRender = (data) => {
    return () => {
      const expandedColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
          title: 'Action',
          dataIndex: 'operation',
          key: 'operation',
          render: this.renderExpanded
        },
      ];

      return (
        <Table
          columns={expandedColumns}
          dataSource={data}

          pagination={false}
          showHeader={false}
        />
      );
    }
  }

  render() {
    const me = this;

    const data = this.state.data;

    if(!data) {
      return <div>no data !</div>
    } else {
      const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { 
          title: 'Action', 
          key: 'operation', 
          render: me.renderNormal
        },
      ];
      
      const children = data.map((object, key) => {
        let obj = {...object};
        let children = obj.children;

        // *******S: please notice that: wasted half day here*******
        // dataSource mustn't content a key children
        delete obj.children;
        // *******E: please notice that: wasted half day here*******

        return <Table
          key={key}
          className="components-table-demo-nested"
          expandedRowRender={me.expandedRowRender(children)}
          columns={columns}
          dataSource={[obj]}
          
          expandRowByClick={false}
          pagination={false}
          showHeader={false}
        />
      });

      return (<div className="ctn">{children}</div>);
    }

  }
}