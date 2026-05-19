import { reactive } from 'vue';

// Base de datos ficticia local (mock data)
export const db = reactive({
  user: {
    id: 1,
    name: 'Juan',
    email: 'vecino@pmontt.cl',
    is_ready: false,
    current_week: 3,
    direccion: 'Calle Los Alerces 1420, Puerto Montt',
    totalKilosReciclados: 12.5,
    get nivel() {
      if (this.totalKilosReciclados <= 10) return 'Semilla 🌱';
      if (this.totalKilosReciclados <= 30) return 'Brote Activo 🌿';
      if (this.totalKilosReciclados <= 50) return 'Árbol Fuerte 🌳';
      return 'Guardián del Ecosistema 🌍';
    },
    sector: 'Valle Volcanes',
    puntos: 120,
    coordenadas: { lat: -41.4693, lng: -72.9424 },
    medallas: [
      { id: 1, nombre: 'Pionero Verde', icono: '🥇', descripcion: 'Piloto Fundador' },
      { id: 2, nombre: 'Ciclo Cerrado', icono: '♻️', descripcion: '1 Cosecha Exitosa' },
      { id: 3, nombre: 'Top Comunal', icono: '🏆', descripcion: 'Top 3 del Sector' }
    ]
  },
  ciclosCompostaje: [
    { 
      id: 'LOTE-001', 
      nombrePersonalizado: 'Compostera Patio Trasero', 
      fechaInicio: '10/04/2026', 
      estado: 'Activo', 
      avances: [ 
        { fecha: '2026-04-17T12:00:00.000Z', olor: 'normal', humedad: 'bien', nota: 'Primer volteo' } 
      ] 
    },
    { 
      id: 'LOTE-002', 
      nombrePersonalizado: 'Balde Cocina (Pequeño)', 
      fechaInicio: '01/05/2026', 
      estado: 'Activo', 
      avances: [] 
    }
  ],
  avisosMuni: [
    { id: 1, titulo: 'Retiro de Abono Certificado', mensaje: 'El camión recolector pasará este jueves por el cuadrante del piloto.', fecha: 'Hoy' },
    { id: 2, titulo: 'Talleres de Huerto Urbano', mensaje: 'Inscríbete gratis al taller online de este sábado usando el link oficial.', fecha: 'Ayer' }
  ],
  rankingVecinos: [
    { id: 10, nombre: 'Ana M.', puntos: 380, sector: 'Alerce', avatar: '👩‍🌾' },
    { id: 11, nombre: 'Carlos R.', puntos: 295, sector: 'Valle Volcanes', avatar: '👨‍🔬' },
    { id: 1, nombre: 'Juan', puntos: 120, sector: 'Valle Volcanes', avatar: '🧑‍🌾', isCurrentUser: true },
    { id: 12, nombre: 'María S.', puntos: 110, sector: 'Pelluco', avatar: '👩‍🏫' },
    { id: 13, nombre: 'Pedro L.', puntos: 85, sector: 'Chinquihue', avatar: '👨‍🍳' }
  ],
  rankingSectores: [
    { sector: 'Alerce', puntosTotales: 1200, vecinos: 18, color: '#10b981' },
    { sector: 'Valle Volcanes', puntosTotales: 950, vecinos: 14, color: '#0ea5e9', isUserSector: true },
    { sector: 'Pelluco', puntosTotales: 720, vecinos: 11, color: '#f59e0b' }
  ],
  tablaPuntos: [
    { accion: 'Compost Listo', puntos: '+100' },
    { accion: 'Registro Semanal', puntos: '+15' },
    { accion: '1 Kg Entregado', puntos: '+20' },
    { accion: 'Trivia Correcta', puntos: '+5' }
  ],
  medallasComunales: [
    { id: 1, nombre: 'Sector Líder', icono: '🏅', descripcion: 'Tu comuna es la #1 del piloto', condicion: 'lider' },
    { id: 2, nombre: 'Unión Verde', icono: '🤝', descripcion: '+10 vecinos activos en tu sector', condicion: 'union' }
  ],

  saveRegistro(data, cicloId) {
    const newRegistro = {
      ...data,
      id: Date.now(),
      fecha: new Date().toISOString()
    };
    
    if (data.kilosAñadidos) {
      this.user.totalKilosReciclados += data.kilosAñadidos;
    }
    
    // Cooldown Anti-Cheat (5 días)
    let otorgarPuntos = false;
    let targetCicloId = cicloId || this.ciclosCompostaje.find(c => c.estado === 'Activo')?.id;
    
    if (targetCicloId) {
      const ciclo = this.ciclosCompostaje.find(c => c.id === targetCicloId);
      if (ciclo) {
        // Verificar si pasaron 5 días desde el último registro
        if (ciclo.avances.length === 0) {
          otorgarPuntos = true;
        } else {
          const lastAvance = ciclo.avances[ciclo.avances.length - 1];
          const daysDiff = (new Date(newRegistro.fecha) - new Date(lastAvance.fecha)) / (1000 * 60 * 60 * 24);
          if (daysDiff >= 5) otorgarPuntos = true;
        }

        ciclo.avances.push(newRegistro);
        
        if (otorgarPuntos) {
          this.user.puntos += 15; // 15 pts por registro semanal
        }
      }
    }
    
    return { registro: newRegistro, puntosOtorgados: otorgarPuntos };
  },

  generarGeoJSON() {
    // Obtenemos el último avance del primer ciclo activo
    const primerCicloActivo = this.ciclosCompostaje.find(c => c.estado === 'Activo');
    const ultimoRegistro = primerCicloActivo && primerCicloActivo.avances.length > 0 
      ? primerCicloActivo.avances[primerCicloActivo.avances.length - 1] 
      : null;

    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [this.user.coordenadas.lng, this.user.coordenadas.lat]
          },
          properties: {
            usuario_id: this.user.id,
            compost_listo: this.user.is_ready,
            nivel: this.user.nivel,
            ultimo_olor: ultimoRegistro ? ultimoRegistro.olor : null,
            ultima_humedad: ultimoRegistro ? ultimoRegistro.humedad : null,
            ultima_actualizacion: ultimoRegistro ? ultimoRegistro.fecha : null
          }
        }
      ]
    };
    return geojson;
  }
});

