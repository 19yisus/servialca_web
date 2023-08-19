import React, { useState, useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import useTableScroll from "../../useTableScroll2";
import { TableBody, TableRow, TableCell } from "@material-ui/core";
import Logo from "../../../imagenes/logo.png";
import axios from "axios";
import { Loader, Dimmer } from "semantic-ui-react";
import { Mensaje } from "../../../components/mensajes";
import logo from "../../../imagenes/logo.png";
import moment from "moment";
import { formatMoneda } from "../../../util/varios";

const headCells = [
  { label: "Fecha", textAlign: "center" },
  { label: "Tipo", textAlign: "center" },
  { label: "Monto", textAlign: "center" },
  { label: "Saldo", textAlign: "center" },
];

// Create styles
const styles = StyleSheet.create({
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableRow1: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "30%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,

    borderTopWidth: 0,
  },

  tableFecha: {
    width: "28%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,

    borderTopWidth: 0,
  },

  tableMonto: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },

  tableCol1: {
    width: "30%",
  },
  tableFecha1: {
    width: "28%",
  },

  tableMonto1: {
    width: "20%",
  },

  tableColCod: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColCod1: {
    width: "20%",
  },
  tableCell: {
    margin: "auto",
    textAlign: "center",
    fontSize: 5,
    padding: "3px 0",
    width: "100%",
    verticalAlign: "middle",
  },
  tableColIndex: {
    width: "2%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColIndex1: {
    width: "2%",
  },

  tableCell: {
    margin: "auto",
    textAlign: "center",
    fontSize: 7,
    padding: "3px 0",
    width: "100%",
    verticalAlign: "middle",
  },
  tableCell1: {
    margin: "auto",
    textAlign: "center",
    fontSize: 10,
    padding: "3px 0",
    width: "100%",
    verticalAlign: "middle",
  },
  tableCell2: {
    margin: "auto",
    textAlign: "center",
    fontSize: 8,
    width: "100%",
    verticalAlign: "middle",
    padding: "4px auto",
  },
  container: {
    margin: "auto",
    padding: "1% 7%",
  },
  image: {
    width: 40,
    height: 40,
    margin: "2px auto",
  },
});

const hola = "variable";

