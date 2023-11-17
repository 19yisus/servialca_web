<?php
require("../QR/qrlib.php");

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
        $QR = "N° Contrato: " . "123" .
            "\n" . "Vigente desde: " . "123" .
            "\n" . "Vigente hasta: " . "123" .
            "\n" . "Nombre: " . "212" .
            "\n" . "Apellido: " . "123" .
            "\n" . "Cédula: " . "123" .
            "\n" . "Placa del vehiculo: " . "132" .
            "\n" . "Marca: " . "123" .
            "\n" . "Modelo: " . "123";
        $QRcodeImg = "../ImgQr/" . "123" . ".png";
        QRcode::png($QR, $QRcodeImg);
    }
}

$a = new porqueria();
$a->conexion();
$a->generarQRALL();
