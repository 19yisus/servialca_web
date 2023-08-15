import React, { useState } from 'react'
import { Table, TableHead, TableRow, TableCell, makeStyles, TablePagination, TableSortLabel } from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';

const useStyles = makeStyles(theme => ({
    table: {
        marginTop: theme.spacing(3),
        '& thead th': {
            fontWeight: '600',
            color: theme.palette.primary.main,
         /*    backgroundColor: theme.palette.primary.light, */
        },
        '& tbody td': {
            fontWeight: '300',
        },
        '& tbody tr:hover': {
            backgroundColor: '#fffbf2',
            cursor: 'pointer',
        }
    
    },
    root: {
        width: '100%',
      },
    container: {
        maxHeight: 440,
      },
}))


export default function useTable1(records, headCells,filterFn) {

    const classes = useStyles();

    const pages = [5, 10, 25, 50]
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(pages[page])
    
    const TblContainer1 = props => (
        <TableContainer className={classes.container}>
        <table  className="table tablet-responsive table-bordered table-striped">
            {props.children}
        </table>
        </TableContainer>
    )

    const TblHead1 = props => {

        return (<thead> 
            <tr>
                {
                     headCells.map(headCell => (
                        <th key={headCell.id} style={{ color: headCell.color, fontSize: headCell.fontSize, background: headCell.background, textAlign: headCell.textAlign, fontFamily: headCell.fontFamily, fontWeight: "bold"}} width={headCell.width}>
                           {headCell.label}
                        </th>))
                }
            </tr>
        </thead>)
    }

    const recordsAfterPagingAndSorting1 = () => {
        return filterFn.fn(records)
    }

    return {
        TblContainer1,
        TblHead1,
        recordsAfterPagingAndSorting1
    }
}

