<template>
  <div class="min-h-screen pb-32 max-w-md mx-auto relative bg-slate-50 shadow-2xl font-sans" v-if="authStore.isAuthenticated">
    <Header @openProfile="isProfileOpen = true" />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <BottomNav />
    <ProfileModal :isOpen="isProfileOpen" @close="isProfileOpen = false" />
  </div>
  <div v-else class="font-sans">
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import Header from './components/Header.vue';
import BottomNav from './components/BottomNav.vue';
import ProfileModal from './components/ProfileModal.vue';

const authStore = useAuthStore();
const isProfileOpen = ref(false);

onMounted(async () => {
  await authStore.init();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
