<?php

if (!class_exists('cls_db'))
  require_once("cls_db.php");

abstract class cls_tipo_vehiculo extends cls_db
{
  protected $id, $nombre, $precio, $estatus;

  public function __construct()
  {
    parent::__construct();
  }

  protected function Save()
  {
    try {
      $result = $this->SearchByNombre($this->nombre);
      if (isset($result[0])) {
        return [
          "data" => [
            "res" => "Este vehiculo ($this->nombre) ya existe"
          ],
          "code" => 400
        ];
      }
      foreach ($this as $key => $value) {
        if (is_string($value)) {
          $this->$key = str_replace(',', '.', $value);
        }
      }

      $sql = $this->db->prepare("INSERT INTO tipovehiculo(        
        tipoVehiculo_nombre,
        tipoVehiculo_estatus
        )  VALUES(?,1)");
      if (
        $sql->execute([
          $this->nombre
        ])
      ) {
        $this->id = $this->db->lastInsertId();
      }
      $this->Precios($this->id);
      if ($sql->rowCount() > 0)
        return [
          "data" => [
            "res" => "Registro exitoso"
          ],
          "code" => 200
        ];
      return [
        "data" => [
          "res" => "El registro ha fallado"
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

  protected function update()
  {
    try {
      $res = $this->GetDuplicados();
      if (isset($res[0])) {
        return [
          "data" => [
            "res" => "Estas duplicando los datos de otro vehiculo"
          ],
          "code" => 400
        ];
      }
      $sql = $this->db->prepare("UPDATE tipovehiculo SET
          tipoVehiculo_nombre = ?,
          tipoVehihculo_precio = ?,
        WHERE tipoVehiculo_id = ?");
      if (
        $sql->execute([
          $this->nombre,
          $this->precio,
          $this->id
        ])
      ) {
        return [
          "data" => [
            "res" => "Actualización de datos exitosa"
          ],
          "code" => 300
        ];
      }
      return [
        "data" => [
          "res" => "Actualización de datos fallida"
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

  private function GetDuplicados()
  {
    $sql = $this->db->prepare("SELECT * FROM tipovehiculo WHERE 
        tipoVehiculo_nombre =? AND tipoVehiculo_id != ?");
    if ($sql->execute([$this->nombre, $this->id]))
      $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else
      $resultado = [];
    return $resultado;
  }

  protected function Delete()
  {
    try {
      $sql = $this->db->prepare("UPDATE tipovehiculo SET tipoVehiculo_estatus = ? WHERE tipoVehiculo_id = ?");
      if ($sql->execute([$this->estatus, $this->id])) {
        return [
          "data" => [
            "res" => "vehiculo desactivado"
          ],
          "code" => 200
        ];
      }
    } catch (PDOException $e) {
      return [
        "data" => [
          "res" => "Error de consulta: " . $e->getMessage()
        ],
        "code" => 400
      ];
    }
  }

  protected function GetOne($id)
  {
    $sql = $this->db->prepare("SELECT * FROM tipovehiculo WHERE tipoVehiculo_id = ?");
    if ($sql->execute([$id]))
      $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else
      $resultado = [];
    return $resultado;
  }

  protected function SearchByNombre($nombre)
  {
    $sql = $this->db->prepare("SELECT * FROM tipovehiculo WHERE tipoVehiculo_nombre = ?");
    if ($sql->execute([$this->nombre]))
      $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else
      $resultado = [];
    return $resultado;
  }

  protected function GetAll()
  {
    $sql = $this->db->prepare("SELECT * FROM tipovehiculo ORDER BY tipoVehiculo_id DESC");
    if ($sql->execute())
      $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
    else
      $resultado = [];
    return $resultado;
  }

  protected function Precios($id)
  {
    foreach ($this as $key => $value) {
      if (is_string($value)) {
        $this->$key = str_replace(',', '.', $value);
      }
    }
    $sql = $this->db->prepare("INSERT INTO precio(tipoVehiculo_id, tipoContrato_id, precio_monto)VALUES(?,?,?)");
    if (
      $sql->execute([
        $id,
        1,
        $this->precio
      ])
    )
      ;
  }
}