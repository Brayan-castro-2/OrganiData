<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex flex-col font-sans">

    <!-- Header con progress bar -->
    <div class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div class="max-w-md mx-auto px-6 py-4 flex items-center gap-4">
        <button @click="handleBack" class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors shrink-0">
          <ChevronLeft size="20" />
        </button>
        <div class="flex-1">
          <div class="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">
            <span :class="paso >= 1 ? 'text-emerald-600' : ''">Cuenta</span>
            <span :class="paso >= 2 ? 'text-emerald-600' : ''">Tu Hogar</span>
          </div>
          <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              :style="{ width: paso === 1 ? '50%' : '100%' }"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-8">

      <!-- ──────────── PASO 1: Datos de cuenta ──────────── -->
      <Transition name="step" mode="out-in">
        <div v-if="paso === 1" key="paso1" class="flex flex-col gap-6">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900 leading-tight">Crea tu cuenta 🌱</h1>
            <p class="text-sm text-slate-500 mt-1">Únete al piloto de compostaje de Puerto Montt</p>
          </div>

          <!-- Nombre -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-slate-700">Nombre completo</label>
            <div class="relative">
              <User size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="signup-nombre"
                v-model="form.nombre"
                type="text"
                autocomplete="name"
                placeholder="Juan Pérez"
                :class="inputClass('nombre')"
                @blur="touch('nombre')"
              />
            </div>
            <p v-if="errors.nombre" class="text-xs text-red-500 font-medium">{{ errors.nombre }}</p>
          </div>

          <!-- Correo -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-slate-700">Correo electrónico</label>
            <div class="relative">
              <Mail size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="signup-email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                placeholder="juan@ejemplo.cl"
                :class="inputClass('email')"
                @blur="touch('email')"
              />
            </div>
            <p v-if="errors.email" class="text-xs text-red-500 font-medium">{{ errors.email }}</p>
          </div>

          <!-- Contraseña -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-slate-700">Contraseña</label>
            <div class="relative">
              <Lock size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="signup-password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Mínimo 6 caracteres"
                :class="inputClass('password')"
                @blur="touch('password')"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <Eye v-if="!showPassword" size="18" />
                <EyeOff v-else size="18" />
              </button>
            </div>
            <!-- Barra de fortaleza -->
            <div v-if="form.password" class="flex gap-1 mt-1">
              <div v-for="n in 3" :key="n" class="h-1 flex-1 rounded-full transition-colors duration-300"
                :class="passwordStrength >= n ? strengthColors[passwordStrength - 1] : 'bg-slate-100'" />
            </div>
            <p v-if="errors.password" class="text-xs text-red-500 font-medium">{{ errors.password }}</p>
          </div>

          <!-- Confirmar contraseña -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-slate-700">Confirmar contraseña</label>
            <div class="relative">
              <Lock size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="signup-confirm"
                v-model="form.confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Repite tu contraseña"
                :class="inputClass('confirmPassword')"
                @blur="touch('confirmPassword')"
              />
              <button type="button" @click="showConfirm = !showConfirm" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <Eye v-if="!showConfirm" size="18" />
                <EyeOff v-else size="18" />
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="text-xs text-red-500 font-medium">{{ errors.confirmPassword }}</p>
          </div>

          <button
            @click="irPaso2"
            class="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
          >
            Continuar
            <ArrowRight size="20" />
          </button>

          <p class="text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?
            <router-link to="/login" class="text-emerald-600 font-bold hover:underline ml-1">Inicia sesión</router-link>
          </p>
        </div>
      </Transition>

      <!-- ──────────── PASO 2: Datos del hogar ──────────── -->
      <Transition name="step" mode="out-in">
        <div v-if="paso === 2" key="paso2" class="flex flex-col gap-6">
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900 leading-tight">Tu hogar 🏡</h1>
            <p class="text-sm text-slate-500 mt-1">Estos datos ayudan a la municipalidad a planificar el programa</p>
          </div>

          <!-- Población / Sector -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-slate-700">Población / Sector</label>
            <div class="relative">
              <MapPin size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                id="signup-sector"
                v-model="form.sector"
                :class="inputClass('sector')"
                @blur="touch('sector')"
              >
                <option value="" disabled>Selecciona tu sector...</option>
                <optgroup label="Zonas Urbanas">
                  <option v-for="s in sectores" :key="s" :value="s">{{ s }}</option>
                </optgroup>
              </select>
              <ChevronDown size="18" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <p v-if="errors.sector" class="text-xs text-red-500 font-medium">{{ errors.sector }}</p>
          </div>

          <!-- Dirección con geolocalización -->
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-slate-700">Dirección</label>
            <div class="relative">
              <Home size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="signup-direccion"
                v-model="form.direccion"
                type="text"
                placeholder="Ej: Los Alerces 1420"
                :class="inputClass('direccion') + ' pr-[5.5rem]'"
                @blur="touch('direccion')"
              />
              <button
                type="button"
                @click="usarUbicacion"
                :disabled="geoLoading"
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[11px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <Loader2 v-if="geoLoading" size="12" class="animate-spin" />
                <Navigation v-else size="12" />
                {{ geoLoading ? '...' : 'GPS' }}
              </button>
            </div>
            <p v-if="geoError" class="text-xs text-orange-500 font-medium flex items-center gap-1">
              <AlertCircle size="12" />{{ geoError }}
            </p>
            <p v-if="errors.direccion" class="text-xs text-red-500 font-medium">{{ errors.direccion }}</p>
          </div>

          <!-- ¿Cuántas personas en casa? -->
          <div class="flex flex-col gap-3">
            <label class="text-sm font-semibold text-slate-700">¿Cuántas personas viven en tu hogar?</label>
            <p class="text-xs text-slate-400 -mt-1">Nos ayuda a estimar tu potencial de reciclaje</p>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                @click="form.personas = n"
                :class="[
                  'py-3 rounded-xl font-bold text-sm border-2 transition-all',
                  form.personas === n
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                ]"
              >
                {{ n }}{{ n === 5 ? '+' : '' }}
              </button>
            </div>
            <p v-if="errors.personas" class="text-xs text-red-500 font-medium">{{ errors.personas }}</p>
          </div>

          <!-- Experiencia previa (bonus UX) -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-slate-700">¿Tienes experiencia previa con el compostaje?</label>
            <div class="flex gap-2">
              <button
                v-for="exp in experiencias"
                :key="exp.value"
                type="button"
                @click="form.experiencia = exp.value"
                :class="[
                  'flex-1 py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all text-center',
                  form.experiencia === exp.value
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                ]"
              >
                <span class="block text-xl mb-1">{{ exp.icono }}</span>
                {{ exp.label }}
              </button>
            </div>
          </div>

          <!-- Error global de Supabase -->
          <Transition name="fade-err">
            <div v-if="errorGlobal" class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size="18" class="text-red-500 shrink-0 mt-0.5" />
              <p class="text-sm font-medium text-red-700">{{ errorGlobal }}</p>
            </div>
          </Transition>

          <!-- Botón Finalizar -->
          <button
            @click="handleSignup"
            :disabled="loading"
            class="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            <Loader2 v-if="loading" size="20" class="animate-spin" />
            <Leaf v-else size="20" />
            {{ loading ? 'Creando cuenta...' : '¡Unirme al piloto!' }}
          </button>

          <!-- Info de privacidad -->
          <p class="text-center text-[11px] text-slate-400 leading-relaxed pb-4">
            🔒 Tus datos son confidenciales y solo los usa la Municipalidad de Puerto Montt para gestionar el programa de compostaje.
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import {
  User, Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft,
  MapPin, Home, Navigation, Loader2, AlertCircle, Leaf, ChevronDown
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

// ── Estado del formulario ──────────────────────────────────────
const paso = ref(1);
const loading = ref(false);
const showPassword = ref(false);
const showConfirm = ref(false);
const geoLoading = ref(false);
const geoError = ref('');
const errorGlobal = ref('');

const form = ref({
  nombre: '',
  email: '',
  password: '',
  confirmPassword: '',
  sector: '',
  direccion: '',
  personas: null,
  experiencia: 'ninguna',
  lat: null,
  lng: null,
});

const touched = ref({});
const errors = ref({});

// ── Datos de sectores de Puerto Montt ─────────────────────────
const sectores = [
  'Alerce', 'Valle Volcanes', 'Pelluco', 'Chinquihue', 'Mirasol',
  'Angelmó', 'El Tepual', 'La Vara', 'Los Riscos', 'Reloncaví',
  'Kennedy', 'Vista Hermosa', 'Quillaipe', 'Colico', 'Otro',
];

const experiencias = [
  { value: 'ninguna', label: 'Primera vez', icono: '🌱' },
  { value: 'algo', label: 'Un poco', icono: '🌿' },
  { value: 'experto', label: 'Experto', icono: '🌳' },
];

// ── Validaciones ───────────────────────────────────────────────
const validar = (campo) => {
  const v = form.value;
  switch (campo) {
    case 'nombre':
      if (!v.nombre.trim()) return 'El nombre es requerido';
      if (v.nombre.trim().length < 3) return 'Mínimo 3 caracteres';
      break;
    case 'email':
      if (!v.email) return 'El correo es requerido';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return 'Correo inválido';
      break;
    case 'password':
      if (!v.password) return 'La contraseña es requerida';
      if (v.password.length < 6) return 'Mínimo 6 caracteres';
      break;
    case 'confirmPassword':
      if (!v.confirmPassword) return 'Confirma tu contraseña';
      if (v.password !== v.confirmPassword) return 'Las contraseñas no coinciden';
      break;
    case 'sector':
      if (!v.sector) return 'Selecciona tu sector';
      break;
    case 'direccion':
      if (!v.direccion.trim()) return 'La dirección es requerida';
      break;
    case 'personas':
      if (!v.personas) return 'Selecciona cuántas personas viven en tu hogar';
      break;
  }
  return null;
};

const touch = (campo) => {
  touched.value[campo] = true;
  const error = validar(campo);
  if (error) errors.value[campo] = error;
  else delete errors.value[campo];
};

// ── Fortaleza de contraseña ───────────────────────────────────
const passwordStrength = computed(() => {
  const p = form.value.password;
  if (!p) return 0;
  let score = 0;
  if (p.length >= 6) score++;
  if (p.length >= 10) score++;
  if (/[A-Z]/.test(p) || /[0-9]/.test(p) || /[^a-zA-Z0-9]/.test(p)) score++;
  return Math.min(score, 3);
});
const strengthColors = ['bg-red-400', 'bg-amber-400', 'bg-emerald-500'];

// ── Clase dinámica de inputs ──────────────────────────────────
const inputClass = (campo) => {
  const base = 'w-full pl-11 pr-4 py-3.5 border-2 rounded-xl text-sm font-medium transition-colors outline-none bg-white appearance-none';
  const error = errors.value[campo] && touched.value[campo];
  return `${base} ${error
    ? 'border-red-300 focus:border-red-400 text-red-700'
    : 'border-slate-200 focus:border-emerald-400 text-slate-800 placeholder:text-slate-400'
  }`;
};

// ── Geolocalización GPS ───────────────────────────────────────
const usarUbicacion = () => {
  if (!navigator.geolocation) {
    geoError.value = 'Tu navegador no soporta geolocalización';
    return;
  }
  geoLoading.value = true;
  geoError.value = '';

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      form.value.lat = pos.coords.latitude;
      form.value.lng = pos.coords.longitude;

      // Reverse geocoding con Nominatim (OpenStreetMap, gratuito)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=es`
        );
        const data = await res.json();
        const addr = data.address;
        const calle = addr.road || addr.pedestrian || '';
        const numero = addr.house_number || '';
        form.value.direccion = [calle, numero].filter(Boolean).join(' ');
        if (!form.value.sector && addr.suburb) {
          // Intentar autocompletar sector si coincide
          const match = sectores.find(s =>
            addr.suburb.toLowerCase().includes(s.toLowerCase()) ||
            s.toLowerCase().includes(addr.suburb.toLowerCase())
          );
          if (match) form.value.sector = match;
        }
      } catch {
        form.value.direccion = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
      }
      geoLoading.value = false;
    },
    (err) => {
      geoLoading.value = false;
      switch (err.code) {
        case 1: geoError.value = 'Permiso de ubicación denegado. Escribe tu dirección manualmente.'; break;
        case 2: geoError.value = 'No se pudo obtener tu ubicación. Intenta de nuevo.'; break;
        default: geoError.value = 'Error al obtener ubicación.';
      }
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
};

