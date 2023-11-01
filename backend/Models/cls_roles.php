<?php
require_once("cls_db.php");

abstract class cls_roles extends cls_db
{
	protected $id, $nombre, $comision, $estatus;

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
						"res" => "El nombre del rol no puede estar vacío",
						"code" => 400
					],
					"code" => 400
				];
			}
			$result = $this->SearchByNombre($this->nombre);
			if (isset($result["roles_nombre"])) {
				return [
					"data" => [
						"res" => "Este nombre de roles ($this->nombre) ya existe",
						"code" => 400
					],
					"code" => 400
				];
			}
			$sql = $this->db->prepare("INSERT INTO roles(roles_nombre,roles_comision,roles_estatus) VALUES(?,?,1)");
			$sql->execute([$this->nombre, $this->comision]);
			$this->id = $this->db->lastInsertId();
			if ($sql->rowCount() > 0) {
				$this->reg_bitacora([
					'table_name' => "roles",
					"des" => "Insert en roles (nombre: $this->nombre)"
				]);
				return [
					"data" => [
						"res" => "Registro exitoso"
					],
					"code" => 200
				];
			} else {
				return [
					"data" => [
						"res" => "El registro ha fallado"
					],
					"code" => 400
				];
			}
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
            roles_nombre = ?, roles_comision = ? WHERE roles_id = ?");
			if ($sql->execute([$this->nombre, $this->comision, $this->id])) {
				$this->reg_bitacora([
					"table_name" => "roles",
					"des" => "Actualización de roles (id:$this->id, nombre: $this->nombre, comision: $this->comision)"
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
				$this->reg_bitacora([
					"table_name" => "roles",
					"des" => "Cambio de estatus en roles (id: $this->id)"
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
