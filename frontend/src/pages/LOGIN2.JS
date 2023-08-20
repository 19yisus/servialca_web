import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";
import axios from "axios";
import { MensajeAlert, MensajeMinimal } from "../components/Alerta";
import Fade from "react-reveal/Fade";
import Zoom from "react-reveal/Zoom";
import { Loader, Dimmer } from "semantic-ui-react";

function Login(props) {
  const [loading, setLoading] = useState(false);

  let op = require("../../public/modulos/datos");

  const context = useContext(AuthContext);
  const [token, setToken] = useState();
  const [idzona, setIdZona] = useState();
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
  });
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const txtUserName = useRef(null);
  const txtPassword = useRef(null);

  const seleccionarDatos = (data) => {

    let campos = '*';
    let nomtab = '';
    let nomid = '';
    let tittle = '';

    if(data.permiso.trim() === 'LOCAL'){
      nomtab = 'iglesia';
      nomid = 'codiglesia';
      tittle = 'IDP'
    } else if(data.permiso.trim() === 'ZONAL'){
      nomtab = 'zona';
      nomid = 'codzona';
      tittle = 'ZONA'
    } else if(data.permiso.trim() === 'NACIONAL'){
      nomtab = 'region';
      nomid = 'codigo';
      tittle = 'REGION'
    }

    let endpoint = `${op.conexion}/api/consulta/modeli?campos=${campos}&id=${data.codigo}&nomtab=${nomtab}&nomid=${nomid}`;
   

    axios.get(endpoint, {
        headers: {
            'x-access-token': `${token}`
        }
    }).then(function (response) {

        if (response.status == 200) {
          if(response.data !== ''){
            console.log(response.data)
            localStorage.setItem("nombreagente", JSON.stringify(tittle+' '+response.data.descripcion));

            window.location.href = "/inicio";
            
    
          }
        
        }
      
    }).catch(function (error) {

        /* setTitulo("ERROR");
       
        setMostrar(true)
        setActivate(false); */
        console.log(error.response.data.message)

    })

}

  const sinIgn = () => {
    let endpoint = op.conexion + "/api/auth/signin";
    console.log(endpoint);

    var login = values.username;
    var passwd = values.password;

    axios
      .post(endpoint, {
        login: login,
        passwd: passwd,
      })
      .then(function (response) {
        if (response.status === 200) {
          context.login(response.data.token);
          if (response.data.token === null) {
            props.history.push("/");
          } else {
            setToken(response.data.token);
        
            localStorage.setItem("fechasistema", JSON.stringify(response.data.fechasistema));
            localStorage.setItem("anioactu", JSON.stringify(response.data.anioactu));
            localStorage.setItem("idusuario", JSON.stringify(response.data.idusuario));
            localStorage.setItem("login", JSON.stringify(response.data.login));
            localStorage.setItem("codigo", JSON.stringify(response.data.codigo));
            localStorage.setItem("permiso", JSON.stringify(response.data.permiso));
            localStorage.setItem("post", JSON.stringify(response.data));

            seleccionarDatos(response.data)

            
          }
        }
      })
      .catch(function (error) {
        MensajeAlert(
          "Notificacion",
          error.response.data.message,
          "error",
          "Aceptar"
        );
      })
      .finally(function () {
        setLoading(false);
      });
  };

  function loginUserCallback() {
    setLoading(true);
    sinIgn();
  }

  return (
    <div className="contenedor">
      <div>
        <nav
          className="navbar navbar-expand-lg navbar-dark d-none d-lg-block"
          style={{ zIndex: 2000 }}
        >
          <div className="container-fluid d-flex justify-content-between">
            {/* Navbar brand */}
            <a
              className="navbar-brand nav-link"
              target="_blank"
              href="https://mdbootstrap.com/docs/standard/"
            >
              <strong> Registro Iglesia de Dios Pentecostal</strong>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-mdb-toggle="collapse"
              data-mdb-target="#navbarExample01"
              aria-controls="navbarExample01"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="fas fa-bars" />
            </button>
            <div
              className="collapse navbar-collapse d-flex justify-content-end"
              id="navbarExample01"
            >
              <ul className="navbar-nav d-flex flex-row">
                <li className="nav-item me-3 me-lg-0">
                  <a
                    className="nav-link"
                    href="https://www.youtube.com/channel/UC5CF7mLQZhvx8O5GODZAhdA"
                    rel="nofollow"
                    target="_blank"
                  >
                    <i className="fab fa-youtube" />
                  </a>
                </li>
                <li className="nav-item me-3 me-lg-0">
                  <a
                    className="nav-link"
                    href="https://www.facebook.com/mdbootstrap"
                    rel="nofollow"
                    target="_blank"
                  >
                    <i className="fab fa-facebook-f" />
                  </a>
                </li>
                <li className="nav-item me-3 me-lg-0">
                  <a
                    className="nav-link"
                    href="https://twitter.com/MDBootstrap"
                    rel="nofollow"
                    target="_blank"
                  >
                    <i className="fab fa-twitter" />
                  </a>
                </li>
                <li className="nav-item me-3 me-lg-0">
                  <a
                    className="nav-link"
                    href="https://github.com/mdbootstrap/mdb-ui-kit"
                    rel="nofollow"
                    target="_blank"
                  >
                    <i className="fab fa-github" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div id="intro" className="bg-image shadow-2-strong">
          <div
            className="mask d-flex align-items-center h-100"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          >
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-xl-5 col-md-5 px-5">
                  <form
                    className="bg-white  rounded-3 shadow-5-strong py-4 px-5"
                    onSubmit={onSubmit}
                  >
                    <div className="h-100 d-flex justify-content-center m-2">
                      <img
                        src="./imagenes/logo.png"
                        className=" img-fluid"
                        style={{ height: 120, width: 120, margin: "auto" }}
                        alt
                      />
                    </div>
                    <Dimmer active={loading} inverted>
                      <Loader inverted>cargando...</Loader>
                    </Dimmer>

                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control form-control-sm"
                        required
                        style={{ borderBottom: "solid black 1px" }}
                        name="username"
                        value={values.username}
                        onChange={onChange}
                      />
                      <label className="form-label" htmlFor="form1Example1">
                        Usuario
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        ref={txtPassword}
                        type="password"
                        autoComplete="off"
                        className="form-control form-control-sm"
                        required
                        style={{ borderBottom: "solid black 1px" }}
                        name="password"
                        value={values.password}
                        onChange={onChange}
                      />
                      <label className="form-label" htmlFor="form1Example2">
                        Contraseña
                      </label>
                    </div>

                   {/*  <div className="row mb-4"> */}
                      {/* <div className="col d-flex justify-content-center">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            defaultValue
                            id="form1Example3"
                            defaultChecked
                          />
                          <label
                            className="form-check-label"
                            htmlFor="form1Example3"
                          >
                            Recuerdame
                          </label>
                        </div>
                      </div> */}
                   {/*    <div className="col text-center">
                     
                        <a href="#!">Recuperar Contraseña?</a>
                      </div> */}
                 {/*    </div> */}
                    {/* Submit button */}
                 
                      <button
                        type="submit"
                        className="btn btn-primary btn-block rounded-pill"
                      >
                        Iniciar Sesion
                      </button>
                 
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="bg-light text-lg-start">
          {/* Copyright */}
          <div
            className="text-center p-3"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
          >
            © 2020 Copyright:
            <a className="text-dark" href="https://mdbootstrap.com/">
              Iglesia Dios Pentecostal M.I. Venezuela
            </a>
          </div>
          {/* Copyright */}
        </footer>
      </div>
    </div>
  );
}

export default Login;