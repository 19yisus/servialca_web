<?php
require_once("cls_db.php");

abstract class cls_usoVehiculo extends cls_db
{
	protected $id, $nombre, $estatus;

	public function __construct()
	{
		parent::__construct();
	}

	protected function Save()
	{
		try {

			if (empty($this->nombre)) {
				return [
					"data" => [
						"res" => "El nombre del uso del vehículo no puede estar vacío",
						"code" => 400
					],
					"code" => 400
				];
			}
			$result = $this->SearchByNombre($this->nombre);
			if (isset($result)) {
				return [
					"data" => [
						"res" => "Este nombre de uso vehiculo ($this->nombre) ya existe",
						"code" => 400
					],
					"code" => 400
				];
			}
			$sql = $this->db->prepare("INSERT INTO usovehiculo(usoVehiculo_nombre,usoVehiculo_estatus) VALUES(?,1)");
			$sql->execute([$this->nombre]);
			$this->id = $this->db->lastInsertId();
			if ($sql->rowCount() > 0) {

				$this->reg_bitacora([
					'table_name' => "usovehiculo",
					'des' => "Insert en usovehiculo (nombre: $this->nombre)"
				]);

				return [
					"data" => [
						"res" => "Registro exitoso",
						"code" => 200
					],
					"code" => 200
				];
			}

			return [
				"data" => [
					"res" => "El registro ha fallado"
				],
				"code" => 400
			];
		} catch (PDOException $e) {
			return [
				"data" => [
					'res' => "Error de consulta: " . $e->getMessage()
				],
				"code" => 400
			];
		}
	}

	protected function update()
	{
		try {
			$res = $this->GetDuplicados();
			if (isset($res[0])) {
				return [
					"data" => [
						"res" => "Estas duplicando los datos de otra usoVehiculo"
					],
					"code" => 400
				];
			}
			$sql = $this->db->prepare("UPDATE usovehiculo SET
            usoVehiculo_nombre = ? WHERE usoVehiculo_id = ?");
			if ($sql->execute([$this->nombre, $this->id])) {

				$this->reg_bitacora([
					'table_name' => "usovehiculo",
					'des' => "Actualización en usovehiculo (id: $this->id, nombre: $this->nombre)"
				]);

				return [
					"data" => [
						"res" => "Actualización de datos exitosa"
					],
					"code" => 300
				];
			}
			return [
				"data" => [
					"res" => "Actualización de datos fallida"
				],
				"code" => 400
			];
		} catch (PDOException $e) {
			return [
				"data" => [
					'res' => "Error de consulta: " . $e->getMessage()
				],
				"code" => 400
			];
		}
	}

	private function GetDuplicados()
	{
		$sql = $this->db->prepare("SELECT * FROM usovehiculo WHERE 
        usoVehiculo_nombre =? AND usoVehiculo_id = ?");
		if ($sql->execute([$this->nombre, $this->id]))
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		else
			$resultado = [];
		return $resultado;
	}

	protected function Delete()
	{
		try {
			$sql = $this->db->prepare("UPDATE usovehiculo SET usoVehiculo_estatus = ? WHERE usoVehiculo_id = ?");
			if ($sql->execute([$this->estatus, $this->id])) {

				$this->reg_bitacora([
					'table_name' => "usovehiculo",
					'des' => "Cambio de estatus en usovehiculo (id: $this->id, estatus: $this->estatus)"
				]);

				return [
					"data" => [
						"res" => "Estatus modificado",
						"code" => 200
					],
					"code" => 200
				];
			}
		} catch (PDOException $e) {
			return [
				"data" => [
					"res" => "Error de consulta: " . $e->getMessage()
				],
				"code" => 400
			];
		}
	}

	protected function GetOne($id)
	{
		$sql = $this->db->prepare("SELECT * FROM usovehiculo WHERE usoVehiculo_id = ?");
		if ($sql->execute([$id]))
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		else
			$resultado = [];
		return $resultado;
	}

	protected function SearchByNombre($nombre)
	{
		$sql = $this->db->prepare("SELECT * FROM usovehiculo WHERE usoVehiculo_nombre = ?");
		if ($sql->execute([$this->nombre]))
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		else
			$resultado = [];
		return $resultado;
	}

	protected function GetAll()
	{
		$sql = $this->db->prepare("SELECT * FROM usovehiculo ORDER BY usoVehiculo_id DESC");
		if ($sql->execute())
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		else
			$resultado = [];
		return $resultado;
	}
}
