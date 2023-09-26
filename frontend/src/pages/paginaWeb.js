import React, { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";
import axios from "axios";
import { MensajeAlert, MensajeMinimal } from "../components/Alerta";
import { Loader, Dimmer, Label } from "semantic-ui-react";
import { GestionarClave } from "../components/componentesIglesia/configuracion/cambiarClavePersonal";
import md5 from "md5";
import { Mensaje } from '../components/mensajes'

function PaginaWeb(props) {
  const [loading, setLoading] = useState(false);

  let op = require("../modulos/datos");
  const [bloquear, setBloquear] = useState(0);
  const context = useContext(AuthContext);
  const [activate, setActivate] = useState(false);

  const [token, setToken] = useState();
  const [idzona, setIdZona] = useState();
  const [mostrar, setMostrar] = useState(false);
  const [mensaje, setMensaje] = useState({ mostrar: false, titulo: '', texto: '', icono: '' });

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "mfigueroa",
    password: "+11078879*",
  });



  useEffect(() => {
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
          setBloquear(1)
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

  const sinIgn = async () => {
    let endpoint = op.conexion + "/Auth/login";
    console.log(endpoint);
    setActivate(true)
    var login = values.username;
    var passwd = values.password;

    // let body = {
    //   Usuario: login,
    //   Clave: passwd
    // }

    setLoading(false);

    let bodyF = new FormData()

    bodyF.append("Usuario", login)
    bodyF.append("Clave", passwd)

    await fetch(endpoint, {
      method: "POST",
      body: bodyF
    }).then(res => res.json())
      .then(response =>{
     
        
        context.login(response.data.token)
       
        // window.location.href = '/inicio'
        const fecha = new Date();
        localStorage.setItem("fechasistema", JSON.stringify(fecha));
     
       localStorage.setItem("rol", JSON.stringify(response.data.usuario[0].rol));
       localStorage.setItem("user_id", JSON.stringify(response.data.usuario[0].user_id));
       localStorage.setItem("username", JSON.stringify(response.data.usuario[0].username));
       localStorage.setItem("permisos", JSON.stringify(response.data.usuario[0].permisos));
       localStorage.setItem("idsucursal", JSON.stringify(response.data.usuario[1].id));
       localStorage.setItem("sucursal", JSON.stringify(response.data.usuario[1].name));
       setActivate(false)
       window.location.href = "/inicio";



      })
      .catch(error =>  
        setMensaje({ mostrar: true, titulo: "Notificación", texto: error.res, icono: "informacion" })
        )



    // axios
    //   .post(endpoint, body, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .then(function (response) {
    //     console.log(response)
    //     if (response.status === 200) {
    //       console.log(response)
    //       /*context.login(response.data.token);
    //      if (response.data.token === null) {
    //        props.history.push("/");
    //      } else {
    //        setToken(response.data.token);

    //        localStorage.setItem(
    //          "fechasistema",
    //          JSON.stringify(response.data.fechasistema)
    //        );
    //        localStorage.setItem(
    //          "anioactu",
    //          JSON.stringify(response.data.anioactu)
    //        );
    //        localStorage.setItem(
    //          "idusuario",
    //          JSON.stringify(response.data.idusuario)
    //        );
    //       
    //        localStorage.setItem(
    //          "codigo",
    //          JSON.stringify(response.data.codigo)
    //        );
    //        localStorage.setItem(
    //          "permiso",
    //          JSON.stringify(response.data.permiso)
    //        );
    //        localStorage.setItem("post", JSON.stringify(response.data));


    //      }*/
    //       console.log(response.data);
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //   })
    //   .finally(function () {
    //     setLoading(false);
    //   });
  };

  function loginUserCallback() {
    setLoading(true);
    sinIgn();
    console.log('listo')
  }

  return (
    <div>
         <input type="radio" name="slider" id="slide1" checked/>
    <input type="radio" name="slider" id="slide2"/>
    <input type="radio" name="slider" id="slide3"/>
    
    <div class="slider">
        <div class="slides">
            <div class="slide" id="slide1">1</div>
            <div class="slide" id="slide2">23</div>
            <div class="slide" id="slide3">3</div>
           
        </div>
    </div>
        </div>
  );
}

export default PaginaWeb;