export const modulosCompostaje = [
  {
    id: 1,
    titulo: "🌱 1. ¿Qué es el Compostaje?",
    descripcion: "Es el proceso natural en el que microorganismos transforman tus restos de comida y jardín en abono rico en nutrientes (compost) para la tierra.",
    puntosClave: [
      "Reduce la basura que va a los vertederos.",
      "Disminuye los gases de efecto invernadero.",
      "Devuelve nutrientes a la tierra de forma gratuita."
    ]
  },
  {
    id: 2,
    titulo: "🍏 2. ¿Qué SÍ puedo echar? (La Dieta Ideal)",
    descripcion: "Un buen compost necesita un equilibrio entre materiales Húmedos (Verdes) y Secos (Cafés).",
    puntosClave: [
      "VERDES (Nitrógeno): Restos de frutas, verduras, cáscaras de huevo, borra de café y bolsitas de té.",
      "CAFÉS (Carbono): Hojas secas, cartón sin tinta, conos de confort picados, aserrín y ramas pequeñas.",
      "Regla de oro: Por cada porción de material verde, agrega una igual de material café."
    ]
  },
  {
    id: 3,
    titulo: "🚫 3. Lo que NUNCA debes echar",
    descripcion: "Estos elementos pudren el compost, atraen plagas o demoran años en degradarse.",
    puntosClave: [
      "Carnes, huesos y restos de pescado.",
      "Lácteos (queso, leche, yogurt) y aceites/grasas.",
      "Heces de perros o gatos.",
      "Plásticos, metales, vidrio o colillas de cigarro."
    ]
  },
  {
    id: 4,
    titulo: "🚑 4. Solución a Problemas Comunes",
    descripcion: "Tu compostera te 'habla'. Así puedes solucionar problemas rápidamente:",
    puntosClave: [
      "Huele a podrido/basura: Exceso de agua. Solución: Agrega mucho cartón o material seco y revuelve para oxigenar.",
      "Huele a amoníaco: Exceso de material verde. Solución: Agrega material café.",
      "Está muy seco y frío: Falta humedad. Solución: Rocía un poco de agua o agrega restos de frutas jugosas."
    ]
  },
  {
    id: 5,
    titulo: "📍 5. ¿Dónde ubicar mi compostera?",
    descripcion: "El lugar correcto evita malos olores y asegura que los microorganismos trabajen rápido.",
    puntosClave: [
      "Busca un lugar con sombra en verano para que no se seque por completo.",
      "Protección contra la lluvia: Clave en nuestra zona. Asegúrate de que tenga tapa para que no se inunde.",
      "Ponla directamente sobre la tierra (no sobre cemento) para que entren lombrices y microorganismos.",
      "Deja espacio alrededor para poder revolver cómodamente."
    ]
  },
  {
    id: 6,
    titulo: "🏗️ 6. ¿Cómo armar la primera capa?",
    descripcion: "El secreto de un compostaje sin pudrición es el drenaje inicial. Sigue esta regla de oro al empezar:",
    puntosClave: [
      "BASE: Pon 15 a 20 centímetros de ramas gruesas o trozos de madera en el fondo. Esto deja entrar aire desde abajo.",
      "CAPA 2: Agrega una capa de hojas secas o cartón.",
      "CAPA 3: Ahora sí, echa tus restos de cocina (material verde).",
      "Siempre cubre tu última capa de restos de cocina con material seco para no atraer moscas."
    ]
  },
  {
    id: 7,
    titulo: "✅ 7. ¿Cómo saber si ya está listo?",
    descripcion: "Antes de presionar el botón '¡Compost Listo!', verifica que tu abono cumpla estas tres reglas (Tarda entre 3 a 6 meses):",
    puntosClave: [
      "Olor: Huele a bosque o a tierra húmeda, cero olor a basura.",
      "Color: Es de un color café muy oscuro, casi negro.",
      "Textura: Ya no puedes reconocer las cáscaras o restos originales (todo es tierra homogénea).",
      "Temperatura: Está a temperatura ambiente, ya no emite calor en el centro."
    ]
  }
];
