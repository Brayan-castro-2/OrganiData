/**
 * calcularNivel — Lógica central de niveles de OrganiData.
 * Fuente única de verdad usada por Dashboard, Perfil y cualquier
 * componente que necesite mostrar el nivel del usuario.
 *
 * @param {number} totalKilos - Kilos reciclados acumulados
 * @returns {{ nombre: string, icono: string, siguienteMeta: number,
 *             porcentajeProgreso: number, kilosRestantes: number }}
 */
export function calcularNivel(totalKilos = 0) {
  const niveles = [
    { nombre: 'Semilla',                icono: '🌱', min: 0,  max: 10  },
    { nombre: 'Brote Activo',           icono: '🌿', min: 10, max: 30  },
    { nombre: 'Árbol Fuerte',           icono: '🌳', min: 30, max: 60  },
    { nombre: 'Guardián del Ecosistema',icono: '🌍', min: 60, max: 100 },
    { nombre: 'Leyenda Verde',          icono: '🏆', min: 100, max: Infinity },
  ];

  const actual = niveles.findLast(n => totalKilos >= n.min) || niveles[0];
  const siguiente = niveles[niveles.indexOf(actual) + 1];

  const siguienteMeta = siguiente?.min ?? actual.max;
  const rangoActual   = siguienteMeta - actual.min;
  const avance        = Math.min(totalKilos - actual.min, rangoActual);
  const porcentajeProgreso = siguiente
    ? Math.round((avance / rangoActual) * 100)
    : 100;
  const kilosRestantes = siguiente
    ? Math.max(0, siguienteMeta - totalKilos)
    : 0;

  return {
    nombre:            actual.nombre,
    icono:             actual.icono,
    nombreCompleto:    `${actual.nombre} ${actual.icono}`,
    siguienteNombre:   siguiente?.nombre ?? null,
    siguienteIcono:    siguiente?.icono  ?? null,
    siguienteMeta,
    porcentajeProgreso,
    kilosRestantes: parseFloat(kilosRestantes.toFixed(1)),
  };
}

/** Promedio semanal de residuos orgánicos por persona en Chile (kg) */
export const PROMEDIO_SEMANAL_CHILE = 4.2;

/**
 * calcularImpacto — Comparativa de impacto del usuario vs promedio Chile.
 * @param {number} totalKilos
 * @returns {{ porcentaje: number, texto: string }}
 */
export function calcularImpacto(totalKilos = 0) {
  const porcentaje = ((totalKilos / PROMEDIO_SEMANAL_CHILE) * 100).toFixed(0);
  const texto = porcentaje >= 100
    ? `¡Has reciclado el ${porcentaje}% de lo que genera una persona promedio esta semana! 🌟`
    : `Has reciclado el ${porcentaje}% de lo que genera una persona promedio esta semana.`;
  return { porcentaje: Number(porcentaje), texto };
}
