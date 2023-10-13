import React, { useEffect, useContext, useState, useRef } from "react";
import { AuthContext } from "../context/auth";

import useTableScroll from "../components/useTableScroll2";

import { Mensaje } from "../components/mensajes";
import { Loader, Dimmer } from "semantic-ui-react";
import moment from "moment";
/*import logo from "../../public/mdb/img/mdb-favicon.ico";
 */ import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import useTable from "../components/useTable";
import { TableBody, TableRow, TableCell } from "@material-ui/core";


import { ModalCertificadoMedico } from "../components/administracion/modalCertificado";
import { ModalRcv } from "../components/administracion/modalRcv";
import { ModalImprimir } from "../components/administracion/modalImprimir";
import { ModalLicencia } from "../components/administracion/modalLicencia";
import { ModalConsultarPoliza } from "../components/administracion/modalConsultarPoliza";
import { ModalRenovarPoliza } from "../components/administracion/modalRenovar";
import { formatMoneda, validaMonto, formatoMonto } from "../util/varios";

function Inicio2() {
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

  const { user } = useContext(AuthContext);
  const codigo = JSON.parse(localStorage.getItem("codigo"));
  const permiso = JSON.parse(localStorage.getItem("permiso"));
  const [poliza, setPoliza] = useState();

  const [operacion, setOperacion] = useState();
  const [mostrar, setMostrar] = useState(false);
  const [mostrar2, setMostrar2] = useState(false);
  const [mostrar3, setMostrar3] = useState(false);
  const [mostrar4, setMostrar4] = useState(false);
  const [mostrar5, setMostrar5] = useState(false);
  const [mostrar6, setMostrar6] = useState(false);
  const [idCliente, setIdCliente] = useState();

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
    let endpoint = op.conexion + "/poliza/ConsultarVencer";
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
    setIdCliente(id);
    setOperacion(op)
    if (op === 1) {
      setMostrar5(true);
    } else  if (op === 3){
      setMostrar6(true);
    }
    if (op === 2){
      setMostrar2(true)
    setIdCliente(id.poliza_id);
    setPoliza(id)
    } else {
      setIdCliente(id);
    }

  };
  const gestionarRcv = (opcion) => (e) => {
    e.preventDefault();
    console.log(opcion);

    if (opcion === 1) {
      setMostrar(true);
    } else if (opcion === 2) {
      setMostrar2(true);
    } else {
      setMostrar4(true);
    }
  };

  const imprimirCertificado = (id) => {
    setIdCliente(id);
    console.log(id);
    setMostrar2(false);
    setMostrar3(true);
  };

  return (
    <div className="col-md-12 mx-auto p-2">
      <ModalCertificadoMedico
        //es show sirve para abrir el modal con setVariable cambias el valor de la variable de estado estado true abre el modal false lo cierra
        show={mostrar}
        onHideCancela={() => {
          setMostrar(false);
        }}
      />

      <ModalRcv
      operacion={operacion}
        show={mostrar2}
        onHideCancela={() => {
          setMostrar2(false);
        }}
        onHideCancela2={imprimirCertificado}
        idCliente={idCliente}
        poliza={poliza}

      />

      <ModalImprimir
        show={mostrar3}
        onHideCancela={() => {
          setMostrar3(false);
        }}
        idCliente={idCliente}
      />
      <ModalConsultarPoliza
        show={mostrar5}
        onHideCancela={() => {
          setMostrar5(false);
        }}
        idCliente={idCliente}
      />
      <ModalRenovarPoliza
        show={mostrar6}
        onHideCancela={() => {
          setMostrar6(false);
        }}
        idCliente={idCliente}
      />
      
        <ModalLicencia
          show={mostrar4}
          onHideCancela={() => {
            setMostrar4(false);
          }}
          idCliente={idCliente}
        />
      

      <div className="col-12 py-2">
        <div className="col-12 row d-flex justify-content-between py-2 mt-5 mb-3">
          <h2 className=" col-5 text-light">RCV QUE ESTAN POR VENCER</h2>
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

          <div className="col-6 d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-primary btn-sm mx-1"
              onClick={gestionarRcv(3)}
            >
              <i class="fa fa-plus"></i> Licencia
            </button>

            <button
              type="button"
              class="btn btn-primary btn-sm mx-1"
              onClick={gestionarRcv(1)}
            >
              <i class="fa fa-plus"></i> Certificado Medico
            </button>
            <button
              type="button"
              class="btn btn-primary btn-sm mx-1"
              onClick={gestionarRcv(2)}
            >
              <i class="fa fa-plus"></i> Crear RCV
            </button>
          </div>
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
                    style={{ textAlign: "center", alignItems: "center" }}
                  >
                    <button
                      onClick={gestionarBanco(1, item.poliza_id)}
                      className="btn btn-sm mx-1 btn-info rounded-circle"
                    >
                      <i className="fas fa-eye"></i>{" "}
                    </button>
                    <button
                      onClick={gestionarBanco(2, item)}
                      className="btn btn-sm mx-1 btn-warning rounded-circle"
                    >
                      <i className="fa fa-edit"></i>{" "}
                    </button>
                    <button
                      onClick={gestionarBanco(3, item.poliza_id)}
                      className="btn btn-sm mx-1 btn-danger rounded-circle"
                    >
                      {" "}
                      <i className="fa fa-sync"></i>{" "}
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

export default Inicio2;
const formatDate = (dateString) => {
  // Usa moment.js para formatear la fecha
  return moment(dateString).format("DD-MM-YYYY"); // Formato "día-mes-año"
};
