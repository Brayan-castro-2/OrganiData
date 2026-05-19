<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-slate-900/60 z-[60] backdrop-blur-sm" @click="$emit('close')"></div>
  </Transition>

  <Transition name="slide-up">
    <div v-if="isOpen" class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-[2rem] z-[70] flex flex-col h-[85vh] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
      
      <div class="w-full pt-3 pb-2 flex justify-center shrink-0">
        <div class="w-12 h-1.5 bg-slate-200 rounded-full"></div>
      </div>

      <div class="px-6 pb-4 flex justify-between items-center border-b border-slate-100 shrink-0">
        <h2 class="font-display text-xl font-bold text-slate-800">Registrar Avance 📸</h2>
        <button @click="$emit('close')" class="p-2 rounded-full hover:bg-slate-100 text-slate-500">
          <X size="24" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 pb-32">
        <section v-if="activeCycles.length > 1" class="flex flex-col gap-2 relative">
          <label class="font-bold text-sm text-slate-800">¿A qué compostera pertenece este avance?</label>
          <select 
            v-model="selectedCycleId"
            class="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold p-4 rounded-xl focus:outline-none focus:border-emerald-500"
          >
            <option v-for="cycle in activeCycles" :key="cycle.id" :value="cycle.id">
              {{ cycle.nombrePersonalizado }} ({{ cycle.id }})
            </option>
          </select>
        </section>

        <section class="flex flex-col gap-2 relative">
          <!-- Input nativo oculto -->
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            class="hidden" 
            ref="cameraInput"
            @change="onPhotoTaken"
          >
          
          <button 
            @click="cameraInput.click()"
            class="w-full border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl flex flex-col items-center justify-center hover:bg-slate-100 transition-colors relative overflow-hidden"
            :class="photoUrl ? 'p-0 h-48 border-emerald-400 border-solid' : 'py-10 gap-2'"
          >
            <template v-if="photoUrl">
              <img :src="photoUrl" class="w-full h-full object-cover" alt="Foto del compost" />
              <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span class="text-white font-bold bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
                  <Camera size="16" /> Retomar foto
                </span>
              </div>
            </template>
            <template v-else>
              <Camera size="32" class="text-slate-300" />
              <span class="font-medium text-sm text-slate-400">📸 Toca aquí para subir una foto</span>
              <span class="text-xs text-slate-300 font-medium">(Opcional)</span>
            </template>
          </button>
        </section>

        <section class="flex flex-col gap-3">
          <h3 class="font-bold text-sm text-slate-800">1. ¿Cuánta comida echaste esta semana?</h3>
          <!-- Stepper Principal -->
          <div class="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
            <button 
              @click="decrementar"
              class="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-all shadow-sm font-bold text-xl"
            >−</button>
            <div class="flex items-center gap-1.5">
              <input 
                type="number" 
                v-model.number="kilosAportados" 
                min="0" 
                step="0.5"
                class="bg-transparent text-center text-3xl font-extrabold text-slate-800 w-20 outline-none focus:ring-0"
              />
              <span class="text-lg font-bold text-slate-400">Kg</span>
            </div>
            <button 
              @click="incrementar"
              class="w-12 h-12 rounded-lg bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all shadow-sm font-bold text-xl"
            >+</button>
          </div>
          <!-- Botones de Referencia Rápida -->
          <div class="flex flex-col gap-1">
            <p class="text-[11px] text-slate-400 font-medium">Ejemplos rápidos:</p>
            <div class="flex gap-2">
              <button @click="setKilos(1)"   class="flex-1 bg-emerald-50 text-emerald-700 text-xs font-bold py-1.5 px-2 rounded-lg hover:bg-emerald-100 transition-colors">🥣 Tazón (1 Kg)</button>
              <button @click="setKilos(2.5)" class="flex-1 bg-emerald-50 text-emerald-700 text-xs font-bold py-1.5 px-2 rounded-lg hover:bg-emerald-100 transition-colors">🥘 Olla (2.5 Kg)</button>
              <button @click="setKilos(5)"   class="flex-1 bg-emerald-50 text-emerald-700 text-xs font-bold py-1.5 px-2 rounded-lg hover:bg-emerald-100 transition-colors">🪣 Balde (5 Kg)</button>
            </div>
          </div>
        </section>


        <section class="flex flex-col gap-4">
          <h3 class="font-bold text-sm text-slate-800">2. ¿Cómo huele hoy?</h3>
          <div class="flex flex-col gap-2">
            <button 
              @click="selectedOlor = 'normal'"
              :class="['w-full flex items-center justify-between p-4 rounded-xl text-left font-bold transition-all', selectedOlor === 'normal' ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-800' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50']"
            >
              <span>A tierra húmeda (Normal)</span>
              <CheckCircle2 v-if="selectedOlor === 'normal'" size="24" class="text-emerald-500 fill-emerald-100" />
            </button>
            <button 
              @click="selectedOlor = 'podrido'"
              :class="['w-full flex items-center justify-between p-4 rounded-xl text-left font-bold transition-all', selectedOlor === 'podrido' ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-800' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50']"
            >
              <span>A podrido o basura</span>
              <CheckCircle2 v-if="selectedOlor === 'podrido'" size="24" class="text-emerald-500 fill-emerald-100" />
            </button>
            <button 
              @click="selectedOlor = 'amoniaco'"
              :class="['w-full flex items-center justify-between p-4 rounded-xl text-left font-bold transition-all', selectedOlor === 'amoniaco' ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-800' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50']"
            >
              <span>A amoníaco</span>
              <CheckCircle2 v-if="selectedOlor === 'amoniaco'" size="24" class="text-emerald-500 fill-emerald-100" />
            </button>
          </div>
        </section>

        <section class="flex flex-col gap-4 mb-8">
          <h3 class="font-bold text-sm text-slate-800">3. Nivel de humedad</h3>
          <div class="grid grid-cols-2 gap-4">
            <button 
              @click="selectedHumedad = 'seco'"
              :class="['flex flex-col items-center justify-center p-6 rounded-xl transition-all gap-2', selectedHumedad === 'seco' ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-800' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50']"
            >
              <Droplets size="24" class="text-emerald-500" />
              <span class="font-bold text-sm">Muy seco</span>
            </button>
            <button 
              @click="selectedHumedad = 'mojado'"
              :class="['flex flex-col items-center justify-center p-6 rounded-xl transition-all gap-2', selectedHumedad === 'mojado' ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-800' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50']"
            >
              <Waves size="24" class="text-emerald-500" />
              <span class="font-bold text-sm text-center">Muy mojado/barro</span>
            </button>
          </div>
        </section>
      </div>

      <div class="absolute bottom-0 left-0 w-full p-6 bg-white/90 border-t border-slate-100 backdrop-blur-md">
        <button 
          @click="() => { if (navigator.vibrate) navigator.vibrate(50); save(); }"
          :disabled="!selectedOlor || !selectedHumedad || kilosAportados <= 0"
          :class="['w-full font-bold text-lg py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2', (!selectedOlor || !selectedHumedad || kilosAportados <= 0) ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98]']"
        >
          Guardar Registro
          <Save size="20" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { X, Camera, CheckCircle2, Droplets, Waves, Save } from 'lucide-vue-next';
