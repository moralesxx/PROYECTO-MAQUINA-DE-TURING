const fs = require('fs');

class MaquinaTuring {
  constructor() {
    this.process = Array.from({ length: 100 }, () => Array(20).fill(''));
    this.processInicial = '';
    this.processAceptacion = '';
    this.alfabeto = '';
    this.transiciones = Array.from({ length: 100 }, () =>
      Array.from({ length: 5 }, () => Array(20).fill(''))
    );
  }
}

function inicializarMT(mt, archivoDefinicion) {
  try {
    const data = fs.readFileSync(archivoDefinicion, 'utf-8');
    const lines = data.split('\n').map(line => line.trim()).filter(line => line !== '');

    // Estados
    mt.process[0][0] = lines[0].split('=')[1].trim().replace(/[()]/g, '');
    mt.processInicial = lines[1].split('=')[1].trim().replace(/[()]/g, '');
    mt.processAceptacion = lines[2].split('=')[1].trim().replace(/[()]/g, '');
    // Ignora línea de rechazo
    mt.alfabeto = lines[4].split('=')[1].trim().replace(/[()]/g, '');

    let i = 0;
    for (let line of lines.slice(5)) {
      if (line.startsWith('MT')) {
        const regex = /MT\s*=\s*\(\s*([^,]+)\s*,\s*(\S)\s*\)\s*=>\s*\(\s*([^,]+)\s*,\s*(\S)\s*,\s*(\S)\s*\)/;
        const match = line.match(regex);
        if (match) {
          mt.transiciones[i][0][0] = match[1];
          mt.transiciones[i][1][0] = match[2];
          mt.transiciones[i][2][0] = match[3];
          mt.transiciones[i][3][0] = match[4];
          mt.transiciones[i][4][0] = match[5];
          i++;
        }
      }
    }
  } catch (error) {
    console.error('Error al abrir el archivo:', error.message);
    process.exit(1);
  }
}

function ejecutarMT(mt, entrada) {
  let processActual = mt.processInicial;
  let cinta = entrada.split('');
  let cabeza = 0;

  while (true) {
    if (cabeza < 0 || cabeza >= cinta.length) {
      console.log('Error: La cabeza está fuera de los límites de la cinta.');
      break;
    }

    let simboloActual = cinta[cabeza];
    let nuevoEstado = '';
    let simboloEscrito = '';
    let movimiento = '';
    let transicionEncontrada = false;

    for (let i = 0; i < 100; i++) {
      if (
        mt.transiciones[i][0][0].length > 0 &&
        mt.transiciones[i][0][0] === processActual &&
        mt.transiciones[i][1][0] === simboloActual
      ) {
        nuevoEstado = mt.transiciones[i][2][0];
        simboloEscrito = mt.transiciones[i][3][0];
        movimiento = mt.transiciones[i][4][0];
        transicionEncontrada = true;
        break;
      }
    }

    if (!transicionEncontrada) {
      console.log(`No existe transición para el estado ${processActual} y el símbolo ${simboloActual}`);
      break;
    }

    cinta[cabeza] = simboloEscrito;

    // Movimientos de la cabeza
    if (movimiento === 'D') {
      cabeza++;
    } else if (movimiento === 'I') {
      cabeza--;
    } // 'N' no se mueve

    processActual = nuevoEstado;
    console.log(`Estado: ${processActual}, Cinta: ${cinta.join('')}, Cabeza: ${cabeza}`);
  }

  if (processActual === mt.processAceptacion) {
    console.log('Resultado de la simulación: ACEPTACION');
  } else {
    console.log('Resultado de la simulación: NO ACEPTACION');
  }
}

// === Programa principal ===
if (require.main === module) {
  const mt = new MaquinaTuring();
  const archivoDefinicion = 'MaquinaTuring.txt';

  inicializarMT(mt, archivoDefinicion);

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('Ingrese una cadena para la simulación: ', entrada => {
    ejecutarMT(mt, entrada);
    readline.close();
  });
}
