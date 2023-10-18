<?php
require_once("cls_db.php");

abstract class cls_gastosPersonales extends cls_db
{
    public function __construct()
    {
        parent::__construct();
    }

    protected function GetAll()
    {
        $fechaActual = date('Y-m-d');
        $primerDiaMes = date('Y-m-01', strtotime($fechaActual));
        $ultimoDiaMes = date('Y-m-t', strtotime($fechaActual));
        $sql = "SELECT * FROM debitocredito WHERE usuario_id is null AND nota_fecha BETWEEN '$primerDiaMes' AND '$ultimoDiaMes'";

        $resultado = [];

        try {
            $stmt = $this->db->query($sql);
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Manejo de errores si es necesario
            // Por ejemplo, puedes imprimir $e->getMessage() para obtener información sobre el error.
        }

        return $resultado;
    }
}
