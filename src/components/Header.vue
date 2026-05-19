<template>
  <header class="bg-white flex justify-between items-center px-6 py-4 w-full sticky top-0 z-40 border-b border-slate-100">
    <div class="flex items-center gap-3">
      <button @click="$emit('openProfile')" class="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-emerald-200 hover:border-emerald-400 transition-colors cursor-pointer">
        <img 
          alt="Avatar" 
          class="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
        />
      </button>
      <div>
        <h1 class="font-display text-lg text-emerald-800 font-bold leading-tight">Hola, {{ authStore.user?.name || 'Vecino' }} 👋</h1>
        <p class="text-xs text-slate-500 font-medium">Piloto OrganiData - P. Montt</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <router-link to="/avisos" class="w-10 h-10 flex items-center justify-center rounded-full text-emerald-600 hover:bg-slate-100 transition-colors relative">
        <Bell size="24" />
        <span v-if="hasNewAvisos" class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
      </router-link>
      <button @click="$emit('openProfile')" class="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors" title="Mi Perfil">
        <User size="20" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { Bell, User } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { db } from '../mocks/database';
import { computed } from 'vue';

defineEmits(['openProfile']);

const authStore = useAuthStore();

const hasNewAvisos = computed(() => {
  return db.avisosMuni.some(a => a.fecha === 'Hoy');
});
</script>
