<?php
include("./FPDF/fpdf.php");
include("./Models/cls_Licencia.php");

class Licencia extends cls_Licencia
{
}
$a = new Licencia();
$datos = $a->consultarUno($_GET["ID"]);
// Crear una nueva instancia de FPDF
$Pdf = new FPDF("P", "mm", "legal");
$Pdf->AddPage();

// Agregar un logotipo a la izquierda
$Pdf->Image("./img//logo2.png", 10, 10, 50, 20);
$Pdf->Image("./img//rubro2.jpg", 165, 70, 30, 30);

// Establecer la fuente para el título
$Pdf->SetFont('Arial', 'B', 16);
$Pdf->Cell(0, 20, utf8_decode("Recibo de ingreso"), 0, 0, "C");
$Pdf->SetFont('Arial', 'B', 12);
$Pdf->SetX(180); // Ajusta la coordenada x según tus necesidades
$Pdf->Cell(10, 20, $datos[0]["cliente_cedula"] . "-" . $_GET["ID"], 0, 1, "L");
// Título centrado
$Pdf->SetY(25);
$Pdf->SetFont('Arial', 'B', 12);
$Pdf->Cell(0, 20, utf8_decode("Renovación de licencia"), 0, 0, "C"); // Cambiado el último argumento a 0

$Pdf->SetY(45);



// Establecer la fuente para los campos de datos
$Pdf->SetFont('Arial', '', 12);

// Datos de ejemplo (reemplaza con tus propios datos)
$nombre = utf8_decode($datos[0]["cliente_nombre"]); // Nombre
$apellido = utf8_decode($datos[0]["cliente_apellido"]); // Apellido
$cedula = $datos[0]["cliente_cedula"]; // Cédula
$telefono = $datos[0]["cliente_telefono"];
$correo = utf8_decode($datos[0]["licencia_correo"]); // Caracteres especiales en el correo
$sangre = $datos[0]["licencia_sangre"]; // Tipo de sangre
$licencia = $datos[0]["licencia_licencia"]; // Licencia
if (isset($datos[0]["sucursal_direccion"])) {
    $sucursal = $datos[0]["sucursal_direccion"];
} else {
    $sucursal = "";
}

if ($licencia == 0) {
    $licencia = "2Da";
}
if ($licencia == 1) {
    $licencia = "3Ra";
}
if ($licencia == 2) {
    $licencia = "4Ta";
}
if ($licencia == 3) {
    $licencia = "5Ta";
}
$abonado = $datos[0]["licencia_abonado"];
$restante = $datos[0]["licencia_restante"];

// Mostrar "Nombre", "Apellido" y "Cédula" en la misma fila
$Pdf->SetFont('Arial', 'B', 12);
$Pdf->Cell(18, 10, "Nombre:", 0);
$Pdf->SetFont('Arial', '', 10);
$Pdf->Cell(60, 10, utf8_decode($nombre), 0);
$Pdf->SetFont('Arial', 'B', 12);
$Pdf->Cell(19, 10, "Apellido:", 0);
$Pdf->SetFont('Arial', '', 10);
$Pdf->Cell(52, 10, utf8_decode($apellido), 0);
$Pdf->SetFont('Arial', 'B', 12);
$Pdf->Cell(16, 10, utf8_decode("Cédula:"), 0);
$Pdf->SetFont('Arial', '', 10);
$Pdf->Cell(50, 10, $cedula, 0);
$Pdf->Ln();
// Mostrar "Correo", "Tipo de Sangre" y "Licencia" en la misma fila
$Pdf->SetFont('Arial', 'B', 12);
$Pdf->Cell(16, 10, "Correo:", 0);
$Pdf->SetFont('Arial', '', 11);
$Pdf->Cell(62, 10, utf8_decode($correo), 0);
$Pdf->SetFont('Arial', 'B', 12);
$Pdf->Cell(33, 10, "Tipo de Sangre:", 0);
$Pdf->SetFont('Arial', '', 10);
$Pdf->Cell(38, 10, $sangre, 0);
$Pdf->SetFont('Arial', 'B', 12);
$Pdf->Cell(20, 10, "Telefono:", 0);
$Pdf->SetFont('Arial', '', 10);
$Pdf->Cell(38, 10, $telefono, 0);
$Pdf->Ln();
$Pdf->SetFont('Arial', 'B', 12);
$Pdf->Cell(20, 10, "Licencia:", 0);
$Pdf->SetFont('Arial', '', 10);
$Pdf->Cell(58, 10, utf8_decode($licencia), 0);
$Pdf->SetFont('Arial', 'B', 12);
$Pdf->Cell(20, 10, "Abonado:", 0);
$Pdf->SetFont('Arial', '', 10);
$Pdf->Cell(51, 10, $abonado . " $ ", 0);
$Pdf->SetFont('Arial', 'B', 12);
$Pdf->Cell(20, 10, "Restante:", 0);
$Pdf->SetFont('Arial', '', 10);
$Pdf->Cell(50, 10, $restante . " $ ", 0);

$Pdf->SetY(95);
$Pdf->SetX(0);
$Pdf->SetFont('Arial', '', 10);
$Pdf->Cell(0, 0, $sucursal, 0);
$Pdf->SetY(100);
$Pdf->SetX(0);
$Pdf->Cell(0, 0, "--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------", 0);

$Pdf->Output();
?>