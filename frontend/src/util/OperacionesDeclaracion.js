import { formatMoneda } from '../util/varios';

export const calculoMontoPagar = (values3, datoUT, cmbAnio, tipodec, calcumin) => {
	var a, total = 0;
	var dJurada, dJurada2, dJurada3;
	var minimoAnual, mpagar;
	var tipoDecla = parseInt(tipodec);
	var Anodecla = cmbAnio;
	var porc = 100;
	var valorUT = datoUT.valorut;
	var factor = datoUT.factorcalculo;
	var valorPetro = datoUT.valorpetro;
	var calculaminimo = calcumin;
	var alicuota;

	var resul = [];

	if (factor === 2 || factor === 3 || factor === 4 || factor === 5) {
		for (a = 0; a < values3.length; a++) {
			if (values3[a].montodeclarado !== undefined) {
				if (values3[a].montodeclarado === '') {
					values3[a].montodeclarado = "0,00";
				}

				dJurada = values3[a].montodeclarado;
				dJurada2 = dJurada.replace(/\./g, '');
				dJurada3 = dJurada2.replace(',', '.');

				//minimoAnual = values3[a].minimo;

				alicuota = values3[a].alicuota;
				mpagar = (alicuota / porc) * dJurada3;
				if (calculaminimo) {
					minimoAnual = values3[a].minimo;
					if (tipoDecla === 1) {
						if (mpagar < minimoAnual * valorUT) {
							mpagar = Math.round(minimoAnual * valorUT * 100) / 100;
						}
					} else if (tipoDecla === 2 || tipoDecla === 3) {
						if (mpagar < minimoAnual / 2 * valorUT) {
							mpagar = Math.round(minimoAnual / 2 * valorUT * 100) / 100;
						}
					} else {
						if (mpagar < minimoAnual / 2 * valorUT) {
							mpagar = Math.round(minimoAnual / 2 * valorUT * 100) / 100;
						}
					}
				}


				mpagar = Math.round(mpagar * Math.pow(10, 2)) / Math.pow(10, 2);
				total += mpagar;
				values3[a].montoapagar = formatMoneda(mpagar.toString().replace('.', ','), ',', '.', 2);
			}
		}
	} else {
		for (a = 0; a < values3.length; a++) {
			/*if (mpagar < minimoAnual) {
				if (tipoDecla === 3 || tipoDecla === 4) {
					mpagar = minimoAnual / 2;
				} else {
					mpagar = minimoAnual;
				}
			}*/

			mpagar = Math.round(mpagar * Math.pow(10, 2)) / Math.pow(10, 2);
			valorPetro = 1.00;
			let monpet = parseFloat(mpagar / valorPetro).toFixed(4);
			if (mpagar > 0 && monpet === 0) {
				mpagar = parseFloat(0.0001 * valorPetro).toFixed(2);
			} else {
				mpagar = parseFloat(monpet * valorPetro).toFixed(2);
			}
			total += mpagar;
			values3[a].montoapagar = formatMoneda(mpagar.toString().replace('.', ','), ',', '.', 2);

		}
	}

	resul.push({
		activi: values3,
		impuesto: formatMoneda(total.toString().replace('.', ','), ',', '.', 2),
	});
	return resul;
}

