import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/auth";
import panelLocal from "./inicioLocal";
import useTableScroll from "../components/useTableScroll2";
import { TableBody, TableRow, TableCell } from "@material-ui/core";
import { Mensaje } from "../components/mensajes";
import { Loader, Dimmer } from "semantic-ui-react";
import moment from "moment";
import logo from '../imagenes/logo.png'
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
import { GestionarPreguntas } from "../components/componentesIglesia/configuracion/preguntasSeguridad";

function Inicio2() {
  var op = require("../modulos/datos");
 /* let token = localStorage.getItem("jwtToken");
  const accfinalocal = JSON.parse(localStorage.getItem("accfinalocal"));*/

  const [activate, setActivate] = useState(false);
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });

  const headCells = [
    { label: "Fecha", textAlign: "center" },
    { label: "Tipo", textAlign: "center" },
    { label: "Monto", textAlign: "center" },
    { label: "Saldo", textAlign: "center" },
  ];

  const { TblContainer, TblHead } = useTableScroll(headCells);

  const { user } = useContext(AuthContext);
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

  const seleccionarMovimiento = (id) => {
    let campos = "*, trim(tiponota) as tiponota";
    let nomtab = "movimientosbancarios";
    let orden = "fecha desc";
    let condi = " idcuentabancaria = " + id;

    let endpoint =
      op.conexion +
      `/api/consulta/selecionarregistrocondi?campos=${campos}&nomtab=${nomtab}&condi=${condi}&orden=${orden}`;
    console.log(endpoint);
    setActivate(true);

    axios
      .get(endpoint, {
        headers: {
        /* /* "x-access-token": `${token}`,*/
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data);

          setRecords(response.data);
        }

        setActivate(false);
      })
      .catch(function (error) {
        setMensaje({
          mostrar: true,
          titulo: "Error",
          texto: error.response.data.message,
          icono: "error",
        });
        setActivate(false);
      });
  };

  const seleccionarCuentas = () => {
    let campos = "*";
    let nomtab = "cuentabancaria";
    let nomid = "agente";
    let nomid2 = "tipoagente";
    let orden = "idcuentabancaria";

    let endpoint = `${
      op.conexion
    }/api/consulta/idsstring2rows?campos=${campos}&nomtab=${nomtab}&nomid=${nomid}&nomid2=${nomid2}&id=${codigo}&id2=${permiso
      .toString()
      .trim()}&orden=${orden} `;
    setActivate(true);

    axios
      .get(endpoint, {
        headers: {
         /* "x-access-token": `${token}`,*/
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data);
          setCuentas(response.data);
          setMontoCuenta(response.data[0].saldoconcil);
          setNCuenta(
            response.data[0].nombre + "/ " + response.data[0].cuentabancaria
          );
          seleccionarMovimiento(response.data[0].idcuentabancaria);
        }

        setActivate(false);
      })
      .catch(function (error) {
        setMensaje({
          mostrar: true,
          titulo: "Error",
          texto: error.response.data.message,
          icono: "error",
        });
        setActivate(false);
      });
  };

  const seleccionarCuentas2 = (id) => (e) => {
    e.preventDefault();

    let campos = "*";
    let nomtab = "cuentabancaria";
    let nomid = "idcuentabancaria";

    let endpoint = `${
      op.conexion
    }/api/consulta/modeli?campos=${campos}&id=${parseInt(
      id
    )}&nomtab=${nomtab}&nomid=${nomid}`;
    setActivate(true);

    axios
      .get(endpoint, {
        headers: {
         /* "x-access-token": `${token}`,*/
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data);
          setMontoCuenta(response.data.saldoconcil);
          setNCuenta(
            response.data.nombre + "/ " + response.data.cuentabancaria
          );
          seleccionarMovimiento(response.data.idcuentabancaria);
        }
      })
      .catch(function (error) {
        setMensaje({
          mostrar: true,
          titulo: "Error",
          texto: error.response.data.message,
          icono: "error",
        });
        setActivate(false);
      });
  };

  console.log('estas en menu')

  const seleccionarPreguntas = (cedula) => {
    let campos = "*";
    let nomtab = "preguntaseguridad";
    let nomid = "idusuario";

    let endpoint = `${op.conexion}/api/consulta/modeli?campos=${campos}&id=${cedula}&nomtab=${nomtab}&nomid=${nomid}`;
    setActivate(true);

    axios
      .get(endpoint, {
        headers: {
         /* "x-access-token": `${token}`,*/
        },
      })
      .then(function (response) {
        if (response.status == 200) {
          if (!response.data) {
            setMensaje({
              mostrar: true,
              titulo: "Notificación",
              texto:
                "Este Usuario No posee preguntas de seguridad debe registrarlas",
              icono: "informacion",
            });
          }
        }

        setActivate(false);
      })
      .catch(function (error) {
        setActivate(false);
      });
  };

  useEffect(() => {
    /*localStorage.setItem("condi", JSON.stringify(""));
    localStorage.setItem("idcuenta", JSON.stringify(""));
    if (permiso.trim() === "LOCAL") {
      seleccionarCuentas();

      setActivate(true);
    }
    const idusuario = JSON.parse(localStorage.getItem("idusuario"));
    seleccionarPreguntas(idusuario);*/
  }, []);

  const regPre = () => {
    setMostrar(true);
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
  };

  /*  const menu = () => {

    if (permiso.trim() === 'LOCAL'){
    return(
      
    )} else {
      return(
        
      )
    }
  }  */

  console.log("estamos en el inicio");
  console.log(user);
  return (
    <div className="col-md-12 mx-auto p-2">
      <GestionarPreguntas
        show={mostrar}
        llamado={2}
        onHideCancela={() => {
          setMostrar(false);
        }}
      />
      <div className="col-sm-12 h-100 w-100 py-3 px-2">
       {/* {permiso.trim() === "LOCAL" && accfinalocal.substring(0, 2) === "11" ? (
          <div className="col-md-12 mx-auto row card">
            <div className="col-md-12 mx-auto row">
              <div className="col-md-6 py-3 h-100">
                <div className="col-md-12 row ">
                  <div className="col-md-4 py-2 h-100 mx-auto ">
                    <div className="col-md-12 card h-100 mx-auto rounded py-2 bg-success">
                      <label>Saldo Actual</label>
                      <h3 className="text-right my-0">{montoCuenta} </h3>
                    </div>
                  </div>
                  <div className="col-md-4 py-2 h-100 mx-auto">
                    <div className="col-md-12 card h-100 mx-auto rounded py-2 bg-warning">
                      <label>Total Movimientos</label>
                      <h3 className="text-right my-0">{records.length} </h3>
                    </div>
                  </div>
                  <div className="col-md-4 py-2 h-100 mx-auto ">
                    <div className="col-md-12 card h-100 mx-auto rounded py-2 bg-info">
                      <label>Total Miembros</label>
                      <h3 className="text-right my-0">52</h3>
                    </div>
                  </div>
                </div>

                <label className="text-dark">
                  Movimientos de la Cuenta:{" "}
                  <span className="text-info"> {nCuenta} </span>
                </label>
                <div className="col-md-12">
                  <TblContainer
                    container={{
                      height: 380,
                      width: "100%",
                      overflow: "auto",
                      padding: "2px",
                      border: "#007bff 2px solid",
                    }}
                  >
                    <TblHead />
                    <TableBody className="overflow-hidden px-2">
                      {records &&
                        records.map((item, index) => (
                          <TableRow key={index} style={{ padding: "0" }}>
                            <TableCell
                              className="align-baseline bg-light "
                              style={{ textAlign: "center", width: "25%" }}
                            >
                              {moment(item.fecha).format("DD-MM-YYYY")}
                            </TableCell>

                            <TableCell
                              className="align-baseline bg-light "
                              style={{ textAlign: "center", width: "25%" }}
                            >
                              {item.tiponota}
                            </TableCell>
                            <TableCell
                              className="align-baseline bg-light "
                              style={{ textAlign: "right", width: "25%" }}
                            >
                              {item.tiponota === "CREDITO" ? (
                                <span className="text-success">
                                  + {item.monto}{" "}
                                </span>
                              ) : (
                                <span className="text-danger">
                                  - {item.monto}{" "}
                                </span>
                              )}
                            </TableCell>
                            <TableCell
                              className="align-baseline bg-light "
                              style={{ textAlign: "right", width: "25%" }}
                            >
                              {item.saldo}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </TblContainer>
                </div>
              </div>
              <div className="col-md-6 h-100">
                <Bar options={options} data={data} />
                <div className="col-md-12 h-50">
                  <table className="table table-sm table-hover">
                    <thead className="bg-primary">
                      <tr>
                        <th scope="col">Banco</th>
                        <th scope="col">N° Cuenta</th>
                        <th scope="col">Saldo</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cuentas &&
                        cuentas.map((item, index) => (
                          <tr
                            className="text-dark"
                            key={index}
                            onClick={seleccionarCuentas2(item.idcuentabancaria)}
                          >
                            <th>{item.nombre} </th>
                            <th>{item.cuentabancaria} </th>
                            <th className="text-right">{item.saldoconcil} </th>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
                        ) : (*/}
          <div className='col-md-12 mx-auto'>
            <div className='card py-5'>

              <div className='col-md-12 row mx-auto py-5'>
              <div className='col-md-12 mx-auto row py-3'>
              <img src={logo} style={{ width: '20%'}}  className='mx-auto py-0'/>
              </div>
              <h1 className='text-dark mx-auto col-md-6 text-center py-0 my-0' >Bienvenido</h1>
              <h1 className='text-dark mx-auto col-md-12 text-center py-0 my-0' >Al Sistema de Gestion y Control de la</h1>
              <h1 className='text-info mx-auto col-md-6 text-center py-0 my-0' >I.D.P. Agua Blanca </h1>

              </div>
            </div>
          </div>
        {/*)}*/}
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
