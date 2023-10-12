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
        if (!$desde) {
            $desde = date("Y-m-d");
        }

        if (!$hasta) {
            $hasta = date("Y-m-d");
        }
        $sql = $this->db->prepare("SELECT debitocredito.*, usuario.*, sucursal.* FROM debitocredito
        LEFT JOIN usuario ON usuario.usuario_id = debitocredito.usuario_id
        LEFT JOIN sucursal ON sucursal.sucursal_id = debitocredito.sucursal_id
        WHERE DATE(nota_fecha) BETWEEN ? AND ?");
        $sql->bindValue(1, $desde, PDO::PARAM_STR);
        $sql->bindValue(2, $hasta, PDO::PARAM_STR);
        if ($sql->execute()) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }
        return $resultado;
    }

    public function Consultar_Anual()
    {
        date_default_timezone_set('America/Caracas');
        $year = date('Y');
        $fechaInicio = $year . '-01-01';
        $fechaFin = $year . '-12-31';
        $sql = $this->db->prepare("SELECT MONTH(nota_fecha) AS mes, COUNT(*) AS cantidad FROM debitocredito WHERE nota_fecha BETWEEN ? AND ? GROUP BY mes");
        if ($sql->execute([$fechaInicio, $fechaFin])) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
            // Array para almacenar la cantidad de registros por mes
            $cantidadRegistrosPorMes = array_fill(1, 12, 0); // Inicializar con ceros
            $totalDatos = 0;
            // Obtener nombres de los meses
            $nombresMeses = [
                1 => "Enero",
                2 => "Febrero",
                3 => "Marzo",
                4 => "Abril",
                5 => "Mayo",
                6 => "Junio",
                7 => "Julio",
                8 => "Agosto",
                9 => "Septiembre",
                10 => "Octubre",
                11 => "Noviembre",
                12 => "Diciembre"
            ];
            foreach ($resultado as $fila) {
                $mes = $fila['mes'];
                $cantidad = $fila['cantidad'];
                $cantidadRegistrosPorMes[$mes] = $cantidad;
                $totalDatos += $cantidad;
            }

            // Crear un arreglo con los nombres de los meses y la cantidad de registros
            $meses = [];
            foreach ($nombresMeses as $mesNumero => $nombreMes) {
                $meses[$nombreMes] = $cantidadRegistrosPorMes[$mesNumero];
            }

            return $meses;
        } else {
            $resultado = [];
        }
    }
}
