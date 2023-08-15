import $ from 'jquery';
import {formatMoneda} from '../util/varios';

export const suma = (values3) => {
    var a, total = 0;
    var dJurada, dJurada2, dJurada3;
    var minimoAnual, mpagar;
    var porcenimpu = 100;
    var Anodecla = 2017;
    var porc = 1000;
    var alicuota;
    var valorUT = 10000;


    if (Anodecla >= 2018) {
      porc = 100;
    }


    for (a = 0; a < values3.length; a++) {
      if ($('#d' + values3[a].idactividad).val() !== 'undefined') {
        if ($('#d' + values3[a].idactividad).val() === '') {
          $('#d' + values3[a].idactividad).val("0,00");
        }
        dJurada = $('#d' + values3[a].idactividad).val();
        dJurada2 = dJurada.replace(/\./g, '');
        dJurada3 = dJurada2.replace(',', '.');
        minimoAnual = (parseFloat($('#mini' + values3[a].idactividad).val()));

        alicuota = (parseFloat($('#ali' + values3[a].idactividad).val().toString().replace(',', '.')));
        mpagar = ((alicuota) / porc) * (parseFloat(dJurada3));

        if (mpagar < (minimoAnual * (parseFloat(valorUT)) / 12)) {
          mpagar = (minimoAnual * (parseFloat(valorUT)) / 12);

        } else {
          mpagar = mpagar * (porcenimpu / 100);

        }

        $('#t' + values3[a].idactividad).val(formatMoneda(mpagar.toString().replace('.', ','), ',', '.', 2));
        mpagar = Math.round(mpagar * Math.pow(10, 2)) / Math.pow(10, 2);
        total += mpagar;
      }
    }

    $('#impuesto').val(formatMoneda(total.toString().replace('.', ','), ',', '.', 2));
  }

