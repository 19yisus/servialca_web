import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
/* import { Mensaje, MensajeSiNo } from "../mensajes"; */
import { Loader, Dimmer, Label } from "semantic-ui-react";
import {
  validaSoloNumero,
  formatMoneda,
  validaMonto,
  formatoMonto,
  validaNumeroTelefono,
  validaEmail,
  validaSoloLetras
} from "../../util/varios";

import axios from "axios";
import moment from "moment";
import { Mensaje } from "../mensajes";
import CatalogoClientes from "../../catalogos/catalogoClientes";

export const ModalUsuarios = (props) => {
  /*  variables de estados */

  let op = require("../../modulos/datos");
  let token = localStorage.getItem("jwtToken");


  const txtEdad = useRef();
  const txtUsuario = useRef();
  const txtApellido = useRef()
  const txtNombre = useRef();
  const txtTipoSangre = useRef();
  const txtCedula = useRef();
  const cmbLentes = useRef();
  const cmbPago = useRef();
  const cmbNacionalidad = useRef();

  const txtDatosPastor = useRef();
  const txtReferencia = useRef()
  const txtBs = useRef();
  const txtDolar = useRef();

  const txtFechaNaci = useRef();
  const txtDireccion = useRef();
const cmbTelefono = useRef();
const txtTelefono = useRef();
const txtCorreo = useRef();
const txtRol = useRef();
const txtSucursal = useRef();

const check = useRef()
  const check1 = useRef();
  const check2 = useRef();
  const check3 = useRef();
  const check4 = useRef();
  const check5 = useRef();
  const check6 = useRef();
  const check7 = useRef();
  const check8 = useRef();
  const check9 = useRef();


const[sucursales, setSucursales] = useState();
const [roles, setRoles] = useState();








  const [values, setValues] = useState({
    ced: "",
    nombre: "",
    apellido: "",
    fecha_nac: "",
    bas_agua: 1,

    status: 1,
    bas_espirit: 1,
    cod_iglesia: "",
    sexo: "M",
    fecha_baus: "",
    nacionalidad: "V",
    direccion: "",
    telefono: "",
    celular: "",
    estadocivil: 0,
    correo: "",
    tiposangre: "",
  });

  const btnCancela = useRef();
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });

  const btnAcepta = useRef();


  const [activate, setActivate] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  const [operacion, setOperacion] = useState(0);




  /*********************************************** FUNCINES DE VALIDACION***********************************************************/

  const handleInputNumChange = (event) => {
    event.preventDefault();
    validaSoloNumero(event);
    var valido;
    if (event.which === 13 || typeof event.which === "undefined") {
      setValues({ ...values, [event.target.name]: event.target.value });
    } else if (event.which === 46) {
      return false;
    } else if (event.which >= 48 && event.which <= 57) {
      return true;
    } else if (event.which === 8 || event.which === 0 || event.which === 44) {
      return true;
    } else return false; //alert(e.which);
  };


  const salir = () => {
    props.onHideCancela();
    setValues({
      ced: "",
      nombre: "",
      apellido: "",
      fecha_nac: "",
      bas_agua: 1,

      status: 1,
      bas_espirit: 1,
      cod_iglesia: "",
      sexo: "M",
      fecha_baus: "",
      nacionalidad: "V",
      direccion: "",
      telefono: "",
      celular: "",
      estadocivil: 0,
      correo: "",
      tiposangre: "",
    });
  };



  const actualizarCertificado = async () => {
    let endpoint = op.conexion + "/poliza/registrarCertificado";
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    let bodyF = new FormData()

    //bodyF.append("Nombre", cmbNacionalidad.current.value+txtNombre.current.value)
    //bodyF.append("Apellido", txtDireccion.current.value)
    //bodyF.append("Cedula", txtCedula.current.value)
    //bodyF.append("fechaNacimiento", txtFechaNaci.current.value)
    //bodyF.append("Edad", txtEdad.current.value)
    //bodyF.append("tipoSangre", txtTipoSangre.current.value)
    //bodyF.append("Lente", cmbLentes.current.value)
    //bodyF.append("metodoPago", cmbPago.current.value)
    //bodyF.append("Referencia", txtReferencia.current.value)
    //bodyF.append("cantidadDolar", txtDolar.current.value)



    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response => {


        setActivate(false)
        console.log(response)

        setMensaje({
          mostrar: true,
          titulo: "Exito.",
          texto: "Registro Guardado Exitosamente",
          icono: "exito",
        });




      })
      .catch(error =>
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
      )

  };



  const onChangeValidar = () => {
    let sigue = true;
    let minimo = 0;
    let calculo = 0;

    /*  else if( && operacion === 1){
          setMensaje({
              mostrar: true,
              titulo: "Notificación",
              texto: "Ya existe un usuario con este n° de cedula",
              icono: "informacion",
            });
            sigue = false;
            txtCedula.current.focus()
  
      } */

    if (sigue) {
      actualizarCertificado();
    }
  };



  const blanquear = () => {
    setValues({
      ced: "",
      nombre: "",
      apellido: "",
      fecha_nac: "",
      bas_agua: 1,

      status: 1,
      bas_espirit: 1,
      cod_iglesia: "",
      sexo: "M",
      fecha_baus: "",
      nacionalidad: "V",
      direccion: "",
      telefono: "",
      celular: "",
      estadocivil: 0,
      correo: "",
      tiposangre: "",
    });
  };




  const checkrte = (e) => {
    var textV = "which" in e ? e.which : e.keyCode,
      char = String.fromCharCode(textV),
      regex = /[a-z]/ig;
    if (!regex.test(char)) e.preventDefault(); return false;
  }
  const seleccionarCliente = (nombre, apellido, cedula) => {

    console.log(nombre, apellido, cedula)
    txtCedula.current.value = cedula;
    txtDireccion.current.value = apellido;
    txtNombre.current.value = nombre;
    setMostrar(false);

  }

  const cerrarModal = () => {
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
    props.onHideCancela()

  }

  function soloLetras(event) {
    if ((event.keyCode != 32) && (event.keyCode < 65) || (event.keyCode > 90) && (event.keyCode < 97) || (event.keyCode > 122))
      event.returnValue = false;
  }

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

  const selecionarUsuario = async (id) => {
    let endpoint = op.conexion + "/Auth/ConsultarUno?ID="+id;
    console.log(endpoint)
    setActivate(true)



    //setLoading(false);

    console.log(id)
    let bodyF = new FormData()

     bodyF.append("ID", id)


    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response => {


        setActivate(false)
       


      
        console.log(response)
        txtUsuario.current.value = response.usuario_usuario;
        txtNombre.current.value = response.usuario_nombre;
        txtApellido.current.value = response.usuario_apellido;
        cmbNacionalidad.current.value = response.usuario_cedula.substring(0,2);
        txtCedula.current.value = response.usuario_cedula.substring(2, response.usuario_cedula.length)
        cmbTelefono.current.value = response.usuario_telefono.substring(0,5)
        txtTelefono.current.value = response.usuario_cedula.substring(5, response.usuario_telefono.length)
        txtDireccion.current.value = response.usuario_direccion
        txtCorreo.current.value = response.usuario_correo
        txtRol.current.value = response.roles_id
        txtSucursal.current.value = response.sucursal_id


      })
      .catch(error =>
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
      )

  };


  const selecionarSucursales = async () => {
    let endpoint = op.conexion + "/sucursal/ConsultarTodos";
console.log(endpoint)
    setActivate(true)
   

  
    //setLoading(false);

  
 

    await fetch(endpoint, {
      method: "POST",
     
    }).then(res => res.json())
      .then(response =>{
     
        
       setActivate(false)
       console.log(response)
       setSucursales(response)
  



      })
      .catch(error =>  
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
        )

  };

  const selecionarRoles = async () => {
    let endpoint = op.conexion + "/roles/ConsultarTodos";
console.log(endpoint)
    setActivate(true)
   

  
    //setLoading(false);

    let bodyF = new FormData()

    //bodyF.append("ID", user_id)
 

    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response =>{
     
        
       setActivate(false)
       console.log(response)
       setRoles(response)
  



      })
      .catch(error =>  
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
        )

  };


  return (
    <Modal
      {...props}
      style={{ background: "rgb(28, 27, 23)" }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      onShow={() => {
        selecionarSucursales()
        selecionarRoles()
        setOperacion(props.operacion);
        setActivate(false)
       

        if (props.operacion !== 1) {
          console.log(props.id, operacion)
          selecionarUsuario(props.id)
        }
      }}
    >
      <Modal.Header className="bg-danger">
        <Modal.Title style={{ color: "#fff" }}>
          {operacion === 1 ? 'Registrar Usuarios Del Sistema' : operacion === 2 ? 'Editar Usuarios Del Sistema' : 'Eliminar Usuarios Del Sistema'}
        </Modal.Title>
        <button
          ref={btnCancela}
          className="btn"
          style={{ border: 0, margin: 0, padding: 0, color: "#ffffff" }}
          onClick={salir}
        >
          <i className="far fa-window-close"></i>
        </button>
      </Modal.Header>
      <Modal.Body style={{ color: "rgb(106, 115, 123)" }}>
        <Dimmer active={activate} inverted>
          <Loader inverted>cargando...</Loader>
        </Dimmer>
        <CatalogoClientes

          show={mostrar}
          onHideCancela={() => { setMostrar(false) }}
          onHideCatalogo={seleccionarCliente}

        />

        <Mensaje
          mensaje={mensaje}
          onHide={() => {
            mensaje.titulo === 'Exito.' ? cerrarModal() :
              setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
          }} />

        <div className="col-md-12 row mx-auto">
          
         
          <div class="input-group input-group-sm mb-3 col-md-4">
            <span class="input-group-text" id="inputGroup-sizing-sm">Usuario:</span>
            <input type="text"  class="form-control" ref={txtUsuario} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-6"></div>

          <div class="input-group input-group-sm mb-3 col-md-6">
            <span class="input-group-text" id="inputGroup-sizing-sm">Nombre:</span>
            <input type="text"  class="form-control" ref={txtNombre} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-6">
            <span class="input-group-text" id="inputGroup-sizing-sm">Apellido:</span>
            <input type="text"  class="form-control" ref={txtApellido} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-4">
            <span class="input-group-text" id="inputGroup-sizing-sm">Cedula:</span>
            <select class="form-select" ref={cmbNacionalidad} aria-label="Default select example">

                    <option value="V-">V-</option>
                    <option value="E-">E-</option>
                    <option value="J-">J-</option>
                    <option value="G-">G-</option>

                  </select>
            <input type="text"  class="form-control" ref={txtCedula} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-4">
            <span class="input-group-text" id="inputGroup-sizing-sm">Telefono:</span>
            <select class="form-select col-md-2" ref={cmbTelefono} aria-label="Default select example">

                      <option value="0414-">0414-</option>
                      <option value="0424-">0424-</option>
                      <option value="0416-">0416-</option>
                      <option value="0426-">0426-</option>
                      <option value="0412-">0412-</option>



                    </select>
            <input type="text"  class="form-control" ref={txtTelefono} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-4">
            <span class="input-group-text" id="inputGroup-sizing-sm">Dirección:</span>
            <input type="text"  class="form-control" ref={txtDireccion} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-4">
            <span class="input-group-text" id="inputGroup-sizing-sm">Correo:</span>
            <input type="text"  class="form-control" ref={txtCorreo} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-4">
            <span class="input-group-text" id="inputGroup-sizing-sm">Rol:</span>
           
            <select class="form-select" ref={txtRol} aria-label="Default select example">

{roles && roles.map((item, index) => (
            <option key={index} value={item.roles_id} > {item.roles_nombre} </option>
          ))}
           </select>
          </div>
          <div class="input-group input-group-sm mb-3 col-md-4">
            <span class="input-group-text" id="inputGroup-sizing-sm">Sucursal:</span>
    
            <select class="form-select" ref={txtSucursal} aria-label="Default select example">

            {sucursales && sucursales.map((item, index) => (
                        <option key={index} value={item.sucursal_id} > {item.sucursal_nombre} </option>
                      ))}
                       </select>
         
          </div>
          <div class="row mx-auto col-md-12">
            <div class="form-check col-md-4 mx-auto pl-5 mb-1">
              <input class="form-check-input " ref={check} type="checkbox" value='Contratos realizados' id="flexCheckDefault"/>
              <label class="form-check-label">
              Contratos Realizados
              </label>
            </div>
            <div class="form-check col-md-4 mx-auto pl-5 mb-1">
              <input class="form-check-input" ref={check1} type="checkbox"value='Lista de asesores' id="flexCheckDefault"/>
              <label class="form-check-label" >
              Lista De Asesores
              </label>
            </div>
            <div class="form-check col-md-4 mx-auto pl-5 mb-1">
              <input class="form-check-input" ref={check2} type="checkbox"  value='Lista de sucursales' id="flexCheckDefault"/>
              <label class="form-check-label">
              Lista De Sucursales
              </label>
            </div>
            <div class="form-check col-md-4 mx-auto pl-5 mb-1">
              <input class="form-check-input" ref={check3} type="checkbox" value='Tipo de contratos' id="flexCheckDefault"/>
              <label class="form-check-label" >
              Tipo De Contratos
              </label>
            </div>
            <div class="form-check col-md-4 mx-auto pl-5 mb-1">
              <input class="form-check-input" ref={check4} type="checkbox"value='Uso de vehiculo' id="flexCheckDefault"/>
              <label class="form-check-label" >
              Uso De Vehiculo
              </label>
            </div>
            <div class="form-check col-md-4 mx-auto pl-5 mb-1">
              <input class="form-check-input" ref={check5} type="checkbox" value='Clase de vehiculo' id="flexCheckDefault"/>
              <label class="form-check-label" >
              Clase De Vehiculo
              </label>
            </div>
            <div class="form-check col-md-4 mx-auto pl-5 mb-1">
              <input class="form-check-input" ref={check6} type="checkbox" value='Tipo de Vehiculo' id="flexCheckDefault"/>
              <label class="form-check-label" >
              Tipo De Vehiculo
              </label>
            </div>
            <div class="form-check col-md-4 mx-auto pl-5 mb-1">
              <input class="form-check-input" ref={check7} type="checkbox" value='Linea de transporte' id="flexCheckDefault"/>
              <label class="form-check-label" >
              Linea De Transporte
              </label>
            </div>
            <div class="form-check col-md-4 mx-auto pl-5 mb-1">
              <input class="form-check-input" ref={check8} type="checkbox"value='Usuarios' id="flexCheckDefault"/>
              <label class="form-check-label" >
              Usuarios
              </label>
            </div>
            <div class="form-check col-md-4 mx-auto pl-5 mb-1">
              <input class="form-check-input" ref={check9} type="checkbox"value='Roles' id="flexCheckDefault"/>
              <label class="form-check-label" >
              Roles
              </label>
            </div>
          </div>
          


        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-sm btn-success rounded-pill "
          disabled={props.operacion === 4 ? true : false}
          onClick={onChangeValidar}
        >
          <i className="fas fa-check-circle"> Aceptar</i>
        </button>
        <button
          ref={btnCancela}
          onClick={salir}
          className="btn btn-sm btn-danger rounded-pill "
        >
          <i className="fas fa-window-close"> Salir</i>
        </button>
      </Modal.Footer>
    </Modal>
  );
};