<?php
include_once("./FPDF/fpdf.php");
require_once("./Models/cls_medico.php");
class clsFpdf extends FPDF
{
    // $id="04";
    //Cabecera de página
    public function Header()
    {
        $this->Cell(10);


        $this->Ln(0);
        $this->Cell(100, 0, "", 0, 1, "C");
        $this->Ln();
        $this->SetFont('Arial', 'B', 12);
    }

    public function Footer()
    {
        //Posición: a 2 cm del final
        $this->SetY(-25);
        //Arial italic 8
        $this->SetFont("Arial", "I", 5);
        $this->SetFont('Arial', '', 13);
        $this->SetFillColor(240, 240, 240);
        $this->SetTextColor(200, 200, 200);
        $this->Cell(0, 5, utf8_decode("________________________________________________________________________________"), 0, 1, "C", false);
        $this->SetFont('Arial', '', 9);
        $this->SetTextColor(0, 0, 0);
        $this->Cell(180);
        //Número de página
        $this->Cell(25, 8, 'P' . utf8_decode('á') . 'gina ' . $this->PageNo() . "/{nb}", 0, 1, 'C');
    }

    function SetWidths($w)
    {
        //Set the array of column widths
        $this->widths = $w;
    }

    function SetAligns($a)
    {
        //Set the array of column alignments
        $this->aligns = $a;
    }

    function Row($data)
    {
        //Calculate the height of the row
        $nb = 0;
        for ($i = 0; $i < count($data); $i++)
            $nb = max($nb, $this->NbLines($this->widths[$i], $data[$i]));
        $h = 5 * $nb;
        //Issue a page break first if needed
        $this->CheckPageBreak($h);
        //Draw the cells of the row
        for ($i = 0; $i < count($data); $i++) {
            $w = $this->widths[$i];
            $a = isset($this->aligns[$i]) ? $this->aligns[$i] : 'C';
            //Save the current position
            $x = $this->GetX();
            $y = $this->GetY();
            //Draw the border
            $this->Rect($x, $y, $w, $h);

            $this->MultiCell($w, 5, $data[$i], 0, $a);
            //Put the position to the right of the cell
            $this->SetXY($x + $w, $y);
        }
        //Go to the next line
        $this->Ln($h);
    }

    function CheckPageBreak($h)
    {
        //If the height h would cause an overflow, add a new page immediately
        if ($this->GetY() + $h > $this->PageBreakTrigger)
            $this->AddPage($this->CurOrientation);
    }

    function NbLines($w, $txt)
    {
        //Computes the number of lines a MultiCell of width w will take
        $cw = &$this->CurrentFont['cw'];
        if ($w == 0)
            $w = $this->w - $this->rMargin - $this->x;
        $wmax = ($w - 2 * $this->cMargin) * 1000 / $this->FontSize;
        $s = str_replace("\r", '', $txt);
        $nb = strlen($s);
        if ($nb > 0 and $s[$nb - 1] == "\n")
            $nb--;
        $sep = -1;
        $i = 0;
        $j = 0;
        $l = 0;
        $nl = 1;
        while ($i < $nb) {
            $c = $s[$i];
            if ($c == "\n") {
                $i++;
                $sep = -1;
                $j = $i;
                $l = 0;
                $nl++;
                continue;
            }
            if ($c == ' ')
                $sep = $i;
            $l += $cw[$c];
            if ($l > $wmax) {
                if ($sep == -1) {
                    if ($i == $j)
                        $i++;
                } else
                    $i = $sep + 1;
                $sep = -1;
                $j = $i;
                $l = 0;
                $nl++;
            } else
                $i++;
        }
        return $nl;
    }
}

