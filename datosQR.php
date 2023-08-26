<?php

include "../Controlador/QR/qrlib.php";

class QR
{
    private $conexion;
    public function __construct()
    {
        $this->conexion = new Conexion();
        $this->conexion = $this->conexion->getBD();
    }

public function generarTodo()
{
    set_time_limit(30000);
    $sql = $this->conexion->prepare("SELECT
    poliza.*,
    cliente.*,
    vehiculo.*,
    marca.*,
    modelo.*
    FROM poliza
    INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
    INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id
    INNER JOIN marca ON marca.marca_id = vehiculo.marca_id
    INNER JOIN modelo ON modelo.modelo_id = vehiculo.modelo_id");
    $sql->execute();
    $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);

    foreach ($resultado as $fila) {
        $contrato = "";
        if ($fila["poliza_renovacion"] < 10) {
            $contrato = "00000" . $fila["poliza_id"] . "-0" . $fila["poliza_renovacion"];
        } else {
            $contrato = "00000" . $fila["poliza_id"] . "-" . $fila["poliza_renovacion"];
        }

        $QR = "M° Contrato: " . $contrato .
            "\n" . "Vigente desde: " . $fila["poliza_fechaInicio"] .
            "\n" . "Vigente hasta: " . $fila["poliza_fechaVencimiento"] .
            "\n" . "Nombre: " . $fila["cliente_nombre"] .
            "\n" . "Apellido: " . $fila["cliente_apellido"] .
            "\n" . "Cédula: " . $fila["cliente_cedula"] .
            "\n" . "Placa del vehiculo" . $fila["vehiculo_placa"] .
            "\n" . "Marca: " . $fila["marca_nombre"] .
            "\n" . "Modelo: " . $fila["modelo_nombre"];

        $QRcodeImg = "../Controlador/ImgQr/" . $contrato . ".png";
        QRcode::png($QR, $QRcodeImg);
        $sql2 = $this->conexion->prepare("UPDATE poliza SET poliza_qr = ? WHERE poliza_id = ?");
        $sql2->execute([$QRcodeImg, $fila["poliza_id"]]);
    }
}


    public function generarQr($id)
    {
        set_time_limit(30000);
        $sql = $this->conexion->prepare("SELECT
        poliza.*,
        cliente.*,
        vehiculo.*,
        marca.*,
        modelo.*
        FROM poliza
        INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
        INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id
        INNER JOIN marca ON marca.marca_id = vehiculo.marca_id
        INNER JOIN modelo ON modelo.modelo_id = vehiculo.modelo_id
        WHERE poliza_id = ?");
        $sql->execute([$id]);
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        $contrato = "";
        foreach ($resultado as $fila) {
            if ($fila["poliza_renovacion"] < 10) {
                $contrato = "00000" . $fila["poliza_id"] . "-0" . $fila["poliza_renovacion"];
            } else {
                $contrato = "00000" . $fila["poliza_id"] . "-" . $fila["poliza_renovacion"];
            }
        }
        $QR = "M° Contrato: " . $contrato .
            "\n" . "Vigente desde: " . $fila["poliza_fechaInicio"] .
            "\n" . "Vigente hasta: " . $fila["poliza_fechaVencimiento"] .
            "\n" . "Nombre: " . $fila["cliente_nombre"] .
            "\n" . "Apellido: " . $fila["cliente_apellido"] .
            "\n" . "Cédula: " . $fila["cliente_cedula"] .
            "\n" . "Placa del vehiculo" . $fila["vehiculo_placa"] .
            "\n" . "Marca: " . $fila["marca_nombre"] .
            "\n" . "Modelo: " . $fila["modelo_nombre"];

        $QRcodeImg = "../Controlador/ImgQr/" . $contrato . ".png";
        QRcode::png($QR, $QRcodeImg);
        $sql2 = $this->conexion->prepare("UPDATE poliza SET poliza_qr = ? WHERE poliza_id = ?");
        $sql2->execute([$QRcodeImg, $fila["poliza_id"]]);

        return $contrato;
    }
}
