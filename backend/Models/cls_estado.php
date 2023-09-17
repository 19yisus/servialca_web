<?php
require_once("cls_db.php");

abstract class cls_estado extends cls_db
{
	public function __construct()
	{
		parent::__construct();
	}

	protected function GetAll()
	{
		$sql = $this->db->prepare("SELECT * FROM estado ORDER BY estado_id ASC");
		if ($sql->execute()) $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
	}
}
