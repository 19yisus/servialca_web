<?php
require_once("cls_db.php");

abstract class cls_Licencia extends cls_db
{
  protected $id, $cedula, $nombre, $apellido, $correo, $telefono, $lente, $sangre, $otrasLicencias, $licencia, $montoTotal, $abonado, $restante, $cliente;

  public function __construct()
  {
    parent::__construct();
  }

  protected function buscarCliente()
  {
    $sql = $this->db->prepare("SELECT * FROM cliente WHERE cliente_cedula = ?");
    $sql->execute([$this->cedula]);
    $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
    if (count($resultado) >= 1) $this->cliente = $resultado[0]["cliente_id"];
    else {
      $sql = $this->db->prepare("INSERT INTO 
      cliente(
      cliente_nombre, 
      cliente_apellido, 
      cliente_cedula,
      cliente_telefono)
      VALUES(?,?,?,?)");
      $sql->execute([
        $this->nombre,
        $this->apellido,
        $this->cedula,
        $this->telefono
      ]);
      $this->cliente = $this->db->lastInsertId();
    }

    return $this->cliente;
  }

  protected function RegistroLicencia()
  {
    if (
      $this->cliente == null ||
      $this->sangre == null ||
      $this->licencia == null ||
      $this->montoTotal == null ||
      $this->abonado == null ||
      $this->restante == null
    ) {
      return false;
    } else {
      // Convierte el array de otrasLicencias en una cadena separada por comas
      $otrasLicenciasString = implode(',', $this->otrasLicencias);

      $sql = $this->db->prepare("INSERT INTO licencia(
              cliente_id,
              licencia_correo,
              licencia_sangre,
              licencia_lente,
              licencia_licencia,
              licencia_licenciaRestante,
              licencia_montoTolar,
              licencia_abonado,
              licencia_restante) VALUES(?,?,?,?,?,?,?,?,?)");

      $sql->execute([
        $this->cliente,
        $this->correo,
        $this->sangre,
        $this->lente,
        $this->licencia,
        $otrasLicenciasString, // Almacena el array como cadena
        $this->restante,
        $this->montoTotal,
        $this->abonado
      ]);

      if ($sql->rowCount() > 0) {
        $this->id = $this->db->lastInsertId();
        return [
          "data" => [
            "res" => "Registro exitoso",
          ],
          "code" => 200
        ];
      } else {
        return [
          "data" => [
            "res" => "Registro fallido",
          ],
          "code" => 400
        ];
      }
    }
  }

  protected function GetAll()
  {
    $sql = $this->db->prepare("SELECT cliente.*, licencia.* FROM licencia
      INNER JOIN cliente on cliente.cliente_id = licencia.cliente_id");
    $sql->execute();

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
