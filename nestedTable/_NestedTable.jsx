import React from 'react';
import ReactDOM from 'react-dom';
import { Table } from 'antd';
import './style.css';

export default function NestedTable(props, context) {
  let eventsEmitter;
  const render = (text, record, index) => {
    const skipId = record.key + 'skip',
    overwriteId = record.key + 'overwrite',
    renameId = record.key + 'rename';

    return (
      <span className="table-operation">
        <input type="radio" id={skipId} name={record.key} onClick={() => {
          eventsEmitter(text, record, index);
          return void 0;
        }} />
        <label htmlFor={skipId}>跳过</label>

        { record.can_overwrite? 
            <input type="radio" id={overwriteId} name={record.key} onClick={() => {
              return void 0;
            }} />: 
            <input type="radio" id={overwriteId} name={record.key} disabled onClick={() => {
              return void 0;
            }} />
        }
        <label htmlFor={overwriteId}>覆盖</label>

        <input type="radio" id={renameId} name={record.key} onClick={() => {
          eventsEmitter(text, record, index);
          return void 0;
        }} />
        <label htmlFor={renameId}>重命名</label>
      </span>
    )
  };
  const renderExpanded = (text, record, index) => {

    const skipId = record.key + 'skip',
      overwriteId = record.key + 'overwrite',
      renameId = record.key + 'rename';

    return (
        <span className="table-operation">
          <input type="radio" id={skipId} name={record.key} onClick={() => {
            eventsEmitter(text, record, index);
            return void 0;
          }} />
          <label htmlFor={skipId}>跳过</label>

          { record.can_overwrite? 
              <input type="radio" id={overwriteId} name={record.key} onClick={() => {
                return void 0;
              }} />: 
              <input type="radio" id={overwriteId} name={record.key} disabled onClick={() => {
                return void 0;
              }} />
          }
          <label htmlFor={overwriteId}>覆盖</label>

          <input type="radio" id={renameId} name={record.key} onClick={() => {
            eventsEmitter(text, record, index);
            return void 0;
          }} />
          <label htmlFor={renameId}>重命名</label>
          
          <input 
            type="text" 
            style={{width: 130, heihgt: 24, border:'1px #ddd solid'}} 
            disabled />
        </span>
      );

  };
  
  eventsEmitter = (text, record, index) => {
    // console.log('fuck eventsEmitter',text, record, index);
  }

  const expandedRowRender = function(data) {
    return () => {
      const expandedColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
          title: 'Action',
          dataIndex: 'operation',
          key: 'operation',
          render: renderExpanded
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
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { 
      title: 'Action', 
      key: 'operation', 
      render: render
    },
  ];

  const data = [];

  const response = props.response || {
    "code": 0, 
    "message": "", 
    "status": 200, 
    "data": {
      "hdfsconnection": [{"name": "test_import_hdfs01", "can_overwrite": true}], 
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
        key: 'child_' + i + '_' + j,
        name: arr[j]['name'],
        can_overwrite: arr[j].can_overwrite
      });
      if (arr[j].can_overwrite === false) {
        console.log('fuck you:', false)
        can_overwrite = false;
      }
    }

    data.push({
      key: 'parent_' + i,
      name: i,
      can_overwrite: can_overwrite,
      children: children
    });
  };

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
      expandedRowRender={expandedRowRender(children)}
      columns={columns}
      dataSource={[obj]}
      
      expandRowByClick={false}
      pagination={false}
      showHeader={false}
    />
  });

  return (<div className="ctn">{children}</div>);
}