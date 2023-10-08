<?php

if (!class_exists('cls_db'))
  require_once("cls_db.php");

abstract class cls_tipo_contrato extends cls_db
{
  protected $id, $nombre, $dano_cosas, $dano_personas, $fianza_cuanti, $asistencia_legal, $apov, $muerte, $invalidez, $gst_metico, $grua, $estatus;

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
            "res" => "El nombre del contrato no puede estar vacío"
          ],
          "code" => 400
        ];
      }
      $result = $this->SearchByNombre($this->nombre);
      if (isset($result[0])) {
        return [
          "data" => [
            "res" => "Este contrato ($this->nombre) ya existe"
          ],
          "code" => 400
        ];
      }
      foreach ($this as $key => $value) {
        if (is_string($value)) {
          $this->$key = str_replace(',', '.', $value);
        }
      }

      $sql = $this->db->prepare("INSERT INTO tipocontrato(        
        contrato_nombre,
        dañoCosas,
        dañoPersonas,
        fianzaCuanti,
        asistenciaLegal,
        apov,
        muerte,
        invalidez,
        gastosMedicos,
        grua,
        contrato_estatus
        )  VALUES(?,?,?,?,?,?,?,?,?,?,1)");
      $sql->execute([
        $this->nombre,
        $this->dano_cosas,
        $this->dano_personas,
        $this->fianza_cuanti,
        $this->asistencia_legal,
        $this->apov,
        $this->muerte,
        $this->invalidez,
        $this->gst_metico,
        $this->grua
      ]);


      $this->id = $this->db->lastInsertId();
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
            "res" => "Estas duplicando los datos de otro contrato"
          ],
          "code" => 400
        ];
      }
      $sql = $this->db->prepare("UPDATE tipocontrato SET
          contrato_nombre = ?,
          dañoCosas = ?,
          dañoPersonas = ?,
          fianzaCuanti = ?,
          asistenciaLegal = ?,
          apov = ?,
          muerte = ?,
          invalidez = ?,
          gastosMedicos =?,
          grua= ? 
        WHERE contrato_id = ?");
      if (
        $sql->execute([
          $this->nombre,
          $this->dano_cosas,
          $this->dano_personas,
          $this->fianza_cuanti,
          $this->asistencia_legal,
          $this->apov,
          $this->muerte,
          $this->invalidez,
          $this->gst_metico,
          $this->grua,
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
    $sql = $this->db->prepare("SELECT * FROM tipocontrato WHERE 
        contrato_nombre =? AND contrato_id != ?");
    if ($sql->execute([$this->nombre, $this->id]))
      $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else
      $resultado = [];
    return $resultado;
  }

  protected function Delete()
  {
    try {
      $sql = $this->db->prepare("UPDATE tipocontrato SET contrato_estatus = ? WHERE contrato_id = ?");
      if ($sql->execute([$this->estatus, $this->id])) {
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

  protected function GetOne($id)
  {
    $sql = $this->db->prepare("SELECT * FROM tipocontrato WHERE contrato_id = ?");
    if ($sql->execute([$id]))
      $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else
      $resultado = [];
    return $resultado;
  }

  protected function SearchByNombre($nombre)
  {
    $sql = $this->db->prepare("SELECT * FROM tipocontrato WHERE contrato_nombre = ?");
    if ($sql->execute([$this->nombre]))
      $resultado = $sql->fetch(PDO::FETCH_ASSOC);
    else
      $resultado = [];
    return $resultado;
  }

  protected function GetAll()
  {
    $sql = $this->db->prepare("SELECT * FROM tipocontrato ORDER BY contrato_id ASC");
    if ($sql->execute())
      $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
    else
      $resultado = [];
    return $resultado;
  }
}
