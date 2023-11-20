<?php
require_once("cls_db.php");

abstract class cls_bitacora extends cls_db
{
    public function __construct()
    {
        parent::__construct();
    }

    protected function GetAll()
    {
        $sql = $this->db->prepare("SELECT bitacora.*, usuario.* FROM bitacora
        INNER JOIN usuario ON usuario.usuario_id = bitacora.id_usuario ORDER BY id_bit DESC");
        if ($sql->execute()) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }
        return $resultado;
    }
}
