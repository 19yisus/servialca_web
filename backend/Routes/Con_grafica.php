<?php
require_once("./Models/cls_grafica.php");

class Con_grafica extends cls_grafica
{

    public function Diario()
    {
        $resultado = $this->Consultar_Diario($_POST["Desde"], $_POST["Hasta"]);
        Response($resultado, 200);
    }

    public function Anual()
    {
        $resultado = $this->Consultar_Anual();
        Response($resultado, 200);
    }
}