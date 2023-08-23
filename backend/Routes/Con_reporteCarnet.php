<?php
include("./FPDF/fpdf.php");
include("./Models/cls_poliza.php");
class MiCliente extends cls_poliza
{

}
$a = new MiCliente();
$datos = $a->GetOne($_GET["ID"]);
if ($datos && count($datos) > 0) {
    if ($datos[0]["poliza_renovacion"] < 10) {
        $renovacion = "0" . $datos[0]["poliza_renovacion"];
    } else {
        $renovacion = $datos[0]["poliza_renovacion"];
    }
    if ($datos[0]["vehiculo_peso"] > 0) {
        $cap = $datos[0]["vehiculo_peso"];
    }
    if ($datos[0]["vehiculo_capTon"] > 0) {
        $capTotal = $datos[0]["vehiculo_capTon"];
    }
}
$Pdf = new FPDF("P", "mm", array(210, 297));
$Pdf->AddPage('P');
$Pdf->SetFont("arial", "", 13); // Aumentar el tamaño de fuente a 13
$Pdf->Image("./Img/FONDO_CERTIFI.gif", 115, 28, 90, 60, "gif", "");
$Pdf->Image("./Img/FONDO_CERTIFI_1.gif", 25, 28, 90, 60, "gif", "");
$Pdf->Image("./Img/FONDO_CERTIFI_2.gif", 30, 32, 25, 8, "gif", "");
// $Pdf->Image($datos[0]["poliza_qr"], 125, 64, 15, 12);
$Pdf->SetTextColor(183, 28, 28); //color rojo en las letras
$Pdf->SetFillColor(300, 300, 255);
$Pdf->Ln(1);
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Cell(135, 120, "");
$Pdf->Cell(32, 114, "CONTRATO NRO: 000000" . $datos[0]["poliza_id"] . " - " . $renovacion);
$Pdf->Ln(1);
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Cell(10, 40, "");
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Ln(+12);
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Cell(86, 105, "");
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Cell(+18, 20, "", 0, 1, "C");
$Pdf->Cell(17, 10, "");
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(15, 37, "EMISION: ");
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(37, 37, date("d/m/Y", strtotime($datos[0]["poliza_fechaInicio"])));
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 
$Pdf->Cell(10, 37, "VENCE :");
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(56, 37, "" . date("d/m/Y", strtotime($datos[0]["poliza_fechaVencimiento"])));
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Ln(1);
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Cell(17, 20, "");
$Pdf->Cell(10, -5, "TITULAR: ");
$Pdf->Ln(1);
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(17, 20, "");
$Pdf->Cell(8, -2, "" . utf8_decode($datos[0]["titular_nombre"] . " " . $datos[0]["titular_apellido"]));
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(2, 10, "");
$Pdf->Cell(12, 4, "" . $datos[0]["titular_cedula"]);
$Pdf->Ln(7);
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Cell(17, 10, "");
$Pdf->Cell(10, -3, "CONTRATANTE: ");
$Pdf->Ln(1);
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(17, 20, "");
$Pdf->Cell(10, 1, "" . utf8_decode($datos[0]["cliente_nombre"]) . " " . utf8_decode($datos[0]["cliente_apellido"]));
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(2, 2, "");
$Pdf->Cell(10, 8, "" . $datos[0]["cliente_cedula"]);
$Pdf->Ln(-8);
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Cell(17, 38, "");
$Pdf->Cell(12, 39, "MARCA : ");
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(40, 39, "" . $datos[0]["marca_nombre"]);
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Cell(14, 39, "MODELO: ");
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(+10, 39, "" . $datos[0]["modelo_nombre"]);
$Pdf->Ln(1);
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Cell(17, 56, "");
$Pdf->Cell(7, 65, "USO: ");
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(20, 65, "" . $datos[0]["usoVehiculo_nombre"]);
$Pdf->Ln(5);
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Cell(17, 28, "");
$Pdf->Cell(13, 34, "COLOR : ");
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(39, 34, "" . $datos[0]["color_nombre"]);
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Cell(8, 34, "TIPO: ");
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(-3, 34, "" . strtoupper($datos[0]["tipoVehiculo_nombre"])); //anio
$Pdf->Ln(5);
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Cell(17, 24, "");
$Pdf->Cell(18, 31, "SER.CARR. : ");
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(34, 31, "" . $datos[0]["vehiculo_serialCarroceria"]);
$Pdf->SetFont('Arial', 'B', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(12, 31, "PLACA: "); //SER.MOTOR.:
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(28, 31, "" . $datos[0]["vehiculo_placa"]);
$Pdf->Ln(4);
$Pdf->SetFont('Arial', 'B', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(17, 22, "");
$Pdf->Cell(21, 30, "SER.MOTOR.: ");
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(31, 30, "" . $datos[0]["vehiculo_serialMotor"]);
$Pdf->SetFont('Arial', 'B', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(9, 30, utf8_decode(strtoupper("AÑO:")));
$Pdf->SetFont('Arial', '', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(15, 30, "" . $datos[0]["vehiculo_año"]);
$Pdf->Ln(10);
$Pdf->SetFont('Arial', 'B', 9); // Aumentar el tamaño de fuente a 9
$Pdf->Cell(18, 7, "");
$Pdf->Ln(1);
$Pdf->Cell(16, 7, "");
$Pdf->Image("./Img/rubro.jpg", 85, 32, 25, 20);
$Pdf->Ln(6);
$Pdf->SetFont('Arial', 'B', 8); // Aumentar el tamaño de fuente a 8
$Pdf->Cell(17, 6, "");
$Pdf->Cell(2, 12, "ESTE VEHICULO CUMPLE CON EL ART. 58 DE LA LEY DE INTT");
$Pdf->Ln(1);

$Pdf->SetFont('Arial', 'B', 6);
$Pdf->Cell(18, 8, "");
$Pdf->ln(2);
$Pdf->Cell(290, 6, " ");
$Pdf->ln(10);
$Pdf->SetTextColor(000);
$Pdf->SetFont("arial", "B", 10);
$Pdf->Output();