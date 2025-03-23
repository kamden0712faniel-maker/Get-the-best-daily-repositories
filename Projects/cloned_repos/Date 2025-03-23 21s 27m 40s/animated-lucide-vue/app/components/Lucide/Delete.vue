<script setup lang="ts">
import { motion } from 'motion-v';

interface Props {
  size?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 28,
  class: '',
});

const emit = defineEmits<{
  startAnimation: [];
  stopAnimation: [];
}>();

const lidVariants = {
  normal: { y: 0 },
  animate: { y: -1.1, rotate: 4 },
};

const springTransition = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
};

const isControlled = ref(false);
const currentState = ref('normal');

const startAnimation = () => {
  currentState.value = 'animate';
};

const stopAnimation = () => {
  currentState.value = 'normal';
};

const handleMouseEnter = () => {
  if (!isControlled.value) {
    startAnimation();
  } else {
    emit('startAnimation');
  }
};

const handleMouseLeave = () => {
  if (!isControlled.value) {
    stopAnimation();
  } else {
    emit('stopAnimation');
  }
};

defineExpose({
  startAnimation,
  stopAnimation,
});
</script>

<template>
  <div
    :class="[
      'cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center',
      props.class,
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <motion.g
        :variants="lidVariants"
        :animate="currentState"
        :transition="springTransition"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </motion.g>
      <motion.path
        d="M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8"
        :variants="{
          normal: { d: 'M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8' },
          animate: { d: 'M19 9v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V9' },
        }"
        :animate="currentState"
        :transition="springTransition"
      />
      <motion.line
        x1="10"
        x2="10"
        y1="11"
        y2="17"
        :variants="{
          normal: { y1: 11, y2: 17 },
          animate: { y1: 11.5, y2: 17.5 },
        }"
        :animate="currentState"
        :transition="springTransition"
      />
      <motion.line
        x1="14"
        x2="14"
        y1="11"
        y2="17"
        :variants="{
          normal: { y1: 11, y2: 17 },
          animate: { y1: 11.5, y2: 17.5 },
        }"
        :animate="currentState"
        :transition="springTransition"
      />
    </svg>
  </div>
</template>
