import React, { useEffect, useContext, useState, useRef } from "react";

import { Mensaje } from "../mensajes";
import { Loader, Dimmer } from "semantic-ui-react";
import { Doughnut } from "react-chartjs-2";

import moment from "moment";
import {
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
import useTable from "../useTable";
import { TableBody, TableRow, TableCell } from "@material-ui/core";

function GraficosIngresos() {
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
      label: "Fecha",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Hora",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Asesor",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Debito/Credito",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Motivo",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Tipo de pago",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Referencia",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Monto",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
    {
      label: "Total neto",
      textAlign: "center",
      backgroundColor: "#e70101bf",
      color: "white",
    },
  ];

  const txtDate1 = useRef();
  const txtDate2 = useRef();

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
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const [records, setRecords] = useState([]);

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
    "Diciembre",
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

  const data2 = {
    labels: [
      "RCV",
      "Certificado medico",
      "Renovación",
      "Abonos",
      "Egresos",
      "Orange",
    ],
    datasets: [
      {
        label: "# of Votes",
        data: [1, 1, 1, 1, 1, 1],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const { TblContainer, TblHead, recordsAfterPagingAndSorting, TblPagination } =
    useTable(records, headCells, filterFn);

  const selecionarRegistrosAnual = async (e) => {
    let endpoint = op.conexion + "/grafica/Anual";
    console.log(endpoint);
    setActivate(true);
    let bodyF = new FormData();
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

  const selecionarRegistros = async (e) => {
    let endpoint = op.conexion + "/grafica/Diario";
    console.log(endpoint);
    setActivate(true);
    let bodyF = new FormData();
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
              (x.idcuentabancaria !== null
                ? String(x.idcuentabancaria).includes(target.value)
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

  console.log("estas en menu");

  useEffect(() => {
    selecionarRegistros();
    
  }, []);

  const regPre = () => {
    setMostrar(true);
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
  };

  return (
    <div className="col-md-12 mx-auto p-2">
      <div className="col-12 py-2">
        <div className="col-12 row d-flex justify-content-between py-2 mt-5 mb-3">
          <h2 className=" col-5 text-light">Ingreso Y Egreso</h2>
        </div>
      </div>
      <div className="col-md-12 bg-light py-2 rounded row py-5">
        <div className="row col-6 d-flex justify-content-between mb-2">
          <Bar options={options} data={data} />
        </div>
        <div className="row col-6 d-flex justify-content-between mb-2">
          <Doughnut data={data2} />
        </div>
        <div className="row col-12 d-flex justify-content-between mb-4 mt-3">
          <input
            type="text"
            className=" col-3 form-control form-control-sm rounded-pill mb-4 "
            onChange={handleSearch}
            placeholder="Buscar"
          />

          <div className="col-4 mb-4">
            <div class="input-group flex-nowrap">
              <span class="input-group-text" id="addon-wrapping">
                Desde:
              </span>
              <input
                type="date"
                class="form-control"
                ref={txtDate1}
                aria-label="Username"
                aria-describedby="addon-wrapping"
              />

              <span class="input-group-text" id="addon-wrapping">
                Hasta:
              </span>
              <input
                type="date"
                class="form-control"
                ref={txtDate2}
                aria-label="Username"
                aria-describedby="addon-wrapping"
              />
              <button
                type="button"
                onClick={selecionarRegistros}
                class="btn btn-success"
              >
                <i class="fa-solid fa-magnifying-glass"></i>Buscar
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
                      {item.nota_fecha}
                    </TableCell>
                    <TableCell
                      className="align-baseline"
                      style={{ textAlign: "center", alignItems: "center" }}
                    >
                      {item.nota_hora}
                    </TableCell>
                    <TableCell
                      className="align-baseline"
                      style={{ textAlign: "center", alignItems: "center" }}
                    >
                      {item.usuario_usuario}
                    </TableCell>
                    <TableCell
                      className="align-baseline"
                      style={{ textAlign: "center", alignItems: "center" }}
                    >
                      {item.nota_IngresoEgreso}
                    </TableCell>
                    <TableCell
                      className="align-baseline"
                      style={{ textAlign: "center", alignItems: "center" }}
                    >
                      {item.nota_motivo}
                    </TableCell>
                    <TableCell
                      className="align-baseline"
                      style={{ textAlign: "center", alignItems: "center" }}
                    >
                      {item.nota_tipoPago}
                    </TableCell>
                    <TableCell
                      className="align-baseline"
                      style={{ textAlign: "center", alignItems: "center" }}
                    >
                      {item.nota_referencia}
                    </TableCell>
                    <TableCell
                      className="align-baseline"
                      style={{ textAlign: "center", alignItems: "center" }}
                    >
                      {item.nota_monto}
                    </TableCell>
                    <TableCell
                      className="align-baseline"
                      style={{ textAlign: "center", alignItems: "center" }}
                    >
                      {}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </TblContainer>
          <TblPagination />
        </div>
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

export default GraficosIngresos;
