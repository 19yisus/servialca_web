<?php
include("./FPDF/fpdf.php");
include("./Models/cls_poliza.php");
class MiCliente extends cls_poliza
{

}
$a = new MiCliente();
$datos = $a->Reporte($_GET["Nombre"], $_GET["Desde"], $_GET["Hasta"]);
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

function abreviarNombre($nombre, $apellido)
{
    $nombres = explode(" ", $nombre);
    $totalNombres = count($nombres);

    if ($totalNombres < 1) {
        // Si no hay nombres, mantener el nombre completo
        return $nombre;
    }

    $nombreAbreviado = $nombres[0] . " "; // Primer nombre

    // Abreviar el segundo nombre si existe
    if ($totalNombres >= 2 && !empty(trim($nombres[1]))) {
        $nombreAbreviado .= strtoupper(substr($nombres[1], 0, 1)) . ". ";
    }

    // Mostrar el primer apellido si existe
    $apellidos = explode(" ", $apellido);
    if (count($apellidos) > 0 && !empty(trim($apellidos[0]))) {
        $nombreAbreviado .= $apellidos[0] . " ";
    }

    return trim($nombreAbreviado);
}


$totalDolar = 0;
$totalComisionDolar = 0;
foreach ($datos as $fila) {
    $totalDolar += $fila["nota_monto"];
    $totalComisionDolar += ($fila["nota_monto"] * $fila["roles_comision"]) / 100;
}


$pdf = new PDF();
$pdf->AddPage();
$pdf->SetFont("Arial", "B", 16);
$pdf->SetY(30);
$pdf->SetX(190);
$pdf->SetFont("Arial", "B", 12);
$pdf->Cell(0, 10, "Reporte de: " . $_GET["Nombre"], 0, 1, "R");
$pdf->Cell(0, 10, "Desde: " . $_GET["Desde"], 0, 1, "R");
$pdf->Cell(0, 10, "Hasta: " . $_GET["Hasta"], 0, 1, "R");
$pdf->SetX(15);
$pdf->Cell(0, 10, 'Total: ' . $totalDolar . "$", 0, 1, 'L');
$pdf->SetX(15);
$pdf->Cell(0, 10, 'Comision: ' . $totalComisionDolar . "$", 0, 1, 'L');
$pdf->Ln(10);
$pdf->SetFont('Arial', '', 10);
$pdf->SetY(90);


// Ancho de página
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
$pdf->SetX($tableX - 10);

// Establecer el color de fondo de las celdas de encabezado
$pdf->SetFillColor(229, 57, 53); // Rojo más intenso

// Encabezados de la tabla
$pdf->Cell($cellWidth, 10, utf8_decode('N° de contrato'), 1, 0, 'C', true);
$pdf->Cell($cellWidth, 10, 'Fecha', 1, 0, 'C', true);
$pdf->Cell($cellWidth + 20, 10, utf8_decode('Cliente'), 1, 0, 'C', true);
$pdf->Cell($cellWidth, 10, utf8_decode('Sucursal'), 1, 0, 'C', true);
$pdf->Cell($cellWidth, 10, 'Tipo de contrato', 1, 0, 'C', true);
$pdf->Cell($cellWidth, 10, 'Monto $', 1, 0, 'C', true);
$pdf->Cell($cellWidth, 10, utf8_decode('Comisión $'), 1, 0, 'C', true);
$pdf->Ln(10);
// Restaurar el color de fondo a blanco
$pdf->SetFillColor(255, 255, 255);

// Variable para controlar la posición Y de la tabla
$tableY = $pdf->GetY();

// Imprimir filas de datos
foreach ($datos as $fila) {
    // Verificar si la siguiente fila excede la altura disponible en la página

    $pdf->SetX(8.5);
    $pdf->Cell($cellWidth, 10, utf8_decode($fila["poliza_id"]), 1, 0, 'C', true);
    $pdf->Cell($cellWidth, 10, date("d-m-Y", strtotime($fila["nota_fecha"])), 1, 0, 'C', true);
    $pdf->Cell($cellWidth + 20, 10, utf8_decode(abreviarNombre($fila["cliente_nombre"], $fila["cliente_apellido"])), 1, 0, 'C', true);
    $pdf->Cell($cellWidth, 10, utf8_decode($fila["sucursal_nombre"]), 1, 0, 'C', true);
    $pdf->Cell($cellWidth, 10, utf8_decode($fila["nota_motivo"]), 1, 0, 'C', true);
    $pdf->Cell($cellWidth, 10, utf8_decode($fila["nota_monto"] . "$"), 1, 0, 'C', true);
    $totalComisionDolar = ($fila["nota_monto"] * $fila["roles_comision"]) / 100;
    $pdf->Cell($cellWidth, 10, utf8_decode($totalComisionDolar . "$"), 1, 0, 'C', true);
    $pdf->Ln(10);
    $tableY += 10; // Actualizar la posición Y de la tabla
}

$pdf->Output();

?>