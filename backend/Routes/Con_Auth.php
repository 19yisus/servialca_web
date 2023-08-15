<?php
require_once("./Models/cls_Auth.php");

class Con_Auth extends cls_Auth
{
  public function __construct($datos, $peticion)
  {
    parent::__construct();
    $this->id = isset($datos["ID"]) ? $datos["ID"] : null;
    $this->usuario = isset($datos["Usuario"]) ? $datos["Usuario"] : null;
    $this->nombre = isset($datos["Nombre"]) ? strtoupper($datos["Nombre"]) : null;
    $this->apellido = isset($datos["Apellido"]) ? strtoupper($datos["Apellido"]) : null;
    $this->cedula = isset($datos["Cedula"]) ? $datos["Cedula"] : null;
    $this->telefono = isset($datos["Telefono"]) ? $datos["Telefono"] : null;
    $this->direccion = isset($datos["Direccion"]) ? $datos["Direccion"] : null;
    $this->correo = isset($datos["Correo"]) ? $datos["Correo"] : null;
    $this->clave = isset($datos["Clave"]) ? $datos["Clave"] : null;
    $this->rol = isset($datos["Rol"]) ? $datos["Rol"] : null;
    $this->sucursal = isset($datos["Sucursal"]) ? $datos["Sucursal"] : null;
    $this->estatus = isset($datos["Estatus"]) ? $datos["Estatus"] : null;
    $this->modulo = isset($datos["Modulos"]) ? $datos["Modulos"] : [];

    switch ($peticion) {
      case 'login':
        $this->login();
        break;
      default:
        Response("Metodo no encontrado", 400);
    }
  }

  public function login()
  {
    if (!isset($this->usuario) || !isset($this->clave)) {
      var_dump($this->usuario, $this->clave);
      Response([
        'res' => "El usuario y clave son obligatorios"
      ], 400);
      return false;
    }

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
    } else {
      Response([
        'data' => [
          'res' => "Algo salío mal"
        ],
      ], 400);
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
