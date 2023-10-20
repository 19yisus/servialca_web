<?php
require_once("./Models/cls_gastosPersonales.php");

class Con_gastosPersonales extends cls_gastosPersonales
{
    public function __construct()
    {
        parent::__construct();
        $this->id = isset($_POST["ID"]) ? $_POST["ID"] : null;
        $this->ingresoEgreso = isset($_POST["ingresoEgreso"]) ? $_POST["ingresoEgreso"] : null;
        $this->motivo = isset($_POST["Motivo"]) ? $_POST["Motivo"] : null;
        $this->tipo = isset($_POST["Tipo"]) ? $_POST["Tipo"] : null;
        $this->monto = isset($_POST["Monto"]) ? $_POST["Monto"] : null;
        $this->referencia = isset($_POST["Referencia"]) ? $_POST["Referencia"] : null;
        $this->precioDolar = isset($_POST["precioDolar"]) ? $_POST["precioDolar"] : null;
    }

    public function Registrar()
    {
        $resultado = $this->Save();
        Response($resultado["data"], $resultado["code"]);
    }

    public function ConsultarUno()
    {
        $resultado = $this->GetOne();
        Response($resultado, 200);
    }

    public function Editar(){
        $resultado = $this->Edit();
        Response($resultado,200);
    }

    public function ConsultarTodos()
    {
        $resultado = $this->GetAll();
        Response($resultado, 200);
    }
}
