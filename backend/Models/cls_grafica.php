<?php
require_once("cls_db.php");

abstract class cls_grafica extends cls_db
{
    public function __construct()
    {
        parent::__construct();
    }

    public function Consultar_Diario($desde, $hasta)
    {
        if (empty($desde) && empty($hasta)) {
            $desde = date("Y-m-d");
            $hasta = date("Y-m-d");
        }
        $sql = $this->db->prepare("SELECT debitocredito.*, usuario.*, sucursal.* FROM debitocredito
        LEFT JOIN usuario ON usuario.usuario_id = debitocredito.usuario_id
        LEFT JOIN sucursal ON sucursal.sucursal_id = debitocredito.sucursal_id
        WHERE DATE(nota_fecha) BETWEEN ? AND ?");
        $sql->bindValue(1, $desde, PDO::PARAM_STR);
        $sql->bindValue(2, $hasta, PDO::PARAM_STR);
        if ($sql->execute())
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        else
            $resultado = [];
        return $resultado;
    }

    public function Consultar_Anual()
    {
        date_default_timezone_set('America/Caracas');
        $year = date('Y');
        $fechaInicio = $year . '-01-01';
        $fechaFin = $year . '-12-31';
        $sql = $this->db->prepare("SELECT MONTH(nota_fecha) AS mes, SUM(nota_monto) AS suma_monto FROM debitocredito WHERE nota_fecha BETWEEN ? AND ? GROUP BY MONTH(nota_fecha)");
        if ($sql->execute([$fechaInicio, $fechaFin])) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
            // Array para almacenar la suma de montos de cada mes
            $sumaMontosPorMes = array_fill(1, 12, 0); // Inicializar con ceros
            $totalDatos = 0;
            foreach ($resultado as $fila) {
                $mes = $fila['mes'];
                $sumaMonto = $fila['suma_monto'];
                $sumaMontosPorMes[$mes] = $sumaMonto;
                $totalDatos += $sumaMonto;
            }
            $enero = $sumaMontosPorMes[1];
            $febrero = $sumaMontosPorMes[2];
            $marzo = $sumaMontosPorMes[3];
            $abril = $sumaMontosPorMes[4];
            $mayo = $sumaMontosPorMes[5];
            $junio = $sumaMontosPorMes[6];
            $julio = $sumaMontosPorMes[7];
            $agosto = $sumaMontosPorMes[8];
            $septiembre = $sumaMontosPorMes[9];
            $octubre = $sumaMontosPorMes[10];
            $noviembre = $sumaMontosPorMes[11];
            $diciembre = $sumaMontosPorMes[12];
            $meses = [
                "enero" => $enero,
                "febrero" => $febrero,
                "marzo" => $marzo,
                "abril" => $abril,
                "mayo" => $mayo,
                "junio" => $junio,
                "julio" => $julio,
                "agosto" => $agosto,
                "septiembre" => $septiembre,
                "octubre" => $octubre,
                "noviembre" => $noviembre,
                "diciembre" => $diciembre,
                "monto" => $totalDatos
            ];
            return $meses;
        } else {
            $resultado = [];
        }
    }

}