setlocale(LC_ALL, "es_VE.UTF8");
$Pdf = new clsFpdf();
class MiCliente extends cls_medico
{
   
}
$a = new MiCliente();
$datos = $a->Reporte($_GET["ID"]);
if ($datos == null) {
    echo ("Error");
} else {
    $Pdf->AliasNbPages();

    $Pdf->AddPage('P');
    $Pdf->SetFont("arial", "", 12);

    //    $ip=$_GET['ip'];
    //    $cedula=$_GET['cedula'];
    //    $nombres=$_GET['nombres'];
    //    $result=$DB->Getone(Query(8,array($ip,$cedula,$nombres)));
    $Pdf->SetTextColor(000);
    $Pdf->SetFillColor(255, 255, 255);
    $Pdf->SetFont('Arial', 'B', 10);

    $Pdf->SetFont('Arial', 'B', 10);
    $Pdf->Cell(200, 18, "", 0, 1, "C");
    //----------------------------
    $Pdf->Ln(3);
    $Pdf->SetFont('Arial', 'B', 10);
    $Pdf->Cell(60, 2, ""); //Lugar: 
    $Pdf->SetFont('Arial', 'B', 8);
    $Pdf->Cell(35, -3, "" . utf8_decode(strtoupper("acarigua")));
    //    $Pdf->Cell(35,0,"".utf8_decode(strtoupper($result['lugar'])));
    $Pdf->Cell(19, 3, ""); //Fecha: 
    $Pdf->SetFont('Arial', 'B', 8);
    $fechaInicio = $datos[0]["medico_fechaInicio"];
    $fechaFormateada = date("d-m-Y", strtotime($fechaInicio));
    $Pdf->Cell(14, -3, "" . utf8_decode(strtoupper($fechaFormateada)));

    //    $Pdf->Cell(14,0,"".utf8_decode(strtoupper($result['fecha_certifi'])));
    $Pdf->Ln(4);
    $Pdf->SetFont('Arial', 'B', 8);
    $Pdf->Cell(61, 2, ""); //NOMBRES: 
    $Pdf->SetFont('Arial', 'B', 7);
    $Pdf->Cell(50, 0, "" . utf8_decode(strtoupper($datos[0]["cliente_nombre"] . " " . $datos[0]["cliente_apellido"])));
    //    $Pdf->Cell(47,1,"".utf8_decode(strtoupper($result['nombre'])));
    $Pdf->SetFont('Arial', 'B', 10);
    $Pdf->Cell(13, 6, ""); //CI/RIF: 
    $Pdf->SetFont('Arial', 'B', 8);
    $Pdf->Cell(160, -3, "" . utf8_decode(strtoupper($datos[0]["cliente_cedula"])));
    //    $Pdf->Cell(160,1,"".utf8_decode(strtoupper($result['id_cedulaorif'])));
    $Pdf->Ln(5);

    $Pdf->Ln(5);


    $Pdf->Ln(6);
    $Pdf->SetFont('Arial', 'B', 10);
    $Pdf->Cell(62, 117, ""); //Nombres:
    $Pdf->SetFont('Arial', 'B', 8);
    $Pdf->Cell(83, 103, "" . utf8_decode($datos[0]["cliente_nombre"]));
    //    $Pdf->Cell(83,105,"".utf8_decode(strtoupper($result['nombres'])));

    $Pdf->Ln(5);
    $Pdf->SetFont('Arial', 'B', 10);
    $Pdf->Cell(62, 119, ""); //Apellidos: 
    $Pdf->SetFont('Arial', 'B', 8);
    $Pdf->Cell(73, 104, "" . utf8_decode($datos[0]["cliente_apellido"]));
    //    $Pdf->Cell(73,106,"".utf8_decode(strtoupper($result['apellidos'])));

    $Pdf->Ln(5);
    $Pdf->SetFont('Arial', 'B', 10);
    $Pdf->Cell(62, 100, ""); //C.I.: 
    $Pdf->SetFont('Arial', 'B', 8);
    $Pdf->Cell(25, 107, "" . utf8_decode($datos[0]["cliente_cedula"]));
    //    $Pdf->Cell(25,107,"".utf8_decode(strtoupper($result['id_cedulaorif'])));
    $Pdf->SetFont('Arial', 'B', 10);
    $Pdf->Cell(5, 100, " "); //Edad:
    $Pdf->SetFont('Arial', 'B', 8);
    $Pdf->Cell(50, 107, "" . utf8_decode($datos[0]["medico_edad"]));
    // $Pdf->Cell(50,108,"".utf8_decode(strtoupper($result['edad'])));
    $Pdf->Ln(5);
    $Pdf->SetFont('Arial', 'B', 10);
    $Pdf->Cell(77, 121, ""); //Fecha: 
    $Pdf->SetFont('Arial', 'B', 8);
    $Pdf->Cell(78, 109, "" . utf8_decode(strtoupper($fechaFormateada)));
    // $Pdf->Cell(78,111,"".utf8_decode(strtoupper($result['fecha_certifi'])));
    $Pdf->Ln(6);
    $Pdf->SetFont('Arial', 'B', 10);
    $Pdf->Cell(78, 123, ""); //Vencimiento: 
    $Pdf->SetFont('Arial', 'B', 8);
    $fechaVencimiento = $datos[0]["medico_fechaVencimiento"];
    $modificacionVencimiento = date("d-m-Y", strtotime($fechaVencimiento));
    $Pdf->Cell(78, 106, "" . utf8_decode(strtoupper($modificacionVencimiento)));
    // $Pdf->Cell(78,108,"".utf8_decode(strtoupper($result['fecha_venci'])));
    $Pdf->Ln(5);
    $Pdf->SetFont('Arial', 'B', 10);
    $Pdf->Cell(60, 153, ""); //ciudad: 
    $Pdf->SetFont('Arial', 'B', 8);
    $Pdf->Cell(22, 150, "" . utf8_decode(strtoupper("acarigua")));
    // $Pdf->Cell(24,153,"".utf8_decode(strtoupper($result['lugar'])));
    $Pdf->SetFont('Arial', 'B', 10);
    $Pdf->Cell(17, 153, ""); //GR. SANGRE: 
    $Pdf->SetFont('Arial', 'B', 8);
    $Pdf->Cell(86, 150, "" . utf8_decode(strtoupper($datos[0]["medico_tipoSangre"])));
    // $Pdf->Cell(86,153,"".utf8_decode(strtoupper($result['tipo_sangre'])));
    $Pdf->Ln(5);
    $Pdf->SetFont('Arial', 'B', 10);
    $Pdf->Cell(94, 181, ""); //Usa lentes: 
    $Pdf->SetFont('Arial', 'B', 8);
    $lente = "";
    if ($datos[0]["medico_lente"] == 0) {
        $lente = "No";
    } else {
        $lente = "Si";
    }
    $Pdf->Cell(90, 161, "" . utf8_decode(strtoupper($lente)));
    // $Pdf->Cell(86,163,"".utf8_decode(strtoupper($result['usa_lente'])));
    $Pdf->Ln(5);
    $Pdf->SetFont('Arial', 'B', 10);
    $Pdf->Cell(72, 183, ""); //Observaciones: 
    $Pdf->SetFont('Arial', 'B', 8);
    // $Pdf->Cell(86, 183, "" . utf8_decode(strtoupper($datos[0]["medico_observacion"])));
    // $Pdf->Cell(86,183,"".utf8_decode(strtoupper($result['observacion'])));

    $Pdf->Ln(9);

    $Pdf->SetWidths(array(255));



    $Pdf->SetWidths(array(15, 20, 15, 22, 25, 50, 20, 15));
    //un arreglo con alineacion de cada celda
    $Pdf->SetAligns(array('C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'));



    $Pdf->ln(2);
    // $Pdf->Cell(290,6," ".utf8_decode($_SESSION['']."  ".$_SESSION['']),0,1,"C");
    $Pdf->ln(10);
    $Pdf->SetTextColor(000);
    $Pdf->SetFont("arial", "B", 10);
    $Pdf->Output();
}