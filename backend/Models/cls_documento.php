<?php
require_once("cls_db.php");

abstract class cls_documento extends cls_db
{
    public function __construct()
    {
        parent::__construct();
    }

    protected function GetAll(){
        $sql = $this->db->prepare("SELECT * FROM documentos");
        if ($sql->execute()){
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        }else{
            $resultado = [];
        }
        return $resultado;
    }

    public function SaveImg($ruta){
        try{
         $sql = $this->db->prepare("INSERT INTO documento(documento_ruta) values (?)");
         $sql->execute([$ruta]);
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