<?php
require_once("cls_db.php");

abstract class cls_medico extends cls_db
{
	protected $cliente, $medico, $cedula, $nombre, $apellido,
		$fechaNacimiento, $telefono, $correo, $edad, $sangre, $lente,
		$cobertura, $refrencia, $metodo;
	public function __construct()
	{
		parent::__construct();
	}

	protected function Edit()
	{
		try {
			$this->db->beginTransaction();
			$result = $this->editarCliente($this->cliente);
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
			$result = $this->editarMedico($this->medico);
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
			$result = $this->editarDebito($this->cobertura);
			if (!$result) {
				$this->db->rollback();
				return [
					'data' => [
						'res' => "Ocurrión un error en la transacción"
					],
					'code' => 400
				];
			}
			if ($result) {
				$this->db->commit();
				return [
					'data' => [
						'res' => "Registro exitoso"
					],
					'code' => 200
				];
			}
			$this->db->rollback();
			return [
				'data' => [
					'res' => "Registro fallida"
				],
				'code' => 400
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

	protected function editarDebito($id)
	{
		$sql = $this->db->prepare("UPDATE debitocredito SET
        	nota_tipoPago = ?,
            nota_referencia = ?
        WHERE nota_id = ?");
		if (
			$sql->execute([
				$this->metodo,
				$this->refrencia,
				$id
			])
		) {
			$this->reg_bitacora([
				'table_name' => "debitocredito",
				'des' => "Actualización de datos de debido credito (id: $id, metodo pago: $this->metodo, referencia: $this->refrencia)"
			]);
			return true;
		} else
			return false;
	}

	protected function editarCliente($id)
	{
		$sql = $this->db->prepare("UPDATE cliente SET
        cliente_cedula = ?,
        cliente_nombre = ?,
        cliente_apellido =?,
        cliente_fechaNacimiento = ?
        WHERE cliente_id = ?");
		if (
			$sql->execute([
				$this->cedula,
				$this->nombre,
				$this->apellido,
				$this->fechaNacimiento,
				$id
			])
		) {
			$this->reg_bitacora([
				'table_name' => "cliente",
				'des' => "Actualización de datos del cliente (id del cliente: $id, cedula: $this->cedula, nombre: $this->nombre, apellido: $this->apellido, fecha nacimiento: $this->fechaNacimiento)"
			]);
			return true;
		} else
			return false;
	}
	protected function editarMedico($id)
	{
		$sql = $this->db->prepare("UPDATE medico SET
            medico_edad = ?,
            medico_tipoSangre = ?,
            medico_lente = ?
            WHERE medico_id = ?");
		if ($sql->execute([
			$this->edad,
			$this->sangre,
			$this->lente,
			$id
		])) {
			$this->reg_bitacora([
				'table_name' => "medico",
				'des' => "Actualización de medico (edad: $this->edad, sangre: $this->sangre, lente: $this->lente, id del medico: $id"
			]);
			return true;
		} else {
			return false;
		}
	}

	protected function GetOne($id)
	{
		$sql = $this->db->prepare("SELECT medico.*, cliente.*, debitocredito.* FROM medico
        INNER JOIN cliente ON cliente.cliente_id = medico.cliente_id
        INNER JOIN debitocredito ON debitocredito.nota_id = medico.debitoCredito_id
        WHERE medico_id =?;
        ");
		if ($sql->execute([$id])) {
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		} else {
			$resultado = [];
		}

		return $resultado;
	}

	protected function GetAll()
	{
		$sql = $this->db->prepare("SELECT medico.*, cliente.*
        FROM medico
        INNER JOIN cliente ON cliente.cliente_id = medico.cliente_id ORDER BY medico_id DESC");
		if ($sql->execute()) {
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		} else {
			$resultado = [];
		}
		return $resultado;
	}
	public function Reporte($id)
	{
		$sql = $this->db->prepare("SELECT medico.*, cliente.*
        FROM medico
        INNER JOIN cliente ON cliente.cliente_id = medico.cliente_id
        WHERE medico_id = ?");
		$sql->execute([$id]);
		$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $resultado;
	}

	public function SaveImg($ruta)
	{
		try {
			$sql = $this->db->prepare("UPDATE medico set medico_foto = ?");
			$sql->execute([$ruta]);
			if ($sql->rowCount() > 0) {

				$this->reg_bitacora([
					'table_name' => "medico",
					'des' => "Imagen de medico subida ($ruta)"
				]);

				return [
					"data" => [
						"res" => "Imagen guardada"
					],
					"code" => 200
				];
			}
			return [
				"data" => [
					"res" => "La imagen no pudo ser guardada"
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
}
