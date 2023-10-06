import React, { useEffect, useContext, useState } from "react";
import logo from '../imagenes/logo1.png';


function Galeria() {
 

	var op = require("../modulos/datos");


  const [activate, setActivate] = useState(false);
  const [mensaje, setMensaje] = useState({
    mostrar: false,
    titulo: "",
    texto: "",
    icono: "",
  });

  

  const [operacion , setOperacion ] = useState();
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
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })

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








  console.log('estas en menu')

  const selecionarRegistros = async () => {
    let endpoint = op.conexion + "/panel/ConsultarTodos";
    console.log(endpoint);
    setActivate(true);

    //setLoading(false);

    let bodyF = new FormData();

   // bodyF.append("ID", user_id);

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


  useEffect(() => {
    selecionarRegistros();
   

  }, []);




 
  return (
    <div className="col-md-12 mx-auto">
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
    <main role="col-md-12">
        
    
    <section class="mt-4 mb-5">
    <div class="container mb-4">
    	<h1 class="font-weight-bold title">Explore</h1>
    	<div class="row">
    		<nav class="navbar navbar-expand-lg navbar-light bg-white pl-2 pr-2">
    		<button class="navbar-light navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExplore" aria-controls="navbarsDefault" aria-expanded="false" aria-label="Toggle navigation">
    		<span class="navbar-toggler-icon"></span>
    		</button>
    	
    		</nav>
    	</div>
    </div>
    <div class="container-fluid">
    	<div class="row">
    		<div class="card-columns">
			{records.map((item, index) => (
    			<div class="card card-pin">
    				<img class="card-img" src={op.conexion+'/Img/'+item.nombre_img} alt="Card image"/>
    				<div class="overlay">
    					
    					<div class="more">
    						<a href="post.html">
    						<i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i> More </a>
    					</div>
    				</div>
    			</div>
    			
    		    ))}
    		
    		</div>
    	</div>
    </div>
    </section>
        
    </main>


    </div>
  );
}

export default Galeria;
