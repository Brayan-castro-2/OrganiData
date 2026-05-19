import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../mocks/database';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const user = ref(null);

  const login = (email, password) => {
    // Simulación de validación de credenciales
    if (email === 'vecino@pmontt.cl' && password === '1234') {
      isAuthenticated.value = true;
      user.value = db.user;
      return { success: true };
    }
    return { success: false, message: 'Credenciales inválidas' };
  };

  const logout = () => {
    isAuthenticated.value = false;
    user.value = null;
  };

  return {
    isAuthenticated,
    user,
    login,
    logout
  };
});
