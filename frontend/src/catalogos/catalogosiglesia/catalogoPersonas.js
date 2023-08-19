import React, { useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Mensaje } from '../../components/mensajes';
import { Loader, Dimmer } from 'semantic-ui-react';
import useTable from "../../components/useTable"
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import { TableBody, TableRow, TableCell, InputAdornment } from '@material-ui/core';
import axios from "axios";


const CatalogoPersona = props => {

    let op = require('../../modulos/datos');
    let token = localStorage.getItem('jwtToken');
    const codigo = JSON.parse(localStorage.getItem('codigo'))

    const btnCancela = useRef();
    const [mostrar, setMostrar] = useState(false);
    const [titulo, setTitulo] = useState();
    const [msg, setMsg] = useState();
    const [activate, setActivate] = useState(false);
    const [records, setRecords] = useState([]);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })

    const headCells = [
        { id: 'Cedula', label: <i style={{ color: "#1793dd", textAlign: 'center' }} className='fas fa-code'> Cedula</i>, textAlign: 'center', fontFamily: 'georgia' },
        { id: 'Nombre', label: <i style={{ color: "#1793dd", textAlign: 'center' }} className='fas fa-signature'> Nombre</i>, textAlign: 'center', fontFamily: 'georgia' },
        { id: 'Apellido', label: <i style={{ color: "#1793dd", textAlign: 'center' }} className='fas fa-code-branch'> Apellido</i>, textAlign: 'center', fontFamily: 'georgia' },
       
    ]

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
          fn: items => {
            if (target.value === "")
              return items;
            else
              return items.filter(x => {
                console.log(x.ced)
                console.log(typeof target.value)
                if (   (x.ced !== null ? String(x.ced).includes(target.value) : 0)
                
                  ||  (x.nombre !== null ? x.nombre.toLowerCase().includes(target.value.toLowerCase()) : '')
                  || (x.apellido !== null ? x.apellido.toLowerCase().includes(target.value.toLowerCase()) : '')
    
                ) {
                  return x;
                }
              });
          }
        })

    }

    const SeleccionarRegistros = () => {

        setActivate(true);

        let campos = '*';
        let nomtab = 'persona';
        let condi = 'cod_iglesia='+codigo;
        let orden = 'ced';
    
     
       
    
    
        let endpoint = `${op.conexion}/api/consulta/selecionarregistrocondi?&campos=${campos}&nomtab=${nomtab}&condi=${condi}&orden=${orden}`;
    
        axios.get(endpoint, {
          headers: {
            'x-access-token': `${token}`
          }
        }).then(function (response) {
    
          if (response.status == 200) {
            
            setActivate(false);
           
            setRecords(response.data)  
    
          }
    
        }).catch(function (error) {
    
            setTitulo("ERROR");
            setMsg(error.response.data.message)
            setMostrar(true)
            setActivate(false);
      
          })
      }


    const blanquear = () => {

        setMostrar(false);
        setTitulo('');
        setMsg('');
        setActivate(false);
        setRecords([]);
        setFilterFn({ fn: items => { return items; } });
    }


    const handleCloseMensa = () => {
        setMostrar(false);
    }

    const cancelar = () => {

        blanquear();
        props.onHideCancela();
    }


    const seleccionarClase = (index) => (event) => {
        var ced = recordsAfterPagingAndSorting()[index].ced;
      
        blanquear();
        props.onHideCatalogo(ced);


    };

    return (
        <Modal
            {...props}
            size="md"
            style={{ background: "rgb(28, 27, 23)" }}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            keyboard={false}
            onShow={() => {
                SeleccionarRegistros()
            }}
        >
            <Modal.Header style={{ backgroundColor: "#019cd5" }}>
                <Modal.Title style={{ color: "#fff" }}>Seleccionar Responsable.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/*   <Mensaje titulo={titulo} mensaje={msg}
                    show={mostrar}
                    onHide={handleCloseMensa} /> */}
                <Dimmer active={activate} inverted>
                    <Loader inverted>Cargando...</Loader>
                </Dimmer>
                <div className="col-md-12" style={{ marginBottom: "10px" }}>
                    <div className="row">
                        <div className="col-md-4">
                        <input type="text" className=" col-md-12 form-control form-control-sm rounded-pill"  onChange={handleSearch} placeholder="Buscar" />
                            
                        </div>
                    </div>
                </div>
                <div className="col-md-12" style={{ margin: "auto" }} >
                    <TblContainer >
                        <TblHead />

                        <TableBody>
                            {
                                records && recordsAfterPagingAndSorting().map((item, index) => (
                                    <TableRow key={item.idclaseminas} style={{ padding: "0" }} onClick={seleccionarClase(index)}>
                                        <TableCell style={{ fontSize: "10px", textAlign: "left", verticalAlign: "middle" }}>{item.ced}</TableCell>
                                        <TableCell style={{ fontSize: "10px", textAlign: "left", verticalAlign: "middle" }}>{item.nombre}</TableCell>
                                        <TableCell style={{ fontSize: "10px", textAlign: "left", verticalAlign: "middle" }}>{item.apellido}</TableCell>
                                        
                                    </TableRow>

                                ))
                            }
                        </TableBody>

                    </TblContainer>
                    <TblPagination />

                </div>
            </Modal.Body>
            <Modal.Footer className='container'>
                <button ref={btnCancela} onClick={cancelar} className="btn btn-sm btn-danger rounded-pill"><i className="fa"> Cancelar</i></button>
            </Modal.Footer>
        </Modal>
    );
}

export default CatalogoPersona;