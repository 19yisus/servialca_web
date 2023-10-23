import React, { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
/* import { Mensaje, MensajeSiNo } from "../mensajes"; */
import { Loader, Dimmer, Label } from "semantic-ui-react";
import {
  TableBody,
  TableRow,
  TableCell,
  InputAdornment,
} from "@material-ui/core";

import {
  validaSoloNumero,
  formatMoneda,
  validaMonto,
  formatoMonto,
  validaNumeroTelefono,
  validaEmail,
  validaSoloLetras,
} from "../../util/varios";

import axios from "axios";
import moment from "moment";
import { Mensaje } from "../mensajes";
import CatalogoClientes from "../../catalogos/catalogoClientes";
import useTable from "../useTable";
import CatalogoTiposContratos from "../../catalogos/catalogoTiposContratos";

export const ModalTipoVehiculo = (props) => {
  const headCells = [
    {
      id: "ced",
      color: "rgba(5, 81, 130, 1)",
      label: "Codigo",
      textAlign: "center",
    },
    {
      id: "ced",
      color: "rgba(5, 81, 130, 1)",
      label: "Descripción",
      textAlign: "center",
    },
    {
      id: "ape",
      color: "rgba(5, 81, 130, 1)",
      label: "Opcion",
      textAlign: "center",
    },
  ];

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter((x) => {
            if (
              (x.tipoVehiculo_id !== null
                ? String(x.tipoVehiculo_id).includes(target.value)
                : 0) ||
              (x.nombre !== null
                ? x.nombre.toLowerCase().includes(target.value.toLowerCase())
                : "") ||
              (x.cuentabancaria !== null
                ? x.cuentabancaria.includes(target.value)
                : "")
            ) {
              return x;
            }
          });
      },
    });
  };

  /*  variables de estados */

  let op = require("../../modulos/datos");
  let token = localStorage.getItem("jwtToken");
  const dolarbcv = JSON.parse(localStorage.getItem("dolarbcv"));

  const txtEdad = useRef();
  const txtNombre = useRef();
  const txtTipoSangre = useRef();
  const txtCedula = useRef();
  const cmbLentes = useRef();
  const cmbPago = useRef();
  const cmbNacionalidad = useRef();

  const txtDatosPastor = useRef();
  const txtReferencia = useRef();
  const txtBs = useRef();
  const txtDolar = useRef();

  const txtFechaNaci = useRef();
  const txtDescripcion = useRef();
  const [records, setRecords] = useState([]);

  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

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

  const { TblContainer, TblHead, recordsAfterPagingAndSorting, TblPagination } =
    useTable(records, headCells, filterFn);

  const salir = () => {
    setRecords([]);
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

  const actualizarTiposContratos = async (id) => {
    let endpoint;
    let bodyF = new FormData();
    setActivate(true);
    for (let i = 0; i < records.length; i++) {
      if (operacion === 1) {
        endpoint = op.conexion + "/tipo_vehiculo/precio";
      }
      bodyF.append("ID", id);
      bodyF.append("precio", txtDolar.current.value);
      bodyF.append("idContrato", records[i].contrato_id);
      bodyF.append("token", token);
      await fetch(endpoint, {
        method: "POST",
        body: bodyF,
      })
        .then((res) => res.json())
        .then((response) => {
          setActivate(false);
          console.log(response);
        })
        .catch((error) =>
          setMensaje({
            mostrar: true,
            titulo: "Notificación",
            texto: error.res,
            icono: "informacion",
          })
        );
    }
    setMensaje({
      mostrar: true,
      titulo: "Exito.",
      texto: "peracion Exitosa",
      icono: "exito",
    });
  };

  const actualizarCertificado = async () => {
    let endpoint;
    let bodyF = new FormData();

    setActivate(true);

    if (operacion === 1) {
      endpoint = op.conexion + "/tipo_vehiculo/registrar";
    }

    bodyF.append("tipoVehiculo_nombre", txtDescripcion.current.value);
    bodyF.append("token", token);
    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        console.log(response);
        actualizarTiposContratos(response.id);
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

  const check = (e) => {
    var textV = "which" in e ? e.which : e.keyCode,
      char = String.fromCharCode(textV),
      regex = /[a-z]/gi;
    if (!regex.test(char)) e.preventDefault();
    return false;
  };
  const seleccionarCliente = (nombre, apellido, cedula) => {
    console.log(nombre, apellido, cedula);
    txtCedula.current.value = cedula;
    txtDescripcion.current.value = apellido;
    txtNombre.current.value = nombre;
    setMostrar(false);
  };

  const cerrarModal = () => {
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
    props.onHideCancela();
  };

  function soloLetras(event) {
    if (
      (event.keyCode != 32 && event.keyCode < 65) ||
      (event.keyCode > 90 && event.keyCode < 97) ||
      event.keyCode > 122
    )
      event.returnValue = false;
  }
  const handleChange = (maxValue) => (e) => {
    const inputValue = e.target.value;
    // Verificar si la longitud del valor ingresado supera el valor máximo
    if (isNaN(inputValue)) {
      if (inputValue.length > maxValue && e.key !== "Backspace") {
        e.preventDefault(); // Evitar que se escriba el valor excedente
      }
    } else {
      if (
        inputValue.length >= maxValue &&
        e.key !== "Backspace" &&
        e.key !== " "
      ) {
        e.preventDefault(); // Evitar que se escriba el valor excedente
      }
    }
  };
  const handleInputMontoChange = (event) => {
    validaMonto(event);
    if (event.which === 13 || typeof event.which === "undefined") {
      if (event.target.name === "dolar") {
        let bs = parseFloat(dolarbcv);
        let total = parseFloat(event.target.value) * bs;
        txtBs.current.value = formatMoneda(
          total.toString().replace(",", "").replace(".", ","),
          ",",
          ".",
          2
        );
      }
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

  const selecionarTipo = async (id) => {
    let endpoint = op.conexion + "/tipo_vehiculo/ConsultarUno?ID=" + id;
    console.log(endpoint);
    setActivate(true);

    //setLoading(false);

    let bodyF = new FormData();

    // bodyF.append("Nombre", txtDescripcion.current.value)

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        console.log(response);

        let $ = response.tipoVehiculo_precio
          ? parseFloat(response.tipoVehiculo_precio)
          : 0;
        let bs = parseFloat(dolarbcv);
        let totalbs = $ * bs;

        txtDescripcion.current.value = response.tipoVehiculo_nombre;
        txtDolar.current.value = response.tipoVehiculo_precio
          ? formatMoneda(
              response.tipoVehiculo_precio
                .toString()
                .replace(",", "")
                .replace(".", ","),
              ",",
              ".",
              2
            )
          : "0,00";
        txtBs.current.value = formatMoneda(
          totalbs.toString().replace(",", "").replace(".", ","),
          ",",
          ".",
          2
        );
        setValues(response);
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

  const agregarTipoContrato = (values) => {
    console.log(values);

    let sigue = true;

    for (let i = 0; i < records.length; i++) {
      if (records.length > 0 && values.contrato_id === records[i].contrato_id) {
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: "El contrato ya esta agregado.",
          icono: "informacion",
        });
        sigue = false;
      }
    }
    if (sigue) {
      records.push(values);
    }

    setMostrar(false);
    console.log(values);
  };
  const gestinarTipo = () => {
    setMostrar(true);
  };
  const elimminarrTipo = (id) => (e) => {
    e.preventDefault();

    let array = [];

    for (let i = 0; i < records.length; i++) {
      if (id !== records[i].contrato_id) {
        array.push(records[i]);
      }
    }
    setRecords(array);
  };

  return (
    <Modal
      {...props}
      style={{ background: "rgb(28, 27, 23)" }}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      onShow={() => {
        setOperacion(props.operacion);

        if (props.operacion !== 1) {
          selecionarTipo(props.idTipoVehiculo);
        }
      }}
    >
      <Modal.Header className="bg-danger">
        <Modal.Title style={{ color: "#fff" }}>
          {operacion === 1
            ? "Registrar Tipo de Vehiculo"
            : operacion === 2
            ? "Editar Tipo de Vehiculo"
            : "Eliminar Tipo de Vehiculo"}
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
        <CatalogoTiposContratos
          show={mostrar}
          onHideCancela={() => {
            setMostrar(false);
          }}
          onHideCatalogo={agregarTipoContrato}
        />

        <Mensaje
          mensaje={mensaje}
          onHide={() => {
            mensaje.titulo === "Exito."
              ? cerrarModal()
              : setMensaje({
                  mostrar: false,
                  titulo: "",
                  texto: "",
                  icono: "",
                });
          }}
        />

        <div className="col-md-12 row mx-auto">
          <div class="input-group input-group-sm mb-3 col-md-12">
            <span class="input-group-text" id="inputGroup-sizing-sm">
              Nombre:
            </span>
            <input
              onKeyDown={handleChange(25)}
              type="text"
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              class="form-control"
              ref={txtDescripcion}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>

          <div class="input-group input-group-sm mb-3 col-md-6">
            <span class="input-group-text" id="inputGroup-sizing-sm">
              Monto en $:
            </span>
            <input
              type="text"
              disabled={
                operacion === 1 ? false : operacion === 2 ? false : true
              }
              class="form-control text-right"
              name="dolar"
              ref={txtDolar}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              onChange={handleInputMontoChange}
            />
          </div>
          <div class="input-group input-group-sm mb-3 col-md-6">
            <span class="input-group-text" id="inputGroup-sizing-sm">
              Monto en Bs:
            </span>
            <input
              type="text"
              disabled
              class="form-control text-right"
              ref={txtBs}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-sm"
              onKeyUp={handleInputMontoChange}
            />
          </div>
          <div className="row col-12 d-flex justify-content-between mb-2 mt-4">
            <input
              type="text"
              className=" col-3 form-control form-control-sm rounded-pill"
              onChange={handleSearch}
              placeholder="Buscar"
            />

            <div className="col-3 d-flex justify-content-end">
              <button
                onClick={gestinarTipo}
                className="btn btn-sm btn-primary rounded-circle"
              >
                <i className="fas fa-plus"></i>{" "}
              </button>
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
                        style={{ textAlign: "center", alignItems: "center" }}
                      >
                        {item.contrato_id}
                      </TableCell>
                      <TableCell
                        className="align-baseline"
                        style={{
                          textAlign: "center",
                          alignItems: "center",
                          width: "270px",
                        }}
                      >
                        {item.contrato_nombre}
                      </TableCell>

                      <TableCell
                        className="align-baseline"
                        style={{ textAlign: "center", alignItems: "center" }}
                      >
                        {
                          // <button  className="btn btn-sm mx-1 btn-info rounded-circle" ><i className="fas fas fa-backward"></i> </button>
                        }{" "}
                        <button
                          className="btn btn-sm mx-1 btn-danger rounded-circle"
                          onClick={elimminarrTipo(item.contrato_id)}
                        >
                          <i className="fa fa-trash"></i>{" "}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </TblContainer>
            <TblPagination />
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
