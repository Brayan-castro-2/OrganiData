import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env');
}

// Cliente público — usar en todos los componentes Vue
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// ── AUTH HELPERS ────────────────────────────────────────────────────────────

export const authService = {
  // Registro con email y contraseña
  async registrar({ email, password, nombre }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } }
    });
    if (error) throw error;
    return data;
  },

  // Login
  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Obtener sesión actual
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Escuchar cambios de sesión (útil en App.vue)
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// ── PERFIL HELPERS ───────────────────────────────────────────────────────────

export const perfilService = {
  async obtener(userId) {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async actualizar(userId, updates) {
    const { data, error } = await supabase
      .from('perfiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async sumarPuntos(userId, puntos) {
    const { data, error } = await supabase.rpc('sumar_puntos', {
      p_user_id: userId,
      p_puntos: puntos
    });
    if (error) throw error;
    return data;
  }
};

// ── CICLOS HELPERS ────────────────────────────────────────────────────────────

export const ciclosService = {
  async listar(userId) {
    const { data, error } = await supabase
      .from('ciclos_compostaje')
      .select('*, avances(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async crear(userId, nombrePersonalizado) {
    const { data, error } = await supabase
      .from('ciclos_compostaje')
      .insert({ user_id: userId, nombre_personalizado: nombrePersonalizado })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async finalizar(cicloId, cosechaKilos) {
    const { data, error } = await supabase
      .from('ciclos_compostaje')
      .update({
        estado: 'Finalizado',
        fecha_fin: new Date().toISOString(),
        cosecha_kilos: cosechaKilos
      })
      .eq('id', cicloId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// ── AVANCES HELPERS ───────────────────────────────────────────────────────────

export const avancesService = {
  async crear({ cicloId, userId, olor, humedad, kilosAnadidos, fotoUrl, nota }) {
    // Verificar cooldown anti-fraude (5 días)
    const { data: ultimo } = await supabase
      .from('avances')
      .select('fecha')
      .eq('ciclo_id', cicloId)
      .order('fecha', { ascending: false })
      .limit(1)
      .single();

    let puntosOtorgados = false;
    if (!ultimo) {
      puntosOtorgados = true; // Primer avance siempre otorga puntos
    } else {
      const diasDiff = (Date.now() - new Date(ultimo.fecha).getTime()) / (1000 * 60 * 60 * 24);
      if (diasDiff >= 5) puntosOtorgados = true;
    }

    const { data, error } = await supabase
      .from('avances')
      .insert({
        ciclo_id: cicloId,
        user_id: userId,
        olor,
        humedad,
        kilos_anadidos: kilosAnadidos,
        foto_url: fotoUrl,
        nota,
        puntos_otorgados: puntosOtorgados
      })
      .select()
      .single();

    if (error) throw error;

    // Sumar kilos al perfil
    if (kilosAnadidos > 0) {
      await supabase.rpc('incrementar_kilos', {
        p_user_id: userId,
        p_kilos: kilosAnadidos
      });
    }

    // Sumar puntos si corresponde
    if (puntosOtorgados) {
      await supabase
        .from('perfiles')
        .update({ puntos: supabase.rpc('coalesce', []) }) // Se usa función SQL
        .eq('id', userId);
      // Alternativa directa:
      await supabase.from('perfiles').update({
        puntos: (await perfilService.obtener(userId)).puntos + 15
      }).eq('id', userId);
    }

    return { avance: data, puntosOtorgados };
  }
};

// ── STORAGE HELPERS (Fotos del compost) ──────────────────────────────────────

export const storageService = {
  async subirFoto(userId, file, cicloId) {
    const ext = file.name.split('.').pop();
    const path = `${userId}/${cicloId}/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('fotos-compost')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('fotos-compost')
      .getPublicUrl(path);

    return publicUrl;
  }
};

// ── RANKING HELPERS ───────────────────────────────────────────────────────────

export const rankingService = {
  async obtenerVecinos(limit = 10) {
    const { data, error } = await supabase
      .from('ranking_vecinos')
      .select('*')
      .limit(limit);
    if (error) throw error;
    return data;
  },

  async obtenerPorSector() {
    const { data, error } = await supabase
      .from('perfiles')
      .select('sector, puntos')
      .neq('sector', null);
    if (error) throw error;

    // Agrupar por sector en el cliente
    const map = {};
    data.forEach(({ sector, puntos }) => {
      if (!map[sector]) map[sector] = { sector, puntosTotales: 0, vecinos: 0 };
      map[sector].puntosTotales += puntos;
      map[sector].vecinos++;
    });
    return Object.values(map).sort((a, b) => b.puntosTotales - a.puntosTotales);
  }
};

// ── AVISOS HELPERS ────────────────────────────────────────────────────────────

export const avisosService = {
  async listar() {
    const { data, error } = await supabase
      .from('avisos_municipales')
      .select('*')
      .order('fecha', { ascending: false });
    if (error) throw error;
    return data;
  }
};
