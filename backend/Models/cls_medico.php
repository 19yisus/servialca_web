<?php
require_once("cls_db.php");

abstract class cls_medico extends cls_db
{
    public function __construct()
    {
        parent::__construct();
    }

    protected function GetAll()
    {
        $sql = $this->db->prepare("SELECT * FROM medico ORDER BY medico_id DESC");
        if ($sql->execute())
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        else
            $resultado = [];
        return $resultado;
    }
}