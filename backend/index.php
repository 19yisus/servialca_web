<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

require_once("./libs/jwt.php");

function Response($data, $code)
{
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
  print(json_encode($data));
  http_response_code($code);
  return false;
}

class Api
{

  private $ruta_actual, $code_error, $code_done, $titleContent, $controlador, $metodo_peticion, $ObjMessage;
  public $url;

  public function __construct()
  {
    $this->GetController($this->GetRoute());
  }

  private function GetRoute()
  {
    $url = isset($_GET['url']) ? $_GET['url'] : "saludo/";
    $url = rtrim($url, '/');
    $url = explode('/', $url);
    $this->url = $url;
    return $url;
  }

  private function AuthToken($peticion)
  {
    if ($peticion[0] != 'Auth') {
      if (isset($_POST['token']) || isset($_GET['token'])) {
        $token = isset($_POST['token']) ? $_POST['token'] : $_GET['token'];
        $resultValido = validateToken($token);
        if (!$resultValido) {
          // El token no es valido
          Response([
            'res' => "El token no es valido",
          ], 403);
          return false;
        }
      }
    }
  }

  private function GetController($peticion)
  {
    $metodo_peticion = (isset($peticion[1]) ? $peticion[1] : $peticion[0]);
    $file_controller_file = "./Routes/Con_" . $peticion[0] . ".php";

    if (file_exists($file_controller_file)) {
      require_once($file_controller_file);
      $cls_name = "Con_" . $peticion[0];
      if (class_exists($cls_name)) {
        $cls = new $cls_name();
        if (method_exists($cls, $metodo_peticion)) {
          // $this->AuthToken($peticion);
          $cls->$metodo_peticion();
        } else {
          Response("No existe el metodo requerido", 400);
        }
      } else {
        Response("No existe la clase requerida", 400);
      }
    } else {
      Response("No existe el recurso requerido", 400);
    }
  }
}


$api = new Api();
