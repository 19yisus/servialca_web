<?php
include_once("./FPDF/fpdf.php");
include_once("./Models/cls_poliza.php");
class Reporte extends cls_poliza
{
}

$rp = new Reporte();
$datos = $rp->reporteGeneral($_GET["Sucursal"], $_GET["Motivo"], $_GET["Desde"], $_GET["Hasta"]);
$motivo;
if (isset($_GET["Sucursal"])) {
  $motivo = "Reporte de sucursal";
} else if ($_GET["Motivo"] == 1) {
  $motivo = "Ingresos";
} else if ($_GET["Motivo"] == 0) {
  $motivo = "Egresos";
} else if ($_GET["Motivo"] == 2) {
  $motivo = "Ingreso y Egreso";
}  else {
  $motivo = $_GET["Motivo"];
}
$generado = 0;
$gastado = 0;
$total = 0;
foreach ($datos as $fila) {
  if ($fila["nota_IngresoEgreso"] === 1) {
    $generado += $fila["nota_monto"];
  } else {
    $gastado += $fila["nota_monto"];
  }
  $total = $generado - $gastado;
}
class PDF extends FPDF
{
  public function __construct()
  {
    parent::__construct("L", "mm", "A4");
  }

  public function Header()
  {
    $this->Image("./Img/heade.jpg", 0, 0, 300, 40, "JPG");
  }

  public function Footer()
  {
    $this->Image("./Img/footer.jpg", 0, 190, 300, 22, "JPG");
  }
}

$pdf = new PDF();
$pdf->AddPage();
$pdf->SetFont("Arial", "B", 16);
$pdf->SetY(40);
$pdf->SetX(190);
$pdf->SetFont("Arial", "B", 12);
$pdf->Cell(0, 10, "Reporte de: " . $motivo, 0, 1, "R");
$pdf->Cell(0, 10, "Desde: " . date("d-m-Y", strtotime($_GET["Desde"])), 0, 1, "R");
$pdf->Cell(0, 10, "Hasta: " . date("d-m-Y", strtotime($_GET["Hasta"])), 0, 1, "R");
$pdf->SetX(15);
$pdf->SetY(40);
$pdf->Cell(0, 10, "Total Generado: " . $generado . " $", 0, 1, "L");
$pdf->Cell(0, 10, "Total Gastado: " . $gastado . " $", 0, 1, "L");
$pdf->Cell(0, 10, "Total: " . $total . " $", 0, 1, "L");
$pdf->Ln(10);
$pdf->SetFont('Arial', '', 10);
$pdf->SetY(90);
$pageWidth = $pdf->GetPageWidth();

// Número de columnas de la tabla
$numColumns = 7;

// Ancho de cada celda
$cellWidth = $pageWidth / ($numColumns + 1); // Se suma 1 para dar espacio adicional entre las celdas

// Obtener el ancho total de la tabla
$tableWidth = $cellWidth * $numColumns;

// Calcular la posición x para centrar la tabla
$tableX = ($pageWidth - $tableWidth) / 2;

// Establecer la posición x de la celda inicial de la tabla
$pdf->SetX($tableX - 7.4);

// Establecer el color de fondo de las celdas de encabezado
$pdf->SetFillColor(229, 57, 53); // Rojo más intenso
$pdf->Cell($cellWidth, 10, utf8_decode('N° de movimiento'), 1, 0, 'C', true);
$pdf->Cell($cellWidth, 10, 'Fecha', 1, 0, 'C', true);
$pdf->Cell($cellWidth, 10, utf8_decode('Hora'), 1, 0, 'C', true);
$pdf->Cell($cellWidth, 10, utf8_decode('Usuario'), 1, 0, 'C', true);
$pdf->Cell($cellWidth, 10, utf8_decode("Sucursal"), 1, 0, "C", true);
$pdf->Cell($cellWidth + 15, 10, 'Motivo', 1, 0, 'C', true);
$pdf->Cell($cellWidth, 10, 'Monto $', 1, 0, 'C', true);
$pdf->Ln(10);
// Restaurar el color de fondo a blanco
$pdf->SetFillColor(255, 255, 255);
$tableY = $pdf->GetY();
foreach ($datos as $fila) {
  $pdf->SetX(11.2);

  // Comprobar el valor de nota_IngresoEgreso
  if ($fila["nota_IngresoEgreso"] === 0) {
    $pdf->SetFillColor(229, 57, 53); // Establecer color de fondo en rojo
  } else {
    $pdf->SetFillColor(255, 255, 255); // Restaurar el color de fondo a blanco
  }

  $pdf->Cell($cellWidth, 10, utf8_decode($fila["nota_id"]), 1, 0, "C", true);
  $pdf->Cell($cellWidth, 10, date("d-m-Y", strtotime($fila["nota_fecha"])), 1, 0, "C", true);
  $pdf->Cell($cellWidth, 10, $fila["nota_hora"], 1, 0, "C", true);
  $pdf->Cell($cellWidth, 10, utf8_decode($fila["usuario_usuario"]), 1, 0, "C", true);
  $pdf->Cell($cellWidth, 10, utf8_decode($fila["sucursal_nombre"]), 1, 0, "C", true);
  $pdf->Cell($cellWidth + 15, 10, utf8_decode($fila["nota_motivo"]), 1, 0, "C", true);
  $pdf->Cell($cellWidth, 10, $fila["nota_monto"] . " $", 1, 0, "C", true);

  // Restaurar el color de fondo a blanco para la siguiente fila
  $pdf->SetFillColor(255, 255, 255);

  $pdf->Ln(10);
}
$pdf->Output();
