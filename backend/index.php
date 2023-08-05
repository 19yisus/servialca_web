<?php

class Api
{

  private $ruta_actual, $code_error, $code_done, $titleContent, $controlador, $metodo_peticion, $ObjMessage;
  public $url;

  public function __construct()
  {
    session_start();
    // $this->ObjMessage = new c_messages();
    $this->GetController($this->GetRoute());
  }

  private function GetRoute()
  {
    $url = isset($_GET['url']) ? $_GET['url'] : "saludo/";
    $url = rtrim($url, '/');
    $url = explode('/', $url);
    $this->url = $url;

    // if (sizeof($url) > 2 && $url[2] === "err") $this->code_error = $url[3];
    // if (sizeof($url) > 2 && $url[2] === "msg") $this->code_done = $url[3];
    return $url;
  }

  private function GetController($peticion)
  {
    $this->metodo_peticion = (isset($peticion[1]) ? $peticion[1] : $peticion[0]);
    $file_controller_file = "./Routes/Con_" . $peticion[0] . ".php";

    if (file_exists($file_controller_file)) {
      require_once($file_controller_file);

      $cls_name = "Con_" . $peticion[0];
      $cls = new $cls_name();
      $cls->{$this->metodo_peticion}();
    }
  }
}

$api = new Api();
