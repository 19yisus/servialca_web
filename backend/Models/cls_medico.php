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
        $sql = $this->db->prepare("SELECT medico.*, cliente.*
        FROM medico
        INNER JOIN cliente ON cliente.cliente_id = medico.cliente_id ORDER BY medico_id DESC");
        if ($sql->execute()) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }
        return $resultado;
    }
    public function Reporte($id)
    {
        $sql = $this->db->prepare("SELECT medico.*, cliente.*
        FROM medico
        INNER JOIN cliente ON cliente.cliente_id = medico.cliente_id
        WHERE medico_id = ?");
        $sql->execute([$id]);
        $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function SaveImg($ruta,$id){
       try{
        $sql = $this->db->prepare("UPDATE medico set medico_foto = ? WHERE medico_id = ?");
        $sql->execute([$ruta,$id]);
        if ($sql->rowCount()>0) return[
            "data" => [
                "res" => "Imagen guardada"
            ],
            "code" => 200
        ];
        return [
            "data" => [
                "res" => "La imagen no pudo ser guardada"
            ],
            "code" => 400
        ];
        
    }catch (PDOException $e) {
        return [
            "data" => [
                'res' => "Error de consulta: " . $e->getMessage()
            ],
            "code" => 400
        ];
        }    
    }
}
?>