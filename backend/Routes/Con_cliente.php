<?php
require_once("./Models/cls_cliente.php");
class Con_cliente extends cls_cliente
{
    public function __construct()
    {
        parent::__construct();
    }

    public function Cumple()
    {
        $resultado = $this->cumpleañero();
        Response($resultado, 200);
    }
}