// Create Document Component
const ReporteMovixIglesias = (props) => {
  let op = require("../../../modulos/datos");
  const codigo = JSON.parse(localStorage.getItem("codigo"));
  const condi = JSON.parse(localStorage.getItem("condi"));
  const [nombreBnaco, setNombreBanco] = useState("");
  const nombreagente = JSON.parse(localStorage.getItem("nombreagente"));
  const idcuenta = JSON.parse(localStorage.getItem("idcuenta"));
  const [records, setRecords] = useState([]);
  const idusuario = JSON.parse(localStorage.getItem("idusuario"));
  const fechasistema = JSON.parse(localStorage.getItem("fechasistema"));
  const [totalMonto, setTotalMonto] = useState(0);
  const [totalMontoS, setTotalMontoS] = useState(0);

  const [creyentes, setCreyentes] = useState();
  const [activate, setActivate] = useState(false);
  let token = localStorage.getItem("jwtToken");
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
  });

  const seleccionarCuenta = () => {
    //  e.preventDefault()
    let campos = "nombre,cuentabancaria";
    let nomtab = "cuentabancaria";
    let nomid = "idcuentabancaria";

    let endpoint2 = `${op.conexion}/api/consulta/modeli?campos=${campos}&id=${idcuenta}&nomtab=${nomtab}&nomid=${nomid}`;
    console.log(endpoint2);
    axios
      .get(endpoint2, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          setNombreBanco(
            response.data.nombre.trim() +
              " / " +
              response.data.cuentabancaria.trim()
          );
        }
      })
      .catch(function (error) {
        setMensaje({
          mostrar: true,
          titulo: "Error",
          texto: error.response.data.message,
          icono: "error",
        });
      });
  };

  const seleccionaRegistros = (condi) => {
    let campos = "*";
    let nomtab = "movimientosbancarios";
    let orden = "fecha desc";

    let endpoint =
      op.conexion +
      `/api/consulta/selecionarregistrocondi?campos=${campos}&nomtab=${nomtab}&condi=${condi.trim()}&orden=${orden}`;
    console.log(endpoint);
    setActivate(true);

    axios
      .get(endpoint, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response.data);

          setRecords(response.data);
          let montoTotal = 0;
          let montoTotal2 = 0;

          for (let i = 0; i < response.data.length; i++) {
            console.log(response.data[i].tiponota);
            if (response.data[i].tiponota.trim() === "CREDITO") {
              let monto = response.data[i].monto
                ? parseFloat(response.data[i].monto.toString())
                : 0;
              montoTotal = montoTotal + monto;
            } else {
              let monto = response.data[i].monto
                ? parseFloat(response.data[i].monto.toString())
                : 0;
              montoTotal2 = montoTotal2 + monto;
            }
          }

          setTotalMonto(montoTotal);
          setTotalMontoS(montoTotal2);
          seleccionarCuenta();
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

  useEffect(() => {
    const condi = JSON.parse(localStorage.getItem("condi"));
    seleccionaRegistros(condi);

    setActivate(true);
  }, []);

  return (
    <Document>
      <Page size="A4">
        <View style={{ padding: "5% 0" }}>
          <View
            style={{
              width: "100%",
              margin: "auto",
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            <View style={{ width: "30%", height: "70px" }}>
              <Image
                src={logo}
                style={{ width: 50, height: 50, margin: "auto" }}
              />
            </View>
            <View
              style={{
                width: "40%",
                verticalAlign: "center",
                paddingTop: "15px",
              }}
            >
              <Text
                style={{
                  fontSize: "8px",
                  fontWeight: "bold",
                  margin: "2px auto",
                  paddingTop: 0,
                }}
              >
                IGLESIA DE DIOS PENTECOSTAL M.I.{" "}
              </Text>
              <Text
                style={{
                  fontSize: "8px",
                  fontWeight: "bold",
                  margin: "2px auto",
                  paddingTop: 0,
                }}
              >
                REGIÓN ECLESIÁSTICA DE VENEZUELA
              </Text>
              <Text
                style={{
                  fontSize: "8px",
                  fontWeight: "bold",
                  margin: "2px auto",
                  paddingTop: 0,
                }}
              >
                ASOCIACIÓN CIVIL 821-326 RIF. J-30004078-0
              </Text>
              <Text
                style={{ fontSize: "8px", fontWeight: "bold", margin: "auto" }}
              >
                {nombreagente.trim()}
              </Text>
            </View>
          </View>
          <View style={styles.container}>
            <View style={{ width: "100%", padding: "2% 0" }}>
              <Text
                style={{
                  fontSize: "7px",
                  fontWeight: "bold",
                  margin: "auto",
                  width: "100%",
                }}
              >
                Balance de la cuenta {nombreBnaco}{" "}
              </Text>
            </View>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColIndex}>
                  <Text style={styles.tableCell2}>*</Text>
                </View>
                <View style={styles.tableColCod}>
                  <Text style={styles.tableCell2}>Fehca de Movimiento</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell2}>Referencia</Text>
                </View>
                <View style={styles.tableFecha}>
                  <Text style={styles.tableCell2}>Tipo Movimineto</Text>
                </View>
                <View style={styles.tableMonto}>
                  <Text style={styles.tableCell2}>Monto</Text>
                </View>
              </View>

              {records &&
                records.map((item, index) => (
                  <View style={styles.tableRow1}>
                    <View style={styles.tableColIndex1}>
                      <Text style={styles.tableCell}>
                        {parseInt(index) + 1}
                      </Text>
                    </View>
                    <View style={styles.tableColCod1}>
                      <Text style={styles.tableCell}>
                        {moment(item.fecha).format("DD-MM-YYYY")}
                      </Text>
                    </View>
                    <View style={styles.tableCol1}>
                      <Text style={styles.tableCell}>{item.referencia}</Text>
                    </View>
                    <View style={styles.tableFecha1}>
                      <Text style={styles.tableCell}>{item.tiponota}</Text>
                    </View>
                    <View style={styles.tableMonto1}>
                      <Text style={styles.tableCell}>
                        {item.monto
                          ? formatMoneda(
                              item.monto
                                .toString()
                                .replace(",", "")
                                .replace(".", ","),
                              ",",
                              ".",
                              2
                            )
                          : "0,00"}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
            <View style={styles.tableRow}>
              <View
                style={{
                  width: "70%",
                }}
              ></View>
              <View
                style={{
                  width: "30%",
                  borderStyle: "solid",
                  borderWidth: 1,
padding:'5px auto 5px 5px',
                  borderTopWidth: 0,
                }}
              >
               
                <Text style={{margin: "auto",
    textAlign: "center",
    fontSize: 8,
    width: "100%",
    verticalAlign: "middle",
    padding: "5px auto 5px 5px",}}>
                Total Entradas:  {totalMonto}
                </Text>
                <Text style={{margin: "auto",
    textAlign: "center",
    fontSize: 8,
    width: "100%",
    verticalAlign: "middle",
    padding: "5px auto 5px 5px",}}>
                  Total Salida: {totalMontoS}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              margin: "100px auto auto auto",
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: "8px",
                fontWeight: "bold",
                borderBottom: "solid #ffffff 3px",
                margin: "2px auto",
                paddingTop: 0,
              }}
            >
              ________________________________
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              margin: "auto",
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: "8px",
                fontWeight: "bold",
                margin: "2px auto",
                paddingTop: 0,
              }}
            >
              Firma del Pastor.
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              margin: "2px auto",
              flexWrap: "wrap",
              /*   flexDirection: "row", */
              padding: "0 7%",
              textAlign: "left",
            }}
          >
            <Text
              style={{
                fontSize: "8px",
                fontWeight: "bold",
                textAlign: "left",
                paddingTop: 0,
              }}
            >
              {"Fecha de Impresion: " +
                moment(fechasistema).format("DD-MM-YYYY")}
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              margin: "2px auto",
              flexWrap: "wrap",
              /*   flexDirection: "row", */
              padding: "0 7%",
              textAlign: "left",
            }}
          >
            <Text
              style={{
                fontSize: "8px",
                fontWeight: "bold",
                textAlign: "left",
                paddingTop: 0,
              }}
            >
              {"Codigo de Usuario a Cargo: " + idusuario}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReporteMovixIglesias;
