import React, { useEffect, useContext, useState } from "react";

import { Mensaje } from "../components/mensajes";
import { Loader, Dimmer } from "semantic-ui-react";
import moment from "moment";

import axios from "axios";

function Panel() {
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

  const carrusel_1 = useState(); 
  const [carrusel_2, setCarrusel2] = useState();
  const [carrusel_3, setCarrusel3] = useState();

  const codigo = JSON.parse(localStorage.getItem("codigo"));
  const permiso = JSON.parse(localStorage.getItem("permiso"));
  const [operacion, setOperacion] = useState();
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
  const [idRol, setIdRol] = useState(0.0);
  const [mostrar, setMostrar] = useState(false);
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

  const selecionarRegistros = async () => {
    let endpoint = op.conexion + "/panel/ConsultarTodos";
    console.log(endpoint);
    setActivate(true);

    //setLoading(false);

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

  const actualizarCertificado = async () => {
    let endpoint = op.conexion + "/panel/SetAndSaveImages";
    console.log(endpoint);
    setActivate(true);

    //setLoading(false);

    let bodyF = new FormData();

   bodyF.append("carrusel_1", carrusel_1.current.files[0]);


    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        console.log(response);
        setMensaje({
          mostrar: true,
          titulo: "Exito.",
          texto: "Registro Guardado Exitosamente",
          icono: "exito",
        });
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

  console.log("estas en menu");

  useEffect(() => {
    selecionarRegistros();
  }, []);

  const onChangeValidar = (e) => {
    e.preventDefault();
    actualizarCertificado();
  };

  return (
    <div className="col-md-12 mx-auto">
      <div className="col-md-12 px-0 mx-auto ">
        <div class="col-md-12 mx-auto row px-2 py-4 mt-5">
          <form
            id="form_panel"
            name="form_panel"
            class="col-md-12 mx-auto row bg-light mt-4 rounded py-3"
          >
            <h3 class="mx-auto">Panel de Control</h3>
            <fieldset class="border border-danger rounded p-2 row mx-auto col-md-12 mb-3">
              <div class="col-md-12 ">
                <label class="fw-bold w-auto ">Imagenes del Carrusel</label>
              </div>

              <div class="col-md-4 px-0">
                <input
                  type="file"
                  style={{ height: "170px", width: "100%" }}
                  name="carrusel_1"
                  ref={carrusel_1}
                  class="form-control bg-transparent border "
                />
              </div>
              <div class="col-md-4 px-0">
                <input
                  type="file"
                  style={{ height: "170px", width: "100%" }}
                  name="carrusel_2"
                  ref={carrusel_2}
                  class="form-control bg-transparent border "
                />
              </div>
              <div class="col-md-4 px-0">
                <input
                  type="file"
                  style={{ height: "170px", width: "100%" }}
                  name="carrusel_3"
                  ref={carrusel_3}
                  class="form-control bg-transparent border "
                />
              </div>
            </fieldset>
            <fieldset class="border border-danger rounded p-2 row mx-auto col-md-12 mb-3">
              <div class="col-md-12 ">
                <label class="fw-bold w-auto ">Home</label>
              </div>

              <div class="col-md-4 px-0">
                <input
                  type="file"
                  style={{ height: "170px", width: "100%" }}
                  id="img_home"
                  name="home_1"
                  class="form-control bg-transparent border "
                />
              </div>

              <div class="col-md-8">
                <textarea
                  name="text_home"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  placeholder="Agregar una descripción"
                  rows="6"
                ></textarea>
              </div>
            </fieldset>
            <fieldset class="border border-danger rounded p-2 row mx-auto col-md-12 mb-3">
              <div class="col-md-12 ">
                <label class="fw-bold w-auto ">Quienes Somos</label>
              </div>

              <div class="col-md-4 px-0">
                <input
                  type="file"
                  style={{ height: "170px", width: "100%" }}
                  id="img_about"
                  name="about_1"
                  class="form-control bg-transparent border "
                />
              </div>

              <div class="col-md-8">
                <textarea
                  name="text_about"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  placeholder="Agregar una descripción"
                  rows="6"
                ></textarea>
              </div>
            </fieldset>

            <fieldset class="border border-danger rounded p-2 row mx-auto col-md-12 mb-3">
              <div class="col-md-6">
                <label
                  for="exampleFormControlTextarea1"
                  class="form-label fw-bold"
                >
                  Mision
                </label>
                <textarea
                  name="text_mision"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                ></textarea>
              </div>
              <div class="col-md-6">
                <label
                  for="exampleFormControlTextarea1"
                  class="form-label fw-bold"
                >
                  Vision
                </label>
                <textarea
                  name="text_vision"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                ></textarea>
              </div>
            </fieldset>

            <fieldset class="border border-danger rounded p-2 row mx-auto col-md-12 mb-3">
              <div class="col-md-12 mb-2">
                <label class="fw-bold w-auto ">Contactanos</label>
              </div>

              <div class="mb-2 col-md-6">
                <label class="form-label">Ubicación</label>
                <input
                  type="input"
                  name="text_ubicacion"
                  class="form-control"
                />
              </div>
              <div class="mb-2 col-md-6">
                <label class="form-label">Correo Electronico</label>
                <input type="email" name="text_correo" class="form-control" />
              </div>
              <div class="mb-2 col-md-6">
                <label class="form-label">Telefono</label>
                <input type="input" name="text_telefono" class="form-control" />
              </div>
              <div class="mb-2 col-md-6">
                <label class="form-label">Fax</label>
                <input type="input" name="text_fax" class="form-control" />
              </div>
              <div class="mb-2 col-md-12">
                <label class="form-label">Banner de Texto</label>
                <input type="text" name="text_banner" class="form-control" />
              </div>
            </fieldset>
            <fieldset class="border border-danger rounded p-2 row mx-auto col-md-12 mb-3">
              <div class="col-md-12 mb-2">
                <label class="fw-bold w-auto ">Banner</label>
              </div>

              <div class="col-md-4 px-0 mx-auto mb-3">
                <input
                  type="file"
                  style={{ height: "170px", width: "100%" }}
                  id="img_banner"
                  name="img_banner"
                  class="form-control bg-transparent border "
                />
              </div>
            </fieldset>

            <fieldset class="border border-danger rounded p-2 row mx-auto col-md-12 mb-3">
              <div class="col-md-12 ">
                <label class="fw-bold w-auto">Login</label>
              </div>
              <div class="col-md-12">
                <textarea
                  class="form-control"
                  name="text_login"
                  id="exampleFormControlTextarea1"
                  placeholder="Agregar una descripción"
                  rows="6"
                ></textarea>
              </div>
            </fieldset>

            <button
              onClick={onChangeValidar}
              class="btn btn-success col-md-2 mx-auto"
            >
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Panel;
