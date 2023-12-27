<?php
require_once("cls_db.php");

abstract class cls_sucursal extends cls_db
{
	protected $id, $nombre, $direccion, $estatus;

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
						"res" => "El nombre de la sucursal no puede estar vacío",
						"code" => 400
					],
					"code" => 400
				];
			}
			$result = $this->db->prepare("SELECT * FROM sucursal WHERE sucursal_nombre = ?");
			$result->execute([$this->nombre]);
			if ($result->rowCount() > 0) {
				return [
					"data" => [
						"res" => "Nombre duplicado",
						"code" => 400
					],
					"code" => 400
				];
			}

			$sql = $this->db->prepare("INSERT INTO sucursal(sucursal_nombre,sucursal_direccion,sucursal_estatus) VALUES(?,?,1)");
			$sql->execute([$this->nombre, $this->direccion]);
			$this->id = $this->db->lastInsertId();
			if ($sql->rowCount() > 0) {

				$this->reg_bitacora([
					'table_name' => "sucursal",
					'des' => "Registro de sucursal (nombre: $this->nombre)"
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
					"res" => "El registro ha fallado",
					"code" => 400
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
			$sql = $this->db->prepare("UPDATE sucursal SET sucursal_nombre = ?, sucursal_direccion = ? WHERE sucursal_id = ?");
			if ($sql->execute([$this->nombre, $this->direccion, $this->id])) {

				$this->reg_bitacora([
					'table_name' => "sucursal",
					'des' => "Actualización de sucursal (id sucursal: $this->id, nombre: $this->nombre)"
				]);

				return [
					"data" => [
						"res" => "Actualización de datos exitosa",
						"code" => 200
					],
					"code" => 200
				];
			}
			return [
				"data" => [
					"res" => "Actualización de datos fallida",
					"code" => 400
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
		$sql = $this->db->prepare("UPDATE sucursal SET sucursal_estatus = ? WHERE sucursal_id = ?");
		if ($sql->execute([$this->estatus, $this->id])) {

			$this->reg_bitacora([
				'table_name' => "sucursal",
				'des' => "Cambio de estatus de sucursal (id: $this->id)"
			]);

			return [
				"data" => [
					"res" => "Estatus modificado",
					"code" => 200
				],
				"code" => 200
			];
		} else {
			return [
				"data" => [
					"res" => "Error de consulta: " . $this->db->errorInfo()
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
		$sql = $this->db->prepare("SELECT * FROM sucursal ORDER BY sucursal_id DESC");
		if ($sql->execute()) $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
	}

	protected function GetSucursal($nombre)
	{
		$sql = $this->db->prepare("SELECT *, sucursal.* FROM usuario 
		INNER JOIN sucursal on sucursal.sucursal_id = usuario.sucursal_id
		WHERE usuario_usuario = ?");
		if ($sql->execute([$nombre])) $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
	}
}
