<?php
require_once("../QR/qrlib.php");

class porqueria
{
    protected $db, $db2;

    public function conexion()
    {
        $this->db = new PDO("mysql:host=localhost;dbname=servialc_web", 'root', '');
    }

    public function conexion2()
    {
        $this->db2 = new PDO("mysql:host=localhost;dbname=servialc_db2", 'root', '');
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
    public function ClaseVehiculo()
    {
        $sql = $this->db2->prepare("SELECT * FROM clasevehiculo");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        foreach ($resultado as $row) {
            $sql2 = $this->db->prepare("INSERT INTO clasevehiculo(clase_nombre,clase_estatus) VALUES(?,1)");
            $sql2->execute([$row["clase_nombre"]]);
        }
    }

    public function cliente()
    {
        $sql = $this->db2->prepare("SELECT * FROM cliente");
        $sql->execute();
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

        foreach ($resultado as $row) {
            // Verifica y ajusta la fecha si es '0000-00-00'
            $fechaNacimiento = ($row["cliente_fechaNacimiento"] === '0000-00-00') ? null : $row["cliente_fechaNacimiento"];

            $sql2 = $this->db->prepare("INSERT INTO cliente (
            cliente_id,
            cliente_nombre,
            cliente_apellido,
            cliente_cedula,
            cliente_fechaNacimiento,
            cliente_telefono,
            cliente_correo,
            cliente_direccion
        ) VALUES (?,?,?,?,?,?,?,?)");

            $sql2->execute([
                $row["cliente_id"],
                $row["cliente_nombre"],
                $row["cliente_apellido"],
                $row["cliente_cedula"],
                $fechaNacimiento,
                $row["cliente_telefono"],
                $row["cliente_correo"],
                $row["cliente_direccion"]
            ]);
        }
    }

    public function coberturas()
    {
        $sql = $this->db2->prepare("SELECT * FROM cobertura");
    }





    public function generarQr()
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
        LEFT JOIN modelo ON modelo.modelo_id = vehiculo.modelo_id WHERE poliza_id = 6000");
        if ($sql->execute()) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
            if ($resultado != "" || $resultado != null) {
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

                if ($fila) { //Verificar si $fila está definida antes de usarla
                    $QRcodeImg = "../ImgQr/" . $contrato . ".png";
                    QRcode::png($QR, $QRcodeImg);
                    $sql2 = $this->db->prepare("UPDATE poliza SET poliza_qr = ? WHERE poliza_id = ?");
                    $sql2->execute([$QRcodeImg, $fila["poliza_id"]]);
                }
            }
        }
    }


    public function encriptPasswords()
    {
        $datos = $this->db->query("SELECT * FROM usuario WHERE usuario_clave != '' ");
        $datos = $datos->fetchAll(PDO::FETCH_ASSOC);
        foreach ($datos as $item) {
            $id_usuario = $item['usuario_id'];
            $clave = password_hash($item['usuario_clave'], PASSWORD_BCRYPT, ['cost' => 12]);
            $this->db->query("UPDATE usuario SET usuario_clave = '$clave' WHERE usuario_id = $id_usuario");
        }
        if (isset($datos))
            return $datos;
    }
}


$a = new porqueria();
$a->conexion();
$a->conexion2();
$a->encriptPasswords();
