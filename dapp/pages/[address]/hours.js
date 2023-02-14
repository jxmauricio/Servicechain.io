import React from 'react'
import { Table } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
function hours() {
  //function gets the days of the week and puts it in an array 
  const getWeek = ()=>{
    var curr = new Date();
    var first = curr.getDate()-curr.getDay();
    var last = first + 6;
    var firstday = new Date(curr.setDate(first)).toUTCString();
    var lastday = new Date(curr.setDate(last)).toUTCString();
    let datesOfWeek = []
    for (let i = 0;i<7;i+=1){
      datesOfWeek.push(new Date(curr.setDate(first+i)).toUTCString());
    }
    console.log(datesOfWeek);
  }
  getWeek()
  return (
    <div>
      <Table>
      <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Hours Worked</Table.HeaderCell>
        <Table.HeaderCell>Approve</Table.HeaderCell>
        <Table.HeaderCell>Deny</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    </Table>
    </div>
  )
}

export default hours;