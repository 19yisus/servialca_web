<?php
require_once("cls_db.php");

abstract class cls_roles extends cls_db
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
						"res" => "Este nombre de roles ($this->nombre) ya existe"
					],
					"code" => 400
				];
			}
			$sql = $this->db->prepare("INSERT INTO roles(roles_nombre,roles_estatus) VALUES(?,?)");
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
						"res" => "Estas duplicando los datos de otra roles"
					],
					"code" => 400
				];
			}
			$sql = $this->db->prepare("UPDATE roles SET
            roles_nombre = ? WHERE roles_id = ?");
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
		$sql = $this->db->prepare("SELECT * FROM roles WHERE 
        roles_nombre =? AND roles_id = ?");
		if ($sql->execute([$this->nombre, $this->id])) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
	}

	protected function Delete()
	{
		try {
			$sql = $this->db->prepare("UPDATE roles SET roles_estatus = ? WHERE roles_id = ?");
			if ($sql->execute([$this->estatus, $this->id])) {
				return [
					"data" => [
						"res" => "roles desactivada"
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
		$sql = $this->db->prepare("SELECT * FROM roles WHERE roles_id = ?");
		if ($sql->execute([$id])) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
	}

	protected function SearchByNombre($nombre)
	{
		$sql = $this->db->prepare("SELECT * FROM roles WHERE roles_nombre = ?");
		if ($sql->execute([$this->nombre])) $resultado = $sql->fetch(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
	}

	protected function GetAll()
	{
		$sql = $this->db->prepare("SELECT * FROM roles ORDER BY roles_id DESC");
		if ($sql->execute()) $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
	}
}
