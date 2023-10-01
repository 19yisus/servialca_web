<?php
class Con_reporte 
{
    public function reporteMedico(){
        include("Con_reporteMedico.php");
    }

    public function reporteRCV(){
        include("Con_reporteRCV.php");
    }

    public function reporteWeb(){
        include("Con_reporteWeb.php");
    }

    public function reporteCarnet(){
        include("Con_reporteCarnet.php");
    }

    public function reporteIngresoEgreso(){
        include("Con_reporteVendedores.php");
    }
}