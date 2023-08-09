<?php

if (!class_exists('cls_db')) require_once("cls_db.php");

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
      $sql = $this->db->prepare("INSERT INTO tipovehiculo(        (
        tipoVehiculo_nombre,
        tipoVehiculo_precio,
        tipoVehiculo_estatus
        )  VALUES(?,?,?)");
      $sql->execute([
        $this->nombre,
        $this->precio,
        $this->estatus
      ]);


      $this->id = $this->db->lastInsertId();
      if ($sql->rowCount() > 0) return [
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
      if ($sql->execute([
        $this->nombre,
        $this->precio,
        $this->id
      ])) {
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
    if ($sql->execute([$this->nombre, $this->id])) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else $resultado = [];
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
    if ($sql->execute([$id])) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else $resultado = [];
    return $resultado;
  }

  protected function SearchByNombre($nombre)
  {
    $sql = $this->db->prepare("SELECT * FROM tipovehiculo WHERE tipoVehiculo_nombre = ?");
    if ($sql->execute([$this->nombre])) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else $resultado = [];
    return $resultado;
  }

  protected function GetAll()
  {
    $sql = $this->db->prepare("SELECT * FROM tipovehiculo");
    if ($sql->execute()) $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
    else $resultado = [];
    return $resultado;
  }
}
