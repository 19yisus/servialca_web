import React, { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";
import axios from "axios";
import { MensajeAlert, MensajeMinimal } from "../components/Alerta";
import { Loader, Dimmer, Label, Item } from "semantic-ui-react";
import md5 from "md5";
import { Mensaje } from "../components/mensajes";
import logo from "../imagenes/logo1.png";
import banner1 from "../imagenes/banner1.jpeg";
import Fade from "react-reveal/Fade";

function PaginaWeb(props) {
  const [loading, setLoading] = useState(false);

  let op = require("../modulos/datos");
  const [values, setValues] = useState(0);
  const context = useContext(AuthContext);
  const [activate, setActivate] = useState(false);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [token, setToken] = useState();
  const [idzona, setIdZona] = useState();
  const [mostrar, setMostrar] = useState(false);
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });

  const { onChange, onSubmit } = useForm(loginUserCallback, {
    username: "mfigueroa",
    password: "+11078879*",
  });

  const [records, setRecords] = useState([]);

  const selecionarRegistrosTexts = async () => {
    let endpoint = op.conexion + "/panel/ConsultarTodosTexts";
    console.log(endpoint);
    setActivate(true);
    await fetch(endpoint, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        console.log(response);
        setValues(response[0]);
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
        console.log(response);
        console.log(response);
        let carrusel_1 = "";
        let carrusel_2 = "";
        let carrusel_3 = "";

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
          }
        }

        console.log("aqui2");

        setRecords({
          carrusel_1: carrusel_1,
          carrusel_2: carrusel_2,
          carrusel_3: carrusel_3,
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
  const selecionarRegistrosWeb = async () => {
    let endpoint = op.conexion + "/panel/ConsultarTodos";
    setActivate(true);
    //setLoading(false);
    let bodyF = new FormData();
    bodyF.append("tag", "img_home");
    console.log(endpoint);
    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
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
  useEffect(() => {
    context.logout();
    selecionarRegistros();
    selecionarRegistrosWeb();
    // selecionarRegistrosTexts();
  }, []);
  const bloquearUsuario = async () => {
    let endpoint = `${op.conexion}/api/comun/bloquearusuario`;
    let body;

    let bodyF = new FormData();

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        setActivate(false);
        console.log(response);
        setValues(response[0]);
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

  const txtUserName = useRef(null);
  const txtPassword = useRef(null);

  const sinIgn = async () => {
    let endpoint = op.conexion + "/Auth/login";
    console.log(endpoint);
    setActivate(true);
    var login = values.username;
    var passwd = values.password;

    // let body = {
    //   Usuario: login,
    //   Clave: passwd
    // }

    setLoading(false);

    let bodyF = new FormData();

    bodyF.append("Usuario", login);
    bodyF.append("Clave", passwd);

    await fetch(endpoint, {
      method: "POST",
      body: bodyF,
    })
      .then((res) => res.json())
      .then((response) => {
        context.login(response.data.token);

        // window.location.href = '/inicio'
        const fecha = new Date();
        localStorage.setItem("fechasistema", JSON.stringify(fecha));

        localStorage.setItem(
          "rol",
          JSON.stringify(response.data.usuario[0].rol)
        );
        localStorage.setItem(
          "user_id",
          JSON.stringify(response.data.usuario[0].user_id)
        );
        localStorage.setItem(
          "username",
          JSON.stringify(response.data.usuario[0].username)
        );
        localStorage.setItem(
          "permisos",
          JSON.stringify(response.data.usuario[0].permisos)
        );
        localStorage.setItem(
          "idsucursal",
          JSON.stringify(response.data.usuario[1].id)
        );
        localStorage.setItem(
          "sucursal",
          JSON.stringify(response.data.usuario[1].name)
        );
        setActivate(false);
        window.location.href = "/inicio";
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

  function loginUserCallback() {
    setLoading(true);
    sinIgn();
    console.log("listo");
  }

  function isInViewport(elem) {
    var distance = elem.getBoundingClientRect();
    return (
      distance.top <
        (window.innerHeight || document.documentElement.clientHeight) &&
      distance.bottom > 0
    );
  }

  return (
    <div className="col-md-12 px-0 mx-auto ">
      <nav class="navbar navbar-expand-lg  fixed-top">
        <div class="container-fluid bg-danger ">
          <a class="navbar-brand py-2" href="#">
            <img src={logo} className="logo-navbar" alt="MDN" />
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div className="row">
            <div
              class="col align-self-end collapse navbar-collapse "
              id="navbarSupportedContent"
            >
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link" href="#home">
                    <i class="fas fa-home"></i> Home
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#quienes">
                    <i class="fas fa-id-card-alt"></i> Quienes Somos
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#contact">
                    <i class="fas fa-address-book"></i> Contactanos
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/login">
                    <i class="fas fa-sign-in-alt"></i> Login
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {/* <div id="slider">
        <figure>
          {records.slice(0, 3).map((item, index) => (
            <img
              key={item.id_file}
              src={op.conexion + "/ImgPanel/" + item.ruta_img}
              alt=""
            />
          ))}
        </figure>
      </div>*/}

      <div id="slider">
        <figure>
          <img src={op.conexion + "/ImgPanel/" + records.carrusel_1} alt="" />
        </figure>
        <figure>
          <img src={op.conexion + "/ImgPanel/" + records.carrusel_2} alt="" />
        </figure>
        <figure>
          <img src={op.conexion + "/ImgPanel/" + records.carrusel_3} alt="" />
        </figure>
      </div>

      <div class="col-md-12 mx-auto" id="home">
        <Fade left>
          <div class="col-md-12 mx-auto" id="home">
            <div class="col-md-12 mx-auto row py-5" id="homediv">
              <div class="col-md-12 mx-auto text-center mt-5 py-4">
                <h1 class="fw-bold text-center text-servial">
                  - <i class="fas fa-home"></i> Home -
                </h1>
              </div>

              <div class="col-md-5 mx-auto"></div>
              <div class="col-md-7 mx-auto text-center">{values.text_home}</div>
            </div>
          </div>
        </Fade>
        <Fade right>
          <div class="col-md-12 mx-auto px-0">
            <img src={banner1} style={{ width: "100%" }} class=" img-fluid" />
          </div>
        </Fade>
        <Fade left>
          <div class="col-md-12 mx-auto py-5" id="quienes">
            <div class="row col-md-12 mx-auto" id="quienesdiv">
              <div class="col-md-12 mx-auto row py-5">
                <div class="col-md-12 mx-auto text-center">
                  <h1 class="fw-bold text-center text-servial">
                    - <i class="fas fa-id-card-alt"></i> Quienes Somos -
                  </h1>
                </div>
              </div>
              <div class="col-md-12 mx-auto row py-5">
                <div class="col-md-6 mx-auto text-center">
                  {values.text_about}
                </div>

                <div class="col-md-6 mx-auto py-4">
                  <img src="" alt="" class="img-fluid" srcset="" />
                </div>
              </div>
            </div>
          </div>
        </Fade>
        <Fade right>
          <div class="col-md-12 py-5" id="contact">
            <div class="row  col-md-12 mt-5 mb-5 " id="contactanos">
              <div class="col-md-12 mx-auto row py-5">
                <div class="col-md-12 mx-auto text-center">
                  <h1 class="fw-bold text-center text-servial">
                    - <i class="fas fa-address-book"></i> Contactanos -
                  </h1>
                </div>
              </div>
              <div class="col-md-12 mx-auto row py-5">
                <div class="col-md-4 mx-auto py-4">
                  <form class="card shadow p-4 rounded border">
                    <div class="mb-2">
                      <label for="exampleInputEmail1" class="form-label">
                        Tu Correo:
                      </label>
                      <input
                        type="email"
                        class="form-control form-control-sm bg-transparent rounded-pill"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                      />
                      <div id="emailHelp" class="form-text">
                        Ingresa tu correo para poder comunicarnos contigo,
                      </div>
                    </div>
                    <div class="mb-3">
                      <label for="exampleInputPassword1" class="form-label">
                        Mensaje
                      </label>
                      <textarea
                        type="textarea"
                        class="form-control"
                        id="exampleInputPassword1"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      class="btn btn-primary btn-sm rounded-pill"
                    >
                      Enviar Mensaje
                    </button>
                  </form>
                </div>
                <div class="col-md-5 mx-auto py-4">
                  <ul class="fa-ul">
                    <li class="mb-3">
                      <h5 class="fa-li">
                        <i class="fas fa-home"></i>
                      </h5>
                      <h5 class="ms-2"> {values.text_ubicacion}</h5>
                    </li>
                    <li class="mb-3">
                      <h5 class="fa-li">
                        <i class="fas fa-envelope"></i>
                      </h5>
                      <h5 class="ms-2"> {values.text_correo}</h5>
                    </li>
                    <li class="mb-3">
                      <h5 class="fa-li">
                        <i class="fas fa-phone"></i>
                      </h5>
                      <h5 class="ms-2"> {values.text_telefono}</h5>
                    </li>
                    <li class="mb-3">
                      <h5 class="fa-li">
                        <i class="fas fa-print"></i>
                      </h5>
                      <h5 class="ms-2"> {values.text_fax}</h5>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Fade>
        <Fade left>
          <div class="row  col-md-12 mt-5 mb-5" id="misionvision">
            <div class="col-md-12 mx-auto row py-5">
              <div class="col-md-6 mx-auto py-4">
                <div class="col-md-12 mx-auto text-center row py-5">
                  <div class="col-md-12 mx-auto text-center">
                    <h1 class="fw-bold text-center text-servial">- Vision -</h1>
                  </div>

                  <h5 class="ms-2 mt-3"> {values.text_vision}</h5>
                </div>
              </div>
              <div class="col-md-6 mx-auto py-4">
                <div class="col-md-12 mx-auto text-center row py-5">
                  <div class="col-md-12 mx-auto text-center">
                    <h1 class="fw-bold text-center text-servial">- Mision -</h1>
                  </div>

                  <h5 class="ms-2 mt-3"> {values.text_mision}</h5>
                </div>
              </div>
            </div>
          </div>
        </Fade>
        <div class="col-md-12 mx-auto px-0 fixed-bottom">
          <div class="slider2">
            <div class="slide-track d-flex justify-content-end">
              <div class="slide text-left">
                <span>La pagina Servialca rcv se enceuntra en desarrollo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-12 mx-auto px-0 fixed-bottom">
        <div class="slider2">
          <div class="slide-track d-flex justify-content-end">
            <div class="slide text-left">
              <span>Servialca lideres en RCV</span>
            </div>
          </div>
        </div>
      </div>
      <a
        href="https://wa.me/573001112233?text=Hola!%20Estoy%20interesado%20en%20tu%20servicio"
        class="btn-wsp"
        target="_blank"
      >
        <i class="fab fa-whatsapp"></i>
      </a>
      <footer class="text-center text-white bg-servial mb-3">
        <div class="container p-4 pb-0">
          <section class="mb-4">
            <a
              class="btn btn-outline-light btn-floating m-1"
              href="#!"
              role="button"
            >
              <i class="fab fa-facebook-f"></i>
            </a>

            <a
              class="btn btn-outline-light btn-floating m-1"
              href="#!"
              role="button"
            >
              <i class="fab fa-twitter"></i>
            </a>

            <a
              class="btn btn-outline-light btn-floating m-1"
              href="#!"
              role="button"
            >
              <i class="fab fa-google"></i>
            </a>

            <a
              class="btn btn-outline-light btn-floating m-1"
              href="#!"
              role="button"
            >
              <i class="fab fa-instagram"></i>
            </a>

            <a
              class="btn btn-outline-light btn-floating m-1"
              href="#!"
              role="button"
            >
              <i class="fab fa-linkedin-in"></i>
            </a>

            <a
              class="btn btn-outline-light btn-floating m-1"
              href="#!"
              role="button"
            >
              <i class="fab fa-github"></i>
            </a>
          </section>
        </div>

        <div
          class="text-center py-5"
          style={{ backgroundColor: " rgba(0, 0, 0, 0.2)" }}
        >
          © 2020 Copyright:
          <a
            class="text-white"
            href="https://servialcarcv.com/"
            target="_blank"
          >
            Servialcarcv.com
          </a>
        </div>
      </footer>
    </div>
  );
}

export default PaginaWeb;
