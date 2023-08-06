<?php
require_once("cls_db.php");

abstract class cls_sucursal extends cls_db
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
						"res" => "Este nombre de sucursal ($this->nombre) ya existe"
					],
					"code" => 400
				];
			}
			$sql = $this->db->prepare("INSERT INTO sucursal(sucursal_nombre,sucursal_estatus) VALUES(?,?)");
			$sql->execute([$this->nombre, $this->estatus]);
			$this->id = $this->db->lastInsertId();
			if ($sql->rowCount() > 0) return [
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
						"res" => "Estas duplicando los datos de otra sucursal"
					],
					"code" => 400
				];
			}
			$sql = $this->db->prepare("UPDATE sucursal SET
            sucursal_nombre = ? WHERE sucursal_id = ?");
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
		$sql = $this->db->prepare("SELECT * FROM sucursal WHERE 
        sucursal_nombre = ? AND sucursal_id != ?");
		if ($sql->execute([$this->nombre, $this->id])) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
	}

	protected function Delete()
	{
		try {
			$sql = $this->db->prepare("UPDATE sucursal SET sucursal_estatus = ? WHERE sucursal_id = ?");
			if ($sql->execute([$this->estatus, $this->id])) {
				return [
					"data" => [
						"res" => "sucursal desactivada"
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
		$sql = $this->db->prepare("SELECT * FROM sucursal WHERE sucursal_id = ?");
		if ($sql->execute([$id])) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
	}

	protected function SearchByNombre($nombre)
	{
		$sql = $this->db->prepare("SELECT * FROM sucursal WHERE sucursal_nombre = ?");
		if ($sql->execute([$this->nombre])) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
	}

	protected function GetAll()
	{
		$sql = $this->db->prepare("SELECT * FROM sucursal");
		if ($sql->execute()) $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
	}
}
