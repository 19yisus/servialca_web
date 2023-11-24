import React, { useEffect, useContext, useState, useRef } from "react";

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

  const carrusel_1 = useRef();
  const carrusel_2 = useRef();
  const carrusel_3 = useRef();
  const img_home = useRef();
  const text_home = useRef();
  const img_about = useRef();
  const text_about = useRef();
  const text_mision = useRef();
  const text_vision = useRef();
  const text_ubicacion = useRef();
  const text_correo = useRef();
  const text_telefono = useRef();
  const text_banner = useRef();
  const img_banner = useRef();
  const img_login = useRef();
  const text_fax = useRef();
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
  const [values, setValues] = useState({
    ced: "",
    nombre: "",
    apellido: "",
    fecha_nac: "",
    bas_agua: 1,

    status: 1,
    bas_espirit: 1,
    cod_iglesia: "",
    sexo: "M",
    fecha_baus: "",
    nacionalidad: "V",
    direccion: "",
    telefono: "",
    celular: "",
    estadocivil: 0,
    correo: "",
    tiposangre: "",
  });
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

  const blanquear = () => {
    setValues({
      ced: "",
      nombre: "",
      apellido: "",
      fecha_nac: "",
      bas_agua: 1,

      status: 1,
      bas_espirit: 1,
      cod_iglesia: "",
      sexo: "M",
    });
  };

  const seleccionarRegistrosTexto = async () => {
    let endpoint = op.conexion + "/panel/ConsultarTodosTexts";
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

        text_home.current.value = response[0].text_home;
        text_about.current.value = response[0].text_about;
        text_mision.current.value = response[0].text_mision;
        text_vision.current.value = response[0].text_vision;
        text_ubicacion.current.value = response[0].text_ubicacion;
        text_correo.current.value = response[0].text_correo;
        text_telefono.current.value = response[0].text_telefono;
        text_banner.current.value = response[0].text_fax;
        setValues(response);
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

  const selecionarRegistros = async () => {
    let endpoint = op.conexion + "/panel/ConsultarTag";
    setActivate(true);
    //setLoading(false);
    let bodyF = new FormData();
    bodyF.append("tag", "carrusel");
    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        let carrusel_1 = "";
        let carrusel_2 = "";
        let carrusel_3 = "";
        let img_home = "";
        let img_about = "";
        let img_banner = "";
        let img_login = "";
        console.log("aqui");
        for (let i = 0; i < response.length; i++) {
          if (response[i].tag && response[i].tag.toString() === "carrusel_1") {
            carrusel_1 = response[i].ruta_img;
          } else if (
            response[i].tag &&
            response[i].tag.toString() === "carrusel_2"
          ) {
            carrusel_2 = response[i].ruta_img;
          } else if (
            response[i].tag &&
            response[i].tag.toString() === "carrusel_3"
          ) {
            carrusel_3 = response[i].ruta_img;
          } else if (
            response[i].tag &&
            response[i].tag.toString() === "img_home"
          ) {
            img_home = response[i].ruta_img;
          } else if (
            response[i].tag &&
            response[i].tag.toString() === "img_about"
          ) {
            img_about = response[i].ruta_img;
          } else if (
            response[i].tag &&
            response[i].tag.toString() === "img_banner"
          ) {
            img_banner = response[i].ruta_img;
          } else if (
            response[i].tag &&
            response[i].tag.toString() === "img_login"
          ) {
            img_login = response[i].ruta_img;
          }
        }

        setRecords({
          carrusel_1: carrusel_1,
          carrusel_2: carrusel_2,
          carrusel_3: carrusel_3,
          img_home: img_home,
          img_about: img_about,
          img_banner: img_banner,
          img_login: img_login,
        });

        console.log(records);
        console.log("aqui3");
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
    bodyF.append("carrusel_2", carrusel_2.current.files[0]);
    bodyF.append("carrusel_3", carrusel_3.current.files[0]);
    bodyF.append("text_home", text_home.current.value);
    bodyF.append("text_about", text_about.current.value);
    bodyF.append("text_mision", text_mision.current.value);
    bodyF.append("text_vision", text_vision.current.value);
    bodyF.append("text_ubicacion", text_ubicacion.current.value);
    bodyF.append("text_correo", text_correo.current.value);
    bodyF.append("text_telefono", text_telefono.current.value);
    bodyF.append("img_home", img_home.current.files[0]);
    bodyF.append("img_about", img_about.current.files[0]);
    bodyF.append("text_banner", text_banner.current.value);
    bodyF.append("img_banner", img_banner.current.files[0]);
    bodyF.append("img_login", img_login.current.files[0]);
    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        setMensaje({
          mostrar: true,
          titulo: "Exito.",
          texto: response.res,
          icono: "exito",
        });

        if (response.code == 400) {
          setMensaje({
            mostrar: true,
            titulo: "Error.",
            texto: response.res,
            icono: "error",
          });
        }
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
  const cerrarModal = () => {
    setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
  };

  console.log("estas en menu");

  useEffect(() => {
    selecionarRegistros();
    seleccionarRegistrosTexto();
  }, []);

  const onChangeValidar = (e) => {
    e.preventDefault();
    actualizarCertificado();
  };

  return (
    <div className="col-md-12 mx-auto">
      {/*<Dimmer active={activate} inverted>
          <Loader inverted>cargando...</Loader>
  </Dimmer>*/}
      <Mensaje
        mensaje={mensaje}
        onHide={() => {
          mensaje.titulo === "Exito."
            ? cerrarModal()
            : setMensaje({
                mostrar: false,
                titulo: "",
                texto: "",
                icono: "",
              });
        }}
      />

      <div className="col-md-12 px-0 mx-auto ">
        <div class="col-md-12 mx-auto row px-2 py-4 mt-5">
          <form
            id="form_panel"
            name="form_panel"
            class="col-md-12 mx-auto row bg-light mt-4 rounded py-3"
          >
            <h3 class="mx-auto">Panel de Control</h3>
            <fieldset class=" row mx-auto col-md-12 mb-1">
              <div class="col-md-12 p-2 rounded row border mx-auto bg-light border-dark">
                <div class="col-md-12 ">
                  <label class="fw-bold w-auto ">Imagenes del Carrusel</label>
                </div>

                <div class="col-md-4 px-0">
                  <input
                    type="file"
                    style={{
                      height: "170px",
                      width: "100%",
                      backgroundImage:
                        "url('" +
                        op.conexion +
                        "/ImgPanel/" +
                        records.carrusel_1 +
                        "')",
                    }}
                    name="carrusel_1"
                    ref={carrusel_1}
                    class="form-control bg-transparent border "
                    onChange={(e) => {
                      console.log(e.target.value);
                    }}
                  />
                </div>
                <div class="col-md-4 px-0">
                  <input
                    type="file"
                    style={{
                      height: "170px",
                      width: "100%",
                      backgroundImage:
                        "url('" +
                        op.conexion +
                        "/ImgPanel/" +
                        records.carrusel_2 +
                        "')",
                    }}
                    name="carrusel_2"
                    ref={carrusel_2}
                    class="form-control bg-transparent border "
                  />
                </div>
                <div class="col-md-4 px-0">
                  <input
                    type="file"
                    style={{
                      height: "170px",
                      width: "100%",
                      backgroundImage:
                        "url('" +
                        op.conexion +
                        "/ImgPanel/" +
                        records.carrusel_3 +
                        "')",
                    }}
                    name="carrusel_3"
                    ref={carrusel_3}
                    class="form-control bg-transparent border "
                  />
                </div>
              </div>
            </fieldset>
            <fieldset class=" row mx-auto col-md-4 mb-1">
              <div class="col-md-12 p-2 rounded row border mx-auto bg-light border-dark">
                <div class="col-md-12 ">
                  <label class="fw-bold w-auto ">Home</label>
                </div>

                <div class="col-md-12 px-0 mb-1">
                  <input
                    type="file"
                    style={{
                      height: "80px",
                      width: "100%",
                      backgroundImage:
                        "url('" +
                        op.conexion +
                        "/ImgPanel/" +
                        records.img_home +
                        "')",
                    }}
                    ref={img_home}
                    name="img_home"
                    class="form-control bg-transparent border "
                  />
                </div>

                <div class="col-md-12 px-0">
                  <textarea
                    ref={text_home}
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    placeholder="Agregar una descripción"
                    rows="6"
                  ></textarea>
                </div>
              </div>
            </fieldset>
            <fieldset class=" row mx-auto col-md-4 mb-1">
              <div class="col-md-12 p-2 rounded row border mx-auto bg-light border-dark">
                <div class="col-md-12 ">
                  <label class="fw-bold w-auto ">Quienes Somos</label>
                </div>

                <div class="col-md-12 px-0 mb-1">
                  <input
                    type="file"
                    style={{
                      height: "80px",
                      width: "100%",
                      backgroundImage:
                        "url('" +
                        op.conexion +
                        "/ImgPanel/" +
                        records.img_about +
                        "')",
                    }}
                    id="img_about"
                    ref={img_about}
                    name="about_1"
                    class="form-control bg-transparent border "
                  />
                </div>

                <div class="col-md-12 px-0">
                  <textarea
                    name="text_about"
                    ref={text_about}
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    placeholder="Agregar una descripción"
                    rows="6"
                  ></textarea>
                </div>
              </div>
            </fieldset>

            <fieldset class=" row mx-auto col-md-4 mb-1">
              <div class="col-md-12 p-2 rounded row border mx-auto bg-light border-dark">
                <div class="col-md-12 px-0">
                  <label
                    for="exampleFormControlTextarea1"
                    class="form-label fw-bold"
                  >
                    Mision
                  </label>
                  <textarea
                    name="text_mision"
                    ref={text_mision}
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  ></textarea>
                </div>
                <div class="col-md-12 px-0">
                  <label
                    for="exampleFormControlTextarea1"
                    class="form-label fw-bold"
                  >
                    Vision
                  </label>
                  <textarea
                    name="text_vision"
                    ref={text_vision}
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </fieldset>

            <fieldset class=" row mx-auto col-md-5 mb-1 px-0">
              <div class="col-md-12 p-2 rounded row border mx-auto bg-light border-dark">
                <div class="col-md-12 mb-2">
                  <label class="fw-bold w-auto ">Contactanos</label>
                </div>

                <div class="mb-2 col-md-12">
                  <label class="form-label">Ubicación</label>
                  <input
                    type="input"
                    name="text_ubicacion"
                    ref={text_ubicacion}
                    class="form-control"
                  />
                </div>
                <div class="mb-2 col-md-12">
                  <label class="form-label">Correo Electronico</label>
                  <input
                    type="email"
                    ref={text_correo}
                    name="text_correo"
                    class="form-control"
                  />
                </div>
                <div class="mb-2 col-md-12">
                  <label class="form-label">Telefono</label>
                  <input
                    type="input"
                    ref={text_telefono}
                    name="text_telefono"
                    class="form-control"
                  />
                </div>
                {/* <div class="mb-2 col-md-12">
                <label class="form-label">Fax</label>
                <input type="input" name="text_fax" class="form-control" />
              </div> */}
                <div class="mb-2 col-md-12">
                  <label class="form-label">Banner de Texto</label>
                  <input type="text" ref={text_banner} class="form-control" />
                </div>
              </div>
            </fieldset>
            <div className="col-md-7 row">
              <fieldset class=" row mx-auto col-md-12 mb-1">
                <div class="col-md-12 p-2 rounded row border mx-auto bg-light border-dark">
                  <div class="col-md-12 mb-2">
                    <label class="fw-bold w-auto ">Banner</label>
                  </div>

                  <div class="col-md-12 px-0 mx-auto mb-1">
                    <input
                      type="file"
                      style={{
                        height: "80px",
                        width: "100%",
                        backgroundImage:
                          "url('" +
                          op.conexion +
                          "/ImgPanel/" +
                          records.img_banner +
                          "')",
                        backgroundSize: "cover",
                      }}
                      ref={img_banner}
                      id="img_banner"
                      name="img_banner"
                      class="form-control bg-transparent border "
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset class=" row mx-auto col-md-12 mb-1">
                <div class="col-md-12 p-2 rounded row border mx-auto bg-light border-dark">
                  <div class="col-md-12 ">
                    <label class="fw-bold w-auto">Login</label>
                  </div>
                  <div class="col-md-12">
                    <input
                      type="file"
                      style={{
                        height: "80px",
                        width: "100%",
                        backgroundImage:
                          "url('" +
                          op.conexion +
                          "/ImgPanel/" +
                          records.img_login +
                          "')",
                      }}
                      ref={img_login}
                      name="img_login"
                      class="form-control bg-transparent border "
                    />
                  </div>
                </div>
              </fieldset>
            </div>

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
