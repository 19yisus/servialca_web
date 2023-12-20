<?php

if (!class_exists('cls_db'))
  require_once("cls_db.php");

abstract class cls_tipo_vehiculo extends cls_db
{
  protected $id, $nombre, $precio, $idContrato, $estatus, $sucursal;

  public function __construct()
  {
    parent::__construct();
  }

  protected function Save()
  {
    try {
      if (empty($this->nombre)) {
        return [
          "data" => [
            "res" => "El nombre del tipo del vehículo no puede estar vacío",
            "code" => 400
          ],
          "code" => 400
        ];
      }
      $result = $this->SearchByNombre();
      if ($result) {
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

      $sql = $this->db->prepare("INSERT INTO tipovehiculo(tipoVehiculo_nombre,tipoVehiculo_precio,sucursal_id,tipoVehiculo_estatus)  VALUES(?,?,?,1)");

      $sql->execute([$this->nombre, $this->precio, $this->sucursal]);

      if ($sql->rowCount() > 0) {
        $this->id = $this->db->lastInsertId();
        $this->reg_bitacora([
          'table_name' => "tipovehiculo",
          'des' => "Insert en tipo vehiculo (nombre: $this->nombre)"
        ]);

        return [
          "data" => [
            "res" => "Registro exitoso",
            "id" => $this->id
          ],
          "code" => 200
        ];
      }


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
          tipoVehiculo_nombre = ?
        WHERE tipoVehiculo_id = ?");
      if (
        $sql->execute([
          $this->nombre,
          $this->id
        ])
      ) {

        $this->reg_bitacora([
          'table_name' => "tipovehiculo",
          'des' => "Actualización en tipo vehiculo (id: $this->id, nombre: $this->nombre)"
        ]);


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
    $sql = $this->db->prepare("SELECT * FROM tipovehiculo WHERE tipoVehiculo_nombre =? AND tipoVehiculo_id != ?");
    $sql->execute([$this->nombre, $this->id]);
    if ($sql->rowCount() > 0) return $sql->fetch(PDO::FETCH_ASSOC);
    else return [];
  }

  protected function Delete()
  {
    try {
      $sql = $this->db->prepare("UPDATE tipovehiculo SET tipoVehiculo_estatus = ? WHERE tipoVehiculo_id = ?");
      if ($sql->execute([$this->estatus, $this->id])) {

        $this->reg_bitacora([
          'table_name' => "tipovehiculo",
          'des' => "Cambio de estatus de vehiculo (id: $this->id, nombre: $this->nombre)"
        ]);

        return [
          "data" => [
            "res" => "Estatus modificado",
            "code" => 200
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
    $sql->execute([$id]);
    if ($sql->rowCount() > 0) return $sql->fetch(PDO::FETCH_ASSOC);
    else return [];
  }

  protected function SearchByNombre()
  {
    $sql = $this->db->prepare("SELECT * FROM tipovehiculo WHERE tipoVehiculo_nombre = ?");
    $sql->execute([$this->nombre]);
    if ($sql->rowCount() > 0) return true;
    else return false;
  }
  protected function SearchBySucursal()
  {
    $sql = $this->db->prepare("SELECT * FROM tipovehiculo WHERE tipoVehiculo_estatus = 1 AND tipoVehiculo_nombre = ?");
    $sql->execute([$this->sucursal]);
    if ($sql->rowCount() > 0) return $sql->fetch(PDO::FETCH_ASSOC);
    else return [];
  }
  protected function GetAll($sucursal)
  {
    // Verificar si la sucursal es 21
    $whereClause = ($sucursal == 21) ? 'WHERE tipovehiculo.tipoVehiculo_estatus = 1 AND tipovehiculo.sucursal_id = 21' : 'WHERE tipovehiculo.tipoVehiculo_estatus = 1 AND tipovehiculo.sucursal_id != 21';

    $sql = $this->db->prepare("SELECT precio.*, tipovehiculo.*, tipocontrato.* FROM precio 
          INNER JOIN tipovehiculo ON tipovehiculo.tipoVehiculo_id = precio.tipoVehiculo_id 
          INNER JOIN tipocontrato ON tipocontrato.contrato_id = precio.tipoContrato_id 
          $whereClause ORDER BY tipovehiculo.tipoVehiculo_id ASC");

    $sql->execute();

    if ($sql->rowCount() > 0) {
      return $sql->fetchAll(PDO::FETCH_ASSOC);
    } else {
      return [];
    }
  }



  protected function savePrecio()
  {
    try {
      foreach ($this as $key => $value) {
        if (is_string($value)) {
          $this->$key = str_replace(',', '.', $value);
        }
      }
      $this->SearchBySucursal();
      $sql = $this->db->prepare("INSERT INTO precio(tipoVehiculo_id, tipoContrato_id, sucursal_id, precio_monto,estatus_precio)VALUES(?,?,?,?,1)");
      if ($sql->execute([$this->id, $this->idContrato, $this->sucursal, $this->precio])) {
        $this->id = $this->db->lastInsertId();
      }
      if ($sql->rowCount() > 0) {

        $this->reg_bitacora([
          'table_name' => "precio",
          'des' => "Insert en precio (id: $this->id, contrato: $this->idContrato, sucursal: $this->sucursal, precio: $this->precio"
        ]);

        return [
          "data" => [
            "res" => "Vinculación exitosa",
            "id" => $this->id
          ],
          "code" => 200
        ];
      }
      return [
        "data" => [
          "res" => "El vhiculo ha fallado"
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

  protected function SearchByID($id, $sucursal)
  {
    $sql = $this->db->prepare("SELECT 
    precio.*,
      sucursal.sucursal_nombre,
      sucursal.sucursal_id,
      tipocontrato.contrato_id,
      tipocontrato.contrato_nombre,
      tipovehiculo.tipoVehiculo_nombre
  FROM
      precio, sucursal, tipocontrato, tipovehiculo
  WHERE
      precio.tipoVehiculo_id = ? AND 
      precio.sucursal_id = ? AND 
      precio.estatus_precio = 1 AND 
      sucursal.sucursal_id = precio.sucursal_id AND 
      tipocontrato.contrato_id = precio.tipoContrato_id AND
      tipovehiculo.tipoVehiculo_id = precio.tipoVehiculo_id;");
    $sql->execute([$id, $sucursal]);
    if ($sql->rowCount() > 0) return $sql->fetchAll(PDO::FETCH_ASSOC);
    else return [];
  }

  protected function DeletePrecio($id)
  {
    try {
      $sql = $this->db->prepare("UPDATE precio SET estatus_precio = $this->estatus WHERE precio_id = ?");
      if ($sql->execute([$id])) {
        $this->reg_bitacora([
          'table_name' => "precio",
          'des' => "Cambio de estatus de tipo contrato (id: $this->id)"
        ]);
        return [
          "data" => [
            "res" => "contrato desactivado"
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

  protected function SearchByPrecio($contrato, $tipo, $sucursal)
  {
    if (!isset($sucursal)) {
      return false;
    }

    if ($sucursal != 21) {
      $where = "sucursal.sucursal_id != 21";
    } else {
      $where = "sucursal.sucursal_id = 21";
    }

    $sql = $this->db->prepare("SELECT precio.* FROM precio 
        JOIN tipocontrato ON tipocontrato.contrato_id = precio.tipoContrato_id
        JOIN tipovehiculo ON tipovehiculo.tipoVehiculo_id = precio.tipoVehiculo_id
        JOIN sucursal ON sucursal.sucursal_id = precio.sucursal_id 
        WHERE tipocontrato.contrato_nombre = ? AND tipovehiculo.tipoVehiculo_nombre = ? AND $where");

    $sql->execute([$contrato, $tipo]);

    if ($sql->rowCount() > 0) {
      return $sql->fetchAll(PDO::FETCH_ASSOC);
    } else {
      return [];
    }
  }
}
