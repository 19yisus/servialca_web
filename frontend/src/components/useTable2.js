import React, { useState } from 'react'
import { Table, TableHead, TableRow, TableCell, makeStyles } from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';

const useStyles = makeStyles(theme => ({
    table: {
        border:'1px solid #b1d3f4',
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
        maxHeight: '50vh',
    },
    celd: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontVariantCaps: 'all-small-caps',
    }
}))



export default function useTable(records, headCells, filterFn) {

    const classes = useStyles();

    const pages = [5, 10, 25, records.length]
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(pages[page])
    const [order, setOrder] = useState()
    const [orderBy, setOrderBy] = useState()

    const TblContainer = props => (
        <TableContainer className={classes.container}>
            <Table stickyHeader  className="table table-bordered table-striped" style={{border:'1px solid #b1d3f4'}}>
                {props.children}
            </Table>
        </TableContainer>
    )

     // Esta función se ejecutará cuando filterFn cambie
  useEffect(() => {
    setPage(0); // Cambiar la variable page a 0 cuando filterFn cambie de valor
  }, [filterFn]);


    const TblHead = props => {


        return (<TableHead>
            <TableRow>
                {
                    headCells.map(headCell => (
                        <TableCell key={headCell.id} className={classes.celd} >

                            {headCell.label}

                        </TableCell>))
                }
            </TableRow>
        </TableHead>)
    }


    const recordsAfterPagingAndSorting = () => {
        return records
    }

    return {
        TblContainer,
        TblHead,
        recordsAfterPagingAndSorting
    }
}