<template>
  <main class="px-6 py-6 flex flex-col gap-6 relative">
    <section class="flex justify-between items-end gap-2">
      <div>
        <h2 class="font-display text-2xl font-extrabold text-slate-800">Mi Compostaje ♻️</h2>
        <p class="text-sm font-medium text-slate-500">Trazabilidad por ciclos</p>
      </div>
      <button 
        @click="showNewCicloModal = true"
        class="bg-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-200 transition-colors shrink-0"
      >
        <Plus size="18" />
        Nuevo
      </button>
    </section>

    <section v-if="db.ciclosCompostaje.length === 0" class="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 flex flex-col items-center justify-center text-center gap-4">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
        <Box size="32" class="text-slate-300" />
      </div>
      <p class="text-slate-500 font-medium">Aún no tienes composteras registradas. ¡Inicia un nuevo ciclo!</p>
    </section>

    <section v-else class="flex flex-col gap-4 pb-20">
      <div 
        v-for="ciclo in db.ciclosCompostaje" 
        :key="ciclo.id"
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all"
        :class="activeCiclo === ciclo.id ? 'ring-2 ring-emerald-500/20' : ''"
      >
        <!-- Card Header (Always visible) -->
        <button 
          @click="toggleCiclo(ciclo.id)"
          class="w-full p-4 flex flex-col gap-3 hover:bg-slate-50 transition-colors text-left"
        >
          <div class="flex justify-between items-start w-full gap-2">
            <h3 class="font-bold text-slate-800 text-lg leading-tight">{{ ciclo.nombrePersonalizado }}</h3>
            <span 
              :class="['text-[10px] font-bold px-2 py-1 rounded-full shrink-0', ciclo.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500']"
            >
              {{ ciclo.estado }}
            </span>
          </div>
          <div class="flex justify-between items-center w-full">
            <span class="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{{ ciclo.id }}</span>
            <div class="flex items-center gap-1 text-xs font-bold text-slate-400">
              <Calendar size="12" />
              <span>Inicio: {{ formatDate(ciclo.fechaInicio) }}</span>
            </div>
          </div>
          <div v-if="kilosAcumulados(ciclo) > 0" class="flex items-center gap-1.5 w-full">
            <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              🌱 {{ kilosAcumulados(ciclo).toFixed(1) }} Kg de residuos aportados
            </span>
          </div>
        </button>

        <!-- Timeline Details (Expandable) -->
        <div v-if="activeCiclo === ciclo.id" class="px-4 pb-4 border-t border-slate-100 bg-slate-50 pt-4">
          
          <!-- 🗓️ Mapa del Progreso (Duolingo-style) -->
          <div class="mb-4">
            <p class="text-xs font-bold text-slate-700 mb-3">📅 Mapa del Progreso</p>
            <div class="flex flex-wrap gap-1.5">
              <div
                v-for="dia in mapaCiclo(ciclo)"
                :key="dia.numeroDia"
                :title="`Día ${dia.numeroDia}`"
                :class="[
                  'w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-all',
                  dia.tipo === 'con_avance'  ? 'bg-emerald-500 text-white shadow-sm' :
                  dia.tipo === 'transcurrido' ? 'bg-emerald-100 text-emerald-700' :
                                               'bg-slate-100 text-slate-300 border border-dashed border-slate-200'
                ]"
              >
                <span v-if="dia.tipo === 'con_avance'">★</span>
                <span v-else>{{ dia.numeroDia }}</span>
              </div>
            </div>
            <!-- Leyenda -->
            <div class="flex gap-4 mt-3 flex-wrap">
              <span class="flex items-center gap-1 text-[10px] text-slate-500 font-medium"><span class="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>Con registro</span>
              <span class="flex items-center gap-1 text-[10px] text-slate-500 font-medium"><span class="w-3 h-3 rounded-sm bg-emerald-100 inline-block"></span>Transcurrido</span>
              <span class="flex items-center gap-1 text-[10px] text-slate-500 font-medium"><span class="w-3 h-3 rounded-sm bg-slate-100 border border-dashed border-slate-300 inline-block"></span>Restante</span>
            </div>
            <!-- Texto dinámico -->
            <p class="text-xs font-medium text-slate-500 mt-2 leading-relaxed">
              Llevas <strong class="text-emerald-600">{{ diasTranscurridos(ciclo) }} días</strong> compostando.
              Faltan aprox. <strong class="text-slate-700">{{ Math.max(0, 60 - diasTranscurridos(ciclo)) }} días</strong> para tu cosecha de abono certificado.
            </p>
          </div>

          <div v-if="ciclo.avances.length === 0" class="text-center py-4">
            <p class="text-xs font-bold text-slate-400">Sin avances registrados aún.</p>
          </div>
          <div v-else class="relative border-l-2 border-slate-200 ml-3 pl-6 py-2 flex flex-col gap-6">
            <div 
              v-for="(avance, i) in [...ciclo.avances].reverse()" 
              :key="i"
              class="relative"
            >
              <!-- Timeline dot -->
              <div class="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-4 ring-emerald-50"></div>
              
              <div class="bg-white rounded-xl p-3 shadow-sm border border-slate-200">
                <span class="text-xs font-bold text-emerald-600 block mb-1">{{ formatDate(avance.fecha) }}</span>
                <div class="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Olor</p>
                    <p class="text-sm font-semibold text-slate-700 capitalize">{{ avance.olor }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Humedad</p>
                    <p class="text-sm font-semibold text-slate-700 capitalize">{{ avance.humedad }}</p>
                  </div>
                </div>
                <div v-if="avance.kilosAñadidos" class="mt-2 pt-2 border-t border-slate-100">
                  <span class="text-[10px] font-bold text-emerald-600">🌱 +{{ avance.kilosAñadidos }} Kg residuos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Modal Nuevo Ciclo -->
    <Transition name="fade">
      <div v-if="showNewCicloModal" class="fixed inset-0 bg-slate-900/60 z-50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl flex flex-col gap-4">
          <h3 class="font-display text-xl font-bold text-slate-800">Nuevo Ciclo</h3>
          <p class="text-sm text-slate-500 font-medium mb-2">Dale un nombre a tu nueva compostera o lote.</p>
          
          <input 
            v-model="newCicloName"
            type="text" 
            placeholder="Ej: Balde Cocina" 
            class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          >

          <div class="flex gap-3 mt-4">
            <button 
              @click="showNewCicloModal = false"
              class="flex-1 font-bold py-3 text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              @click="createNewCiclo"
              :disabled="!newCicloName.trim()"
              class="flex-1 font-bold py-3 text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Empezar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { Box, Calendar, Plus } from 'lucide-vue-next';
import { db } from '../mocks/database';

const activeCiclo = ref(null);
const showNewCicloModal = ref(false);
const newCicloName = ref('');

const toggleCiclo = (id) => {
  activeCiclo.value = activeCiclo.value === id ? null : id;
};

const kilosAcumulados = (ciclo) => {
  return ciclo.avances.reduce((sum, a) => sum + (a.kilosAñadidos || 0), 0);
};

const diasTranscurridos = (ciclo) => {
  const start = new Date(ciclo.fechaInicio);
  const end = ciclo.estado === 'Finalizado' && ciclo.fechaFin ? new Date(ciclo.fechaFin) : new Date();
  return Math.max(0, Math.floor((end - start) / (1000 * 60 * 60 * 24)));
};

const mapaCiclo = (ciclo) => {
  const totalDias = 60;
  const transcurridos = diasTranscurridos(ciclo);

  // Obtener fechas que tienen avance (normalizadas a YYYY-MM-DD)
  const fechasConAvance = new Set(
    ciclo.avances.map(a => {
      const d = new Date(a.fecha);
      return isNaN(d) ? null : d.toISOString().slice(0, 10);
    }).filter(Boolean)
  );

  const inicio = new Date(ciclo.fechaInicio);

  return Array.from({ length: totalDias }, (_, i) => {
    const numeroDia = i + 1;
    const fechaDia = new Date(inicio);
    fechaDia.setDate(inicio.getDate() + i);
    const fechaStr = fechaDia.toISOString().slice(0, 10);

    let tipo = 'futuro';
    if (numeroDia <= transcurridos) {
      tipo = fechasConAvance.has(fechaStr) ? 'con_avance' : 'transcurrido';
    }
    return { numeroDia, tipo };
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr; // Retorna el string si no es formato ISO (ej. '10/04/2026')
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const createNewCiclo = () => {
  if (!newCicloName.value.trim()) return;
  
  const newId = `LOTE-${String(db.ciclosCompostaje.length + 1).padStart(3, '0')}`;
  
  db.ciclosCompostaje.unshift({
    id: newId,
    nombrePersonalizado: newCicloName.value.trim(),
    fechaInicio: new Date().toISOString(),
    estado: 'Activo',
    avances: []
  });
  
  newCicloName.value = '';
  showNewCicloModal.value = false;
  activeCiclo.value = newId; // Abre el nuevo ciclo creado
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
