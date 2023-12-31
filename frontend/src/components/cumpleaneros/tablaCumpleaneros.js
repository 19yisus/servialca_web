import React, { useEffect, useContext, useState } from "react";


import { Mensaje } from "../mensajes";
import { Loader, Dimmer } from "semantic-ui-react";
import moment from "moment";



import axios from "axios";
import useTable from "../useTable";
import { TableBody, TableRow, TableCell } from '@material-ui/core';


function TablaClumpeaneros() {
  var op = require("../../modulos/datos");
  let token = localStorage.getItem("jwtToken");
  const user_id = JSON.parse(localStorage.getItem("user_id"));

  const [activate, setActivate] = useState(false);
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });

  console.log(user_id)
  const headCells = [
    { label: "Cedula", textAlign: "center",backgroundColor:'#e70101bf',color:'white' },
    { label: "Nombre", textAlign: "center",backgroundColor:'#e70101bf',color:'white' },
    { label: "Telefono", textAlign: "center",backgroundColor:'#e70101bf',color:'white' },
    { label: "Dirección", textAlign: "center",backgroundColor:'#e70101bf',color:'white' },
      { label: "Correo", textAlign: "center",backgroundColor:'#e70101bf',color:'white' },
      { label: "Fecha Nacimiento", textAlign: "center",backgroundColor:'#e70101bf',color:'white' },





  ];



  const codigo = JSON.parse(localStorage.getItem("codigo"));
  const permiso = JSON.parse(localStorage.getItem("permiso"));
  const [cuentas, setCuentas] = useState();
  const [montoCuenta, setMontoCuenta] = useState();
  const [nCuenta, setNCuenta] = useState();
  const [total, setTotal] = useState(0.0);
  const [totalp, setTotalp] = useState(0.0);
  const [totalpresu, setTotalpresu] = useState(0.0);
  const [totaltipo, setTotaltipo] = useState(0.0);
  const [presupuesto, setPresupuesto] = useState(0.0);
  const [totalrc, setTotalrc] = useState(0.0);
  const [totalavi, setTotalavi] = useState(0.0);
  const [totalact, setTotalact] = useState(0.0);
  const [totalmenos, setTotalmenos] = useState(0.0);
  const [mostrar, setMostrar] = useState(false);
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })

  const [records, setRecords] = useState([
    {
      idproducto: "",
      codigo: "",
      cantidad: "",
      producto: "",
      precio: "",
      iva: "",
      motoiva: "",
      descuento: "",
      total: "",
    },
  ]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
  };

  
  const labels = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo ",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Miembros",
        data: [12, 4, 34, 54, 7, 12, 78],
        backgroundColor: "rgb(149, 187, 227)",
      },
    ],
  };
  const {
    TblContainer,
    TblHead,
    recordsAfterPagingAndSorting,
    TblPagination
  } = useTable(records, headCells, filterFn);
  
  
  const selecionarRegistros = async () => {
    let endpoint = op.conexion + "/cliente/Cumple";
console.log(endpoint)
    setActivate(true)
   

  
    //setLoading(false);

    let bodyF = new FormData()

    bodyF.append("ID", user_id)
 

    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response =>{
     
        
       setActivate(false)
       console.log(response)
       setRecords(response)
  



      })
      .catch(error =>  
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
        )

  };

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
      fn: items => {
        if (target.value === "")
          return items;
        else
          return items.filter(x => {
            if ((x.cliente_cedula !== null ? String(x.cliente_cedula).includes(target.value) : 0)
              || (x.cliente_nombre !== null ? x.cliente_nombre.toLowerCase().includes(target.value.toLowerCase()) : '')
              || (x.cliente_apellido !== null ? x.cliente_apellido.includes(target.value) : '')
            ) {
              return x;
            }
          });
      }
    })

  }


  

  console.log('estas en menu')

  

  useEffect(() => {
    selecionarRegistros()
   
  }, []);

  const regPre = () => {
    setMostrar(true);
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
  };

 
  const gestionarBanco = (op,id) => (e) => {
    e.preventDefault();

  }
  return (
    <div className="col-md-12 mx-auto p-2">
    

<div className="col-12 py-2">
           <div className='col-12 row d-flex justify-content-between py-2 mt-5 mb-3'>
                <h2 className=' col-5 text-light'>Lista De Cumpleañeros</h2>

              </div>
              
            </div>
            <div className="col-md-12 bg-light py-2 rounded" style={{ margin: "auto" }} >
              <div className="row col-12 d-flex justify-content-between mb-2">
                <input type="text" className=" col-3 form-control form-control-sm rounded-pill" onChange={handleSearch} placeholder="Buscar" />
         
                <div className='col-3 d-flex justify-content-end'>
                </div>
              </div>
              <TblContainer>
                <TblHead />
                <TableBody >
                  {
                    records && recordsAfterPagingAndSorting().map((item, index) => (
                      <TableRow key={index} style={{ padding: "0" }}>
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>{item.cliente_cedula}</TableCell>
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>{item.cliente_nombre+' '+item.cliente_apellido}</TableCell>
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>{item.cliente_telefono}</TableCell>
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>{item.cliente_direccion}</TableCell>
                                   <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>{item.cliente_correo}</TableCell>
                        <TableCell className='align-baseline' style={{ textAlign: "center", alignItems: 'center' }}>{moment(item.cliente_fechaNacimiento).format('DD/MM/YYYY')}</TableCell>
                   
                      
                      </TableRow>
                    ))
                  }
                </TableBody>
              </TblContainer>
              <TblPagination />
            </div>
      
      <Dimmer active={activate} inverted>
        <Loader inverted>cargando...</Loader>
      </Dimmer>
      <Mensaje
        mensaje={mensaje}
        onHide={() =>
          mensaje.texto ===
          "Este Usuario No posee preguntas de seguridad debe registrarlas"
            ? regPre()
            : setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" })
        }
      />
    </div>
  );
}

export default TablaClumpeaneros;
