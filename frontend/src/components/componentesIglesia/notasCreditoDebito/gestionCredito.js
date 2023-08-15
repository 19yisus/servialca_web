import React, { useState, useEffect, useRef } from 'react';
import { TableBody, TableRow, TableCell, InputAdornment } from '@material-ui/core';
import { Loader, Dimmer } from 'semantic-ui-react';
import { Search } from "@material-ui/icons";
import axios from 'axios';
/* import { Dona, Torta } from '../graficos/graficos'; */
/* import CartasAgentes from './cartasAgentes'; */
import { Mensaje, MensajeSiNo } from '../../mensajes';
/* import { GestionarExpendedor } from './modalExpendedor'; */
import useTable from "../../useTable";

import { formatMoneda } from '../../../util/varios';
import { ModalCredito } from './modalGestionCredito';
import moment from 'moment'

const NotasdeCredito = (props) => {

  var op = require('../../../modulos/datos');
  let token = localStorage.getItem('jwtToken');
  const codigo = JSON.parse(localStorage.getItem('codigo'))
  const permiso = JSON.parse(localStorage.getItem('permiso'))
  let el;
  let municipios = [];
  

  const headCells = [
    { id: 'ced', color: 'rgba(5, 81, 130, 1)', label: 'Fecha', textAlign: 'center' },
    { id: 'ced', color: 'rgba(5, 81, 130, 1)', label: 'Rerencia', textAlign: 'center' },
    { id: 'nombre', color: 'rgba(5, 81, 130, 1)', label: 'Concepto', textAlign: 'center' },
    { id: 'ape', color: 'rgba(5, 81, 130, 1)', label: 'Monto', textAlign: 'center' },
     { id: 'ape', color: 'rgba(5, 81, 130, 1)', label: 'Opcion', textAlign: 'center' },
   
  ]

  const colores = [
    '#17a2b8',
    '#ffae00',
    '#dc3545',
    '#BDB76B',
    '#7B68EE',
    '#4B0082',
    '#00ffff',
    '#0080ff',
    '#0000ff',
    '#8000ff',
    '#ff00ff',
    '#ff0080',
  ];

  const [mensaje, setMensaje] = useState({mostrar: false, titulo: '', texto: '', icono: ''});
  const [mensajesino, setMensajesino] = useState({mostrar: false, titulo: '', texto: '', icono: ''});
  const txtBuscador = useRef();
  const [cuentas, setCuentas] = useState();
  const [saldo, setSaldo] = useState(0.00)
  const [mostrar, setMostrar] = useState(false);
  const [mostrar4, setMostrar4] = useState(false);
  const [titulo1, setTitulo1] = useState();
  const [msg1, setMsg1] = useState();
  const [activate, setActivate] = useState(false);
  const [records, setRecords] = useState([]);
  const [expendedor, setExpendedor] = useState([]);
  const [operacion, setOperacion] = useState(1);
  const [btnAgre, setBtnAgre] = useState(true)
  const [persona, setPersona] = useState()
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const [ciudades, setCiudades] = useState()
  const [credito, setCredito] = useState();
  const [total, setTotal] = useState(0);
  const [activos, setActivos] = useState(0);
  const [inactivos, setInactivos] = useState(0);
  const [municipiosEx, setMunicipiosEx] = useState([]);
  const [municipiosData, setMunicipiosData] = useState([]);
  const [iglesia, setIglesia] = useState()
  const [notaDebito, setNotaDebito] = useState()
  const [estado,setEstado] = useState()
  const [idcuentabancaria, setIdCuentaBancaria] = useState('')
  const [datos, setDatos] = useState([]);

  const {
    TblContainer,
    TblHead,
    recordsAfterPagingAndSorting,
    TblPagination
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
            if (    (x.concptocredito !== null ? x.concptocredito.toLowerCase().includes(target.value.toLowerCase()) : '')
            
              ||   (x.referencia !== null ? x.referencia.toLowerCase().includes(target.value.toLowerCase()) : '')
            /*   || (x.apellido !== null ? x.apellido.toLowerCase().includes(target.value.toLowerCase()) : '') */

            ) {
              return x;
            }
          });
      }
    })

  }

  function menuclick() {
    if (el = document.getElementById("wrapper")) {
      el.classList.add("toggled");
    }
  }


  const seleccionarCuentasBancarias = () => {
   
    let campos = '*';
    let nomtab = 'cuentabancaria';
    let nomid = 'agente';
    let nomid2 = 'tipoagente'
    let orden = 'idcuentabancaria'


      let endpoint = `${op.conexion}/api/consulta/idsstring2rows?campos=${campos}&nomtab=${nomtab}&nomid=${nomid}&nomid2=${nomid2}&id=${codigo}&id2=${permiso.toString().trim()}&orden=${orden} `
      setActivate(true);

    axios
      .get(endpoint, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
         
          setCuentas(response.data);


        }
    

        setActivate(false);
      })
      .catch(function (error) {
        setMensaje({ mostrar: true, titulo: 'Error', texto: error.response.data.message, icono: 'error' });
        setActivate(false);
      });
  };

  const seleccionarNotasCredito = (id) => {
    let campos = '*';
    let nomtab = "nota_credito";
    let orden = "fechacredito desc";
    let condi = ' idcuentabancaria = ' + id;
  


    let endpoint =
      op.conexion +
      `/api/consulta/selecionarregistrocondi?campos=${campos}&nomtab=${nomtab}&condi=${condi}&orden=${orden}`;
    console.log(endpoint)
    setActivate(true);

    axios
      .get(endpoint, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
         

          console.log(response.data)
          setRecords(response.data)

         
        }


        setActivate(false);
      })
      .catch(function (error) {
        setMensaje({ mostrar: true, titulo: 'Error', texto: error.response.data.message, icono: 'error' });
        setActivate(false);
      });
  };

  const seleccionarNota = (id)  => {


    let campos = '*';
    let nomtab = 'nota_credito';
    let nomid = 'idnotacredito';
  
    setBtnAgre(false)
  
    let endpoint = `${op.conexion}/api/consulta/modeli?campos=${campos}&id=${parseInt(id)}&nomtab=${nomtab}&nomid=${nomid}`;
    setActivate(true);
  
    axios.get(endpoint, {
        headers: {
            'x-access-token': `${token}`
        }
    }).then(function (response) {
  
        if (response.status === 200) {
          if(response.data.idiglesia !== ''){
            console.log(response.data)
            setNotaDebito(response.data)
            setMostrar(true)
            setActivate(false);
          }
        
        }
      
    }).catch(function (error) {
  
        /* setTitulo("ERROR");
       
        setMostrar(true)
        setActivate(false); */
        console.log(error.response.data.message)
  
    })
  
  }

  const seleccionarCuentaId = (id) => (e) => {

    e.preventDefault()


  setBtnAgre(false)

    let campos = '*';
    let nomtab = 'cuentabancaria';
    let nomid = 'idcuentabancaria';

    let endpoint = `${op.conexion}/api/consulta/modeli?campos=${campos}&id=${parseInt(id)}&nomtab=${nomtab}&nomid=${nomid}`;
    setActivate(true);

    axios.get(endpoint, {
        headers: {
            'x-access-token': `${token}`
        }
    }).then(function (response) {

        if (response.status == 200) {
          if(response.data.idiglesia !== ''){
            console.log(response.data)
            setActivate(false);
            setSaldo(response.data.saldoconcil)
            setIdCuentaBancaria(response.data.idcuentabancaria)
            seleccionarNotasCredito(response.data.idcuentabancaria)
           /*  setMostrar(true)
             */
    
          }
        
        }
      
    }).catch(function (error) {

        /* setTitulo("ERROR");
       
        setMostrar(true)
        setActivate(false); */
        console.log(error.response.data.message)

    })

}

