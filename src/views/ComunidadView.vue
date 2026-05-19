<template>
  <main class="px-6 py-6 flex flex-col gap-6">
    <section class="flex flex-col gap-2">
      <h2 class="font-display text-2xl font-extrabold text-slate-800">Comunidad 🏆</h2>
      <p class="text-sm font-medium text-slate-500">Ranking del Piloto OrganiData - Puerto Montt</p>
    </section>

    <!-- Tabs -->
    <div class="flex bg-slate-100 rounded-xl p-1 gap-1">
      <button 
        @click="activeTab = 'vecinos'"
        :class="['flex-1 py-2.5 rounded-lg text-sm font-bold transition-all', activeTab === 'vecinos' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
      >
        Top Vecinos
      </button>
      <button 
        @click="activeTab = 'sectores'"
        :class="['flex-1 py-2.5 rounded-lg text-sm font-bold transition-all', activeTab === 'sectores' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
      >
        Liga de Sectores
      </button>
    </div>

    <!-- TAB A: Top Vecinos -->
    <section v-if="activeTab === 'vecinos'" class="flex flex-col gap-4">
      <!-- Podio Top 3 -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-end justify-center gap-3 mb-6">
          <!-- 2do lugar -->
          <div class="flex flex-col items-center gap-2">
            <span class="text-3xl">{{ db.rankingVecinos[1]?.avatar }}</span>
            <div class="w-20 bg-slate-100 rounded-xl flex flex-col items-center justify-center pt-8 pb-3 relative">
              <span class="absolute -top-3 text-2xl">🥈</span>
              <span class="text-xs font-bold text-slate-600 text-center leading-tight">{{ db.rankingVecinos[1]?.nombre }}</span>
              <span class="text-xs font-extrabold text-slate-800 mt-1">{{ db.rankingVecinos[1]?.puntos }}pts</span>
            </div>
          </div>
          <!-- 1er lugar -->
          <div class="flex flex-col items-center gap-2 -mt-4">
            <span class="text-4xl">{{ db.rankingVecinos[0]?.avatar }}</span>
            <div class="w-24 bg-amber-50 border-2 border-amber-200 rounded-xl flex flex-col items-center justify-center pt-10 pb-3 relative shadow-sm">
              <span class="absolute -top-4 text-3xl">🥇</span>
              <span class="text-xs font-bold text-amber-800 text-center leading-tight">{{ db.rankingVecinos[0]?.nombre }}</span>
              <span class="text-sm font-extrabold text-amber-900 mt-1">{{ db.rankingVecinos[0]?.puntos }}pts</span>
            </div>
          </div>
          <!-- 3er lugar -->
          <div class="flex flex-col items-center gap-2 mt-2">
            <span class="text-3xl">{{ db.rankingVecinos[2]?.avatar }}</span>
            <div :class="['w-20 rounded-xl flex flex-col items-center justify-center pt-8 pb-3 relative', db.rankingVecinos[2]?.isCurrentUser ? 'bg-emerald-50 border-2 border-emerald-300' : 'bg-orange-50']">
              <span class="absolute -top-3 text-2xl">🥉</span>
              <span :class="['text-xs font-bold text-center leading-tight', db.rankingVecinos[2]?.isCurrentUser ? 'text-emerald-700' : 'text-slate-600']">
                {{ db.rankingVecinos[2]?.nombre }}
                <span v-if="db.rankingVecinos[2]?.isCurrentUser" class="text-[9px] block text-emerald-500">(Tú)</span>
              </span>
              <span class="text-xs font-extrabold text-slate-800 mt-1">{{ db.rankingVecinos[2]?.puntos }}pts</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista restante -->
      <div class="flex flex-col gap-2">
        <div 
          v-for="(v, i) in db.rankingVecinos.slice(3)" 
          :key="v.id"
          :class="['flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border transition-all', v.isCurrentUser ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200']"
        >
          <span class="text-lg font-extrabold text-slate-400 w-6 text-center">{{ i + 4 }}</span>
          <span class="text-2xl">{{ v.avatar }}</span>
          <div class="flex-1">
            <span class="text-sm font-bold text-slate-800">{{ v.nombre }} <span v-if="v.isCurrentUser" class="text-emerald-500 text-xs">(Tú)</span></span>
            <p class="text-xs text-slate-500">{{ v.sector }}</p>
          </div>
          <span class="text-sm font-extrabold text-emerald-600">{{ v.puntos }} pts</span>
        </div>
      </div>
    </section>

    <!-- TAB B: Liga de Sectores -->
    <section v-if="activeTab === 'sectores'" class="flex flex-col gap-4">
      <div 
        v-for="(s, i) in db.rankingSectores" 
        :key="s.sector"
        :class="['bg-white rounded-2xl p-5 shadow-sm border transition-all', s.isUserSector ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-slate-200']"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="text-xl">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉' }}</span>
            <div>
              <span class="text-sm font-bold text-slate-800">{{ s.sector }}</span>
              <span v-if="s.isUserSector" class="ml-2 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full">Tu sector</span>
              <p class="text-xs text-slate-500">{{ s.vecinos }} vecinos activos</p>
            </div>
          </div>
          <span class="text-lg font-extrabold" :style="{ color: s.color }">{{ s.puntosTotales }}</span>
        </div>
        <!-- Barra de progreso -->
        <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-700 ease-out"
            :style="{ width: (s.puntosTotales / maxSectorPoints * 100) + '%', backgroundColor: s.color }"
          ></div>
        </div>
      </div>

      <!-- Medallas comunales -->
      <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
        <h3 class="font-bold text-sm text-amber-800 mb-3 flex items-center gap-2">
          <Trophy size="16" class="text-amber-600" />
          Medallas de tu Comuna
        </h3>
        <div class="flex gap-3">
          <div 
            v-for="m in db.medallasComunales" 
            :key="m.id"
            class="flex-1 bg-white/70 rounded-xl p-3 text-center border border-amber-100"
          >
            <span class="text-2xl block">{{ m.icono }}</span>
            <p class="text-xs font-bold text-amber-800 mt-1">{{ m.nombre }}</p>
            <p class="text-[10px] text-amber-600 mt-0.5">{{ m.descripcion }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Trophy } from 'lucide-vue-next';
import { db } from '../mocks/database';

const activeTab = ref('vecinos');

const maxSectorPoints = computed(() => {
  return Math.max(...db.rankingSectores.map(s => s.puntosTotales));
});
</script>
