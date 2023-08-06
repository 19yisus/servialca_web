<?php
require_once("./Models/cls_Auth.php");

class Con_Auth extends cls_Auth
{
  public function __construct()
  {
    parent::__construct();
    $this->id = isset($_POST["ID"]) ? $_POST["ID"] : null;
    $this->usuario = isset($_POST["Usuario"]) ? $_POST["Usuario"] : null;
    $this->nombre = isset($_POST["Nombre"]) ? strtoupper($_POST["Nombre"]) : null;
    $this->apellido = isset($_POST["Apellido"]) ? strtoupper($_POST["Apellido"]) : null;
    $this->cedula = isset($_POST["Cedula"]) ? $_POST["Cedula"] : null;
    $this->telefono = isset($_POST["Telefono"]) ? $_POST["Telefono"] : null;
    $this->direccion = isset($_POST["Direccion"]) ? $_POST["Direccion"] : null;
    $this->correo = isset($_POST["Correo"]) ? $_POST["Correo"] : null;
    $this->clave = isset($_POST["Clave"]) ? $_POST["Clave"] : null;
    $this->rol = isset($_POST["Rol"]) ? $_POST["Rol"] : null;
    $this->sucursal = isset($_POST["Sucursal"]) ? $_POST["Sucursal"] : null;
    $this->estatus = isset($_POST["Estatus"]) ? $_POST["Estatus"] : null;
    $this->modulo = isset($_POST["Modulos"]) ? $_POST["Modulos"] : [];
  }

  public function login()
  {
    if (!isset($_POST['Usuario']) || !isset($_POST['Clave'])) Response([
      'res' => "El usuario y clave son obligatorios"
    ], 400);

    $resultado = $this->sing_in();

    if ($resultado['code'] == 200) {
      $token = createToken($resultado['data']['usuario']['user_id'], $resultado['data']['usuario']['permisos']);
      Response([
        'data' => [
          'usuario' => [
            $resultado['data']['usuario'],
            $resultado['data']['sucursal']
          ],
          'token' => $token,
          'res' => $resultado['data']['res']
        ],
      ], 200);
      return false;
    }
  }

  public function encriptarClaves()
  {
    Response($this->encriptPasswords(), 200);
  }

  public function registrar()
  {
    $resultado = $this->Save();
    Response($resultado['data'], $resultado['code']);
  }

  public function actualizar()
  {
    $resultado = $this->update();
    Response($resultado['data'], $resultado['code']);
  }

  public function eliminar()
  {
    $resultado = $this->Delete();
    Response($resultado['data'], $resultado['code']);
  }

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
