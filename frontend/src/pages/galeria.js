import React, { useEffect, useContext, useState } from "react";
import logo from '../imagenes/logo1.png'


import { Mensaje } from "../components/mensajes";
import { Loader, Dimmer } from "semantic-ui-react";
import moment from "moment";


import axios from "axios";



function Galeria() {
  var op = require("../modulos/datos");
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
    { label: "Codigo", textAlign: "center", backgroundColor: '#e70101bf', color: 'white' },
    { label: "Nombre", textAlign: "center", backgroundColor: '#e70101bf', color: 'white' },
    { label: "Estatus", textAlign: "center", backgroundColor: '#e70101bf', color: 'white' },



    { label: "Opciones", textAlign: "center", backgroundColor: '#e70101bf', color: 'white' },




  ];



  const codigo = JSON.parse(localStorage.getItem("codigo"));
  const permiso = JSON.parse(localStorage.getItem("permiso"));
  const [operacion , setOperacion ] = useState();
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
  const [idRol, setIdRol] = useState(0.0);
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
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes ",
    "Sabado",
    "Domingo",
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


  const selecionarRegistros = async () => {
    let endpoint = op.conexion + "/roles/ConsultarTodos";
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    let bodyF = new FormData()

    bodyF.append("ID", user_id)


    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response => {


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
            if ((x.roles_id !== null ? String(x.roles_id).includes(target.value) : 0)
              || (x.roles_nombre !== null ? x.roles_nombre.toLowerCase().includes(target.value.toLowerCase()) : '')
             
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


  const gestionarBanco = (op, id) => (e) => {
    e.preventDefault();
    setMostrar(true)
    setIdRol(id)
    setOperacion(op)

  }
  return (
    <div className="col-md-12 mx-auto">
<nav class="navbar navbar-expand-lg  fixed-top">
        <div class="container-fluid bg-danger ">
          <a class="navbar-brand py-2" href="#">
            <img src={logo} className="logo-navbar" alt="MDN" />
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div className="row">
            <div class="col align-self-end collapse navbar-collapse " id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              
                <li class="nav-item">
                  <a class="nav-link" href="#home"><i class="fas fa-home"></i>  Home</a>
                </li>
                
                <li class="nav-item">
                  <a class="nav-link" href="#contact"><i class="fas fa-address-book"></i>  Contactanos</a>
                </li>

                
                <li class="nav-item">
                  <a class="nav-link" href="#quienes"><i class="fas fa-id-card-alt"></i>  Quienes Somos</a>
                </li>
                
                <li class="nav-item">
                  <a class="nav-link" href="/login"><i class="fas fa-sign-in-alt"></i>  Login</a>
                </li>
              
              
              </ul>
            </div>
          </div>
        </div>
        </nav>

    </div>
  );
}

export default Galeria;