export const sumaDatos = (values3, cmbAnio, cmbMes, datoCalculo, tipodec, espiritu, retencion, reintegro) => {
	var a, total = 0;
	var porcenimpu = 100;
	//var tipo = cmbMes;
	var tipoDecla = tipodec;
	var Anodecla = cmbAnio;
	var porc = 100;
	var intereses = datoCalculo.porcentajeinteres;
	var diasven = datoCalculo.diasvencido;
	var recargos = datoCalculo.porcentajerecargo;
	var valorUT = datoCalculo.valorut;
	var valorUTMulta = datoCalculo.valorutmulta;
	var factorMulta = datoCalculo.factormulta;
	var valorMulta = datoCalculo.valormulta;
	//var porcebenef = parseFloat(datoCalculo.porcebenef);
	//var statusComercio = values3[0].status;
	var factor = datoCalculo.factorcalculo;
	var valorPetro = datoCalculo.valorpetro;

	var retenciones = retencion;
	var reintegros = reintegro;
	var alicuota;

	var resul = [];




	for (a = 0; a < values3.length; a++) {
		total += parseFloat(values3[a].montoapagar);
		//values3[a].montoapagar = formatMoneda(mpagar.toString().replace('.', ','), ',', '.', 2);

	}


	var interesesPagar;
	var totPagar;
	var recargoPagar;
	var multaPagar;
	var montoDescuento = parseFloat(0.00);
	var sFavor = parseFloat(0.00);
	var monEst = parseFloat(0.00);
	var monDedu = parseFloat(0.00);
	var credito = parseFloat(datoCalculo.credito);
	var acredit = parseFloat(datoCalculo.acredit);
	if (acredit < 0) {
		//$('#retenciones').val(formatMoneda(acredit.toString().replace('.', ','), ',', '.', 2));
		acredit = parseFloat(0.00);
	}
	if (credito < 0) {
		//$('#credito').val(formatMoneda(credito.toString().replace('.', ','), ',', '.', 2));
		credito = parseFloat(0.00);
	}
	/*if (porcebenef > 0.00) {
		montoDescuento =  total * (porcebenef / 100);
		montoDescuento = Math.round(montoDescuento * Math.pow(10, 2)) / Math.pow(10, 2);
	}else {
		montoDescuento = 0.00;
	}*/
	if (intereses > 0) {
		interesesPagar = (((total * (parseFloat(intereses)) / 100) / 12) / 30) * parseFloat(diasven);
	} else {
		interesesPagar = 0.00;
	}
	if (interesesPagar <= 0.00) {
		interesesPagar = 0.00;
	}
	interesesPagar = Math.round(interesesPagar * Math.pow(10, 2)) / Math.pow(10, 2);

	multaPagar = 0.00;
	if (recargos > 0.00 & diasven > 0.00) {
		recargoPagar = total * (parseFloat(recargos) / 100);
		recargoPagar = Math.round(recargoPagar * Math.pow(10, 2)) / Math.pow(10, 2);
		if (recargoPagar < 0.00) {
			recargoPagar = 0.00;
		} else {
			//$('#recargos').val(formatMoneda(recargoPagar.toString().replace('.', ','), ',', '.', 2));
			if (factorMulta >= 2) {
				multaPagar = valorUTMulta * valorMulta;
			} else {
				multaPagar = valorMulta;
			}
			multaPagar = Math.round(multaPagar * Math.pow(10, 2)) / Math.pow(10, 2);
		}

	} else {
		recargoPagar = 0.00;
	}

	/*if (parseInt(tipoDecla) === 1) {
		monEst = parseFloat(datoCalculo[0].montoestimado);
		monEst = Math.round(monEst * Math.pow(10, 2)) / Math.pow(10, 2);
	} else {
		monEst = parseFloat(0.00);
	}*/
	acredit = acredit + parseFloat(reintegros.replace(/\./g, '').replace(',', '.'));
	acredit = Math.round(acredit * Math.pow(10, 2)) / Math.pow(10, 2);
	monDedu = parseFloat(acredit) + parseFloat(retenciones.replace(/\./g, '').replace(',', '.')) + parseFloat(credito) + parseFloat(montoDescuento);
	monDedu = Math.round(monDedu * Math.pow(10, 2)) / Math.pow(10, 2);
	totPagar = parseFloat(total) + (tipoDecla === '1' ? parseFloat(0.00) : parseFloat(recargoPagar)) + parseFloat(interesesPagar) + (tipoDecla === '1' ? parseFloat(0.00) : parseFloat(multaPagar)) - monDedu - monEst;
	totPagar = Math.round(totPagar * Math.pow(10, 2)) / Math.pow(10, 2);

	if (totPagar < 0.00) {
		sFavor = totPagar * -1;
		sFavor = Math.round(sFavor * Math.pow(10, 2)) / Math.pow(10, 2);
		totPagar = parseFloat(0.00);
	} else {
		sFavor = parseFloat(0.00);
	}
	//totPagar = (parseFloat(total) - parseFloat(acredit) - parseFloat(credito));
	//acredit = acredit + parseFloat(reintegros.replace(/\./g, '').replace(',', '.'));
	resul.push({
		impuesto: formatMoneda(total.toString().replace('.', ','), ',', '.', 2),
		intereses: formatMoneda(interesesPagar.toString().replace('.', ','), ',', '.', 2),
		recargos: formatMoneda(recargoPagar.toString().replace('.', ','), ',', '.', 2),
		//retenciones: formatMoneda(acredit.toFixed(2).toString().replace('.', ','), ',', '.', 2),
		credito: formatMoneda(credito.toString().replace('.', ','), ',', '.', 2),
		acredit: formatMoneda(acredit.toString().replace('.', ','), ',', '.', 2),
		multa: formatMoneda(multaPagar.toString().replace('.', ','), ',', '.', 2),
		totalpagar: formatMoneda(totPagar.toString().replace('.', ','), ',', '.', 2),
		montodescuento: formatMoneda(montoDescuento.toString().replace('.', ','), ',', '.', 2),
		montodeducible: formatMoneda(monDedu.toString().replace('.', ','), ',', '.', 2),
		saldofavor: formatMoneda(sFavor.toString().replace('.', ','), ',', '.', 2)
	});
	return resul;
}

