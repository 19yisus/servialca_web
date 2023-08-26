<?php
require_once("./Models/cls_tipo_contrato.php");

class Con_tipo_contrato extends cls_tipo_contrato
{
	public function __construct()
	{
		parent::__construct();
		$this->id = isset($_POST["ID"]) ? $_POST["ID"] : null;
		$this->nombre = isset($_POST["Nombre_contrato"]) ? $_POST["Nombre_contrato"] : null;
		$this->dano_cosas = isset($_POST["dano_cosas"]) ? $_POST["dano_cosas"] : null;
		$this->dano_personas = isset($_POST["dano_personas"]) ? $_POST["dano_personas"] : null;
		$this->fianza_cuanti = isset($_POST["fianza_cuanti"]) ? $_POST["fianza_cuanti"] : null;
		$this->asistencia_legal = isset($_POST["asistencia_legal"]) ? $_POST["asistencia_legal"] : null;
		$this->apov = isset($_POST["apov"]) ? $_POST["apov"] : null;
		$this->muerte = isset($_POST["muerte"]) ? $_POST["muerte"] : null;
		$this->invalidez = isset($_POST["invalidez"]) ? $_POST["invalidez"] : null;
		$this->gst_metico = isset($_POST["gasto_metico"]) ? $_POST["gasto_metico"] : null;
		$this->grua = isset($_POST["grua"]) ? $_POST["grua"] : null;
		$this->estatus = isset($_POST["Estatus"]) ? $_POST["Estatus"] : null;
	}

	public function registrar()
	{
		$resultado = $this->Save();
		Response($resultado["data"], $resultado["code"]);
	}

	public function actualizar()
	{
		$resultado = $this->update();
		Response($resultado["data"], $resultado["code"]);
	}

	public function eliminar()
	{
		$resultado = $this->Delete();
		Response($resultado["data"], $resultado["code"]);
	}

	public function ConsultarUno()
	{
		$resultado = $this->GetOne($_GET['ID']);
		Response($resultado, 200);
	}

	public function ConsultarTodos()
	{
		$resultado = $this->GetAll();
		Response($resultado, 200);
	}
}