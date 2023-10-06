<?php
require_once("cls_db.php");

abstract class cls_panel extends cls_db
{
	public function __construct()
	{
		parent::__construct();
	}

	protected function GetAll()
	{
		$sql = $this->db->prepare("SELECT * FROM file_contents");
		if ($sql->execute()) $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
	}
}
