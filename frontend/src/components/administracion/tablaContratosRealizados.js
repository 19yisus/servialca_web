import React, { useEffect, useContext, useState, useRef } from "react";

import { Mensaje } from "../mensajes";
import { Loader, Dimmer } from "semantic-ui-react";
import moment from "moment";

import axios from "axios";
import useTable from "../useTable";
import { TableBody, TableRow, TableCell } from "@material-ui/core";
import { ModalImprimir } from "./modalImprimir";
import { ModalConsultarPoliza } from "./modalConsultarPoliza";
import { ModalRenovarPoliza } from "./modalRenovar";
import { formatMoneda, validaMonto, formatoMonto } from "../../util/varios";
import { ModalRcv } from "./modalRcv";

function TablaContratosRealizados() {
  var op = require("../../modulos/datos");
  let token = localStorage.getItem("jwtToken");
  const user_id = JSON.parse(localStorage.getItem("user_id"));
  console.log(user_id);
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
      label: "N° Contrato",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Fecha Vencimiento",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "C.I/R.I.F.",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Benefeciario",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Telefono",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Placa",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Acesor",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Sucursal",
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

  const codigo = JSON.parse(localStorage.getItem("codigo"));
  const permiso = JSON.parse(localStorage.getItem("permiso"));
  const [poliza, setPoliza] = useState();
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
  const [idCliente, setIdCliente] = useState(0);
  const [operacion, setOperacion] = useState();
  const [mostrar, setMostrar] = useState(false);
  const [mostrar2, setMostrar2] = useState(false);
  const [mostrar3, setMostrar3] = useState(false);
  const [mostrar4, setMostrar4] = useState(false);
  const [mostrar5, setMostrar5] = useState(false);

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
      const inputValue = event.target.value;
      if (inputValue === "" || parseFloat(inputValue) === 0.0) {
        event.target.value = "0,00";
      } else {
        const formattedValue = formatoMonto(inputValue);
        event.target.value = formattedValue;
      }
    } else {
      const inputChar = String.fromCharCode(event.which);
      if (/[\d,]/.test(inputChar)) {
        // Permitir solo números y comas
        return true;
      } else {
        event.preventDefault(); // Prevenir cualquier otro carácter
      }
    }
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
    let endpoint = op.conexion + "/poliza/ConsultarTodos";
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

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter((x) => {
            if (
              (x.cliente_cedula !== null
                ? x.cliente_cedula.toLowerCase().includes(target.value)
                : 0) ||
              (x.cliente_nombre !== null
                ? x.cliente_nombre
                    .toLowerCase()
                    .includes(target.value.toLowerCase())
                : "") ||
              (x.cliente_telefono !== null
                ? x.cliente_telefono.includes(target.value)
                : "") ||
              (x.vehiculo_placa !== null
                ? x.vehiculo_placa.toLowerCase().includes(target.value)
                : "") ||
              (x.usuario_nombre !== null
                ? x.usuario_nombre.toLowerCase().includes(target.value)
                : "") ||
              (x.poliza_id !== null
                ? String(x.poliza_id).includes(target.value)
                : "") ||
              (x.sucursal_nombre !== null
                ? x.sucursal_nombre.toLowerCase().includes(target.value)
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

  const regPre = () => {
    setMostrar(true);
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
  };

  const gestionarBanco = (op, id) => (e) => {
    e.preventDefault();
    setOperacion(op);
    if (op === 2) {
      setMostrar5(true);
      setIdCliente(id.poliza_id);
      setPoliza(id);
      setOperacion(op);
    } else {
      setIdCliente(id);
    }
    if (op === 2) {
      setMostrar5(true);
    } else if (op === 3) {
      setMostrar5(true);
    } else if (op === 4) {
      setMostrar2(true);
    } else if (op === 5) {
      setMostrar3(true);
    }
  };

  const imprimirCertificado = (id) => {
    setIdCliente(id);
    console.log(id);
    setMostrar5(false);
    setMostrar2(true);
  };

  return (
    <div className="col-md-12 mx-auto p-2">
      <ModalImprimir
        show={mostrar2}
        onHideCancela={() => {
          setMostrar2(false);
        }}
        idCliente={idCliente}
      />

      <ModalConsultarPoliza
        show={mostrar3}
        onHideCancela={() => {
          setMostrar3(false);
        }}
        idCliente={idCliente}
      />

      <ModalRenovarPoliza
        show={mostrar4}
        onHideCancela={() => {
          setMostrar4(false);
        }}
        idCliente={idCliente}
      />

      <ModalRcv
        operacion={operacion}
        show={mostrar5}
        onHideCancela={() => {
          setMostrar5(false);
        }}
        idCliente={idCliente}
        poliza={poliza}
        onHideCancela2={imprimirCertificado}
      />

      <div className="col-12 py-2">
        <div className="col-12 row d-flex justify-content-between py-2 mt-5 mb-3">
          <h2 className=" col-5 text-light">Lista De Contratos</h2>
          <div class="input-group input-group-sm col-md-4 my-auto">
            <span
              class="input-group-text bg-transparent border-0 fw-bold text-light"
              id="inputGroup-sizing-sm"
            >
              Calcular $:
            </span>
            <input
              type="text"
              class="form-control bg-transparent text-light text-right"
              onChange={calcular}
              ref={txtDolar}
              aria-label="Sizing example input"
              placeholder="$"
              aria-describedby="inputGroup-sizing-sm"
            />
            <span
              class="input-group-text bg-transparent border-0 fw-bold text-light"
              id="inputGroup-sizing-sm"
            >
              Calcular BS:
            </span>
            <input
              type="text"
              class="form-control bg-transparent text-light text-right"
              ref={txtBs}
              onChange={calcular2}
              aria-label="Sizing example input"
              placeholder="BS"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
        </div>
      </div>
      <div
        className="col-md-12 bg-light py-2 rounded"
        style={{ margin: "auto" }}
      >
        <div className="row col-12 d-flex justify-content-between mb-2">
          <input
            type="text"
            className=" col-3 form-control form-control-sm rounded-pill"
            onChange={handleSearch}
            placeholder="Buscar"
          />

          {/*<div className='col-3 d-flex justify-content-end'>
            <button onClick={gestionarBanco(1, '')} className="btn btn-sm btn-primary rounded-circle"><i className="fas fa-plus"></i> </button>
  </div>*/}
        </div>
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
                    {item.poliza_id}
                  </TableCell>
                  <TableCell
                    className="align-baseline"
                    style={{ textAlign: "center", alignItems: "center" }}
                  >
                    {formatDate(item.poliza_fechaVencimiento)}
                  </TableCell>
                  <TableCell
                    className="align-baseline"
                    style={{ textAlign: "center", alignItems: "center" }}
                  >
                    {item.cliente_cedula}
                  </TableCell>
                  <TableCell
                    className="align-baseline"
                    style={{ textAlign: "center", alignItems: "center" }}
                  >
                    {item.cliente_nombre}
                  </TableCell>
                  <TableCell
                    className="align-baseline"
                    style={{ textAlign: "center", alignItems: "center" }}
                  >
                    {item.cliente_telefono}
                  </TableCell>
                  <TableCell
                    className="align-baseline"
                    style={{ textAlign: "center", alignItems: "center" }}
                  >
                    {item.vehiculo_placa}
                  </TableCell>
                  <TableCell
                    className="align-baseline"
                    style={{ textAlign: "center", alignItems: "center" }}
                  >
                    {item.usuario_nombre}
                  </TableCell>
                  <TableCell
                    className="align-baseline"
                    style={{ textAlign: "center", alignItems: "center" }}
                  >
                    {item.sucursal_nombre}
                  </TableCell>
                  <TableCell
                    className="align-baseline"
                    style={{
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={gestionarBanco(4, item.poliza_id)}
                      className="btn btn-sm mx-3 btn-info rounded-circle"
                    >
                      <i className="fas fa-print"></i>{" "}
                    </button>
                    {user_id == 57 && (
                      <button
                        onClick={() => gestionarBanco(2, item.poliza_id)}
                        className="btn btn-sm mx-1 btn-warning rounded-circle"
                      >
                        <i className="fa fa-edit"></i>{" "}
                      </button>
                    )}

                    <button
                      onClick={gestionarBanco(3, item.poliza_id)}
                      className="btn btn-sm mx-1 btn-danger rounded-circle"
                    >
                      <i className="fa fa-sync"></i>{" "}
                    </button>
                    <button
                      onClick={gestionarBanco(5, item.poliza_id)}
                      className="btn btn-sm mx-1 btn-primary rounded-circle"
                    >
                      <i className="fa fa-eye"></i>{" "}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
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

export default TablaContratosRealizados;
const formatDate = (dateString) => {
  // Usa moment.js para formatear la fecha
  return moment(dateString).format("DD-MM-YYYY"); // Formato "día-mes-año"
};
