<?php
date_default_timezone_set('America/Caracas');
require_once("cls_db.php");

abstract class cls_hotel extends cls_db
{
    protected $id, $id_cliente, $id_vehiculo, $id_color, $id_modelo,
        $nombre_hotel,
        $nombre_cliente, $apellido_cliente, $cedula, $fechaNacimiento, $telefono, $direccion,
        $placa, $modelo, $color,
        $habitacion, $horaLlegada, $horaSalida, $fecha, $observacion, $foto;


    public function __construct()
    {
        parent::__construct();
    }

    protected function save()
    {
        try {
            $this->db->beginTransaction();
            $resul = $this->SearchByCliente();
            if (!$resul) {
                $this->db->rollback();
                return [
                    "data" => [
                        "res" => "Error de transacción cliente"
                    ],
                    "code" => 400
                ];
            }
            $resul = $this->GetModelo();
            if (!$resul) {
                $this->db->rollback();
                return [
                    "data" => [
                        "res" => "Error de transacción vehiculo"
                    ],
                    "code" => 400
                ];
            }

            $resul = $this->GetColor();
            if (!$resul) {
                $this->db->rollback();
                return [
                    "data" => [
                        "res" => "Error de transacción vehiculo"
                    ],
                    "code" => 400
                ];
            }

            $resul = $this->GetVehiculo();
            if (!$resul) {
                $this->db->rollback();
                return [
                    "data" => [
                        "res" => "Error de transacción vehiculo"
                    ],
                    "code" => 400
                ];
            }
            $resul = $this->SaveHotel();
            if (!$resul) {
                $this->db->rollback();
                return [
                    "data" => [
                        "res" => "Error de transacción vehiculo"
                    ],
                    "code" => 400
                ];
            }
            if ($resul) {
                $this->db->commit();
                return [
                    "data" => [
                        "res" => "Registrado"
                    ],
                    "code" => 200
                ];
            }
        } catch (PDOException $e) {
            return [
                "data" => [
                    'res' => "Error de consulta: " . $e->getMessage(),
                    "cliente" => $this->id_cliente,
                    "vehiculo" => $this->id_vehiculo
                ],
                "code" => 400
            ];
        }
    }

    protected function SaveHotel()
    {
        // Obtener la hora actual en formato HH:mm:ss
        $this->horaLlegada = date("H:i:s");

        // Supongamos que $this->horaSalida es un valor numérico que representa las horas
        $horasSalida = $this->horaSalida;

        // Sumar las horas de $horasSalida a la hora actual
        $horaActual = new DateTime($this->horaLlegada);
        $horaActual->add(new DateInterval("PT{$horasSalida}H"));

        // Obtener la hora resultante en formato HH:mm:ss
        $desde = $horaActual->format("H:i:s");
        $fecha_actual = date('Y-m-d');
        $sql = $this->db->prepare("INSERT INTO hospedaje_clientes(cliente_id_hospedaje, vehiculo_id_hospedaje, num_habicacion_hospedaje,fecha_llegada_hospedaje, hora_llegada_hospedaje, hora_salida_hospedaje) VALUES(?,?,?,?,?,?)");


        if ($sql->execute([$this->id_cliente, $this->id_vehiculo, $this->habitacion, $fecha_actual, $this->horaLlegada, $desde])) {
            $resultado = true;
        } else {
            $resultado = false;
        }

        return $resultado;
    }


    protected function SaveObs()
    {
        $sql = $this->db->prepare("UPDATE hospedaje_clientes SET observacion_hospedaje = ?, foto_hospedaje = ? WHERE id_hospedaje  = ?");
        if ($sql->execute([$this->observacion, $this->foto, $this->id])) {
            return [
                "data" => [
                    "res" => "Observación registrada"
                ],
                "code" => 200
            ];
        } else {
            return [
                "data" => [
                    "res" => "Observación no registrada"
                ],
                "code" => 400
            ];
        }
    }



