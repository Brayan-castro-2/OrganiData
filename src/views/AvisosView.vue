<template>
  <main class="px-6 py-6 flex flex-col gap-6">
    <section class="flex flex-col gap-2">
      <h2 class="font-display text-2xl font-extrabold text-slate-800">Avisos 📢</h2>
      <p class="text-sm font-medium text-slate-500">Comunicaciones oficiales del piloto</p>
    </section>

    <section class="flex flex-col gap-4">
      <div 
        v-for="aviso in db.avisosMuni" 
        :key="aviso.id"
        class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex gap-4 items-start transition-all hover:shadow-md"
      >
        <div class="mt-1 shrink-0">
          <div 
            :class="['w-3 h-3 rounded-full', aviso.fecha === 'Hoy' ? 'bg-emerald-500 shadow-sm shadow-emerald-300 animate-pulse' : 'bg-slate-300']"
          ></div>
        </div>
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex justify-between items-start">
            <h3 class="text-sm font-bold text-slate-800 leading-tight">{{ aviso.titulo }}</h3>
            <span 
              :class="['text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ml-2', aviso.fecha === 'Hoy' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400']"
            >
              {{ aviso.fecha }}
            </span>
          </div>
          <p class="text-sm text-slate-500 leading-relaxed">{{ aviso.mensaje }}</p>
        </div>
      </div>
    </section>

    <section v-if="db.avisosMuni.length === 0" class="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 flex flex-col items-center justify-center text-center gap-4">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
        <BellOff size="32" class="text-slate-300" />
      </div>
      <p class="text-slate-500 font-medium">No hay avisos municipales por ahora.</p>
    </section>
  </main>
</template>

<script setup>
import { BellOff } from 'lucide-vue-next';
import { db } from '../mocks/database';
</script>
