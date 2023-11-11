<?php
require_once("cls_db.php");

abstract class cls_cliente extends cls_db
{
	public function __construct()
	{
		parent::__construct();
	}

	protected function cumpleañero()
	{
		$dia = date("d");
		$mes = date("m");
		$sql = $this->db->prepare("SELECT * FROM cliente 
        WHERE MONTH(cliente_fechaNacimiento) = :mes 
        AND DAY(cliente_fechaNacimiento) = :dia");
		$sql->bindParam(":mes", $mes, PDO::PARAM_INT);
		$sql->bindParam(":dia", $dia, PDO::PARAM_INT);
		if ($sql->execute()) {
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		} else {
			$resultado = [];
		}
		return $resultado;
	}

	protected function GetAll()
	{
		$sql = $this->db->prepare("SELECT * FROM cliente WHERE 
        cliente_nombre IS NOT NULL
        AND cliente_apellido IS NOT NULL
        AND cliente_cedula IS NOT NULL");
		if ($sql->execute()) {
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		} else {
			$resultado = [];
		}
		return $resultado;
	}

	protected function GetAllTitular()
	{
		$sql = $this->db->prepare("SELECT * FROM titular");
		if ($sql->execute()) {
			$resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		} else {
			$resultado = [];
		}
		return $resultado;
	}

	protected function consultarByCedula($cedula)
	{
		if ($cedula === "V-" || $cedula === "E-" || $cedula === "J-" || $cedula === "G-") {
			return [
				'data' => [
					'res' => "cliente no encontrado",
					"code" => 400
				],
				'code' => 400
			];
		}
		$res = $this->db->prepare("SELECT * FROM cliente WHERE cliente_cedula = ? AND cliente_nombre IS NOT NULL AND cliente_cedula IS NOT NULL");
		$res->execute([$cedula]);
		if ($res->rowCount() > 0) {
			$data = $res->fetch(PDO::FETCH_ASSOC);
			return [
				'data' => [
					'res' => "cliente encontrado",
					'cliente' => $data,
					"code" => 200
				],
				'code' => 200
			];
		} else {
			return [
				'data' => [
					'res' => "cliente no encontrado",
					"code" => 400
				],
				'code' => 400
			];
		}
	}

	public function consultarByDedulaTitular($cedula)
	{
		if ($cedula === "V-" || $cedula === "E-" || $cedula === "J-" || $cedula === "G-") {
			return [
				'data' => [
					'res' => "cliente no encontrado",
					"code" => 400
				],
				'code' => 400
			];
		}
		$res = $this->db->prepare('SELECT * FROM titular WHERE titular_cedula = ? AND titular_nombre IS NOT NULL AND titular_apellido IS NOT NULL');
		$res->execute([$cedula]);
		if ($res->rowCount() > 0) {
			$data = $res->fetch(PDO::FETCH_ASSOC);
			return [
				'data' => [
					'res' => "Titular encontrado",
					'cliente' => $data,
					"code" => 200
				],
				'code' => 200
			];
		} else {
			return [
				'data' => [
					'res' => "Titular no encontrado",
					"code" => 400
				],
				'code' => 400
			];
		}
	}
}
