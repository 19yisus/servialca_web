<?php
require_once("cls_db.php");

abstract class cls_Licencia extends cls_db
{
  protected $id, $cedula, $nombre, $apellido, $correo, $telefono, $lente, $sangre, $otrasLicencias, $licencia, $montoTotal, $abonado, $restante, $cliente;

  public function __construct()
  {
    parent::__construct();
  }


  protected function GetAll()
  {
    $sql = $this->db->prepare("SELECT cliente.*, licencia.* FROM licencia
      INNER JOIN cliente on cliente.cliente_id = licencia.cliente_id 
      ORDER BY licencia_id DESC");
    if ($sql->execute())
      $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
      else
      $resultado = [];
    return $resultado;
  }

  protected function consultarUno($id)
  {
    $sql = $this->db->prepare("SELECT cliente.*, licencia.* FROM licencia
      INNER JOIN cliente on cliente.cliente_id = licencia.cliente_id
      WHERE licencia_id = ?");
    $sql->execute([$id]);

    if ($sql->rowCount() > 0) {
      $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
      return [
        "data" => [
          "res" => "Consulta exitosa",
          "result" => $resultado
        ],
        "code" => 200
      ];
    } else {
      return [
        "data" => [
          "res" => "No hay nada para consultar",
          "result" => []
        ],
        "code" => 400
      ];
    }
  }
}