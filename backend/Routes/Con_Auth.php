<?php
  require_once("./Models/cls_Auth.php");

  class Con_Auth extends cls_Auth{
    public function __construct()
    {
      parent::__construct();
    }

    public function login(){
      var_dump($_POST);
    }

    public function registrar(){
      echo "Registrar";
      // $this->cedula = $_POST['cedula'];
      // $this->nombre = $_POST['nombre'];
      // $this->registrar();
    }

    public function update(){
      echo "Actualizar";
    }

    public function eliminar(){
      echo "Eliminar";
    }

    public function consultar(){
      echo "Consultar";
      // $_GET['cedula'];
    }

    public function consultar_todo(){
      echo "consultar todo";
    }
  }