<template>
  <main class="px-6 py-6 flex flex-col gap-6 relative">
    <section class="flex flex-col gap-2">
      <h2 class="font-display text-2xl font-extrabold text-slate-800">Aprende 🌱</h2>
      <p class="text-sm font-medium text-slate-500">Conviértete en un experto del compostaje</p>
    </section>

    <!-- Desafío del Día -->
    <section>
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none" />
        <h3 class="font-display text-lg text-emerald-600 font-bold mb-4 flex items-center gap-2">
          <span>💡</span> Desafío del Día
        </h3>
        <p class="text-base font-extrabold text-slate-800 mb-6 leading-tight">
          {{ currentChallenge.q }}
        </p>
        <div class="flex flex-col gap-2">
          <button 
            v-for="(opt, i) in currentChallenge.opts"
            :key="i"
            @click="answerTrivia(i)"
            :disabled="triviaAnswered"
            :class="[
              'w-full text-left font-bold py-3 px-5 rounded-full transition-all text-sm border flex justify-between items-center',
              triviaAnswer === i && i === currentChallenge.correct
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                : triviaAnswer === i && i !== currentChallenge.correct
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : triviaAnswered
                    ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed opacity-60'
                    : 'bg-slate-50 text-slate-800 border-slate-100 hover:bg-slate-100'
            ]"
          >
            <span>{{ opt }}</span>
            <CheckCircle2 v-if="triviaAnswer === i && i === currentChallenge.correct" size="18" fill="white" class="text-emerald-300" />
            <XCircle v-else-if="triviaAnswer === i" size="18" class="text-red-500" />
          </button>
        </div>
        <Transition name="fade-in">
          <div v-if="triviaAnswered && triviaAnswer !== currentChallenge.correct" class="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm font-medium text-red-700 flex items-start gap-2">
            <XCircle size="18" class="shrink-0 mt-0.5" />
            <span>Incorrecto. Revisa la Guía Interactiva para encontrar la respuesta ↓</span>
          </div>
          <div v-else-if="triviaAnswered" class="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm font-bold text-emerald-700 flex items-start gap-2">
            <CheckCircle2 size="18" class="shrink-0 mt-0.5" />
            <span>¡Correcto! Ganaste 10 puntos 🌱</span>
          </div>
        </Transition>
      </div>
    </section>

    <!-- Cápsulas Rápidas -->
    <section>
      <h3 class="font-display text-lg font-bold text-slate-800 mb-4">Cápsulas Rápidas</h3>
      <div class="flex overflow-x-auto gap-4 pb-4 snap-x -mx-6 px-6" style="scrollbar-width: none;">
        <button 
          v-for="(capsule, i) in capsules" 
          :key="i"
          @click="openCapsule(capsule.moduleId)"
          class="snap-center shrink-0 w-[150px] aspect-square bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between items-start transition-all hover:bg-emerald-50 hover:border-emerald-200 group"
        >
          <div class="p-3 bg-slate-50 rounded-full group-hover:bg-emerald-50 transition-colors">
            <component :is="capsule.icon" size="24" class="text-emerald-600" />
          </div>
          <span class="text-sm font-bold text-slate-800 leading-tight text-left">{{ capsule.label }}</span>
        </button>
      </div>
    </section>

    <!-- Guía Interactiva Oficial -->
    <section>
      <h3 class="font-display text-lg font-bold text-slate-800 mb-4">Guía Interactiva Oficial</h3>
      <div class="flex flex-col gap-3">
        <div 
          v-for="modulo in modulosCompostaje" 
          :key="modulo.id"
          :id="`modulo-${modulo.id}`"
          class="rounded-2xl shadow-sm border transition-all overflow-hidden"
          :class="activeModule === modulo.id ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'"
        >
          <button 
            @click="toggleModule(modulo.id)"
            class="w-full p-4 flex justify-between items-center text-left"
          >
            <span class="text-sm font-semibold text-slate-800">{{ modulo.titulo }}</span>
            <ChevronUp v-if="activeModule === modulo.id" size="20" class="text-emerald-500 shrink-0" />
            <ChevronDown v-else size="20" class="text-slate-400 shrink-0" />
          </button>
          
          <div 
            v-if="activeModule === modulo.id"
            class="px-4 pb-4 border-t border-emerald-100/50 mt-1 pt-3"
          >
            <p class="text-sm text-slate-600 mb-3">{{ modulo.descripcion }}</p>
            <ul class="flex flex-col gap-2">
              <li 
                v-for="(punto, i) in modulo.puntosClave" 
                :key="i"
                class="flex items-start gap-2 text-sm text-slate-600"
              >
                <CheckCircle2 size="16" class="text-emerald-500 shrink-0 mt-0.5" />
                <span>{{ punto }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Documentos Oficiales -->
    <section>
      <h3 class="font-display text-lg font-bold text-slate-800 mb-4">Documentos Oficiales</h3>
      <div class="flex flex-col gap-3">
        <a 
          href="/Guia-Compostaje-Domiciliario.pdf" 
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
             <span class="text-red-500 font-black text-xs">PDF</span>
          </div>
          <span class="text-sm font-bold text-slate-800 flex-1 leading-tight">Manual de Compostaje Domiciliario (MMA)</span>
          <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
            <Download size="18" class="text-emerald-600" />
          </div>
        </a>
      </div>
    </section>

    <!-- Preguntas Frecuentes -->
    <section class="mb-20">
      <h3 class="font-display text-lg font-bold text-slate-800 mb-4">Preguntas Frecuentes</h3>
      <div class="flex flex-col gap-3">
        <div 
          v-for="(faq, i) in faqs" 
          :key="i"
          class="bg-white rounded-2xl shadow-sm border overflow-hidden transition-all"
          :class="activeFaq === i ? 'border-emerald-200' : 'border-slate-200'"
        >
          <button 
            @click="activeFaq = activeFaq === i ? null : i"
            class="w-full p-5 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
          >
            <span class="text-sm font-bold text-slate-800">{{ faq.q }}</span>
            <ChevronUp v-if="activeFaq === i" size="20" class="text-emerald-500 shrink-0" />
            <ChevronDown v-else size="20" class="text-slate-400 shrink-0" />
          </button>
          <div v-if="activeFaq === i" class="px-5 pb-5 border-t border-emerald-100 pt-3">
            <p class="text-sm text-slate-600 leading-relaxed">{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Toast de puntos -->
    <Transition name="toast">
      <div v-if="showPointsToast" class="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-4 w-[90%] max-w-sm">
        <div class="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shrink-0">
          <Star size="20" class="fill-white text-white" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-bold text-white leading-tight">¡Respuesta correcta!</p>
          <p class="text-xs font-medium text-slate-300 mt-0.5">
            <span class="text-amber-400 font-bold">+10 pts</span>
            · Total: <span class="text-white font-bold">{{ db.user.puntos }} pts</span>
          </p>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { CheckCircle2, XCircle, Info, Droplets, Wind, Download, ChevronDown, ChevronUp, Star } from 'lucide-vue-next';
import { db, modulosCompostaje } from '../mocks/database';

// ─── BANCO DE DESAFÍOS (20 preguntas rotatorias) ───────────────────────
const allChallenges = [
  { q: '¿Qué debes hacer si tu compost huele a amoníaco?', opts: ['Agregar agua', 'Agregar material seco (cartón)'], correct: 1 },
  { q: '¿Cuál de estos SÍ puedes echar al compost?', opts: ['Huesos de pollo', 'Cáscaras de huevo'], correct: 1 },
  { q: '¿Qué ratio de materiales usa la "regla de oro"?', opts: ['1 verde : 1 café', '3 verdes : 1 café'], correct: 0 },
  { q: '¿Por qué NO debes poner lácteos en el compost?', opts: ['Atraen plagas y malos olores', 'Son muy nutritivos para las plantas'], correct: 0 },
  { q: '¿Qué señal indica que tu compost ya está listo?', opts: ['Huele a tierra húmeda de bosque', 'Huele a frutas fermentadas'], correct: 0 },
  { q: '¿Dónde conviene ubicar tu compostera?', opts: ['Sobre el cemento al sol directo', 'Con sombra y sobre la tierra'], correct: 1 },
  { q: '¿Cuántos centímetros de ramas debes poner en la base?', opts: ['15 a 20 cm', '1 a 2 cm'], correct: 0 },
  { q: '¿Qué material sirve para oxigenar si el compost está muy húmedo?', opts: ['Más verduras', 'Cartón o aserrín'], correct: 1 },
  { q: 'El color de un compost listo debe ser...', opts: ['Café muy oscuro, casi negro', 'Marrón claro anaranjado'], correct: 0 },
  { q: '¿Qué microorganismos ayudan al compostaje?', opts: ['Solo bacterias con calor', 'Bacterias, hongos y lombrices'], correct: 1 },
  { q: '¿Cuánto tiempo tarda aprox. un compost domiciliario?', opts: ['1 semana', 'Entre 3 y 6 meses'], correct: 1 },
  { q: '¿Puedes echar heces de perros al compost?', opts: ['Sí, son materia orgánica', 'No, contienen patógenos'], correct: 1 },
  { q: '¿Qué ocurre si el compost está muy seco y frío?', opts: ['Avanza más rápido', 'Falta humedad y actividad biológica'], correct: 1 },
  { q: '¿Qué capa debes poner SIEMPRE encima de los restos de cocina?', opts: ['Más restos de cocina', 'Material seco (hojas, cartón)'], correct: 1 },
  { q: '¿Para qué sirve revolver (voltear) el compost?', opts: ['Para que se vea ordenado', 'Para oxigenar y acelerar la descomposición'], correct: 1 },
  { q: '¿Cuál es el beneficio principal del compost para la tierra?', opts: ['La hace más pesada', 'Aporta nutrientes y mejora la estructura'], correct: 1 },
  { q: '¿Cuál de estos es material VERDE (nitrógeno)?', opts: ['Hojas secas caídas', 'Borra de café usada'], correct: 1 },
  { q: '¿Cuál de estos es material CAFÉ (carbono)?', opts: ['Cáscaras de naranja', 'Cartón sin tinta picado'], correct: 1 },
  { q: '¿Qué gases se reducen gracias al compostaje domiciliario?', opts: ['Oxígeno y nitrógeno', 'Metano y CO₂ de vertederos'], correct: 1 },
  { q: '¿Qué tipo de textura tiene el compost maduro listo para usar?', opts: ['Fibroso y se ven los alimentos', 'Tierra homogénea sin restos reconocibles'], correct: 1 },
];

// Seleccionar el desafío del día basado en el día del año
const dayIndex = computed(() => new Date().getDay() + new Date().getDate() % allChallenges.length);
const currentChallenge = computed(() => allChallenges[dayIndex.value % allChallenges.length]);

const triviaAnswer = ref(null);
const triviaAnswered = ref(false);
const showPointsToast = ref(false);

const answerTrivia = (optionIndex) => {
  if (triviaAnswered.value) return;
  triviaAnswer.value = optionIndex;
  triviaAnswered.value = true;
  if (optionIndex === currentChallenge.value.correct) {
    db.user.puntos += 10;
    showPointsToast.value = true;
    setTimeout(() => { showPointsToast.value = false; }, 3000);
  }
};

// ─── ACORDEÓN GUÍA ───────────────────────────────────────────────────────
const activeModule = ref(null);
const toggleModule = (id) => {
  activeModule.value = activeModule.value === id ? null : id;
};

// ─── CÁPSULAS RÁPIDAS (abren el módulo correspondiente) ──────────────────
const capsules = [
  { label: '¿Qué echar y qué no?', icon: Info, moduleId: 2 },
  { label: 'Controlando la humedad', icon: Droplets, moduleId: 4 },
  { label: 'Oxigenación', icon: Wind, moduleId: 6 },
];

const openCapsule = (moduleId) => {
  activeModule.value = moduleId;
  setTimeout(() => {
    document.getElementById(`modulo-${moduleId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
};

// ─── FAQs EXPANDIBLES ────────────────────────────────────────────────────
const activeFaq = ref(null);
const faqs = [
  { q: '¿Cuánto tarda en estar listo?', a: 'Entre 3 y 6 meses dependiendo del clima, la aireación y el balance de materiales. En Puerto Montt, por la humedad natural, puede tardar un poco más.' },
  { q: '¿Atrae insectos o plagas?', a: 'Si sigues las reglas (no echar carnes ni lácteos y siempre cubrir con material seco), no atrae plagas. Las moscas aparecen cuando hay restos expuestos sin cubrir.' },
  { q: '¿Puedo compostar en departamento?', a: 'Sí. Puedes usar un balde de 20 litros con tapa en el balcón o cocina. Mantén siempre más material seco que húmedo para evitar olores.' },
  { q: '¿Qué hago si mi compost tiene gusanos blancos?', a: 'Son larvas de mosca soldado negro: ¡son aliadas! Aceleran la descomposición y no son dañinas. Puedes dejarlas o cubrirlas con tierra.' },
];
</script>

<style scoped>
div::-webkit-scrollbar { display: none; }
.fade-in-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-in-enter-from { opacity: 0; transform: translateY(-8px); }
.toast-enter-active, .toast-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, -20px); }
.toast-enter-to, .toast-leave-from { opacity: 1; transform: translate(-50%, 0); }
</style>



