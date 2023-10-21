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
    $this->permiso = isset($_POST["Permiso"]) ? $_POST["Permiso"] : null;
    $this->id_pregunta = isset($_POST["id_pregunta"]) ? $_POST["id_pregunta"] : null;
    $this->des_respuesta = isset($_POST["des_respuesta"]) ? $_POST["des_respuesta"] : null;
    $this->des_pregunta = isset($_POST["des_pregunta"]) ? $_POST["des_pregunta"] : null;
    $this->des_pregunta2 = isset($_POST["des_pregunta2"]) ? $_POST["des_pregunta2"] : null;
    $this->des_respuesta = isset($_POST["des_respuesta"]) ? $_POST["des_respuesta"] : null;
    $this->des_respuesta2 = isset($_POST["des_respuesta2"]) ? $_POST["des_respuesta2"] : null;
  }



  public function login()
  {
    if (!isset($this->usuario) || !isset($this->clave)) {
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
          'res' => $resultado['data']['res']
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

  public function ConsultarByUsuario()
  {
    $resultado = $this->GetOneByUser($_GET['usuario']);
    Response($resultado, 200);
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
  public function Luz()
  {
    $resultado = $this->quitarLuz();
    Response($resultado["data"], $resultado["code"]);
  }

  public function savePreguntas()
  {
    $resultado = $this->Save_respuestas();
    Response($resultado["data"], $resultado["code"]);
  }

  public function ConsultarPreguntas()
  {
    $resultado = $this->getPreguntasFromUser();
    Response($resultado, 200);
  }

  public function EliminarUsuario()
  {
    $resultado = $this->DeleteUser();
    Response($resultado["data"], $resultado["code"]);
  }

  public function ModificarEstatus()
  {
    $resultado = $this->ChangeStatus($_POST["Estatus"]);
    Response($resultado["data"], $resultado["code"]);
  }

  // public function actualizar_password()
  // {
  //   $resultado = $this->updatePass();
  //   Response($resultado['data'], $resultado['code']);
  // }

  // preguntas y respuestas de seguridad
  // public function registrar_respuestas()
  // {
  //   $resultado = $this->Save_respuestas();
  //   Response($resultado['data'], $resultado['code']);
  // }

  // public function actualizar_respuestas()
  // {
  //   $resultado = $this->Update_respuestas();
  //   Response($resultado['data'], $resultado['code']);
  // }

  // public function get_preguntas()
  // {
  //   $resultado = $this->getPreguntas();
  //   Response($resultado['data'], $resultado['code']);
  // }

  public function get_preguntas_from_user()
  {
    $resultado = $this->getPreguntasFromUser();
    Response($resultado, 200);
  }
}
