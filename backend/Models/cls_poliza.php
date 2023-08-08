<?php

require_once("cls_db.php");

abstract class cls_poliza extends cls_db
{
    private $id, $sucursal, $usuario,
        // Contratante 
        $nombre, $apellido, $cedula, $fechaNacimiento, $telefono, $correo, $direccion,
        // Titular 
        $nombreTitular, $apellidoTitular, $cedulaTitular,
        // Vehiculo
        $placa, $puesto, $ano, $serialMotor, $serialCarroceria, $peso, $capacidad,
        // Vehiculo extra
        $color, $modelo, $marca, $uso, $clase, $tipo,
        // Contrato
        $fechaInicio, $fechaVenciento, $tipoContrato,
        $tipoTransporte, $estado,
        $dañoCosas, $dañoPersonas, $fianza, $asistencia, $apov,
        $muerte, $invalidez, $medico, $grua,
        // Pago
        $metodoPago, $referencia, $cantidadDolar, $monto,
        // ID
        $vehiculo, $cliente, $precioDolar, $debitoCredito, $idTitular;



    protected function Vencer($id)
    {
        date_default_timezone_set('America/Caracas');
        $diaActual = date('Y-m-d'); // Obtener el día actual
        $diaCinco = date('Y-m-d', strtotime('+30 day')); // Obtener el quinto día 
        if ($id == 57) {
            $sql = $this->db->prepare("SELECT poliza.*, cliente.*, vehiculo.*, usuario.*, sucursal.*
            FROM poliza 
            INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
            INNER JOIN sucursal ON sucursal.sucursal_id = poliza.sucursal_id
            INNER JOIN usuario ON usuario.usuario_id = poliza.usuario_id
            INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id
            WHERE poliza.poliza_fechaVencimiento > :diaActual AND 
            poliza.poliza_fechaVencimiento <= :diaCinco
            ORDER BY poliza.poliza_fechaVencimiento ASC");
        } else {
            $sql = $this->db->prepare("SELECT poliza.*, cliente.*, vehiculo.*, usuario.*, sucursal.*
            FROM poliza 
            INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
            INNER JOIN sucursal ON sucursal.sucursal_id = poliza.sucursal_id
            INNER JOIN usuario ON usuario.usuario_id = poliza.usuario_id
            INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id
            WHERE usuario.usuario_id = :id AND 
            poliza.poliza_fechaVencimiento > :diaActual AND 
            poliza.poliza_fechaVencimiento <= :diaCinco
            ORDER BY poliza.poliza_fechaVencimiento ASC");
            $sql->bindParam(':id', $id, PDO::PARAM_INT);
        }
        $sql->bindParam(':diaActual', $diaActual, PDO::PARAM_STR);
        $sql->bindParam(':diaCinco', $diaCinco, PDO::PARAM_STR);
        if ($sql->execute()) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }
        return $resultado;
    }

    protected function GetAll($id)
    {
        if ($id == 57) {
            $sql = $this->db->prepare("SELECT poliza.*, cliente.*, sucursal.*, usuario.*, vehiculo.* FROM poliza 
            INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
            INNER JOIN sucursal ON sucursal.sucursal_id = poliza.sucursal_id
            INNER JOIN usuario ON usuario.usuario_id = poliza.usuario_id
            INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id");
        } else {
            $sql = $this->db->prepare("SELECT poliza.*, cliente.*, sucursal.*, usuario.*, vehiculo.* FROM poliza 
            INNER JOIN cliente ON cliente.cliente_id = poliza.cliente_id
            INNER JOIN sucursal ON sucursal.sucursal_id = poliza.sucursal_id
            INNER JOIN usuario ON usuario.usuario_id = poliza.usuario_id
            INNER JOIN vehiculo ON vehiculo.vehiculo_id = poliza.vehiculo_id
            WHERE usuario.usuario_id = $id");
        }

        if ($sql->execute()) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
        else $resultado = [];
        return $resultado;
    }

    protected function debitoCredito($tipoIngreso, $motivo)
    {
        date_default_timezone_set('America/Caracas');
        $fecha = date("Y-m-d");
        $hora = date("H:i:s");
        $sql = $this->db->prepare("INSERT INTO debitocredito(
            nota_IngresoEgreso,
            nota_motivo,
            nota_fecha,
            nota_hora,
            nota_tipoPago,
            nota_referencia,
            nota_monto,
            precioDolar_id,
            usuario_id,
            sucursal_id
        )VALUES(?,?,?,?,?,?,?,?,?,?)");
        if ($sql->execute([
            $tipoIngreso,
            $motivo,
            $fecha,
            $hora,
            $this->metodoPago,
            $this->referencia,
            $this->cantidadDolar,
            $this->precioDolar,
            $this->usuario,
            $this->sucursal
        ])) return $this->debitoCredito =  $this->db->lastInsertId();
        else return false;
    }

    protected function precioDolar($precio)
    {
        date_default_timezone_set('America/Caracas');
        $fecha = date("Y-m-d");
        $hora = date("H:i:s");
        $sql = $this->db->prepare("SELECT * preciodolar WHERE dolar_monto = ? AND dolar_fecha = ?");
        if ($sql->execute([$precio, $fecha])) {
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            if (count($resultado) > 0) {
                $this->precioDolar = $resultado[0]["dolar_id"];
            } else {
                $sql = $this->db->prepare("INSERT INTO preciodolar(dolar_monto,dolar_hora,dolar_fecha) VALUES(?,?,?)");
                $sql->execute($precio, $hora, $fecha);
                $this->precioDolar = $this->db->lastInsertId();
            }
        } else return false;
        return $this->precioDolar;
    }

    protected function SearchByVehiculo($placa)
    {
        $sql = $this->db->prepare("SELECT * FROM vehiculo WHERE vehiculo_placa = ?");
        if ($sql->execute([$placa])) {
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            if (count($resultado) > 0) {
                $this->vehiculo = $resultado[0]["vehiculo_id"];
            } else {
                $sql = $this->db->prepare("INSERT INTO vehiculo(
                    vehiculo_placa,
                    vehiculo_puesto,
                    vehiculo_año,
                    vehiculo_serialMotor,
                    vehiculo_serialCarroceria,
                    vehiculo_peso,
                    vehiculo_capTon,
                    color_id,
                    modelo_id,
                    marca_id,
                    uso_id,
                    clase_id,
                    tipo_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)");
                $sql->execute([
                    $this->placa,
                    $this->puesto,
                    $this->ano,
                    $this->serialMotor,
                    $this->serialCarroceria,
                    $this->peso,
                    $this->capacidad,
                    $this->color,
                    $this->modelo,
                    $this->marca,
                    $this->uso,
                    $this->clase,
                    $this->tipo
                ]);
                $this->vehiculo = $this->db->lastInsertId();
            }
        } else return false;
        return $this->vehiculo;
    }

    protected function SearchByCliente($cedula)
    {
        $sql = $this->db->prepare("SELECT * FROM cliente WHERE cliente_cedula = ?");
        if ($sql->execute([$cedula])) {
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            if (count($resultado) > 0) {
                $this->cliente = $resultado[0]["cliente_id"];
            } else {
                $sql = $this->db->prepare("INSERT INTO cliente(
                    cliente_nombre, 
                    cliente_apellido, 
                    cliente_cedula, 
                    cliente_fechaNacimiento, 
                    cliente_telefono, 
                    cliente_correo, 
                    cliente_direccion)VALUES(?,?,?,?,?,?,?)");
                $sql->execute([
                    $this->nombre,
                    $this->apellido,
                    $this->cedula,
                    $this->fechaNacimiento,
                    $this->telefono,
                    $this->correo,
                    $this->direccion
                ]);
                $this->cliente = $this->db->lastInsertId();
            }
        } else false;
        return $this->cliente;
    }

    protected function SearchByModelo($nombre)
    {
        $sql = $this->db->prepare("SELECT * FROM modelo WHERE modelo_nombre = ?");
        if ($sql->execute([$nombre])) {
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            if (count($resultado) > 0) {
                $this->modelo = $resultado[0]["modelo_id"];
            } else {
                $sql = $this->db->prepare("INSERT INTO modelo (modelo_nombre,modelo_estatus) VALUES(?,1)");
                $sql->execute([$nombre]);
                $this->modelo =  $this->db->lastInsertId();
            }
        } else false;
        return $this->modelo;
    }

    protected function SearchByMarca($nombre)
    {
        $sql = $this->db->prepare("SELECT * FROM marca WHERE marca_nombre = ?");
        if ($sql->execute([$nombre])) {
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            if (count($resultado) > 0) {
                $this->marca = $resultado[0]["marca_id"];
            } else {
                $sql = $this->db->prepare("INSERT INTO marca (marca_nombre,marca_estatus) VALUES(?,1)");
                $sql->execute([$nombre]);
                $this->marca =  $this->db->lastInsertId();
            }
        } else false;
        return $this->marca;
    }

    protected function SearchByColor($nombre)
    {
        $sql = $this->db->prepare("SELECT * FROM color WHERE color_nombre = ?");
        if ($sql->execute([$nombre])) {
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            if (count($resultado) > 0) {
                $this->color = $resultado[0]["color_id"];
            } else {
                $sql = $this->db->prepare("INSERT INTO color (color_nombre,color_estatus) VALUES(?,1)");
                $sql->execute([$nombre]);
                $this->color =  $this->db->lastInsertId();
            }
        } else false;
        return $this->color;
    }

    protected function SearchByTitular($cedula)
    {
        $sql = $this->db->prepare("SELECT * FROM titular WHERE titular_cedula = ?");
        if ($sql->execute([$cedula])) {
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            if (count($resultado) > 0) {
                $this->idTitular = $resultado[0]["titular_id"];
            } else {
                $sql = $this->db->prepare("INSERT INTO titular(titular_cedula,titular_nombre,titular_apellido) VALUES(?,?,?)");
                $sql->execute([
                    $this->cedulaTitular,
                    $this->nombreTitular,
                    $this->apellidoTitular
                ]);
                $this->idTitular = $this->db->lastInsertId();
            }
        } else {
            return false;
        }
        return $this->idTitular;
    }
}