/*export const suma2 = (values3, idusuariow) => {
	var valorUT = 100;
    var a, total = 0;
    var alicuota;
	var dJurada, dJurada2, dJurada3 ;
	var minimoAnual, mpagar;
	var porcenimpu 		= 100;
	var tipo 			= $("#cmbMes").val();
    var Anodecla 		= $( "#cmbAno").val();
    var statusComercio  = values3[0].status;
    var porcenimpuesto = idusuariow[0].porcenimpuesto;
	var porc = 1000;
	if (Anodecla >= 2018) {
		porc = 100;
	}

	if(tipo==="DEFINITIVA"){

		if(statusComercio===51){//Usuario normal
			for(a=0; a<values3.length; a++){
				if($('#d'+values3[a].idactividad).val() !== 'undefined'){
					
					if($('#d'+values3[a].idactividad).val() === ''){
						$('#d'+values3[a].idactividad).val("0,00");
					}
					
					dJurada 	= $('#d'+values3[a].idactividad).val();
					
					dJurada2 	= dJurada.replace(/\./g,'');
					dJurada3 	= dJurada2.replace(',','.');
					minimoAnual = (parseFloat($('#mini' + values3[a].idactividad).val()));
					alicuota 	= (parseFloat($('#ali'+values3[a].idactividad).val().toString().replace(',','.')));
					mpagar 		= ((alicuota)/porc)*(parseFloat(dJurada3));
					if(mpagar < (minimoAnual*(parseFloat(valorUT)))){
						mpagar = (minimoAnual*(parseFloat(valorUT)));
					}else {
						mpagar *= (porcenimpu/100);
					}
					
					$('#total'+values3[a].idactividad).val(formatMoneda(mpagar.toString().replace('.',','),',','.',2));
					mpagar = Math.round(mpagar * Math.pow(10, 2)) / Math.pow(10, 2);
					total  += mpagar;
					//sumaTotales();//prueba
				}
				//total += (parseFloat(document.getElementById(''+lista[a]).value));
			}
		} else if(statusComercio===57){//Exonerado
			for(a=0; a<values3.length; a++){
				if($('#d'+values3[a].idactividad).val() !== 'undefined'){
					
					if($('#d'+values3[a].idactividad).val() === ''){
						$('#d'+values3[a].idactividad).val("0,00");
					}
					
					dJurada 	= $('#d'+values3[a].idactividad).val();
					dJurada2 	= dJurada.replace(/\./g,'');
					dJurada3 	= dJurada2.replace(',','.');
					minimoAnual = (parseFloat($('#mini' + values3[a].idactividad).val()));
					alicuota 	= (parseFloat($('#ali'+values3[a].idactividad).val().toString().replace(',','.')));
					mpagar 		= (minimoAnual*(parseFloat(valorUT)));
					
					$('#total'+values3[a].idactividad).val(formatMoneda(mpagar.toString().replace('.',','),',','.',2));
					mpagar  = Math.round(mpagar * Math.pow(10, 2)) / Math.pow(10, 2);
					total   = (minimoAnual*(parseFloat(valorUT)));
					//sumaTotales();//prueba
				}
				//total += (parseFloat(document.getElementById(''+lista[a]).value));
			}
			$('#impuesto').val(formatMoneda(total.toString().replace('.',','),',','.',2));
			
			//alert("Status Comercio "+ parseFloat(statusComercio));
		}else{
			
			    alert("Este Contribuyente esta Inactivo Dirigirse a la Oficina de Administracion Tributaria.");
	
				document.location.href="./home";
			
		}
	}else{
		if(statusComercio===51){//Usuario normal
			for(a=0; a<values3.length; a++){
				if($('#d'+values3[a].idactividad).val() !== 'undefined'){
					if($('#d'+values3[a].idactividad).val() === ''){
						$('#d'+values3[a].idactividad).val("0,00");
					}
					dJurada 	= $('#d'+values3[a].idactividad).val();
					dJurada2 	= dJurada.replace(/\./g,'');
					dJurada3 	= dJurada2.replace(',','.');
					minimoAnual = (parseFloat($('#mini' + values3[a].idactividad).val()));
					//alert("minimo anual " + parseFloat(valorUT));
				//	alert("unidad tributaria es " + minimoAnual);
					alicuota 	= (parseFloat($('#ali'+values3[a].idactividad).val().toString().replace(',','.')));
					mpagar 		= ((alicuota)/porc)*(parseFloat(dJurada3));
					//alert("el valor unidad es: " + parseFloat(valorUT));
					//mpagar = (parseFloat(minimoAnual));
					//alert("monto a pagar es" + mpagar);
					if(mpagar < (minimoAnual*(parseFloat(valorUT))/12)){
						mpagar = (minimoAnual*(parseFloat(valorUT))/12);
					//	alert("paga el minimo que es" + mpagar);
					}else {
						mpagar *= (porcenimpuesto/100);
					//	alert("paga completo que es" + mpagar);
					}

					$('#total'+values3[a].idactividad).val(formatMoneda(mpagar.toString().replace('.',','),',','.',2));
					mpagar = Math.round(mpagar * Math.pow(10, 2)) / Math.pow(10, 2);
					total += mpagar;
				}
				//total += (parseFloat(document.getElementById(''+lista[a]).value));
			}
		}else if(statusComercio===57){//Exonerado
			for(a=0; a<values3.length; a++){
				if($('#d'+values3[a].idactividad).val() !== 'undefined'){
					
					if($('#d'+values3[a].idactividad).val() === ''){
						$('#d'+values3[a].idactividad).val("0,00");
					}
					
					dJurada 	= $('#d'+values3[a].idactividad).val();
					dJurada2 	= dJurada.replace(/\./g,'');
					dJurada3 	= dJurada2.replace(',','.');
					minimoAnual = (parseFloat($('#mini' + values3[a].idactividad).val()));
					alicuota 	= (parseFloat($('#ali'+values3[a].idactividad).val().toString().replace(',','.')));
					mpagar 		= ((minimoAnual*(parseFloat(valorUT)))/12);
					
					$('#total'+values3[a].idactividad).val(formatMoneda(mpagar.toString().replace('.',','),',','.',2));
					mpagar  = Math.round(mpagar * Math.pow(10, 2)) / Math.pow(10, 2);
					//total   = ((minimoAnual*(parseFloat(valorUT)))/12);
					total += mpagar;
					//alert("paga completo que es" + mpagar);
					//sumaTotales();//prueba
				}
				//total += (parseFloat(document.getElementById(''+lista[a]).value));
			}
			$('#impuesto').val(formatMoneda(total.toString().replace('.',','),',','.',2));
			//alert("total impuesto "+ parseFloat(total));
			
			//alert("Status Comercio "+ parseFloat(statusComercio));
		}else{
            alert("Este Contribuyente esta Inactivo Dirigirse a la Oficina de Administracion Tributaria.");
	
            document.location.href="./home";
		}
	}
    var interesesPagar;
    var intereses = idusuariow[0].intereses;
	var totPagar;
	var recargoPagar;
	//var porcenbenef 	= $('#porcebenef').val();
	var credito 		= $('#credito').val();
	//var acredit         = $('#retenciones').val();
	//var credi 		= parseFloat($('#credito').val().replace(/\./g,'').replace(',','.'));
	var acredit         = parseFloat($('#retenciones').val().replace(/\./g,'').replace(',','.'));
	//alert("el credito es " + credito);
	//totPagar = (parseFloat(total) - parseFloat(credi) - parseFloat(acredit));
	totPagar = (parseFloat(total)  - parseFloat(acredit));
	if(intereses>0){
			interesesPagar = (((totPagar*(parseFloat(intereses))/100)/12)/30)*parseFloat(diasven);
	}
	if(interesesPagar>0 && interesesPagar >= 0){
		$('#intereses').val(formatMoneda(interesesPagar.toString().replace('.',','),',','.',2));
	}else {
		$('#intereses').val("0,00");		
	}
	if(recargos>0 & diasven>0){
	//	totPagar = (parseFloat(total) - parseFloat(credito) - parseFloat(acredit));
		
		//alert("el total a pagar  es: " + totPagar);
		
		recargoPagar = totPagar*(parseFloat(recargos)/100);
		recargoPagar = Math.round( recargoPagar * Math.pow(10, 2)) / Math.pow(10, 2);
		if (recargoPagar < 0) {
			$('#recargos').val("0,00");	
		} else {
			$('#recargos').val(formatMoneda(recargoPagar.toString().replace('.',','),',','.',2));
		}
		
	
	}else{
		recargoPagar=0;
	}
	if(acredit>0){
		$('#retenciones').val(formatMoneda(acredit.toString().replace('.',','),',','.',2));	
	
	}
	if(credito>0){
		//alert(credito);
		$('#credito').val(formatMoneda(credito.toString().replace('.',','),',','.',2));	
	
	}
	$('#impuesto').val(formatMoneda(total.toString().replace('.',','),',','.',2));
	
	sumaTotales();
	
}*/
      
      
/*export const sumaTotales = () => {
    var totalS 			= parseFloat($('#impuesto').val().replace(/\./g,'').replace(',','.'));
    var interesesS 		= parseFloat($('#intereses').val().replace(/\./g,'').replace(',','.'));
    var recargosS 		= parseFloat($('#recargos').val().replace(/\./g,'').replace(',','.'));
    var sancionesS 		= parseFloat($('#sanciones').val().replace(/\./g,'').replace(',','.'));
    var retencionesS 	= parseFloat($('#retenciones').val().replace(/\./g,'').replace(',','.'));
    var beneficiosS 	= 0.00;
    var bene            = 0.00;
    var tipo 			= $("#cmbMes").val();
    var statusComercio 	= $('#statusComercio').val();
    
    if(statusComercio===51){//Usuario normal
        
        if (porcebenef>0){
            bene = totalS *(porcebenef/100);
            beneficiosS = parseFloat($('#beneficio').val(formatMoneda(bene.toString().replace('.',','),',','.',2)));
        }
        var acreditacionS = 0.00;
        if(acreditacion){
            acreditacionS = parseFloat($('#acreditacion').val().replace(/\./g,'').replace(',','.'));
        }
        var creditoS = parseFloat($('#credito').val().replace(/\./g,'').replace(',','.'));
        //alert("el credito es " + creditoS);
        var Cancelar = totalS + interesesS + recargosS + sancionesS - retencionesS - bene - creditoS - acreditacionS;
        //alert("Cancelar es " + Cancelar);
        if(Cancelar<0){
            Cancelar = Cancelar*-1;
            $('#sFavor').val(formatMoneda(Cancelar.toString().replace('.',','),',','.',2));
            Cancelar = 0;
            $('#tpagar'		).val("0,00");
            $('#saldoFavor'	).css("visibility", "visible");
            $('#saldoFavorM').css("visibility", "visible");
        
        }else {
            $('#tpagar'		).val(formatMoneda(Cancelar.toString().replace('.',','),',','.',2));
            $('#saldoFavor'	).css("visibility", "hidden");
            $('#saldoFavorM').css("visibility", "hidden");
            $('#sFavor'		).val("0,00");
        }
        
    }
    else if(statusComercio===57){//Exonerado
        if (porcebenef>0){
            bene = totalS *(porcebenef/100);
            beneficiosS = parseFloat($('#beneficio').val(formatMoneda(bene.toString().replace('.',','),',','.',2)));
        }
        var acreditacionS = 0.00;
        if(acreditacion){
            acreditacionS = parseFloat($('#acreditacion').val().replace(/\./g,'').replace(',','.'));
        }
        var creditoS = parseFloat($('#credito').val().replace(/\./g,'').replace(',','.'));
        
        var Cancelar = totalS + interesesS + recargosS + sancionesS - retencionesS - bene - creditoS - acreditacionS;
    
        if(Cancelar<0){
            Cancelar = Cancelar*-1;
            $('#sFavor').val(formatMoneda(Cancelar.toString().replace('.',','),',','.',2));
            Cancelar = 0;
            $('#tpagar'		).val("0,00");
            $('#saldoFavor'	).css("visibility", "visible");
            $('#saldoFavorM').css("visibility", "visible");
        
        }else {
            $('#tpagar'		).val(formatMoneda(Cancelar.toString().replace('.',','),',','.',2));
            $('#saldoFavor'	).css("visibility", "hidden");
            $('#saldoFavorM').css("visibility", "hidden");
            $('#sFavor'		).val("0,00");
        }
    }
} */