    protected function SearchByCliente()
    {
        $sql = $this->db->prepare("SELECT * FROM cliente WHERE cliente_cedula = ?");
        $sql->execute([$this->cedula]);
        $rowCount = $sql->rowCount();
        if ($rowCount > 0) {
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            $this->id_cliente = $resultado["cliente_id"];
        } else {
            $sql = $this->db->prepare("INSERT INTO cliente(cliente_nombre, cliente_apellido, cliente_cedula)
            VALUES(?,?,?)");
            if ($sql->execute([$this->nombre_cliente, $this->apellido_cliente, $this->cedula])) {
                $this->id_cliente = $this->db->lastInsertId();
            }
        }

        return $this->id_cliente;
    }

    protected function GetModelo()
    {
        $sql = $this->db->prepare("SELECT * FROM modelo WHERE modelo_nombre = ?");
        $sql->execute([$this->modelo]);
        $rowCount = $sql->rowCount();
        if ($rowCount > 0) {
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            $this->id_modelo = $resultado["modelo_id"];
        } else {
            $sql = $this->db->prepare("INSERT INTO modelo(modelo_nombre, modelo_estatus) VALUES(?,1)");
            if ($sql->execute([$this->modelo])) {
                $this->id_modelo = $this->db->lastInsertId();
            }
        }

        return $this->id_modelo;
    }

    protected function GetColor()
    {
        $sql = $this->db->prepare("SELECT * FROM color WHERE color_nombre = ?");
        $sql->execute([$this->color]);
        $rowCount = $sql->rowCount();
        if ($rowCount > 0) {
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            $this->id_color = $resultado["color_id"];
        } else {
            $sql = $this->db->prepare("INSERT INTO color(color_nombre,color_estatus) VALUES(?,1)");
            if ($sql->execute([$this->color])) {
                $this->id_color = $this->db->lastInsertId();
            }
        }

        return $this->id_color;
    }

    protected function GetVehiculo()
    {
        $sql = $this->db->prepare("SELECT * FROM vehiculo WHERE vehiculo_placa = ? AND vehiculo_placa <> ''");
        $sql->execute([$this->placa]);
        $rowCount = $sql->rowCount();
        if ($rowCount > 0) {
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            $this->id_vehiculo = $resultado["vehiculo_id"];
        } else {
            $sql = $this->db->prepare("INSERT INTO vehiculo(vehiculo_placa,color_id,modelo_id) VALUES(?,?,?)");
            if ($sql->execute([$this->placa, $this->id_color, $this->id_modelo])) {
                $this->id_vehiculo = $this->db->lastInsertId();
            }
        }

        return $this->id_vehiculo;
    }

    protected function GetOcup()
    {
        $sql = $this->db->prepare("SELECT *, cliente.*, vehiculo.* FROM hospedaje_clientes 
        INNER JOIN cliente on cliente.cliente_id = hospedaje_clientes.cliente_id_hospedaje
        INNER JOIN vehiculo on vehiculo.vehiculo_id = hospedaje_clientes.vehiculo_id_hospedaje
        WHERE estatus_hospedaje = 1 ORDER BY id_hospedaje DESC");
        if ($sql->execute()) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }

        return $resultado;
    }

    protected function GetAll()
    {
        $sql = $this->db->prepare("SELECT *, cliente.*, vehiculo.* FROM hospedaje_clientes 
        INNER JOIN cliente on cliente.cliente_id = hospedaje_clientes.cliente_id_hospedaje
        INNER JOIN vehiculo on vehiculo.vehiculo_id = hospedaje_clientes.vehiculo_id_hospedaje
        WHERE estatus_hospedaje = 0
        ORDER BY id_hospedaje DESC");
        if ($sql->execute()) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }

        return $resultado;
    }

    protected function GetRooms()
    {
        $sql = $this->db->prepare("SELECT * FROM hospedaje_clientes WHERE estatus_hospedaje = 1");
        if ($sql->execute()) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }

        return $resultado;
    }

    protected function HabiLib()
    {
        $sql = $this->db->prepare("UPDATE hospedaje_clientes SET estatus_hospedaje = 0 WHERE id_hospedaje = ?");
        if ($sql->execute([$this->id])) {
            return [
                "data" => [
                    "res" => "Habitación liberada"
                ],
                "code" => 200
            ];
        } else {
            return [
                "data" => [
                    "res" => "Error al liberar la habitación"
                ],
                "code" => 400
            ];
        }
    }

    protected function GetOne($id)
    {
        $sql = $this->db->prepare("SELECT *, cliente.* , vehiculo.*, color.*, modelo.* FROM hospedaje_clientes 
        INNER JOIN vehiculo ON vehiculo.vehiculo_id = hospedaje_clientes.vehiculo_id_hospedaje
        INNER JOIN cliente ON cliente.cliente_id = hospedaje_clientes.cliente_id_hospedaje 
        INNER JOIN color ON color.color_id = vehiculo.color_id
        INNER JOIN modelo ON modelo.modelo_id = vehiculo.modelo_id
        WHERE id_hospedaje  = ?");
        if ($sql->execute([$id])) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }
        return $resultado;
    }
}
