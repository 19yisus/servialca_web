import React, { useEffect, useRef, useContext, useState } from "react";

import { Mensaje } from "../mensajes";
import { Loader, Dimmer } from "semantic-ui-react";
import moment from "moment";

import axios from "axios";
import useTable from "../useTable";
import { TableBody, TableRow, TableCell } from "@material-ui/core";

import { formatMoneda, validaMonto, formatoMonto } from "../../util/varios";

function PageChats() {
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

  console.log(user_id);
  const headCells = [
    {
      label: "Codigo",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Descripción",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Estatus",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },

    {
      label: "Opciones",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
  ];

  const txtMensaje = useRef()

  const codigo = JSON.parse(localStorage.getItem("codigo"));
  const permiso = JSON.parse(localStorage.getItem("permiso"));
  const [cuentas, setCuentas] = useState();
  const [montoCuenta, setMontoCuenta] = useState();
  const [nCuenta, setNCuenta] = useState();
  const [idCon, setIdCon] = useState(0.0);
  const [conversacion, setConversacion] = useState([]);
  const [idResector, setIdResector] = useState(0.0);
  const [totaltipo, setTotaltipo] = useState(0.0);
  const [presupuesto, setPresupuesto] = useState(0.0);
  const [totalrc, setTotalrc] = useState(0.0);
  const [totalavi, setTotalavi] = useState(0.0);
  const [idSucursal, setIdSucursal] = useState(0.0);
  const [operacion, setOperacion] = useState(0.0);
  const [nombreChat, setNombreChat] = useState('');
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

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

  const BCV = JSON.parse(localStorage.getItem("dolarbcv"));
  const txtDolar = useRef();
  const txtBs = useRef();

  const calcular = () => {
    const cantidadDolares = parseFloat(txtDolar.current.value);
    const precio = parseFloat(BCV);

    if (!isNaN(cantidadDolares) && !isNaN(precio)) {
      const total = cantidadDolares * precio;
      txtBs.current.value = total.toFixed(2).replace(".", ",");
    } else {
      txtBs.current.value = "0,00";
    }
  };
  const calcular2 = () => {
    const cantidadBsStr = txtBs.current.value.replace(",", "."); // Reemplaza la coma por punto
    const cantidadBs = parseFloat(cantidadBsStr);
    const precioDolar = parseFloat(BCV);

    if (!isNaN(cantidadBs) && !isNaN(precioDolar) && precioDolar !== 0) {
      const totalDolares = cantidadBs / precioDolar;
      txtDolar.current.value = totalDolares.toFixed(2).replace(".", ",");
    } else {
      txtDolar.current.value = "0,00";
    }
  };

  const handleInputMontoChange = (event) => {
    validaMonto(event);
    if (event.which === 13 || typeof event.which === "undefined") {
      if (
        event.target.value === "" ||
        parseFloat(
          event.target.value.trim().replace(".", "").replace(",", ".")
        ) === 0.0
      ) {
        event.target.value = "0,00";
      }
      event.target.value = formatoMonto(event.target.value);
      let char1 = event.target.value.substring(0, 1);
      let char2 = event.target.value.substring(1, 2);
      if (char1 === "0" && char2 !== ",") {
        event.target.value = event.target.value.substring(
          1,
          event.target.value.legth
        );
      }
    } else if (event.which === 46) {
      return false;
    } else if (event.which >= 48 && event.which <= 57) {
      return true;
    } else if (event.which === 8 || event.which === 0 || event.which === 44) {
      return true;
    } else return false;
  };

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
  const { TblContainer, TblHead, recordsAfterPagingAndSorting, TblPagination } =
    useTable(records, headCells, filterFn);

  const selecionarRegistros = async () => {
    let endpoint = op.conexion + "/Auth/ConsultarTodos";
    let bodyF = new FormData()
    bodyF.append("token", token);
    console.log(endpoint);
    setActivate(true);

    //setLoading(false);

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        console.log(response);
       setRecords(response);
      })
      .catch((error) =>
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: error.res,
          icono: "informacion",
        })
      );
  };

  const listarConversaciones = async (id) => {
    let endpoint = op.conexion + "/chat/crearConversacion";
    let bodyF = new FormData()
    bodyF.append("token", token);
    bodyF.append("user_1_id", user_id);
    bodyF.append("user_2_id", id);


   

    setActivate(true);

    //setLoading(false);
  
    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
  
        console.log(response.res);
        setIdCon(response.id)
        if(response.res !== 'Conversación creada' || response.res !== 'Sin mensajes disponibles' ){
          setConversacion(response.res)
        } else {
          conversacion.push({
            content_sms:'AHORA PUEDES COMUNICARTE CON OTROS USUARIOS DEL SISTEMA',
            fecha_hora_sms:'Ahora'
          })
          
        }
       
      })
      .catch((error) =>
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: error.res,
          icono: "informacion",
        })
      );
  };

  const enviarSMS = async () => {
    let endpoint = op.conexion + "/chat/enviarMensaje";
    let bodyF = new FormData()
    bodyF.append("token", token);
    bodyF.append("conversacion_id", idCon);
    bodyF.append("remitente", user_id);
    bodyF.append("content_sms", txtMensaje.current.value);

    

   

    setActivate(true);

    //setLoading(false);

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
  
        console.log(response);
        txtMensaje.current.value=''
        listarConversaciones(idResector)
      
      })
      .catch((error) =>
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: error.res,
          icono: "informacion",
        })
      );
  };

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter((x) => {
            if (
              (x.sucursal_id !== null
                ? String(x.sucursal_id).includes(target.value)
                : 0) ||
              (x.sucursal_nombre !== null
                ? x.sucursal_nombre
                    .toLowerCase()
                    .includes(target.value.toLowerCase())
                : "")
            ) {
              return x;
            }
          });
      },
    });
  };

  console.log("estas en menu");

  useEffect(() => {
    selecionarRegistros();
  }, []);

  const onChangeValidar = (e) => {
    e.preventDefault()
    console.log('si')
    let sigue = true;
    if(txtMensaje.current.value === ''){
      sigue = false;
      setMensaje({
        mostrar: true,
        titulo: "Notificación",
        texto: 'Debe ingresar un mensaje',
        icono: "informacion",
      })
      txtMensaje.current.focus()

    }

    if(sigue){
      enviarSMS()
    }
  }


  const consultarChat = (item) => (e) => {
    e.preventDefault()
console.log(item)
setNombreChat(item.usuario_nombre + ' ' + item.usuario_apellido)
setIdResector(item.usuario_id)
listarConversaciones(item.usuario_id)
  }
  return (
   
    <div class="container-fluid h-100">

<Mensaje
          mensaje={mensaje}
          onHide={() => {
           setMensaje({
                  mostrar: false,
                  titulo: "",
                  texto: "",
                  icono: "",
                });
          }}
        />
    <div class="row justify-content-center h-100">
      <div class="col-md-4 col-xl-3 chat"><div class="card2 mb-sm-3 mb-md-0 contacts_card">
        <div class="card-header">
          <div class="input-group">
            <input type="text" placeholder="Search..." name="" class="form-control search"/>
            <div class="input-group-prepend">
              <span class="input-group-text search_btn"><i class="fas fa-search"></i></span>
            </div>
          </div>
        </div>
        <input type="hidden" />
        <div class="card-body contacts_body">
          <ui class="contacts">
          

          {records &&
              records.map((item, index) => (
            


<li class="active" type='button' onClick={consultarChat(item)}>
            <div class="d-flex bd-highlight">
              <div class="img_cont">
              <i class="user_img far fa-user-circle"></i>
                <span class="online_icon"></span>
              </div>
              <div class="user_info">
                <span>{item.usuario_nombre + ' ' + item.usuario_apellido}</span>
                <p>Kalid is online</p>
              </div>
            </div>
          </li>
              ))}
         
          
          </ui>
        </div>
        <div class="card-footer"></div>
      </div></div>
      <div class="col-md-8 col-xl-9 chat">
        <div class="card2">
          <div class="card-header msg_head">
            <div class="d-flex bd-highlight">
              <div class="img_cont">
              <i class="user_img2 far fa-user-circle"></i>
              
                <span class="online_icon"></span>
              </div>
              <div class="user_info">
                <span>{nombreChat}</span>
                <p>{ conversacion.length + ' Mensajes'}</p>
              </div>
              
            </div>
           
          </div>
          <div class="card-body msg_card_body">
          {conversacion &&
  conversacion.map((item, index) => {
    if (item.remitente !== user_id) {
      return (
        <div class="d-flex justify-content-start mb-4">
          <div class="msg_cotainer">
           {item.content_sms}
            <span class="msg_time">{item.fecha_hora_sms} </span>
          </div>
        </div>
      );
    } else {
      return (
        <div class="d-flex justify-content-end mb-4">
          <div class="msg_cotainer_send">
           {item.content_sms}
            <span class="msg_time_send">{item.fecha_hora_sms} </span>
          </div>
        </div>
      );
    }
  })
}

           
        
          </div>
          <div class="card-footer">
            <div class="input-group">
              <div class="input-group-append">
                <span class="input-group-text attach_btn"><i class="fas fa-paperclip"></i></span>
              </div>
              <textarea ref={txtMensaje} name="" class="form-control type_msg" placeholder="Ingrese su mensaje..."></textarea>
              <div class="input-group-append">
                <button class="input-group-text send_btn" onClick={onChangeValidar} type="button"><i class="fas fa-location-arrow"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default PageChats;
