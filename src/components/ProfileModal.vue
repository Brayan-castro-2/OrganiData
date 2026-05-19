<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 z-[60] backdrop-blur-sm" @click="$emit('close')"></div>
  </Transition>

  <Transition name="slide-up">
    <div v-if="isOpen" class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-[2rem] z-[70] flex flex-col h-[90vh] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
      
      <div class="w-full pt-3 pb-2 flex justify-center shrink-0">
        <div class="w-12 h-1.5 bg-slate-200 rounded-full"></div>
      </div>

      <div class="px-6 pb-4 flex justify-between items-center border-b border-slate-100 shrink-0">
        <h2 class="font-display text-xl font-bold text-slate-800">Mi Perfil</h2>
        <button @click="$emit('close')" class="p-2 rounded-full hover:bg-slate-100 text-slate-500">
          <X size="24" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 pb-32">
        
        <!-- SECCIÓN A: Cabecera -->
        <div class="flex flex-col items-center text-center gap-3">
          <div class="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border-[3px] border-emerald-300 shadow-lg shadow-emerald-100">
            <img 
              alt="Avatar" 
              class="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
            />
          </div>
          <div>
            <h3 class="text-xl font-extrabold text-slate-800">{{ db.user.name }}</h3>
            <p class="text-sm text-slate-500 flex items-center justify-center gap-1.5 mt-0.5">
              <Mail size="14" />
              {{ db.user.email }}
            </p>
            <p class="text-xs text-slate-400 flex items-center justify-center gap-1.5 mt-0.5">
              <MapPin size="12" />
              {{ db.user.direccion }}
            </p>
          </div>
          <!-- Puntos Totales destacados -->
          <div class="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl px-6 py-4 w-full flex items-center justify-between shadow-md">
            <div class="text-left">
              <p class="text-xs font-bold text-amber-100 uppercase tracking-wide">Tus Puntos Verdes</p>
              <p class="text-3xl font-extrabold text-white mt-0.5">{{ db.user.puntos }} <span class="text-sm font-medium text-amber-100">pts</span></p>
            </div>
            <div class="text-4xl">⭐</div>
          </div>

          <!-- Impacto Ambiental (Kilos y Nivel) -->
          <div class="bg-slate-900 rounded-3xl p-6 border-2 border-emerald-500 w-full shadow-lg relative overflow-hidden">
            <!-- Background glow -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div class="relative z-10 flex flex-col gap-4">
              <div class="flex justify-between items-start">
                <div class="text-left">
                  <p class="text-xs font-bold text-emerald-400 uppercase tracking-wide">Tu Impacto 🌍</p>
                  <p class="text-3xl font-extrabold text-white mt-1">{{ db.user.totalKilosReciclados.toFixed(1) }} <span class="text-lg font-medium text-slate-400">Kg</span></p>
                </div>
                <div class="bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30">
                  <span class="text-xs font-bold text-emerald-400">{{ db.user.nivel }}</span>
                </div>
              </div>

              <!-- Comparativo -->
              <div class="bg-slate-800/80 rounded-xl p-3">
                <p class="text-xs text-slate-300 font-medium leading-relaxed">
                  Una persona promedio en Chile bota 4.2 kg de materia orgánica a la semana. ¡Tú has reciclado <span class="text-white font-bold">{{ db.user.totalKilosReciclados.toFixed(1) }} kg</span>!
                </p>
                <div v-if="db.user.totalKilosReciclados > 4.2" class="mt-2 inline-block bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                  ⭐ ¡Eres un Top Reciclador!
                </div>
              </div>

              <!-- Barra de Progreso hacia el siguiente nivel -->
              <div class="flex flex-col gap-1.5">
                <div class="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>{{ db.user.nivel }}</span>
                  <span>{{ nextLevelText }}</span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-2.5">
                  <div class="bg-emerald-500 h-2.5 rounded-full" :style="{ width: progressPercentage + '%' }"></div>
                </div>
                <p class="text-[10px] text-slate-500 text-right mt-0.5">Te faltan {{ kilosToNextLevel.toFixed(1) }} Kg para subir</p>
              </div>
            </div>
          </div>
          <!-- Stats -->
          <div class="grid grid-cols-2 gap-3 w-full">
            <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
              <p class="text-xl font-extrabold text-emerald-600">{{ totalRegistros }}</p>
              <p class="text-[10px] text-slate-500 font-medium mt-0.5">Registros</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
              <p class="text-xl font-extrabold text-emerald-600">{{ db.user.current_week }}</p>
              <p class="text-[10px] text-slate-500 font-medium mt-0.5">Semana</p>
            </div>
          </div>
        </div>

        <!-- SECCIÓN B: Mis Medallas -->
        <div>
          <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Award size="16" class="text-amber-500" />
            Mis Medallas
          </h3>
          <div class="grid grid-cols-3 gap-3">
            <div 
              v-for="m in db.user.medallas" 
              :key="m.id"
              class="bg-slate-50 rounded-2xl p-4 flex flex-col items-center text-center border border-slate-100 hover:border-emerald-200 transition-colors"
            >
              <span class="text-3xl">{{ m.icono }}</span>
              <span class="text-[11px] font-bold text-slate-700 mt-2 leading-tight">{{ m.nombre }}</span>
              <span class="text-[9px] text-slate-400 mt-0.5">{{ m.descripcion }}</span>
            </div>
          </div>
        </div>

        <!-- Medallas Comunales -->
        <div>
          <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Trophy size="16" class="text-amber-500" />
            Medallas por Comuna
          </h3>
          <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
            <div class="grid grid-cols-2 gap-3">
              <div 
                v-for="m in db.medallasComunales" 
                :key="m.id"
                class="bg-white/70 rounded-xl p-3 text-center border border-amber-100"
              >
                <span class="text-2xl block">{{ m.icono }}</span>
                <p class="text-[11px] font-bold text-amber-800 mt-1">{{ m.nombre }}</p>
                <p class="text-[9px] text-amber-600 mt-0.5">{{ m.descripcion }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN C: ¿Cómo ganar más puntos? -->
        <div>
          <h3 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Star size="16" class="text-emerald-500" />
            ¿Cómo ganar más puntos?
          </h3>
          <div class="flex flex-col gap-2">
            <div 
              v-for="(item, i) in db.tablaPuntos" 
              :key="i"
              class="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200"
            >
              <span class="text-sm font-medium text-slate-700">{{ item.accion }}</span>
              <span class="text-sm font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">{{ item.puntos }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Logout fijo abajo -->
      <div class="absolute bottom-0 left-0 w-full p-6 bg-white/90 border-t border-slate-100 backdrop-blur-md">
        <button 
          @click="handleLogout"
          class="w-full bg-red-50 text-red-600 font-bold py-4 rounded-full flex items-center justify-center gap-3 hover:bg-red-100 transition-all border border-red-100 active:scale-[0.98]"
        >
          <LogOut size="20" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';
import { X, Mail, MapPin, Award, Star, LogOut, Trophy } from 'lucide-vue-next';
import { db } from '../mocks/database';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

defineProps({ isOpen: Boolean });
defineEmits(['close']);

const authStore = useAuthStore();
const router = useRouter();

// Total de registros contando avances de todos los ciclos
const totalRegistros = computed(() => {
  return db.ciclosCompostaje.reduce((sum, ciclo) => sum + ciclo.avances.length, 0);
});

const nextLevelThreshold = computed(() => {
  const kg = db.user.totalKilosReciclados;
  if (kg <= 10) return 11;
  if (kg <= 30) return 31;
  if (kg <= 50) return 51;
  return 100; // Max cap o algo simbólico
});

const nextLevelText = computed(() => {
  const kg = db.user.totalKilosReciclados;
  if (kg <= 10) return 'Brote Activo';
  if (kg <= 30) return 'Árbol Fuerte';
  if (kg <= 50) return 'Guardián';
  return 'Máximo Nivel';
});

const progressPercentage = computed(() => {
  const kg = db.user.totalKilosReciclados;
  const target = nextLevelThreshold.value;
  let base = 0;
  if (kg > 10 && kg <= 30) base = 10;
  else if (kg > 30 && kg <= 50) base = 30;
  else if (kg > 50) return 100;

  const currentLevelProgress = kg - base;
  const currentLevelRange = target - base;
  return Math.min(100, Math.max(0, (currentLevelProgress / currentLevelRange) * 100));
});

const kilosToNextLevel = computed(() => {
  const kg = db.user.totalKilosReciclados;
  if (kg > 50) return 0;
  return nextLevelThreshold.value - kg;
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%) translateX(-50%);
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0) translateX(-50%);
}
</style>
