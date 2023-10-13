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
  
	protected function GetAllText()
	{
		$sql = $this->db->prepare("SELECT * FROM  pagina_web");
		if ($sql->execute()) $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
  }
	public function GetAllWeb()
	{
		$sql = $this->db->prepare("SELECT * FROM pagina_web");
		if ($sql->execute()) $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
		else $resultado = [];
		return $resultado;
	}

	protected function reg_file_info($datos, $file_names)
	{

		foreach ($file_names as $item) {
			if ($item['name'] != "") {
				$name = str_ireplace(".PNG", "", $item['name']);
				$tag = $item['tag'];
				$ruta = str_replace(" ", "_", $item['name']);
				$this->buscar_y_desactivar($tag);
				$sql = $this->db->prepare("INSERT INTO file_contents(nombre_img, tag, ruta_img, upload_date, estatus_img) VALUES(?,?,?,NOW(),1)");
				$sql->execute([$name, $tag, $ruta]);
			}
		}
	}

	protected function Save($datos)
	{
		if (isset($datos)) {
			$sqlc = $this->db->query("SELECT * FROM pagina_web WHERE 1");
			// $resultado = $sqlc->fetchAll(PDO::FETCH_ASSOC);
			if ($sqlc->rowCount() == 0) {
				$sql2 = $this->db->prepare("INSERT INTO pagina_web(text_home,text_about,text_mision,text_visiom,text_ubicacion,text_correo,text_telefono, text_fax) VALUES(?,?,?,?,?,?,?,?)");
			} else {
				$sql2 = $this->db->prepare("UPDATE pagina_web SET text_home =?, text_about=?, text_mision=?, text_vision=?, text_ubicacion=?, text_correo=?, text_telefono =?, text_fax=? WHERE 1");
			}

			$sql2->execute([$datos['text_home'], $datos["text_about"], $datos["text_mision"], $datos["text_vision"], $datos["text_ubicacion"], $datos["text_correo"], $datos["text_telefono"], $datos["text_banner"]]);
		}

		return 1;
	}

	private function buscar_y_desactivar($tag)
	{
		$this->db->query("UPDATE file_contents SET estatus_img = 0 WHERE tag = '$tag'");
	}
	public function getImg($tag)
	{

		if ($tag == 'home') $tag = 'home_1';
		else if ($tag == 'about') $tag = 'about_1';
		else if ($tag == 'banner') $tag = 'img_banner';
		else {
			$array_img = [];
			for ($i = 1; $i < 4; $i++) {
				$tag = "carrusel_" . $i;
				$sql = $this->db->query("SELECT * FROM file_contents WHERE tag = '$tag' AND estatus_img = 1");
				$resultado = $sql->fetch(PDO::FETCH_ASSOC);
				array_push($array_img, $resultado);
			}
			return $array_img;
		}

		$sql = $this->db->query("SELECT * FROM file_contents WHERE tag = '$tag' AND estatus_img = 1");
		$resultado = $sql->fetch(PDO::FETCH_ASSOC);
		return $resultado;
	}
}
