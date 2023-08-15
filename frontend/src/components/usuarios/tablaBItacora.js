import React, { useRef, useState,useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Mensaje } from '../../components/mensajes';
import { Loader, Dimmer } from 'semantic-ui-react';
import useTable from "../../components/useTable"
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import { TableBody, TableRow, TableCell, InputAdornment } from '@material-ui/core';
import axios from "axios";
import moment from 'moment';


const BitacoraTabla = props => {

    let op = require('../../modulos/datos');
    let token = localStorage.getItem('jwtToken');
  const codigo = JSON.parse(localStorage.getItem("codigo"));


    const btnCancela = useRef();
    const [mostrar, setMostrar] = useState(false);
    const [titulo, setTitulo] = useState();
    const [msg, setMsg] = useState();
    const [activate, setActivate] = useState(false);
    const [records, setRecords] = useState([]);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })

    const headCells = [
        {
            id: "1",
            color: "rgba(5, 81, 130, 1)",
            label: "Acción",
            textAlign: "center",
          },
          {
            id: "2",
            color: "rgba(5, 81, 130, 1)",
            label: "Id",
            textAlign: "center",
          },
         
          {
            id: "3",
            color: "rgba(5, 81, 130, 1)",
            label: "Tabla",
            textAlign: "center",
          },

          {
            id: "3",
            color: "rgba(5, 81, 130, 1)",
            label: "Fecha",
            textAlign: "center",
          },

          {
            id: "3",
            color: "rgba(5, 81, 130, 1)",
            label: "Usuario",
            textAlign: "center",
          },
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
              if (    (x.descripcion !== null ? x.descripcion.toLowerCase().includes(target.value.toLowerCase()) : '')
             || (x.idregistro !== null ? String(x.idregistro).includes(target.value) : 0)
             || (x.idiglesia !== null ? String(x.idiglesia).includes(target.value) : 0)
            
                ||   (x.tabla !== null ? x.tabla.toLowerCase().includes(target.value.toLowerCase()) : '')
              /*   || (x.apellido !== null ? x.apellido.toLowerCase().includes(target.value.toLowerCase()) : '') */
  
              ) {
                return x;
              }
            });
        }
      })
  
    }

    const SeleccionarRegistros = () => {

        setActivate(true);
    
        let campos = "b.*, u.login";
        let nomtab = "bitacora as b, usuarios as u";
        let condi = "u.idusuario = b.idusuario and idiglesia=" + codigo;
        let orden = "fecha desc";
    
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
    
    useEffect(() => {
        SeleccionarRegistros()
   
       
      }, []);

    const seleccionarClase = (index) => (event) => {
        var ced = recordsAfterPagingAndSorting()[index].cedula;
        var nom = recordsAfterPagingAndSorting()[index].nombre;
        var ape = recordsAfterPagingAndSorting()[index].apellido;
        var cel = recordsAfterPagingAndSorting()[index].celular;
        var direc = recordsAfterPagingAndSorting()[index].direccion;
        blanquear();
        props.onHideCatalogo(ced, nom, ape, cel, direc);


    };

    return (
        
        <div style={{ height: "100%", width: "100%" }}>
        <div className="row col-md-12 py-4 px-2" style={{ margin: 0 }}>
          <div className="row col-md-8 mx-auto card py-4" style={{ margin: 0 }}>
            <div className="card-body col-md-12 py-3">
              <div className="col-12 p-2">
                <div className="col-12 row d-flex justify-content-between">
                  <h2 className="text-dark col-5 text-start"> Bitacora</h2>
                 
                 
                </div>
                <div className="row col-12 d-flex justify-content-between">
                  <input
                    type="text"
                    className=" col-3 form-control form-control-sm rounded-pill"
                  
                    onChange={handleSearch}
                    placeholder="Buscar"
                  />
                  <div className="col-3 d-flex justify-content-end">
                    
  
                  </div>
                </div>
              </div>
              <div className="col-md-12" style={{ margin: "auto" }}>
                <TblContainer>
                  <TblHead />
                  <TableBody>
                    {records &&
                      recordsAfterPagingAndSorting().map((item, index) => (
                        <TableRow key={index} style={{ padding: "0" }}>
                          <TableCell
                            className="align-baseline"
                            style={{ textAlign: "left", alignItems: "center" }}
                          >
                            {item.descripcion}
                          </TableCell>
                          <TableCell
                            className="align-baseline"
                            style={{
                              textAlign: "center",
                              alignItems: "center",
                              width: "270px",
                            }}
                          >
                            {item.idregistro}
                          </TableCell>
                          <TableCell
                            className="align-baseline"
                            style={{
                              textAlign: "center",
                              alignItems: "center",
                              width: "270px",
                            }}
                          >
                            {item.tabla}
                          </TableCell>
                          <TableCell
                            className="align-baseline"
                            style={{
                              textAlign: "center",
                              alignItems: "center",
                              width: "270px",
                            }}
                          >
                            {moment(item.fecha).format('DD-MM-YYYY')}
                          </TableCell>

                          <TableCell
                            className="align-baseline"
                            style={{
                              textAlign: "center",
                              alignItems: "center",
                              width: "270px",
                            }}
                          >
                           {item.login}
                          </TableCell>
                         
                         
  
                         
                        </TableRow>
                      ))}
                  </TableBody>
                </TblContainer>
                <TblPagination />
              </div>
            </div>
          </div>
        </div>
  
  
       
  
        <Dimmer active={activate} inverted>
          <Loader inverted>cargando...</Loader>
        </Dimmer>
       
      
      </div>
        
    );
}

export default BitacoraTabla;