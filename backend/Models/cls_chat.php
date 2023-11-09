<?php
require_once("cls_db.php");

abstract class cls_chat extends cls_db
{
  // tabla conversacion
  protected $id_con, $fecha_hora_con, $user_1_id, $user_2_id, $estatus_con;
  // tabla sms_conversacion
  protected $sms_id, $conversacion_id, $remitente, $fecha_hora_sms, $content_sms;
  public function __construct()
  {
    parent::__construct();
  }

  // inicia conservacion si no existe
  // para iniciar conversacion solo se necesita el id de ambos usuarios

  protected function iniciarConversacion()
  {
    try {
      $sql = $this->db->prepare("INSERT INTO conversacion(fecha_hora_con, user_1_id, user_2_id, estatus_con)
        VALUES(NOW(),?,?,1)");

      if ($sql->execute([$this->user_1_id, $this->user_2_id])) {
        $id = $this->db->lastInsertId();
        $this->reg_bitacora([
          'table_name' => "conversacion",
          'des' => "Creación de conversación de los usuarios 1: $this->user_1_id, 2: $this->user_2_id"
        ]);

        return [
          "data" => [
            "res" => "Conversación creada!",
            "id" => $id
          ],
          "code" => 200
        ];
      }

      return [
        "data" => [
          "res" => "Error al crear conversación"
        ],
        "code" => 400
      ];
    } catch (PDOException $e) {
      return [
        "data" => [
          'res' => "Error de consulta: " . $e->getMessage()
        ],
        "code" => 400
      ];
    }
  }

  // para enviar un sms, se necesita el id de la conversacion, el id de el remitente
  protected function enviarSMS()
  {
    try {
      $result = $this->ConfirmarRemitent();
      if (!$result) {
        return [
          "data" => [
            "res" => "No se puede procesar su solicitud!"
          ],
          "code" => 400
        ];
      }
      $sql = $this->db->prepare("INSERT INTO sms_conversacion(conversacion_id, remitente, fecha_hora_sms, content_sms)
        VALUES(?,?,NOW(),?)");

      if ($sql->execute([$this->conversacion_id, $this->remitente, $this->content_sms])) {

        $this->reg_bitacora([
          'table_name' => "sms_conversacion",
          'des' => "Envio de mensaje, remitente: $this->remitente, id_conversación: $this->conversacion_id"
        ]);

        return [
          "data" => [
            "res" => "Mensaje enviado!"
          ],
          "code" => 200
        ];
      }

      return [
        "data" => [
          "res" => "No fue posible enviar el mensaje"
        ],
        "code" => 400
      ];
    } catch (PDOException $e) {
      return [
        "data" => [
          'res' => "Error de consulta: " . $e->getMessage()
        ],
        "code" => 400
      ];
    }
  }

  protected function buscarChats($user1, $user2)
  {
    try {
      $sql = $this->db->query("SELECT * FROM  conversacion WHERE user_1_id = $user1 AND user_2_id = $user2");

      if ($sql->RowCount() > 0) {
        $listado = $sql->fetch(PDO::FETCH_ASSOC);
        return [
          "data" => [
            "res" => $listado
          ],
          "code" => 200
        ];
      } else {
        return [
          "data" => [
            "res" => "Sin conversaciones disponibles"
          ],
          "code" => 400
        ];
      }
    } catch (PDOException $e) {
      return [
        "data" => [
          'res' => "Error de consulta: " . $e->getMessage()
        ],
        "code" => 400
      ];
    }
  }

  protected function listarConversaciones()
  {
    try {
      $sql = $this->db->query("SELECT * FROM  conversacion WHERE user_1_id = $this->remitente OR user_2_id = $this->remitente");

      if ($sql->RowCount() > 0) {
        $listado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return [
          "data" => [
            "res" => $listado
          ],
          "code" => 200
        ];
      } else {
        return [
          "data" => [
            "res" => "Sin conversaciones disponibles"
          ],
          "code" => 400
        ];
      }
    } catch (PDOException $e) {
      return [
        "data" => [
          'res' => "Error de consulta: " . $e->getMessage()
        ],
        "code" => 400
      ];
    }
  }

  protected function VerConversacion()
  {
    try {
      $sql = $this->db->query("SELECT * FROM sms_conversacion WHERE conversacion_id = $this->conversacion_id");
      if ($sql->RowCount() > 0) {
        $chat = $sql->fetchAll(PDO::FETCH_ASSOC);
        return [
          "data" => [
            "res" => $chat,
            "id" => $this->conversacion_id
          ],
          "code" => 200
        ];
      } else {

        return [
          "data" => [
            "res" => "Sin mensajes disponibles",
            "id" => $this->conversacion_id
          ],
          "code" => 400
        ];
      }
    } catch (PDOException $e) {
      return [
        "data" => [
          'res' => "Error de consulta: " . $e->getMessage()
        ],
        "code" => 400
      ];
    }
  }

  protected function ConfirmarRemitent()
  {
    try {
      $result = $this->db->query("SELECT * FROM conversacion WHERE id_con = $this->conversacion_id");

      if ($result->RowCount() > 0) {
        $dt = $result->fetch(PDO::FETCH_ASSOC);

        if ($dt['user_1_id'] == $this->remitente || $dt['user_2_id'] == $this->remitente) return true;
        else return false;
      }
      return false;
    } catch (PDOException $e) {
      return [
        "data" => [
          'res' => "Error de consulta: " . $e->getMessage()
        ],
        "code" => 400
      ];
    }
  }
}
