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
    width: "50%",
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
    borderRightWidth: 0,
    borderTopWidth: 0,
  },

  tableCol1: {
    width: "50%",
  },
  tableFecha1: {
    width: "28%",
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
    fontSize: 9,
    width: "100%",
    verticalAlign: "middle",
    padding: "4px auto",
    fontWeight: "bold",
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
const ReporteCreyentes = (props) => {
  let op = require("../../../modulos/datos");
  const codigo = JSON.parse(localStorage.getItem("codigo"));
  const nombreagente = JSON.parse(localStorage.getItem("nombreagente"));
  const [records, setRecords] = useState([]);
  const idusuario = JSON.parse(localStorage.getItem("idusuario"));
  const [creyentes, setCreyentes] = useState();
  const [activate, setActivate] = useState(false);
  let token = localStorage.getItem("jwtToken");
  const fechasistema = JSON.parse(localStorage.getItem("fechasistema"));
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
  });

  const seleccionaRegistros = () => {
    let campos = "*";
    let nomtab = "persona";
    let condi = "cod_iglesia=" + codigo;
    let orden = "ced";

    let endpoint = `${op.conexion}/api/consulta/selecionarregistrocondi?&campos=${campos}&nomtab=${nomtab}&condi=${condi}&orden=${orden}`;
    console.log(endpoint);

    axios
      .get(endpoint, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          setRecords(response.data);
          console.log(response.data);
          setActivate(false);
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

  useEffect(() => {
    seleccionaRegistros();

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
                  fontSize: "8px",
                  fontWeight: "bold",
                  margin: "auto",
                  width: "100%",
                }}
              >
                Listado de Creyentes
              </Text>
            </View>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColIndex}>
                  <Text style={styles.tableCell2}>*</Text>
                </View>
                <View style={styles.tableColCod}>
                  <Text style={styles.tableCell2}>Cedula</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell2}>Nombre y Apellido</Text>
                </View>
                <View style={styles.tableFecha}>
                  <Text style={styles.tableCell2}>Fecha Nacimiento</Text>
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
                      <Text style={styles.tableCell}>{item.ced}</Text>
                    </View>
                    <View style={styles.tableCol1}>
                      <Text style={styles.tableCell}>
                        {item.nombre + " " + item.apellido}
                      </Text>
                    </View>
                    <View style={styles.tableFecha1}>
                      <Text style={styles.tableCell}>
                        {moment(item.fecha_nac).format("DD-MM-YYYY")}
                      </Text>
                    </View>
                  </View>
                ))}
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

export default ReporteCreyentes;