export const suma = (values3, cmbAnio, cmbMes, datoCalculo, tipodec, espiritu) => {
	var a, total = 0;
	var dJurada, dJurada2, dJurada3;
	var minimoAnual, mpagar;
	var porcenimpu = 100;
	//var tipo = cmbMes;
	var tipoDecla = tipodec;
	var Anodecla = cmbAnio;
	var porc = 100;
	var intereses = datoCalculo.porcentajeinteres;
	var diasven = datoCalculo.diasvencido;
	var recargos = datoCalculo.porcentajerecargo;
	var valorUT = datoCalculo.valorut;
	var valorUTMulta = datoCalculo.valorutmulta;
	var factorMulta = datoCalculo.factormulta;
	var valorMulta = datoCalculo.valormulta;
	//var statusComercio = values3[0].status;
	var factor = datoCalculo.factorcalculo;
	var valorPetro = datoCalculo.valorpetro;
	var alicuota;

	var resul = [];

	if (factor === 2 || factor === 3 || factor === 4 || factor === 5) {
		for (a = 0; a < values3.length; a++) {
			if (values3[a].montodeclarado !== undefined) {
				if (values3[a].montodeclarado === '') {
					values3[a].montodeclarado = "0,00";
				}

				dJurada = values3[a].montodeclarado;
				dJurada2 = dJurada.replace(/\./g, '');
				dJurada3 = dJurada2.replace(',', '.');

				minimoAnual = values3[a].minimo;

				alicuota = values3[a].alicuota;
				mpagar = (alicuota / porc) * dJurada3;
				/*if (tipoDecla === 2) {
					if (espiritu === 11 || espiritu === 2 || espiritu === 1 || espiritu === 0) {
						if (mpagar < minimoAnual * valorUT) {
							mpagar = Math.round(minimoAnual * valorUT * 100) / 100;
						}
					} else {
						if (mpagar < minimoAnual * valorUT / 12) {
							mpagar = Math.round(minimoAnual * valorUT / 12 * 100) / 100;
						}
					}

				} else if (tipoDecla === 3 || tipoDecla === 4) {
					if (espiritu === 11 || espiritu === 2 || espiritu === 1 || espiritu === 0) {
						if (mpagar < minimoAnual / 2 * valorUT) {
							mpagar = Math.round(minimoAnual / 2 * valorUT * 100) / 100;
						}
					} else {
						if (mpagar < minimoAnual * valorUT / 12) {
							mpagar = Math.round(minimoAnual / 2 * valorUT / 12 * 100) / 100;
						}
					}
				} else {
					if (mpagar < minimoAnual / 2 * valorUT) {
						mpagar = Math.round(minimoAnual / 2 * valorUT * 100) / 100;
					}
				}*/

				mpagar = Math.round(mpagar * Math.pow(10, 2)) / Math.pow(10, 2);
				total += mpagar;
				values3[a].montoapagar = formatMoneda(mpagar.toString().replace('.', ','), ',', '.', 2);
			}
		}
	} else {
		for (a = 0; a < values3.length; a++) {
			/*if (mpagar < minimoAnual) {
				if (tipoDecla === 3 || tipoDecla === 4) {
					mpagar = minimoAnual / 2;
				} else {
					mpagar = minimoAnual;
				}
			}*/

			mpagar = Math.round(mpagar * Math.pow(10, 2)) / Math.pow(10, 2);
			valorPetro = 1.00;
			let monpet = parseFloat(mpagar / valorPetro).toFixed(4);
			if (mpagar > 0 && monpet === 0) {
				mpagar = parseFloat(0.0001 * valorPetro).toFixed(2);
			} else {
				mpagar = parseFloat(monpet * valorPetro).toFixed(2);
			}
			total += mpagar;
			values3[a].montoapagar = formatMoneda(mpagar.toString().replace('.', ','), ',', '.', 2);

		}
	}

	var interesesPagar;
	var totPagar;
	var recargoPagar;
	var multaPagar;
	var credito = datoCalculo[0].credito;
	var acredit = datoCalculo[0].acredit;
	if (acredit < 0) {
		//$('#retenciones').val(formatMoneda(acredit.toString().replace('.', ','), ',', '.', 2));
		acredit = 0.00;
	}
	if (credito < 0) {
		//$('#credito').val(formatMoneda(credito.toString().replace('.', ','), ',', '.', 2));
		credito = 0.00;
	}
	totPagar = (parseFloat(total) - parseFloat(acredit) - parseFloat(credito));
	if (intereses > 0) {
		interesesPagar = (((totPagar * (parseFloat(intereses)) / 100) / 12) / 30) * parseFloat(diasven);
	} else {
		interesesPagar = 0.00;
	}
	if (interesesPagar <= 0.00) {
		interesesPagar = 0.00;
	}

	multaPagar = 0.00;
	if (recargos > 0.00 & diasven > 0.00) {
		recargoPagar = totPagar * (parseFloat(recargos) / 100);
		recargoPagar = Math.round(recargoPagar * Math.pow(10, 2)) / Math.pow(10, 2);
		if (recargoPagar < 0.00) {
			recargoPagar = 0.00;
		} else {
			//$('#recargos').val(formatMoneda(recargoPagar.toString().replace('.', ','), ',', '.', 2));
			if (factorMulta >= 2) {
				multaPagar = valorUTMulta * valorMulta;
			} else {
				multaPagar = valorMulta;
			}
			multaPagar = Math.round(multaPagar * Math.pow(10, 2)) / Math.pow(10, 2);
		}

	} else {
		recargoPagar = 0.00;
	}


	resul.push({
		activi: values3,
		impuesto: formatMoneda(total.toString().replace('.', ','), ',', '.', 2),
		intereses: formatMoneda(interesesPagar.toString().replace('.', ','), ',', '.', 2),
		recargos: formatMoneda(recargoPagar.toString().replace('.', ','), ',', '.', 2),
		retenciones: formatMoneda(acredit.toString().replace('.', ','), ',', '.', 2),
		credito: formatMoneda(credito.toString().replace('.', ','), ',', '.', 2),
		acredit: acredit, multa: formatMoneda(multaPagar.toString().replace('.', ','), ',', '.', 2)
	});
	return resul;
}