import { db } from '../mocks/database';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'saved']);

const selectedOlor = ref(null);
const selectedHumedad = ref(null);
const kilosAportados = ref(1);
const cameraInput = ref(null);
const photoUrl = ref(null);

const incrementar = () => { kilosAportados.value = Math.round((kilosAportados.value + 0.5) * 10) / 10; };
const decrementar = () => { kilosAportados.value = Math.max(0, Math.round((kilosAportados.value - 0.5) * 10) / 10); };
const setKilos = (val) => { kilosAportados.value = val; };

const activeCycles = computed(() => db.ciclosCompostaje.filter(c => c.estado === 'Activo'));
const selectedCycleId = ref(null);

// Manejar la foto
const onPhotoTaken = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (photoUrl.value) {
      URL.revokeObjectURL(photoUrl.value); // Limpiar URL anterior
    }
    photoUrl.value = URL.createObjectURL(file);
  }
};

// Reset options when modal closes
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (activeCycles.value.length > 0) {
      selectedCycleId.value = activeCycles.value[0].id;
    }
  } else {
    setTimeout(() => {
      selectedOlor.value = null;
      selectedHumedad.value = null;
      kilosAportados.value = 1;
      if (photoUrl.value) {
        URL.revokeObjectURL(photoUrl.value);
        photoUrl.value = null;
      }
    }, 300); // wait for animation
  }
});

const save = () => {
  if (!selectedOlor.value || !selectedHumedad.value || kilosAportados.value <= 0) return;
  
  const result = db.saveRegistro({ 
    olor: selectedOlor.value, 
    humedad: selectedHumedad.value,
    foto: photoUrl.value,
    kilosAñadidos: kilosAportados.value
  }, selectedCycleId.value);
  
  emit('saved', result.puntosOtorgados);
  emit('close');
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
