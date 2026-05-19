<template>
  <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 flex justify-around items-center px-4 py-4 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.05)] rounded-t-2xl border-t border-slate-100">
    <router-link 
      v-for="tab in tabs" 
      :key="tab.id"
      :to="tab.path"
      custom
      v-slot="{ isActive, navigate }"
    >
      <button
        @click="navigate"
        class="flex flex-col items-center justify-center px-4 py-1.5 rounded-2xl transition-all duration-300"
        :class="isActive ? 'bg-emerald-50 text-emerald-600 scale-105' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'"
      >
        <component :is="tab.icon" :size="22" :stroke-width="isActive ? 2.5 : 1.8" />
        <span class="text-[10px] font-bold mt-1 uppercase tracking-wider" :class="isActive ? 'text-emerald-600' : 'text-slate-400'">{{ tab.label }}</span>
      </button>
    </router-link>
  </nav>
</template>

<script setup>
import { Home, History, BookOpen, Bell } from 'lucide-vue-next';

const tabs = [
  { id: "inicio", label: "Inicio", path: "/", icon: Home },
  { id: "historial", label: "Historial", path: "/historial", icon: History },
  { id: "aprende", label: "Aprende", path: "/aprende", icon: BookOpen },
  { id: "avisos", label: "Avisos", path: "/avisos", icon: Bell },
];
</script>