export const sumaTotales = (props) => {
	var totalS = props.montos.impuesto.replace(/\./g, '').replace(',', '.');
	var interesesS = props.montos.intereses.replace(/\./g, '').replace(',', '.');
	var recargosS = props.montos.recargos.replace(/\./g, '').replace(',', '.');
	var multasS = props.montos.multa.replace(/\./g, '').replace(',', '.');;
	//var sancionesS = "0.00";
	var retencionesS = props.montos.retenciones.replace(/\./g, '').replace(',', '.');
	var beneficiosS = 0.00;
	var bene = 0.00;
	var statusComercio = props.status;
	var acreditacionS = 0.00;
	var porcebenef = props.porcebenef;
	var creditoS = 0.00;
	var Cancelar = 0.00;
	var sFavor = 0.00;
	var tPagar = 0.00;
	var intereses = props.intereses;
	var diasven = props.diasven;
	var recargos = props.recargos;

	var resulta = [];
	// Nota: Las acreditaciones y las retenciones son lo mismo
	if (statusComercio === 51) {//Usuario normal

		if (props.porcebenef > 0.00) {
			bene = totalS * (porcebenef / 100);
			beneficiosS = bene;
		}
		if (props.acreditacion) {
			acreditacionS = props.montos.acredit;
		}
		creditoS = props.montos.credito.replace(/\./g, '').replace(',', '.');
		if (retencionesS > 0.00 || creditoS > 0.00) {
			interesesS = ((((parseFloat(totalS) - parseFloat(retencionesS) - parseFloat(creditoS)) * (parseFloat(intereses)) / 100) / 12) / 30) * parseFloat(diasven);
			interesesS = Math.round(interesesS * Math.pow(10, 2)) / Math.pow(10, 2);

			if (recargos > 0.00 & diasven > 0.00) {

				recargosS = (totalS - retencionesS - creditoS) * (parseFloat(recargos) / 100);
				recargosS = Math.round(recargosS * Math.pow(10, 2)) / Math.pow(10, 2);
			}

		}
		if (interesesS <= 0.00) {
			//$('#retenciones').val(formatMoneda(acredit.toString().replace('.', ','), ',', '.', 2));
			interesesS = 0.00;
		}
		if (recargosS < 0) {
			//$('#retenciones').val(formatMoneda(acredit.toString().replace('.', ','), ',', '.', 2));
			recargosS = 0.00;
		}
		Cancelar = parseFloat(totalS) + parseFloat(interesesS) + parseFloat(recargosS) + parseFloat(multasS) - parseFloat(retencionesS) - parseFloat(bene) - parseFloat(creditoS) - parseFloat(acreditacionS);
		if (Cancelar < 0) {
			Cancelar *= -1;
			sFavor = formatMoneda(Cancelar.toString().replace('.', ','), ',', '.', 2);
			Cancelar = 0;
			tPagar = "0,00";

		} else {
			tPagar = formatMoneda(Cancelar.toString().replace('.', ','), ',', '.', 2);
			sFavor = "0,00";
		}

	} else if (statusComercio === 57) {//Exonerado
		if (porcebenef > 0) {
			bene = totalS * (porcebenef / 100);
			beneficiosS = bene;
		}
		if (props.acreditacion) {
			acreditacionS = props.montos.acredit;
		}
		if (retencionesS > 0.00) {
			interesesS = ((((parseFloat(totalS) - parseFloat(retencionesS)) * (parseFloat(intereses)) / 100) / 12) / 30) * parseFloat(diasven);
			interesesS = Math.round(interesesS * Math.pow(10, 2)) / Math.pow(10, 2);
			recargosS = (totalS - retencionesS) * (parseFloat(recargos) / 100);
			recargosS = Math.round(recargosS * Math.pow(10, 2)) / Math.pow(10, 2);
		}
		creditoS = props.montos.credito.replace(/\./g, '').replace(',', '.');

		Cancelar = parseFloat(totalS) + parseFloat(interesesS) + parseFloat(recargosS) + parseFloat(multasS) - parseFloat(retencionesS) - parseFloat(bene) - parseFloat(creditoS) - parseFloat(acreditacionS);

		if (Cancelar < 0) {
			Cancelar *= -1;
			sFavor = formatMoneda(Cancelar.toString().replace('.', ','), ',', '.', 2);
			Cancelar = 0;
			tPagar = "0,00";

		} else {
			tPagar = formatMoneda(Cancelar.toString().replace('.', ','), ',', '.', 2);
			sFavor = "0,00";
		}
	}


	resulta.push({
		impuesto: props.montos.impuesto,
		intereses: formatMoneda(interesesS.toString().replace('.', ','), ',', '.', 2),
		recargos: formatMoneda(recargosS.toString().replace('.', ','), ',', '.', 2),
		retenciones: props.montos.retenciones,
		credito: props.montos.credito,
		incentivos: formatMoneda(beneficiosS.toString().replace('.', ','), ',', '.', 2),
		tPagar: tPagar,
		sFavor: sFavor,
		multa: props.montos.multa
	});
	return resulta;
}