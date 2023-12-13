<?php
require_once("cls_db.php");

abstract class cls_hotel extends cls_db
{
    protected $id, $id_cliente, $id_vehiculo, $nombre_hotel, $nombre_cliente,
        $apellido_cliente, $cedula, $placa, $habitacion, $horaLlegada, $horaSalida, $fecha;


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
        $sql = $this->db->prepare("INSERT INTO 
        hospedaje_clientes(cliente_id_hospedaje,vehiculo_id_hospedaje,num_habicacion_hospedaje) 
        VALUES(?,?,?)");
        if ($sql->execute([$this->id_cliente, $this->id_vehiculo, $this->habitacion])) {
            $resultado = true;
        } else {
            $resultado = false;
        }

        return $resultado;
    }


    protected function SearchByCliente()
    {
        $sql = $this->db->prepare("SELECT * FROM cliente WHERE cliente_cedula = ?");
        $sql->execute([$this->cedula]);
        $rowCount = $sql->rowCount();
        if ($rowCount > 0) {
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            $this->id_cliente = $resultado["cliente_id"];
        }

        return $this->id_cliente;
    }


    protected function GetVehiculo()
    {
        $sql = $this->db->prepare("SELECT * FROM vehiculo WHERE vehiculo_placa = ? AND vehiculo_placa <> ''");
        $sql->execute([$this->placa]);
        $rowCount = $sql->rowCount();
        if ($rowCount > 0) {
            $resultado = $sql->fetch(PDO::FETCH_ASSOC);
            $this->id_vehiculo = $resultado["vehiculo_id"];
        }

        return $this->id_vehiculo;
    }

    protected function GetAll()
    {
        $sql = $this->db->prepare("SELECT *, cliente.*, vehiculo.* FROM hospedaje_clientes 
        INNER JOIN cliente on cliente.cliente_id = hospedaje_clientes.cliente_id_hospedaje
        INNER JOIN vehiculo on vehiculo.vehiculo_id = hospedaje_clientes.vehiculo_id_hospedaje");
        if ($sql->execute()) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }

        return $resultado;
    }
}