const seleccionarCuentaId2 = (id)  => {


  let campos = '*';
  let nomtab = 'cuentabancaria';
  let nomid = 'idcuentabancaria';

  setBtnAgre(false)

  let endpoint = `${op.conexion}/api/consulta/modeli?campos=${campos}&id=${parseInt(id)}&nomtab=${nomtab}&nomid=${nomid}`;
  setActivate(true);

  axios.get(endpoint, {
      headers: {
          'x-access-token': `${token}`
      }
  }).then(function (response) {

      if (response.status == 200) {
        if(response.data.idiglesia !== ''){
          console.log(response.data)
          setActivate(false);
          setSaldo(response.data.saldoconcil)
          setIdCuentaBancaria(response.data.idcuentabancaria)
          seleccionarNotasCredito(response.data.idcuentabancaria)
         /*  setMostrar(true)
           */
  
        }
      
      }
    
  }).catch(function (error) {

      /* setTitulo("ERROR");
     
      setMostrar(true)
      setActivate(false); */
      console.log(error.response.data.message)

  })

}




const seleccionaOperacion = (id,op) => (e) => {
  e.preventDefault()
  setOperacion(op)
  if(op === 1){
    setMostrar(true)
  } else{
    seleccionarNota(id)
  }




}



  const handleCancela2 = () => {
  
    setExpendedor('')
    setCredito('')
  }

  const handleCloseSi = () => {
    setActivate(false);
  
    setMostrar4(false);
    setMensajesino({mostrar: false, titulo: '', texto: '', icono: ''})

  };

  const handleCloseNo = () => {
    setMostrar4(false);
  };

 

 

  const cerrarModal = () =>{
    setMostrar(false)
    setIglesia('')
  }
  useEffect(() => {
    seleccionarCuentasBancarias()
   /*  setActivate(true); */
  }, []);




  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div className="row col-md-12 py-4 px-2">
        <div className='row col-md-12 mx-auto ' >
          <div className='col-md-10 card mx-auto py-3'>
            <div className='col-md-12 mx-auto row'>
              <div className='col-md-12 mx-auto d-flex justify-content-end px-3'>
                <div className='col-md-5 row'>
                  <div className='card bg-success py-3 d-flex justify-content-end'>
                  <h3 className='text-light my-auto text-right'>Saldo en Cuenta: <span className='text-light'>{saldo ? formatMoneda(saldo.toString().replace(',', '').replace('.', ','), ',', '.', 2) : '0,00'}</span> Bs.</h3>
                  </div>
                </div>
              </div>
              <div className='col-md-12 mx-auto d-flex justify-content-center px-3 mb-4'>
                <h3 className='text-dark'>Notas de Credito</h3>
              </div>

              <div className="col-12 p-2">
             
           
           <div className="row col-12 d-flex justify-content-between">
           <div class="input-group input-group-sm col-md-7">
                <label class="input-group-text" id="inputGroup-sizing-sm">
                  Cuenta Bancaria:
                </label>
                <select
                
                  
                  class="form-select"
                  aria-label="Default select example"
                  disabled={operacion === 1 ? false : operacion === 2 ? false : true}
                >
                  <option value="">Seleccione Cuenta</option>
                  {cuentas && cuentas.map((item, index) => (
                    <option key={index} value={item.idcuentabancaria} onClick={seleccionarCuentaId(item.idcuentabancaria)}> {item.nombre+' / '+item.cuentabancaria} </option>
                  ))}

                </select>
              </div>
             <div className='col-4 d-flex justify-content-end'>
             <input type="text" className=" col form-control form-control-sm rounded-pill" ref={txtBuscador} onChange={handleSearch} placeholder="Buscar" />
               
               <button onClick={seleccionaOperacion('',1)} disabled={btnAgre} style={{ marginBottom: "5px" }} className="btn btn-sm btn-primary rounded-circle"><i className="fas fa-plus"></i> </button>
             </div>
           </div>
         </div>
         <div className="col-md-12" style={{ margin: "auto" }} >
           <TblContainer>
             <TblHead />
             <TableBody >
               {
                 records && recordsAfterPagingAndSorting().map((item, index) => (
                   <TableRow key={index} style={{ padding: "0" }}>
                     <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>{moment(item.fechacredito).format('DD-MM-YYYY')}</TableCell>
                     <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center', width: '270px' }}>{item.referencia}</TableCell>
                     <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center', width: '200px' }}>{item.concptocredito}</TableCell>
                     <TableCell className='align-baseline' style={{ textAlign: "right", alignItems: 'center', width: '200px' }}><span className='text-success'>{ '+ '+ item.montocredito + ' Bs.'}</span></TableCell>

                     {item.reversado !== '1' ? 
                     
                     <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>
                          <button onClick={seleccionaOperacion(item.idnotacredito, 3)}  className="btn btn-sm mx-1 btn-info rounded-circle" ><i className="fas fas fas fa-backward"></i> </button>
                          <button onClick={seleccionaOperacion(item.idnotacredito, 2)}  className="btn btn-sm mx-1 btn-warning rounded-circle"><i className="fa fa-edit"></i> </button>
                        </TableCell>
                        : 
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>
                       <label  className='text-info'>REVERSADA</label>
                        </TableCell>
      
                        }
                   </TableRow>
               
                 ))
               }
             </TableBody>
           </TblContainer>
           <TblPagination />
         </div>
            </div>
           
            
           

          </div>
          
     
        </div>
      </div >
   
  
      <Dimmer active={activate} inverted>
        <Loader inverted>cargando...</Loader>
      </Dimmer>
      <Mensaje mensaje={mensaje}
        onHide={() => setMensaje({mostrar: false, titulo: '', texto: '', icono: ''})} />
      <MensajeSiNo mensaje={mensajesino}
        onHideNo={() => setMensajesino({mostrar: false, titulo: '', texto: '', icono: ''})} onHideSi={handleCloseSi} />
      <ModalCredito
      nota={notaDebito}
      show={mostrar}
      onHideCancela={cerrarModal}
      iglesia={''}
      operacion={operacion}
      idcuenta={idcuentabancaria}
      onHideRenderizar={seleccionarCuentaId2}
     
     
      /> 
    </div>
  );
}
export default NotasdeCredito;