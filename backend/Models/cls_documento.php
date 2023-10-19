<?php
require_once("cls_db.php");

abstract class cls_documento extends cls_db
{
    public function __construct()
    {
        parent::__construct();
    }

    protected function GetAll()
    {
        $sql = $this->db->prepare("SELECT * FROM documentos");
        if ($sql->execute()) {
            $resultado = $sql->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $resultado = [];
        }
        return $resultado;
    }

    public function SaveImg($nombre, $ruta)
    {
        try {
            $sql = $this->db->prepare("INSERT INTO documentos
            (documento_nombre,documento_ruta,documento_estatus) 
            values (?,?,1)");
            $sql->execute([$nombre, $ruta]);
            if ($sql->rowCount() > 0) {
                $this->reg_bitacora([
                    'table_name' => "documentos",
                    'des' => "subida de documentos ($nombre, en la ruta: $ruta)"
                ]);

                return [
                    "data" => [
                        "res" => "Imagen guardada"
                    ],
                    "code" => 200
                ];
            }
            return [
                "data" => [
                    "res" => "La imagen no pudo ser guardada"
                ],
                "code" => 400
            ];
        } catch (PDOException $e) {
            return [
                "data" => [
                    'res' => "Error de consulta: " . $e->getMessage()
                ],
                "code" => 400
            ];
        }
    }
}
