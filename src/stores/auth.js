import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../lib/supabase';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const user = ref(null);
  const loading = ref(false);

  // ── INICIALIZAR sesión existente al arrancar la app ──────────
  const init = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await _loadUser(session.user);
    }

    // Escuchar cambios de sesión (login/logout)
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await _loadUser(session.user);
      } else {
        isAuthenticated.value = false;
        user.value = null;
      }
    });
  };

  // ── Cargar perfil desde la tabla perfiles ─────────────────────
  const _loadUser = async (authUser) => {
    try {
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      user.value = {
        id: authUser.id,
        email: authUser.email,
        name: perfil?.nombre || authUser.user_metadata?.nombre || authUser.email.split('@')[0],
        sector: perfil?.sector || 'Sin sector',
        direccion: perfil?.direccion || '',
        puntos: perfil?.puntos || 0,
        totalKilosReciclados: perfil?.kilos_reciclados || 0,
        current_week: 1,
        get nivel() {
          if (this.totalKilosReciclados <= 10) return 'Semilla 🌱';
          if (this.totalKilosReciclados <= 30) return 'Brote Activo 🌿';
          if (this.totalKilosReciclados <= 50) return 'Árbol Fuerte 🌳';
          return 'Guardián del Ecosistema 🌍';
        },
      };
      isAuthenticated.value = true;
    } catch {
      // Si falla cargar perfil, usar datos mínimos del auth
      user.value = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.nombre || authUser.email.split('@')[0],
        puntos: 0,
        totalKilosReciclados: 0,
        current_week: 1,
        sector: 'Sin sector',
        get nivel() { return 'Semilla 🌱'; },
      };
      isAuthenticated.value = true;
    }
  };

  // ── SIGNUP ────────────────────────────────────────────────────
  const signup = async ({ nombre, email, password, sector, direccion, personas, experiencia, lat, lng }) => {
    loading.value = true;
    try {
      // 1. Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nombre } // guardado en raw_user_meta_data, el trigger lo usa
        }
      });

      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) throw new Error('No se pudo obtener el ID del usuario.');

      // 2. Actualizar perfil con datos adicionales del paso 2
      // (el trigger handle_new_user ya creó la fila base con nombre y email)
      const { error: updateError } = await supabase
        .from('perfiles')
        .update({
          sector,
          direccion,
          coordenadas: lat && lng ? { lat, lng } : { lat: -41.4693, lng: -72.9424 },
        })
        .eq('id', userId);

      if (updateError) console.warn('No se pudo actualizar perfil:', updateError.message);

      // 3. Cargar usuario en el store
      await _loadUser(data.user);

      return { success: true };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, message: _traducirError(err.message) };
    } finally {
      loading.value = false;
    }
  };

  // ── LOGIN ─────────────────────────────────────────────────────
  const login = async (email, password) => {
    loading.value = true;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await _loadUser(data.user);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: _traducirError(err.message) };
    } finally {
      loading.value = false;
    }
  };

  // ── LOGOUT ────────────────────────────────────────────────────
  const logout = async () => {
    await supabase.auth.signOut();
    isAuthenticated.value = false;
    user.value = null;
  };

  // ── Traducir errores de Supabase al español ───────────────────
  const _traducirError = (msg = '') => {
    if (msg.includes('already registered') || msg.includes('User already registered'))
      return 'Este correo ya está registrado. ¿Quieres iniciar sesión?';
    if (msg.includes('Invalid login credentials'))
      return 'Correo o contraseña incorrectos.';
    if (msg.includes('Email not confirmed'))
      return 'Confirma tu correo antes de ingresar. Revisa tu bandeja de entrada.';
    if (msg.includes('Password should be'))
      return 'La contraseña debe tener al menos 6 caracteres.';
    if (msg.includes('Unable to validate email'))
      return 'El correo ingresado no es válido.';
    if (msg.includes('rate limit') || msg.includes('too many'))
      return 'Demasiados intentos. Espera unos minutos e intenta de nuevo.';
    return msg || 'Ocurrió un error. Intenta de nuevo.';
  };

  return {
    isAuthenticated,
    user,
    loading,
    init,
    signup,
    login,
    logout,
  };
});
