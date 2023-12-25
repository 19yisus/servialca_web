import React, { useState, useEffect, useRef } from "react";
import {
  TableBody,
  TableRow,
  TableCell,
  InputAdornment,
} from "@material-ui/core";
import { Loader, Dimmer } from "semantic-ui-react";
import { Search } from "@material-ui/icons";
import axios from "axios";
/* import { Dona, Torta } from '../graficos/graficos'; */
/* import CartasAgentes from './cartasAgentes'; */
import { Mensaje, MensajeSiNo } from "../mensajes";
/* import { GestionarExpendedor } from './modalExpendedor'; */
import useTable from "../useTable";

import { formatMoneda } from "../../util/varios";

import moment from "moment";

function TablaReportes() {
  var op = require("../../modulos/datos");
  let token = localStorage.getItem("jwtToken");
  const user_id = JSON.parse(localStorage.getItem("user_id"));
  const fechasistema = JSON.parse(localStorage.getItem("fechasistema"));

  let el;
  let municipios = [];

  const headCells = [
    {
      id: "ced",
      color: "rgba(5, 81, 130, 1)",
      label: "Fecha",
      textAlign: "center",
    },
    {
      id: "ced",
      color: "rgba(5, 81, 130, 1)",
      label: "Rerencia",
      textAlign: "center",
    },
    {
      id: "nombre",
      color: "rgba(5, 81, 130, 1)",
      label: "Concepto",
      textAlign: "center",
    },
    {
      id: "ape",
      color: "rgba(5, 81, 130, 1)",
      label: "Monto",
      textAlign: "center",
    },
    {
      id: "ape",
      color: "rgba(5, 81, 130, 1)",
      label: "Opcion",
      textAlign: "center",
    },
  ];

  const colores = [
    "#17a2b8",
    "#ffae00",
    "#dc3545",
    "#BDB76B",
    "#7B68EE",
    "#4B0082",
    "#00ffff",
    "#0080ff",
    "#0000ff",
    "#8000ff",
    "#ff00ff",
    "#ff0080",
  ];

  const cmbTipo = useRef();
  const cmbDato = useRef();

  const txtDesde = useRef();

  const txtHasta = useRef();

  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });
  const [mensajesino, setMensajesino] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });
  const txtBuscador = useRef();
  const [cuentas, setCuentas] = useState();
  const [saldo, setSaldo] = useState(0.0);
  const [mostrar, setMostrar] = useState(false);
  const [mostrar4, setMostrar4] = useState(false);
  const [titulo1, setTitulo1] = useState();
  const [desabilitar, setDesabilitar] = useState(false);
  const [activate, setActivate] = useState(false);
  const [records, setRecords] = useState([]);
  const [expendedor, setExpendedor] = useState([]);
  const [operacion, setOperacion] = useState(1);
  const [btnAgre, setBtnAgre] = useState(true);
  const [persona, setPersona] = useState();
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [ciudades, setCiudades] = useState();
  const [credito, setCredito] = useState();
  const [total, setTotal] = useState(0);
  const [activos, setActivos] = useState(0);
  const [inactivos, setInactivos] = useState(0);
  const [municipiosEx, setMunicipiosEx] = useState([]);
  const [municipiosData, setMunicipiosData] = useState([]);
  const [iglesia, setIglesia] = useState();
  const [notaDebito, setNotaDebito] = useState();
  const [estado, setEstado] = useState();
  const [idcuentabancaria, setIdCuentaBancaria] = useState("");
  const [datos, setDatos] = useState([]);

  const generarReporte = async (e) => {
    e.preventDefault();
    if (cmbDato.current.value != "" && cmbDato.current.value != null) {
      window.open(
        `${op.conexion}/reporteGeneral?Sucursal=${cmbDato.current.value}Motivo=${cmbTipo.current.value}&Desde=${txtDesde.current.value}&Hasta=${txtHasta.current.value}`
      );
    } else {
      window.open(
        `${op.conexion}/reporteGeneral?Motivo=${cmbTipo.current.value}&Desde=${txtDesde.current.value}&Hasta=${txtHasta.current.value}`
      );
    }
  };

  const seleccionaOperacion = (id, op) => (e) => {
    e.preventDefault();
    setOperacion(op);
    if (op === 1) {
      setMostrar(true);
    }
  };

  const handleCancela2 = () => {
    setExpendedor("");
    setCredito("");
  };

  const handleCloseSi = () => {
    setActivate(false);

    setMostrar4(false);
    setMensajesino({ mostrar: false, titulo: "", texto: "", icono: "" });
  };

  const handleCloseNo = () => {
    setMostrar4(false);
  };

  const cerrarModal = () => {
    setMostrar(false);
    setIglesia("");
  };
  useEffect(() => {
    /*  setActivate(true); */
  }, []);

  const selecionarUsuarios = async () => {
    let endpoint = op.conexion + "/Auth/ConsultarTodos";
    console.log(endpoint);
    setActivate(true);

    //setLoading(false);

    let bodyF = new FormData();

    bodyF.append("ID", user_id);

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        console.log(response);
        let array = [];

        for (let i = 0; i < response.length; i++) {
          array.push({
            id: response[i].usuario_id,
            nombre: response[i].usuario_nombre,
          });
        }

        setRecords(array);
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

  const selecionarSucursal = async () => {
    let endpoint = op.conexion + "/sucursal/ConsultarTodos";
    console.log(endpoint);
    setActivate(true);

    await fetch(endpoint, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        let array = [];

        for (let i = 0; i < response.length; i++) {
          array.push({
            id: response[i].sucursal_id,
            nombre: response[i].sucursal_nombre,
          });
        }

        setRecords(array);
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

  const consulta = (e) => {
    if (parseInt(e.target.value) === 5) {
      setDesabilitar(false);
      selecionarUsuarios();
    } else if (parseInt(e.target.value) === 4) {
      setDesabilitar(false);
      selecionarSucursal();
    } else {
      setRecords([]);
      setDesabilitar(true);
    }
  };
  useEffect(() => {
    // Obtener la fecha actual en el formato "YYYY-MM-DD"
    const fechaActual = new Date().toISOString().split("T")[0];

    // Establecer la fecha actual en los campos "Desde" y "Hasta"
    txtDesde.current.value = fechaActual;
    txtHasta.current.value = fechaActual;
  }, []);
  // const generar = () => {
  //   let sigue = true;

  //   if (cmbTipo.current.value === "") {
  //     sigue = false;
  //     setMensaje({
  //       mostrar: true,
  //       titulo: "Notificación",
  //       texto: "Seleccione un tipo de reposrte",
  //       icono: "informacion",
  //     });
  //     cmbTipo.current.focus();
  //   } else if (cmbDato.current.value === "") {
  //     sigue = false;
  //     setMensaje({
  //       mostrar: true,
  //       titulo: "Notificación",
  //       texto: "Seleccione un regsitro",
  //       icono: "informacion",
  //     });
  //     cmbDato.current.focus();
  //   } else if (txtDesde.current.value === "") {
  //     sigue = false;
  //     setMensaje({
  //       mostrar: true,
  //       titulo: "Notificación",
  //       texto: "Ingrese una fecha de inicio",
  //       icono: "informacion",
  //     });
  //     txtDesde.current.focus();
  //   } else if (txtHasta.current.value === "") {
  //     sigue = false;
  //     setMensaje({
  //       mostrar: true,
  //       titulo: "Notificación",
  //       texto: "Ingrese una fecha Final",
  //       icono: "informacion",
  //     });
  //     txtHasta.current.focus();
  //   } else if (txtDesde.current.value > txtHasta.current.value) {
  //     sigue = false;
  //     setMensaje({
  //       mostrar: true,
  //       titulo: "Notificación",
  //       texto: "La fecha de inicio no debe ser mayora a la fecha final",
  //       icono: "informacion",
  //     });
  //     txtHasta.current.focus();
  //   }

  //   if (sigue) {
  //     window.open(
  //       `${op.conexion}/reporte_Ingreso_egreso?nota_id=${
  //         cmbTipo.current.value
  //       }&sucursal_id=${cmbDato.current.value}&user_id=${
  //         cmbDato.current.value
  //       }&fechaInicio=${moment(txtDesde.current.value).format(
  //         "YYYY-MM-DD"
  //       )}&fechaFin=${moment(txtHasta.current.value).format("YYYY-MM-DD")}`
  //     );
  //   }
  // };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="row col-md-12 py-4 px-2">
        <div className="row col-md-12 mx-auto ">
          <div className="col-md-10 card mx-auto py-3">
            <div className="col-md-12 mx-auto row">
              <div className="col-md-12 mx-auto d-flex justify-content-center px-3 mb-4">
                <h3 className="text-dark">Genearar Reporte</h3>
              </div>

              <div className="col-12 p-2 row">
                <div class="input-group input-group-sm mb-2 col-md-6">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Tipo:
                  </span>
                  <select
                    class="form-select"
                    aria-label="Default select example"
                    ref={cmbTipo}
                    onChange={consulta}
                  >
                    <option value=" ">Selecionar</option>
                    <option value="4">Sucursal</option>
                    <option value="RCV">RCV</option>
                    <option value="Renovación">Renovacione s</option>
                    <option value="Seguro">Certificados Medicos</option>
                    <option value="Licencia">Licencias</option>
                    <option value="1">Ingresos</option>
                    <option value="0">Egresos</option>
                    <option value="2">Ingreso y Egreso</option>
                  </select>
                  {
                    <select
                      class="form-select"
                      disabled={desabilitar}
                      aria-label="Default select example"
                      ref={cmbDato}
                    >
                      <option value="">Seleccionar</option>
                      {records &&
                        records.map((item, index) => (
                          <option key={index} value={item.id}>
                            {" "}
                            {item.nombre}{" "}
                          </option>
                        ))}
                    </select>
                  }
                </div>

                <div class="input-group input-group-sm mb-2 col-md-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Desde:
                  </span>
                  <input
                    type="date"
                    class="form-control"
                    ref={txtDesde}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
                <div class="input-group input-group-sm mb-2 col-md-3">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Hasta:
                  </span>
                  <input
                    type="date"
                    class="form-control"
                    ref={txtHasta}
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                  />
                </div>
              </div>
              <div className="col-md-5 mx-auto row">
                <button
                  type="button"
                  onClick={generarReporte}
                  class="btn col-md-6 btn-sm mx-auto rounded-pill btn-primary"
                >
                  Generar{" "}
                </button>
                <button
                  type="button"
                  class="btn col-md-6 btn-sm mx-auto rounded-pill btn-danger"
                >
                  limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dimmer active={activate} inverted>
        <Loader inverted>cargando...</Loader>
      </Dimmer>
      <Mensaje
        mensaje={mensaje}
        onHide={() =>
          setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" })
        }
      />
      <MensajeSiNo
        mensaje={mensajesino}
        onHideNo={() =>
          setMensajesino({ mostrar: false, titulo: "", texto: "", icono: "" })
        }
        onHideSi={handleCloseSi}
      />
    </div>
  );
}
export default TablaReportes;
