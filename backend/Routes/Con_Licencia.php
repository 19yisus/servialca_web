<?php
require_once("./Models/cls_Licencia.php");

class Con_Licencia extends cls_Licencia
{
  public function __construct()
  {
    parent::__construct();
    $this->id = isset($_POST["ID"]) ? $_POST["ID"] : null;
    $this->cedula = isset($_POST["Cedula"]) ? $_POST["Cedula"] : null;
    $this->nombre = isset($_POST["Nombre"]) ? $_POST["Nombre"] : null;
    $this->apellido = isset($_POST["Apellido"]) ? $_POST["Apellido"] : null;
    $this->telefono = isset($_POST["Telefono"]) ? $_POST["Telefono"] : null;
    $this->lente = isset($_POST["Lente"]) ? $_POST["Lente"] : null;
    $this->correo = isset($_POST["Correo"]) ? $_POST["Correo"] : null;
    $this->sangre = isset($_POST["Sangre"]) ? $_POST["Sangre"] : null;
    $this->otrasLicencias = isset($_POST["otrasLicencias"]) ? $_POST["otrasLicencias"] : [];
    $this->licencia = isset($_POST["Licencia"]) ? $_POST["Licencia"] : null;
    $this->montoTotal = isset($_POST["montoTotal"]) ? $_POST["montoTotal"] : null;
    $this->abonado = isset($_POST["Abonado"]) ? $_POST["Abonado"] : null;
    $this->restante = isset($_POST["Restante"]) ? $_POST["Restante"] : null;
  }

  public function registrar()
  {
    $resultado = $this->RegistroLicencia($this->buscarCliente());
    Response($resultado["data"], $resultado["code"]);
  }

  // public function actualizar()
  // {
  //   $resultado = $this->update();
  //   Response($resultado["data"], $resultado["code"]);
  // }

  // public function eliminar()
  // {
  //   $resultado = $this->Delete();
  //   Response($resultado["data"], $resultado["code"]);
  // }

  public function ConsultarUno()
  {
    $resultado = $this->GetOne($_GET['ID']);
    Response($resultado, 200);
  }

  public function ConsultarTodos()
  {
    $resultado = $this->GetAll();
    Response($resultado, 200);
  }
}
