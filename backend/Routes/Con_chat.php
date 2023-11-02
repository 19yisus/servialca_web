<?php
require './vendor/autoload.php';

$options = array(
  'cluster' => 'us2',
  'useTLS' => true
);
//$pusher = new Pusher\Pusher(
 // '0de0045a64400606066e',
  //'9924920562895d4b64f2',
  //'1696319',
 // $options
//);

require_once("./Models/cls_chat.php");

class Con_chat extends cls_chat
{
  public function __construct()
  {
    parent::__construct();

    // tabla conversacion
    // protected $id_con, $fecha_hora_con, $user_1_id, $user_2_id, $estatus_con;
    // // tabla sms_conversacion
    // protected $sms_id, $conversacion_id, $remitente, $fecha_hora_sms, $content_sms;

    $this->id_con = isset($_POST['id_con']) ? $_POST['id_con'] : "";
    $this->user_1_id = isset($_POST['user_1_id']) ? $_POST['user_1_id'] : "";
    $this->user_2_id = isset($_POST['user_2_id']) ? $_POST['user_2_id'] : "";

    $this->conversacion_id = isset($_POST['conversacion_id']) ? $_POST['conversacion_id'] : "";
    $this->sms_id = isset($_POST['sms_id']) ? $_POST['sms_id'] : "";
    $this->remitente = isset($_POST['remitente']) ? $_POST['remitente'] : "";
    $this->content_sms = isset($_POST['content_sms']) ? $_POST['content_sms'] : "";
  }

  public function crearConversacion()
  {
    $result1 = $this->buscarChats($this->user_1_id, $this->user_2_id);
    if ($result1['code'] == 200) $this->conversacion_id = $result1['data']['res']['id_con'];

    $result2 = $this->buscarChats($this->user_2_id, $this->user_1_id);
    if ($result2['code'] == 200) $this->conversacion_id = $result2['data']['res']['id_con'];

    if ($this->conversacion_id != "") {
      $resultado = $this->VerConversacion();
      Response($resultado['data'], $resultado['code']);
    } else {
      $resultado = $this->iniciarConversacion();
      Response($resultado['data'], $resultado['code']);
    }
  }

  public function enviarMensaje()
  {
    $resultado = $this->enviarSMS();
    Response($resultado['data'], $resultado['code']);
  }

  public function ListarMisConversaciones()
  {
    $resultado = $this->listarConversaciones();
    Response($resultado['data'], $resultado['code']);
  }

  public function DetalleConversacion()
  {
    $resultado = $this->VerConversacion();
    Response($resultado['data'], $resultado['code']);
  }
}
