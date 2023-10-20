<?php
require_once("cls_db.php");

abstract class cls_gastosPersonales extends cls_db
{
    protected $id, $ingresoEgreso, $motivo, $tipo,
        $referencia, $monto, $precioDolar;

    public function __construct()
    {
        parent::__construct();
    }

    protected function Save()
    {
        $fechaActual = date("Y-m-d");
        $horaActual = date("H:i:s");
        try {
            $this->db->beginTransaction();
            $sql = $this->db->prepare("INSERT INTO debitocredito(
                nota_IngresoEgreso, 
                nota_motivo, 
                nota_fecha, 
                nota_hora,
                nota_tipoPago,
                nota_referencia,
                nota_monto,
                precioDolar_id) 
                VALUES (?,?,?,?,?,?,?,?)");
            if ($sql->execute([
                $this->ingresoEgreso,
                $this->motivo,
                $fechaActual,
                $horaActual,
                $this->tipo,
                $this->referencia,
                $this->monto,
                $this->precioDolar
            ])) {
                $this->db->commit();
                return [
                    "data" => [
                        "res" => "Registro exitoso",
                        "code" => 200
                    ],
                    "code" => 200
                ];
            } else {
                $this->db->rollBack(); // En caso de error, deshacer la transacción
                return [
                    "data" => [
                        "res" => "Error en la ejecución de la consulta."
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

    protected function Edit()
    {
        try {
            $this->db->beginTransaction();
            $sql = $this->db->prepare("UPDATE debitocredito SET 
            nota_IngresoEgreso = ?,
            nota_motivo = ?,
            nota_tipoPago = ?,
            nota_referencia = ?,
            nota_monto = ?,
            precioDolar_id = ?
            WHERE nota_id = ?");
            if ($sql->execute([
                $this->ingresoEgreso,
                $this->motivo,
                $this->tipo,
                $this->referencia,
                $this->monto,
                $this->precioDolar,
                $this->id
            ])) {
                $this->db->commit();
                return [
                    "data" => [
                        "res" => "Actualización exitosa",
                        "code" => 200
                    ],
                    "code" => 200
                ];
            } else {
                $this->db->rollBack();
                return [
                    "data" => [
                        "res" => "Error en la ejecución de la consulta."
                    ],
                    "code" => 400
                ];
            }
        } catch (PDOException $e) {
            return [
                "data" => [
                    "res" => "Error de consulta : " . $e->getMessage()
                ],
                "code" => 400
            ];
        }
    }

    protected function GetOne()
    {
        $sql = $this->db->prepare("SELECT *, preciodolar.* FROM debitocredito 
        INNER JOIN preciodolar ON preciodolar.dolar_id = debitocredito.precioDolar_id
        WHERE nota_id = ?");
        if ($sql->execute([$this->id])) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }
        return $resultado;
    }

    protected function GetAll()
    {
        $fechaActual = date('Y-m-d');
        $primerDiaMes = date('Y-m-01', strtotime($fechaActual));
        $ultimoDiaMes = date('Y-m-t', strtotime($fechaActual));
        $sql = $this->db->prepare("SELECT * FROM debitocredito WHERE usuario_id IS NULL AND nota_fecha BETWEEN ? AND ? ORDER BY nota_id DESC");
        if ($sql->execute([$primerDiaMes, $ultimoDiaMes])) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }
        return $resultado;
    }
}
