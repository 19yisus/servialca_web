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

const CatalogoClientes = (props) => {
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
      id: "Cedula",
      label: (
        <i
          style={{ color: "#1793dd", textAlign: "center" }}
          className="fas fa-code"
        >
          {" "}
          Cedula
        </i>
      ),
      textAlign: "center",
      fontFamily: "georgia",
    },
    {
      id: "Nombre",
      label: (
        <i
          style={{ color: "#1793dd", textAlign: "center" }}
          className="fas fa-signature"
        >
          {" "}
          Nombre
        </i>
      ),
      textAlign: "center",
      fontFamily: "georgia",
    },
    {
      id: "Apellido",
      label: (
        <i
          style={{ color: "#1793dd", textAlign: "center" }}
          className="fas fa-code-branch"
        >
          {" "}
          Apellido
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
              x.cliente_cedula.includes(target.value) ||
              x.cliente_nombre
                .toLowerCase()
                .includes(target.value.toLowerCase()) ||
              x.cliente_apellido
                .toLowerCase()
                .includes(target.value.toLowerCase())
            ) {
              return x;
            }
          });
        }
      },
    });
  };

  const selecionarRegistros = async () => {
    let endpoint = op.conexion + "/cliente/ConsultarTodos";
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
    var cedulaCompleta =
      recordsAfterPagingAndSorting()[index].cliente_cedula.split("-");
    var telefonoCompleto =
      recordsAfterPagingAndSorting()[index].cliente_telefono.split("-");
    var nac = cedulaCompleta[0];
    var ced = cedulaCompleta[1];
    var nom = recordsAfterPagingAndSorting()[index].cliente_nombre;
    var ape;
    if (recordsAfterPagingAndSorting()[index].cliente_apellido){
      ape = recordsAfterPagingAndSorting()[index].cliente_apellido;
    }else{
      ape = "";
    }
    var cor;
    if (recordsAfterPagingAndSorting()[index].cliente_correo){
      cor = recordsAfterPagingAndSorting()[index].cliente_correo;
    }else{
      cor = "";
    }
    var cod;
    if (telefonoCompleto[0]){
      cod = telefonoCompleto[0];
    }else{
      cod = "0412" ;
    }
    var tel = telefonoCompleto[1];
    var dir = recordsAfterPagingAndSorting()[index].cliente_direccion;
    blanquear();
    props.onHideCatalogo(nom, ape, ced, nac, cor, cod, tel, dir);
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
                      {item.cliente_cedula}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "10px",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      {item.cliente_nombre}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "10px",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      {item.cliente_apellido}
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

export default CatalogoClientes;
