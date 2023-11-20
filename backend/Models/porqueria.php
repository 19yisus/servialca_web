<?php
require_once("../QR/qrlib.php");

class porqueria
{
    protected $db;

    public function conexion()
    {
        $this->db = new PDO("mysql:host=localhost;dbname=servialc_web", 'root', '');
    }
    public function trasferir()
    {
        // Realizar la consulta para obtener los datos necesarios de tipoVehiculo
        $sql = $this->db->prepare("SELECT tipoVehiculo_id, sucursal_id, tipoVehiculo_precio FROM tipoVehiculo");

        // Reemplaza 1 con el ID del tipo de vehículo que deseas insertar
        $tipoVehiculoID = 1;

        if ($sql->execute()) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
            foreach ($resultado as $row) {
                // Reemplazar 1 con el ID del tipo de contrato adecuado
                $tipoContratoID = 1;

                $sqlInsert = $this->db->prepare("INSERT INTO precio (tipoVehiculo_id, tipoContrato_id, sucursal_id, precio_monto) VALUES(?, ?, ?, ?)");

                if (!$sqlInsert->execute([$row["tipoVehiculo_id"], $tipoContratoID, $row["sucursal_id"], $row["tipoVehiculo_precio"]])) {
                    return false; // Si hay un error en alguna inserción, retornar false
                }
            }
        }
    }

    public function generarQRALL()
    {
        set_time_limit(30000);
        $sql = $this->db->prepare("SELECT 
        poliza.*,
        cliente.*,
        vehiculo.*,
        marca.*,
        modelo.* 
        FROM poliza
        LEFT JOIN cliente ON cliente.cliente_id = poliza.cliente_id
        LEFT JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id
        LEFT JOIN marca ON marca.marca_id = vehiculo.marca_id
        LEFT JOIN modelo ON modelo.modelo_id = vehiculo.modelo_id");

        if ($sql->execute()) {



            $resultado = $sql->fetch(PDO::FETCH_ASSOC); // Cambiado de fetchAll a fetch
            $fila = null; // Inicializar $fila aquí para evitar advertencias fuera del bucle

            foreach ($resultado as $fila) {
                $contrato = $fila["poliza_id"];
                if ($fila["poliza_renovacion"] < 10) {
                    $contrato = "00000" . $fila["poliza_id"] . "-0" . $fila["poliza_renovacion"];
                } else {
                    $contrato = "00000" . $fila["poliza_id"] . "-" . $fila["poliza_renovacion"];
                }

                $QR = "N° Contrato: " . $contrato .
                    "\n" . "Vigente desde: " . $fila["poliza_fechaInicio"] .
                    "\n" . "Vigente hasta: " . $fila["poliza_fechaVencimiento"] .
                    "\n" . "Nombre: " . $fila["cliente_nombre"] .
                    "\n" . "Apellido: " . $fila["cliente_apellido"] .
                    "\n" . "Cédula: " . $fila["cliente_cedula"] .
                    "\n" . "Placa del vehiculo" . $fila["vehiculo_placa"] .
                    "\n" . "Marca: " . $fila["marca_nombre"] .
                    "\n" . "Modelo: " . $fila["modelo_nombre"];
            }

            if ($fila) { // Verificar si $fila está definida antes de usarla
                $QRcodeImg = "../ImgQr/" . $contrato . ".png";
                QRcode::png($QR, $QRcodeImg);
                $sql2 = $this->db->prepare("UPDATE poliza SET poliza_qr = ? WHERE poliza_id = ?");
                $sql2->execute([$QRcodeImg, $fila["poliza_id"]]);
            }
        }
    }
}


$a = new porqueria();
$a->conexion();
$a->generarQRALL();
