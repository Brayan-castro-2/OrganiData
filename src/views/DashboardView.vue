<template>
  <main class="px-6 py-6 flex flex-col gap-6 relative">
    <!-- Copiloto / Diseño Anticipatorio -->
    <div :class="['w-full rounded-xl p-4 transition-colors', estadoCopiloto]">
      <p class="font-bold text-sm mb-1">📋 Tarea de hoy:</p>
      <p class="text-sm font-medium">{{ mensajeCopiloto }}</p>
    </div>

    <!-- Nivel + Impacto del usuario -->
    <section class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <!-- Header del ciclo -->
      <div class="p-6 pb-4 flex flex-col items-center gap-4">
        <div 
          class="relative w-40 h-40 rounded-full flex items-center justify-center shadow-inner" 
          :style="`background: conic-gradient(rgb(16 185 129) ${nivelInfo.porcentajeProgreso}%, rgb(241 245 249) 0);`"
        >
          <div class="absolute inset-3 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
            <span class="text-3xl">{{ nivelInfo.icono }}</span>
            <span class="font-display text-sm font-extrabold text-slate-800 mt-1 text-center leading-tight px-2">{{ nivelInfo.nombre }}</span>
          </div>
        </div>

        <!-- Kilos totales -->
        <div class="text-center">
          <p class="text-3xl font-extrabold text-emerald-600">{{ totalKilos.toFixed(1) }} <span class="text-base font-bold text-slate-400">Kg</span></p>
          <p class="text-xs font-medium text-slate-500 mt-0.5">reciclados en total</p>
        </div>
      </div>

      <!-- Barra de progreso al siguiente nivel -->
      <div v-if="nivelInfo.siguienteNombre" class="px-6 pb-5">
        <div class="flex justify-between text-[11px] font-bold text-slate-400 mb-1.5">
          <span>{{ nivelInfo.nombre }} {{ nivelInfo.icono }}</span>
          <span>{{ nivelInfo.siguienteNombre }} {{ nivelInfo.siguienteIcono }}</span>
        </div>
        <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            class="h-full bg-emerald-500 rounded-full transition-all duration-700"
            :style="{ width: nivelInfo.porcentajeProgreso + '%' }"
          />
        </div>
        <p class="text-[11px] text-slate-400 text-right mt-1">Te faltan <strong class="text-emerald-600">{{ nivelInfo.kilosRestantes }} Kg</strong> para subir</p>
      </div>

      <!-- Impacto comparativo vs promedio Chile -->
      <div class="mx-4 mb-5 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
        <p class="text-xs font-bold text-emerald-700 leading-relaxed">
          🌍 {{ impactoInfo.texto }}
        </p>
        <div class="mt-2 w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-emerald-500 rounded-full"
            :style="{ width: Math.min(impactoInfo.porcentaje, 100) + '%' }"
          />
        </div>
        <p class="text-[10px] text-emerald-600 font-medium mt-1 text-right">Promedio Chile: 4.2 Kg/semana</p>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <div class="flex gap-3">
        <button 
          @click="isModalOpen = true"
          class="flex-1 bg-white text-slate-800 font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm border border-slate-200"
        >
          <Camera size="20" class="text-emerald-500" />
          Registrar Avance
        </button>
        <button 
          @click="showSOS"
          class="w-14 shrink-0 bg-rose-100 text-rose-600 text-xl font-bold rounded-xl flex items-center justify-center hover:bg-rose-200 transition-colors shadow-sm"
          title="S.O.S - Ayuda"
        >
          🚑
        </button>
      </div>
      <button 
        @click="openHarvestModal"
        :class="['w-full font-bold py-4 rounded-full flex items-center justify-center gap-3 transition-all shadow-lg', !hasActiveCycle ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : diasTranscurridosCiclo < 60 ? 'bg-emerald-500/50 text-white cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.99]']"
      >
        <template v-if="!hasActiveCycle">
          <Truck size="20" />
          Sin ciclos activos 🚛
        </template>
        <template v-else>
          <CheckCircle size="20" />
          ¡Mi Compost está Listo!
        </template>
      </button>
    </section>

    <section class="bg-emerald-50 text-emerald-900 rounded-2xl p-6 shadow-sm border border-emerald-100 overflow-hidden relative">
      <div class="absolute top-0 right-0 p-4 opacity-10">
        <Lightbulb size="80" />
      </div>
      <div class="flex items-center gap-3 relative z-10">
        <div class="p-2 bg-white/60 rounded-full">
          <Lightbulb size="20" class="text-amber-500 fill-amber-500" />
        </div>
        <h3 class="font-display text-lg font-bold">Tip Oficial del Ministerio</h3>
      </div>
      <p class="text-sm mt-3 relative z-10 font-bold leading-relaxed opacity-90">
        Si tu compostera huele a humedad, asegúrate de agregar material seco como cartón o aserrín hoy.
      </p>
    </section>

    <!-- Tarjeta de Ranking -->
    <router-link to="/comunidad" class="block bg-emerald-500 text-white rounded-2xl p-5 shadow-lg hover:bg-emerald-600 transition-all active:scale-[0.98] overflow-hidden relative group">
      <div class="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity">
        <Trophy size="64" />
      </div>
      <div class="flex items-center gap-3 relative z-10">
        <div class="p-2 bg-white/20 rounded-full">
          <Trophy size="22" class="text-white" />
        </div>
        <div>
          <p class="text-base font-bold">🏆 Estás en el Top 3 de tu sector</p>
          <p class="text-sm font-medium text-emerald-100 mt-0.5">¡Mira el Ranking!</p>
        </div>
      </div>
    </router-link>

    <RecordProgressModal 
      :isOpen="isModalOpen" 
      @close="isModalOpen = false" 
      @saved="onProgressSaved" 
    />

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-4 w-[90%] max-w-sm">
        <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
          <CheckCircle size="20" class="text-white" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-bold text-white leading-tight">¡Avance registrado! 🌱</p>
          <p v-if="puntosGanados > 0" class="text-xs font-medium text-slate-300 mt-0.5">
            <span class="text-amber-400 font-bold">+{{ puntosGanados }} pts</span>
            · <span class="text-emerald-400 font-bold">+{{ kilosRegistrados }} Kg</span>
            · Total: <span class="text-white font-bold">{{ authStore.user?.puntos ?? db.user.puntos }} pts</span>
          </p>
          <p v-else class="text-xs font-medium text-slate-400 mt-0.5">Puntos cada 5 días para proteger tu compost 🌿</p>
        </div>
      </div>
    </Transition>
    <!-- Exportar GeoJSON Oculto para devs -->
    <button 
      @click="exportarGeoJSON"
      class="text-xs text-slate-300 font-bold underline text-center mt-2 pb-6 w-full opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
    >
      Exportar GeoJSON
    </button>
    <!-- Modal Cosecha -->
    <Transition name="fade">
      <div v-if="isHarvestModalOpen" class="fixed inset-0 bg-slate-900/60 z-[60] backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-xl flex flex-col gap-4 text-center">
          <h2 class="font-display text-2xl font-bold text-slate-800">¡Felicidades! 🌾</h2>
          <p class="text-sm font-medium text-slate-500 mb-2">¿Cuánto abono cosechaste de tu compostera?</p>
          
          <div class="flex flex-col gap-3">
            <button 
              @click="finishHarvest(10)"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
            >
              <span class="text-4xl mb-2">🪣</span>
              <span class="font-bold text-slate-800">Medio Balde</span>
              <span class="text-xs text-slate-500">(Aprox. 10 Litros)</span>
            </button>
            <button 
              @click="finishHarvest(20)"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
            >
              <span class="text-4xl mb-2">🪣🪣</span>
              <span class="font-bold text-slate-800">Un Balde Lleno</span>
              <span class="text-xs text-slate-500">(Aprox. 20 Litros)</span>
            </button>
            <button 
              @click="finishHarvest(40)"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
            >
              <span class="text-4xl mb-2">🛒</span>
              <span class="font-bold text-slate-800">Carretilla / 2 Baldes</span>
              <span class="text-xs text-slate-500">(Aprox. 40 Litros)</span>
            </button>
          </div>
          
          <button @click="isHarvestModalOpen = false" class="mt-2 text-sm font-bold text-slate-400 hover:text-slate-600">
            Cancelar
          </button>
        </div>
      </div>
    </Transition>

    <!-- Toast de Cosecha -->
    <Transition name="toast">
      <div v-if="showHarvestToast" class="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white px-6 py-4 rounded-3xl shadow-xl w-[90%] max-w-sm text-center">
        <span class="text-3xl block mb-2">🎉</span>
        <p class="font-bold text-lg mb-1">¡Increíble!</p>
        <p class="text-sm font-medium opacity-90 leading-tight">Acabas de evitar que {{ kilosCosechados }} kilos de basura lleguen al vertedero. Ganaste +100 puntos 🌍.</p>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Camera, CheckCircle, Lightbulb, Truck, Trophy } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { db } from '../mocks/database';
