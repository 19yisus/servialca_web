<?php
require_once("cls_db.php");

abstract class cls_Licencia extends cls_db
{
  protected $id, $cedula, $nombre,
    $apellido, $correo, $telefono,
    $lente, $sangre, $otrasLicencias,
    $licencia, $montoTotal,
    $abonado, $restante, $cliente,
    $referencia, $metodo, $cobertura;

  public function __construct()
  {
    parent::__construct();
  }

  protected function Edit()
  {
    try {
      $this->db->beginTransaction();
      $result = $this->editarCliente($this->cliente);
      if (!$result) {
        $this->db->rollback();
        return [
          "data" => [
            "res" => "Ocurrio un error en la transacción"
          ],
          "code" => 400
        ];
      }
      $result = $this->editarLicencia($this->id);
      if (!$result) {
        $this->db->rollback();
        return [
          "data" => [
            "res" => "Ocurrio un error en la transacción"
          ],
          "code" => 400
        ];
      }
      $result = $this->editarCobertura($this->cobertura);
      if (!$result) {
        $this->db->rollback();
        return [
          "data" => [
            "res" => "Ocurrio un error en la transacción"
          ],
          "code" => 400
        ];
      }
      if ($result) {
        $this->db->commit();

        return [
          "data" => [
            "res" => "Registro exitoso"
          ],
          "code" => 400
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

  protected function editarCobertura($id)
  {
    $sql = $this->db->prepare("UPDATE debitocredito SET 
      nota_tipoPago = ?,
      nota_referencia = ?,
      nota_monto = ?
      WHERE nota_id = ?");
    if ($sql->execute([
      $this->metodo,
      $this->referencia,
      $this->montoTotal,
      $id
    ])) {
      $this->reg_bitacora([
        'table_name' => "debitocredito",
        'des' => "Actualización de debito credito (tipo pago: $this->metodo, referencia: $this->referencia, monto: $this->montoTotal)"
      ]);
      return true;
    } else {
      return false;
    }
  }

  protected function editarLicencia($id)
  {
    $sql = $this->db->prepare("UPDATE licencia SET
      licencia_correo = ?,
      licencia_sangre = ?,
      licencia_lente = ?,
      licencia_licencia = ?,
      licencia_montoTotal = ?,
      licencia_abonado = ?,
      licencia_restante =?
      WHERE licencia_id = ?");
    if ($sql->execute([
      $this->correo,
      $this->sangre,
      $this->lente,
      $this->licencia,
      $this->montoTotal,
      $this->abonado,
      $this->restante,
      $id
    ])) {
      $this->reg_bitacora([
        'table_name' => "licencia",
        'des' => "Actualización de licencia (correo: $this->correo ,sangre: $this->sangre, lente: $this->lente, licencia: $this->licencia, monto total: $this->montoTotal, abonado: $this->abonado, restante: $this->restante)"
      ]);
      return true;
    } else {
      return false;
    }
  }
  protected function editarCliente($id)
  {
    $sql = $this->db->prepare("UPDATE cliente SET
      cliente_cedula = ?,
      cliente_nombre = ?,
      cliente_apellido =?,
      cliente_telefono = ?
      WHERE cliente_id = ?");
    if (
      $sql->execute([
        $this->cedula,
        $this->nombre,
        $this->apellido,
        $this->telefono,
        $id
      ])
    ) {

      $this->reg_bitacora([
        'table_name' => "cliente",
        'des' => "Actualización de cliente (cedula: $this->cedula, nombre: $this->nombre, apellido: $this->apellido, telefono: $this->telefono)"
      ]);
      return true;
    } else
      return false;
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

  protected function GetOne($id)
  {
    $sql = $this->db->prepare("SELECT cliente.*, licencia.*, debitocredito.* FROM licencia
      INNER JOIN cliente on cliente.cliente_id = licencia.cliente_id
      INNER JOIN debitocredito on debitocredito.nota_id = licencia.debitoCredito_id
      WHERE licencia_id = ?");
    if ($sql->execute([$id]))
      $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
    else
      $resultado = [];
    return $resultado;
  }
}
