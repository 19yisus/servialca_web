<?php
ini_set('display_errors',1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

require_once("./libs/jwt.php");

function Response($data, $code)
{
  // header('Access-Control-Allow-Origin: *');
  // header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  // header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
  print(json_encode($data));
  http_response_code($code);
  return false;
}

class Api
{
  public $url;

  public function __construct()
  {
    try{
      $this->GetController($this->GetRoute());
    }catch(Exception $e){
      error_log("Error servidor: ".$e->GetMessage());
    }
    
  }

  private function GetRoute()
  {
    $url = isset($_GET['url']) ? $_GET['url'] : "saludo/";
    $url = rtrim($url, '/');
    $url = explode('/', $url);
    $this->url = $url;

    return $url;
  }

  private function CreateArrayFromPost($jsonString)
  {
    $jsonString = str_replace('\\"', '"', $jsonString);
    $array = json_decode($jsonString, true);

    return $array;
  }

  private function GetController($peticion)
  {
    $metodo_peticion = (isset($peticion[1]) ? $peticion[1] : $peticion[0]);
    $file_controller_file = "./Routes/Con_" . $peticion[0] . ".php";

    if (file_exists($file_controller_file)) {

      if ($peticion[0] != 'Auth') {
        if (isset($_POST['token']) || isset($_GET['token'])) {
          $token = isset($_POST['token']) ? $_POST['token'] : $_GET['token'];
          $resultValido = validateToken($token);
          if (!$resultValido) {
            // El token no es valido
            Response([
              'res' => "El token no es valido",
            ], 403);
          }
        }
      }
      
      $postData = file_get_contents("php://input");
      $data = $this->CreateArrayFromPost($postData);
      require_once($file_controller_file);      
      $cls_name = "Con_" . $peticion[0];
      $cls = new $cls_name();      
      $cls->$metodo_peticion();
    }
  }
}


$api = new Api();