// ── Navegación entre pasos ────────────────────────────────────
const irPaso2 = () => {
  ['nombre', 'email', 'password', 'confirmPassword'].forEach(c => {
    touched.value[c] = true;
    const e = validar(c);
    if (e) errors.value[c] = e;
    else delete errors.value[c];
  });
  const hayErrores = ['nombre', 'email', 'password', 'confirmPassword'].some(c => errors.value[c]);
  if (!hayErrores) paso.value = 2;
};

const handleBack = () => {
  if (paso.value === 2) {
    paso.value = 1;
  } else {
    router.push('/login');
  }
};

// ── Registro final con Supabase ───────────────────────────────
const handleSignup = async () => {
  ['sector', 'direccion', 'personas'].forEach(c => {
    touched.value[c] = true;
    const e = validar(c);
    if (e) errors.value[c] = e;
    else delete errors.value[c];
  });
  const hayErrores = ['sector', 'direccion', 'personas'].some(c => errors.value[c]);
  if (hayErrores) return;

  loading.value = true;
  errorGlobal.value = '';

  const result = await authStore.signup({
    nombre: form.value.nombre.trim(),
    email: form.value.email.trim().toLowerCase(),
    password: form.value.password,
    sector: form.value.sector,
    direccion: form.value.direccion.trim(),
    personas: form.value.personas,
    experiencia: form.value.experiencia,
    lat: form.value.lat,
    lng: form.value.lng,
  });

  loading.value = false;

  if (result.success) {
    router.push('/');
  } else {
    errorGlobal.value = result.message;
  }
};
</script>

<style scoped>
/* Quitar flecha nativa del select */
select { background-image: none; }

/* Transición entre pasos */
.step-enter-active,
.step-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.step-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.step-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

/* Fade error */
.fade-err-enter-active,
.fade-err-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-err-enter-from,
.fade-err-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
