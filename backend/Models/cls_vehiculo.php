<?php

require_once("cls_db.php");
abstract class cls_vehiculo extends cls_db
{
	protected $placa;


	public function __construct()
	{
		parent::__construct();
	}

	protected function GetOne($placa)
	{
		$sql = $this->db->prepare("SELECT vehiculo.*, color.*, modelo.*, marca.*, usovehiculo.*, tipovehiculo.*
            FROM vehiculo
            INNER JOIN color ON color.color_id = vehiculo.color_id
            INNER JOIN modelo ON modelo.modelo_id = vehiculo.modelo_id
            INNER JOIN marca ON marca.marca_id = vehiculo.marca_id
            INNER JOIN usovehiculo ON usovehiculo.usoVehiculo_id = vehiculo.uso_id
            INNER JOIN clasevehiculo ON clasevehiculo.claseVehiculo_id = vehiculo.clase_id
            INNER JOIN tipovehiculo ON tipovehiculo.tipoVehiculo_id = vehiculo.tipo_id
            WHERE vehiculo_placa = ?");

		if ($sql->execute([$placa])) {
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		} else {
			$resultado = [];
		}

		return $resultado;
	}

	protected function GetAll()
	{
		$sql = $this->db->prepare("SELECT vehiculo.*, 
		color.*, 
		modelo.*, 
		marca.*, 
		usovehiculo.*, 
		tipovehiculo.*,
		clasevehiculo.* 
		FROM vehiculo 
		INNER JOIN color ON color.color_id = vehiculo.color_id 
		INNER JOIN modelo ON modelo.modelo_id = vehiculo.modelo_id 
		INNER JOIN marca ON marca.marca_id = vehiculo.marca_id 
		INNER JOIN usovehiculo ON usovehiculo.usoVehiculo_id = vehiculo.uso_id 
		INNER JOIN clasevehiculo ON clasevehiculo.claseVehiculo_id = vehiculo.clase_id 
		INNER JOIN tipovehiculo ON tipovehiculo.tipoVehiculo_id = vehiculo.tipo_id
		");
		if ($sql->execute()) {
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		} else {
			$resultado = [];
		}

		return $resultado;
	}
}