import RecordProgressModal from '../components/RecordProgressModal.vue';
import confetti from 'canvas-confetti';
import { calcularNivel, calcularImpacto } from '../composables/useNivel';

const authStore = useAuthStore();
const isModalOpen = ref(false);
const showToast = ref(false);
const puntosGanados = ref(0);
const kilosRegistrados = ref(0);

// Kilos totales: prioriza el store (Supabase) o el mock
const totalKilos = computed(() =>
  authStore.user?.totalKilosReciclados ?? db.user.totalKilosReciclados
);
const nivelInfo  = computed(() => calcularNivel(totalKilos.value));
const impactoInfo = computed(() => calcularImpacto(totalKilos.value));

const diasTranscurridosCiclo = computed(() => {
  const activeCycle = db.ciclosCompostaje.find(c => c.estado === 'Activo');
  if (!activeCycle) return 0;
  
  const start = new Date(activeCycle.fechaInicio);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

const lastRecordDays = computed(() => {
  const activeCycle = db.ciclosCompostaje.find(c => c.estado === 'Activo');
  if (!activeCycle || activeCycle.avances.length === 0) return 7; // 7+ si no hay registros

  const lastDate = new Date(activeCycle.avances[activeCycle.avances.length - 1].fecha);
  const now = new Date();
  const diffTime = Math.abs(now - lastDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

const estadoCopiloto = computed(() => {
  const days = lastRecordDays.value;
  if (days <= 2) return 'bg-slate-100 text-slate-700 border border-slate-200';
  if (days <= 6) return 'bg-blue-50 text-blue-700 border border-blue-200';
  return 'bg-orange-50 text-orange-700 border border-orange-200';
});

const mensajeCopiloto = computed(() => {
  const days = lastRecordDays.value;
  if (days <= 2) return 'Todo en orden hoy 🌱. Déjalo descansar.';
  if (days <= 6) return 'Hora de oxigenar 🌬️. Ve a darle una revuelta rápida con la pala.';
  return '¡Toca revisión semanal! 📸 Toca abajo para registrar tu avance.';
});

const showSOS = () => {
  alert('Tranquilo, ve a la sección Aprende para solucionar problemas comunes 🚑');
};

const exportarGeoJSON = () => {
  const geojson = db.generarGeoJSON();
  console.log('--- GEOJSON GENERADO ---');
  console.log(JSON.stringify(geojson, null, 2));
  alert('GeoJSON generado. Revisa la consola del navegador.');
};

const isHarvestModalOpen = ref(false);
const showHarvestToast = ref(false);
const kilosCosechados = ref(0);

const hasActiveCycle = computed(() => {
  return db.ciclosCompostaje.some(c => c.estado === 'Activo');
});

const openHarvestModal = () => {
  if (!hasActiveCycle.value) return;
  
  if (diasTranscurridosCiclo.value < 60) {
    alert("Tu compost está en proceso biológico. Podrás cosecharlo después del día 60. 🌱");
    return;
  }
  
  isHarvestModalOpen.value = true;
};

const finishHarvest = (litros) => {
  const kilosEstimados = litros * 0.6;
  kilosCosechados.value = kilosEstimados.toFixed(1);
  
  const activeCycle = db.ciclosCompostaje.find(c => c.estado === 'Activo');
  if (activeCycle) {
    activeCycle.cosechaKilos = kilosEstimados;
    activeCycle.estado = 'Finalizado';
  }
  
  db.user.puntos += 100;
  
  isHarvestModalOpen.value = false;

  // 🎉 CONFETI
  confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b'] });
  setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5 }, angle: 60, colors: ['#10b981', '#ffffff'] }), 300);
  setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5 }, angle: 120, colors: ['#fbbf24', '#10b981'] }), 500);
  
  showHarvestToast.value = true;
  setTimeout(() => { showHarvestToast.value = false; }, 6000);
};

const onProgressSaved = ({ puntosOtorgados, kilosEstimados } = {}) => {
  puntosGanados.value   = puntosOtorgados ? 15 : 0;
  kilosRegistrados.value = kilosEstimados ?? 0;
  showToast.value = true;
  setTimeout(() => { showToast.value = false; }, 4500);
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}
</style>
