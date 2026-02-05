import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
import type { Oblea } from '../types/obleas';

/**
 * Genera un PDF con las obleas seleccionadas
 * Dimensiones exactas del FRX de VFP9
 */
export const generarPDFObleas = async (obleas: Oblea[]): Promise<void> => {
    if (obleas.length === 0) {
        throw new Error('No hay obleas para generar');
    }

    // Crear documento PDF con dimensiones personalizadas
    // Usamos A4 landscape para que quepan múltiples obleas
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'cm',
        format: 'a4'
    });

    // Cargar logo como imagen
    const logoPath = '/Partners img/logo oblea smt.png';

    // Dimensiones de cada oblea (del FRX)
    const obleaAncho = 8.28; // cm
    const obleaAlto = 5.42;  // cm

    // Posiciones dentro de cada oblea (RELATIVAS al borde de la oblea)
    // Cálculos basados en FRX: Posición Absoluta - Inicio Rectángulo (Top: 1.37, Left: 0.31)

    // Logo (Top: 1.71 - 1.37 = 0.34) | (Left: 0.60 - 0.31 = 0.29)
    const logoPos = { top: 0.34, left: 0.29, width: 5.10, height: 1.66 };

    // Dominio (Top: 4.07 - 1.37 = 2.70) | (Left Label: 3.25 - 0.31 = 2.94)
    const dominioLabelPos = { top: 2.70, left: 2.94, width: 2.14, height: 0.60 };
    const dominioValuePos = { top: 2.70, left: 5.27, width: 2.75, height: 0.66 };

    // Barcode (Top: 5.10 - 1.37 = 3.73) | Reducido y centrado para coincidir con VFP9
    const barcodePos = { top: 3.73, left: 0.65, width: 7.0, height: 1.29 };

    // Calcular cuántas obleas caben por página
    const margenIzq = 0.31; // cm (del FRX)
    const margenTop = 1.37;  // cm (del FRX)
    const espacioHorizontal = 9.86; // cm (del FRX: width de columna)

    const obleasPorFila = 3; // Ajustable según necesidad
    const obleasPorColumna = 2;
    const obleasPorPagina = obleasPorFila * obleasPorColumna;

    let obleaIndex = 0;

    for (let i = 0; i < obleas.length; i++) {
        const oblea = obleas[i];

        // Si no es la primera oblea de la página y alcanzamos el límite, crear nueva página
        if (i > 0 && i % obleasPorPagina === 0) {
            pdf.addPage();
            obleaIndex = 0;
        }

        // Calcular posición de esta oblea en la página
        const fila = Math.floor(obleaIndex / obleasPorFila);
        const columna = obleaIndex % obleasPorFila;

        const offsetX = margenIzq + (columna * espacioHorizontal);
        const offsetY = margenTop + (fila * (obleaAlto + 0.5)); // 0.5cm de separación vertical

        // Dibujar borde de la oblea con línea más oscura
        pdf.setDrawColor(0, 0, 0); // Negro
        pdf.setLineWidth(0.02); // Línea más gruesa para mejor visibilidad
        pdf.rect(offsetX, offsetY, obleaAncho, obleaAlto);

        // Agregar logo
        try {
            pdf.addImage(
                logoPath,
                'PNG',
                offsetX + logoPos.left,
                offsetY + logoPos.top,
                logoPos.width,
                logoPos.height
            );
        } catch (error) {
            console.error('Error al cargar logo:', error);
            // Continuar sin logo si falla
        }

        // Agregar texto "Dominio :"
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(
            'Dominio :',
            offsetX + dominioLabelPos.left,
            offsetY + dominioLabelPos.top + 0.4 // Ajuste vertical para centrar texto
        );

        // Agregar valor del dominio
        pdf.setFont('helvetica', 'normal');
        pdf.text(
            oblea.dominio,
            offsetX + dominioValuePos.left,
            offsetY + dominioValuePos.top + 0.4
        );

        // Generar código de barras
        await generarCodigoBarras(
            pdf,
            oblea.nroOblea.toString(),
            offsetX + barcodePos.left,
            offsetY + barcodePos.top,
            barcodePos.width,
            barcodePos.height
        );

        obleaIndex++;
    }

    // Descargar el PDF
    const fecha = new Date().toISOString().split('T')[0];
    pdf.save(`obleas_${fecha}.pdf`);
};

/**
 * Genera un código de barras usando la fuente PF Barcode 128
 */
const generarCodigoBarras = async (
    pdf: jsPDF,
    texto: string,
    x: number,
    y: number,
    width: number,
    height: number
): Promise<void> => {
    // Crear canvas temporal para generar el código de barras
    const canvas = document.createElement('canvas');

    try {
        JsBarcode(canvas, texto, {
            format: 'CODE128',
            width: 2,
            height: 60,
            displayValue: false, // No mostrar texto, solo barras
            margin: 0
        });

        // Convertir canvas a imagen y agregar al PDF
        const barcodeImage = canvas.toDataURL('image/png');
        pdf.addImage(barcodeImage, 'PNG', x, y, width, height);
    } catch (error) {
        console.error('Error al generar código de barras:', error);
        // Fallback: mostrar el número como texto
        pdf.setFontSize(8);
        pdf.text(texto, x, y + height / 2);
    }
};
