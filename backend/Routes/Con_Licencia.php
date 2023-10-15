<?php
require_once("./Models/cls_Licencia.php");

class Con_Licencia extends cls_Licencia
{
  public function __construct()
  {
    parent::__construct();
    $this->id = isset($_POST["ID"]) ? $_POST["ID"] : null;
    $this->cliente = isset($_POST["idCliente"]) ? $_POST["idCliente"] : null;
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
    $this->referencia = isset($_POST["Referencia"]) ? $_POST["Referencia"] : null;
    $this->metodo = isset($_POST["metodoPago"]) ? $_POST["metodoPago"] : null;
    $this->cobertura = isset($_POST["Cobertura"]) ? $_POST["Cobertura"] : null;
    $this->lente = isset($_POST["Lente"]) ? $_POST["Lente"] : null;
  }

  public function Editar()
  {
    $resultado = $this->Edit();
    Response($resultado, 200);
  }

  public function consultarUno()
  {
    $resultado = $this->GetOne($_POST["ID"]);
    Response($resultado, 200);
  }

  public function ConsultarTodos()
  {
    $resultado = $this->GetAll();
    Response($resultado, 200);
  }
}
