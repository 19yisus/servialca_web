<?php
require_once("cls_db.php");

abstract class cls_claseVehiculo extends cls_db
{
	protected $id, $nombre, $estatus;

	public function __construct()
	{
		parent::__construct();
	}

	protected function Save()
	{
		try {
			$result = $this->SearchByNombre($this->nombre);
			if (isset($result[0])) {
				return [
					"data" => [
						"res" => "Este nombre de clase vehiuclo ($this->nombre) ya existe"
					],
					"code" => 400
				];
			}
			$sql = $this->db->prepare("INSERT INTO clasevehiculo(claseVehiculo_nombre,claseVehiculo_estatus) VALUES(?,?)");
			$sql->execute([$this->nombre, $this->estatus]);
			$this->id = $this->db->lastInsertId();
			if ($sql->rowCount() > 0)
				return [
					"data" => [
						"res" => "Registro exitoso"
					],
					"code" => 200
				];
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
						"res" => "Estas duplicando los datos de otra claseVehiculo"
					],
					"code" => 400
				];
			}
			$sql = $this->db->prepare("UPDATE clasevehiculo SET
            claseVehiculo_nombre = ? WHERE claseVehiculo_id = ?");
			if ($sql->execute([$this->nombre, $this->id])) {
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
		$sql = $this->db->prepare("SELECT * FROM clasevehiculo WHERE 
        claseVehiculo_nombre =? AND claseVehiculo_id = ?");
		if ($sql->execute([$this->nombre, $this->id]))
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		else
			$resultado = [];
		return $resultado;
	}

	protected function Delete()
	{
		try {
			$sql = $this->db->prepare("UPDATE clasevehiculo SET claseVehiculo_estatus = ? WHERE claseVehiculo_id = ?");
			if ($sql->execute([$this->estatus, $this->id])) {
				return [
					"data" => [
						"res" => "claseVehiculo desactivada"
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
		$sql = $this->db->prepare("SELECT * FROM clasevehiculo WHERE claseVehiculo_id = ?");
		if ($sql->execute([$id]))
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		else
			$resultado = [];
		return $resultado;
	}

	protected function SearchByNombre($nombre)
	{
		$sql = $this->db->prepare("SELECT * FROM clasevehiculo WHERE claseVehiculo_nombre = ?");
		if ($sql->execute([$this->nombre]))
			$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		else
			$resultado = [];
		return $resultado;
	}

	protected function GetAll()
	{
		$sql = $this->db->prepare("SELECT * FROM clasevehiculo ORDER BY claseVehiculo_id DESC");
		if ($sql->execute())
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		else
			$resultado = [];
		return $resultado;
	}
}