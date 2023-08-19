import React from 'react'
import { Table, TableHead, TableRow, TableCell } from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';

export default function useTableScroll(headCells) {

    const TblContainer = (props) => (
        <div  className='table-sm p-0 fixed rounded'  style={props.container}>
            <table className="table table-striped table-hover table-sm">
                {props.children}
            </table>
        </div>
    )

    const TblHead = () => {

        return (<thead style={{border: 'none'}}>
            <tr style={{border: 'none'}}>
                {
                    headCells.map((item, index) => (
                        <th  key={index} className='letra-tabla-th' style={{backgroundColor: '#007bff', fontWeight: 'bold', width: item.width, textAlign: item.textAlign}}>
                            {item.label}
                        </th>))
                }
            </tr>
        </thead>)
    }

    return {
        TblContainer,
        TblHead
    }
}

