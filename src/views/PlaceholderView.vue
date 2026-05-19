<template>
  <main class="flex flex-col items-center justify-center h-[70vh] px-10 text-center gap-4">
    <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-emerald-500/20">
      <Info size="48" />
    </div>
    <h2 class="font-display text-xl font-extrabold text-slate-800">{{ title }}</h2>
    <p class="text-sm font-medium text-slate-500 leading-relaxed">Esta sección estará disponible próximamente en el piloto OrganiData.</p>
  </main>
</template>

<script setup>
import { Info } from 'lucide-vue-next';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const title = computed(() => {
  if (route.path === '/historial') return 'Historial de Avances';
  if (route.path === '/avisos') return 'Avisos Municipales';
  return 'Próximamente';
});
</script>
