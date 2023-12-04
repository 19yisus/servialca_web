import React, { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";
import axios from "axios";
import { MensajeAlert, MensajeMinimal } from "../components/Alerta";
import { Loader, Dimmer, Label } from "semantic-ui-react";
import md5 from "md5";
import { Mensaje } from "../components/mensajes";
import { GestionarPreguntas } from "../components/seguridad/preguntasSeguridad";
import { GestionarClave } from "../components/seguridad/cambiarClavePersonal";

function Login(props) {
  const [loading, setLoading] = useState(false);
  const img_login = useRef();
  let op = require("../modulos/datos");
  const [bloquear, setBloquear] = useState(0);
  const context = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const [activate, setActivate] = useState(false);
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

  const [token, setToken] = useState();
  const [idzona, setIdZona] = useState();

  const [mostrar, setMostrar] = useState(false);
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });

  const { onChange, onSubmit, values } = useForm(() => loginUserCallback(), {
    username: "",
    password: "",
  });

  useEffect(() => {
    selecionarRegistros();
    context.logout();
  }, []);

  const txtUserName = useRef(null);
  const txtPassword = useRef(null);

  const bloquearUsuario = () => {
    let endpoint = `${op.conexion}/api/comun/bloquearusuario`;
    let body;

    body = {
      usuario: values.username.toLowerCase(),
    };

    axios
      .post(endpoint, body, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then(function (response) {
        if (response.status === 200) {
          setBloquear(1);
          setMensaje({
            mostrar: true,
            titulo: "Notificación",
            texto: "Por Razones de Seguridad su usuario a sido bloqueado",
            icono: "informacion",
          });
        }
        setActivate(false);
      })
      .catch(function (error) {
        setActivate(false);
        setMensaje({
          mostrar: true,
          titulo: "Error",
          texto:
            error.response.data.message ===
            "llave duplicada viola restricción de unicidad «persona_pkey»"
              ? "ya existe una persona con esa cedula"
              : error.response.data.message,
          icono: "error",
        });
      });
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
        console.log(response.data.res.code);
        console.log(response.data.res.text);
        context.login(response.data.token);
        // window.location.href = '/inicio'
        const fecha = new Date();
        localStorage.setItem("fechasistema", JSON.stringify(fecha));

        setActivate(false);

        if (response.data.res.code == 200) {
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

          setMensaje({
            mostrar: true,
            titulo: "Exito.",
            texto: response.data.res.text,
            icono: "exito",
          });

          window.location.href = "/inicio";
        }
        if (response.data.res.code == 400) {
          setMensaje({
            mostrar: true,
            titulo: "Error.",
            texto: response.data.res.text,
            icono: "error",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setMensaje({
          mostrar: true,
          titulo: "Notificación",
          texto: error.res,
          icono: "informacion",
        });
      });
  };

  const changeIcon = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  function loginUserCallback() {
    // if (userInput.toLowerCase() != captchaText.toLowerCase()) {
      setLoading(true);
      sinIgn();
    //  else {
    //   //  alert('CAPTCHA incorrecto, intenta de nuevo');
    //   setMensaje({
    //     mostrar: true,
    //     titulo: "Notificación",
    //     texto: "Error en el CAPTCHA",
    //     icono: "informacion",
    //   });
    //   setLoading(false);
    //   generateCaptcha(); // Generar un nuevo CAPTCHA después de un intento fallido
    //   setUserInput(""); // Limpiar el campo de entrada
    // }
    console.log("listo");
  }

  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");

  // Función para generar un nuevo CAPTCHA
  // const generateCaptcha = () => {
  //   // Implementa la lógica para generar un CAPTCHA como se muestra en el ejemplo anterior
  //   // Por ejemplo, puedes usar una función para generar texto aleatorio y asignarlo a captchaText
  //   // Ejemplo simple:
  //   const captcha = Math.random().toString(36).substring(7);
  //   setCaptchaText(captcha);
  // };

  // // Función para verificar el CAPTCHA ingresado por el usuario
  // const checkCaptcha = () => {};

  // const [captchaValid, setCaptchaValid] = useState(false);

  // useEffect(() => {
  //   // Generar un CAPTCHA al cargar el componente
  //   generateCaptcha();
  // }, []);

  return (
    <div className="contenedor">
      <GestionarClave
        show={mostrar}
        onHideCancela={() => {
          setMostrar(false);
        }}
      />

      <Mensaje
        mensaje={mensaje}
        onHide={() => {
          parseInt(bloquear) === 3
            ? bloquearUsuario()
            : setMensaje({ mostrar: false, titulo: "", texto: "", icono: "" });
        }}
      />

      <div class="container-fluid ps-md-0">
        <Dimmer active={loading} inverted>
          <Loader inverted>cargando...</Loader>
        </Dimmer>
        <div class="row g-0">
          <div class="d-none d-md-flex col-md-4 col-lg-6 bg-image">
            <div
              style={{
                height: "100vh",
                width: "100%",
                backgroundImage:
                  "url('" +
                  op.conexion +
                  "/ImgPanel/" +
                  records.img_login +
                  "')",
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
              ref={img_login}
              name="img_login"
            />
          </div>
          <div class="col-md-8 col-lg-6">
            <div class="login d-flex align-items-center ">
              <div class="container">
                <div class="row">
                  <div class="col-md-9 col-lg-8 mx-auto">
                    <div
                      className=" img-fluid mx-auto logo-login"
                      style={{ height: 120, width: 280 }}
                    ></div>

                    <h3 class="login-heading text-center fw-bold mb-4">
                      {" "}
                      Sistema de Servial C.A
                    </h3>

                    <form onSubmit={onSubmit}>
                      <div class="form-floating mb-3">
                        <input
                          type="text"
                          class="form-control"
                          required
                          autoComplete="off"
                          name="username"
                          value={values.username}
                          onChange={onChange}
                        />
                        <label for="floatingInput">Usuario</label>
                      </div>
                      <div className="form-floating mb-3 position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control text-uppercase"
                          required
                          autoComplete="off"
                          name="password"
                          value={values.password}
                          onChange={onChange}
                          maxLength={10}
                          style={{ paddingRight: "2.5rem" }} // Ajusta el valor según sea necesario
                        />
                        <span
                          onClick={changeIcon}
                          className="position-absolute"
                          style={{
                            top: "50%",
                            right: "1rem",
                            transform: "translateY(-50%)",
                          }}
                        >
                          <i
                            className={`fas ${
                              showPassword ? "fa-eye-slash" : "fa-eye"
                            }`}
                          ></i>
                        </span>
                        <label htmlFor="floatingPassword">Contraseña</label>
                      </div>

                      {/* <div className="captcha-container input-group mx-auto mb-3 col-md-7 ">
                        <label className="captcha-text my-auto d-flex align-items-center rounded-pill">
                          {captchaText}
                        </label>
                        <input
                          type="text"
                          className={`form-control my-auto rounded-pill ${
                            captchaValid ? "is-valid" : "is-invalid"
                          }`}
                          id="captchaInput"
                          placeholder="Ingresa CAPTCHA"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                        />
                      </div> */}

                      <div class="d-grid">
                        <button
                          class="btn rounded-pill btn-lg btn-primary btn-login text-uppercase fw-bold mb-2"
                          type="submit"
                        >
                          Ingresar
                        </button>
                        <div class="text-center">
                          <a
                            class="small"
                            type="button"
                            onClick={() => {
                              setMostrar(true);
                            }}
                          >
                            <h6>Recuperar Contraseña</h6>
                          </a>
                        </div>
                        <div class="text-center">
                          <a class="small" type="button" href="/">
                            <h6>Salir al Inicio</h6>
                          </a>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
