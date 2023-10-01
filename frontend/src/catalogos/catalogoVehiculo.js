import React, { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";

import { Mensaje } from "../components/mensajes";
import { Loader, Dimmer } from "semantic-ui-react";
import useTable from "../components/useTable";

import {
  TableBody,
  TableRow,
  TableCell,
  InputAdornment,
} from "@material-ui/core";
import axios from "axios";

const CatalogoVehiculo = (props) => {
  let op = require("../modulos/datos");
  let token = localStorage.getItem("jwtToken");

  const btnCancela = useRef();
  const [mostrar, setMostrar] = useState(false);
  const [titulo, setTitulo] = useState();
  const [msg, setMsg] = useState();
  const [activate, setActivate] = useState(false);
  const [records, setRecords] = useState([]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });
  const headCells = [
    {
      id: "Placa",
      label: (
        <i
          style={{ color: "#1793dd", textAlign: "center" }}
          className="fas fa-code"
        >
          {" "}
          Placa
        </i>
      ),
      textAlign: "center",
      fontFamily: "georgia",
    },
    {
      id: "Modelo",
      label: (
        <i
          style={{ color: "#1793dd", textAlign: "center" }}
          className="fas fa-signature"
        >
          {" "}
          Modelo
        </i>
      ),
      textAlign: "center",
      fontFamily: "georgia",
    },
    {
      id: "Marca",
      label: (
        <i
          style={{ color: "#1793dd", textAlign: "center" }}
          className="fas fa-code-branch"
        >
          {" "}
          Marca
        </i>
      ),
      textAlign: "center",
      fontFamily: "georgia",
    },
    {
      id: "Color",
      label: (
        <i
          style={{ color: "#1793dd", textAlign: "center" }}
          className="fas fa-signature"
        >
          {" "}
          Color
        </i>
      ),
      textAlign: "center",
      fontFamily: "georgia",
    },
  ];

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;

    setFilterFn({
      fn: (items) => {
        if (target.value === "") {
          return items;
        } else {
          return items.filter((x) => {
            if (
              x.vehiculo_placa.includes(target.value) ||
              x.modelo_nombre
                .toLowerCase()
                .includes(target.value.toLowerCase()) ||
              x.marca_nombre.toLowerCase().includes(target.value.toLowerCase())
            ) {
              return x;
            }
          });
        }
      },
    });
  };

  const selecionarRegistros = async () => {
    let endpoint = op.conexion + "/vehiculo/ConsultarTodos";
    console.log(endpoint);
    setActivate(true);

    //setLoading(false);

    let bodyF = new FormData();

    // bodyF.append("ID", user_id)

    await fetch(endpoint, {
      method: "POST",
      // body: bodyF
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

  const blanquear = () => {
    setMostrar(false);
    setTitulo("");
    setMsg("");
    setActivate(false);
    setRecords([]);
    setFilterFn({
      fn: (items) => {
        return items;
      },
    });
  };

  const handleCloseMensa = () => {
    setMostrar(false);
  };

  const cancelar = () => {
    blanquear();
    props.onHideCancela();
  };

  const seleccionarClase = (index) => (event) => {
    var pla = recordsAfterPagingAndSorting()[index].vehiculo_placa;
    var pue = recordsAfterPagingAndSorting()[index].vehiculo_puesto;
    var uso = recordsAfterPagingAndSorting()[index].usoVehiculo_nombre;
    var ano = recordsAfterPagingAndSorting()[index].vehiculo_año;
    var serM = recordsAfterPagingAndSorting()[index].vehiculo_serialMotor;
    var cla = recordsAfterPagingAndSorting()[index].clase_nombre;
    var col = recordsAfterPagingAndSorting()[index].color_nombre;
    var serC = recordsAfterPagingAndSorting()[index].vehiculo_serialCarroceria;
    var tip = recordsAfterPagingAndSorting()[index].tipoVehiculo_nombre;
    var mar = recordsAfterPagingAndSorting()[index].marca_nombre;
    var mod = recordsAfterPagingAndSorting()[index].modelo_nombre;
    var pes = recordsAfterPagingAndSorting()[index].vehiculo_peso;
    var capT = recordsAfterPagingAndSorting()[index].vehiculo_capTon;
    blanquear();
    props.onHideCatalogo(
      pla,
      pue,
      uso,
      ano,
      serM,
      cla,
      col,
      serC,
      tip,
      mod,
      mar,
      pes,
      capT
    );
  };

  return (
    <Modal
      {...props}
      size="lg"
      style={{ background: "rgb(28, 27, 23)" }}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      onShow={() => {
        selecionarRegistros();
      }}
    >
      <Modal.Header className="bg-danger">
        <Modal.Title style={{ color: "#fff" }}>
          Seleccionar Cliente.
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/*   <Mensaje titulo={titulo} mensaje={msg}
                    show={mostrar}
                    onHide={handleCloseMensa} /> */}
        <Dimmer active={activate} inverted>
          <Loader inverted>Cargando...</Loader>
        </Dimmer>
        <div className="col-md-12" style={{ marginBottom: "10px" }}>
          <div className="row">
            <div className="col-md-4">
              <input
                type="text"
                className=" col-md-12 form-control form-control-sm rounded-pill"
                onChange={handleSearch}
                placeholder="Buscar"
              />
            </div>
          </div>
        </div>
        <div className="col-md-12" style={{ margin: "auto" }}>
          <TblContainer>
            <TblHead />

            <TableBody>
              {records &&
                recordsAfterPagingAndSorting().map((item, index) => (
                  <TableRow
                    key={item.idclaseminas}
                    style={{ padding: "0" }}
                    onClick={seleccionarClase(index)}
                  >
                    <TableCell
                      style={{
                        fontSize: "10px",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      {item.vehiculo_placa}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "10px",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      {item.modelo_nombre}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "10px",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      {item.marca_nombre}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "10px",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      {item.color_nombre}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </TblContainer>
          <TblPagination />
        </div>
      </Modal.Body>
      <Modal.Footer className="container">
        <button
          ref={btnCancela}
          onClick={cancelar}
          className="btn btn-sm btn-danger rounded-pill"
        >
          <i className="fa"> Cancelar</i>
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default CatalogoVehiculo;
