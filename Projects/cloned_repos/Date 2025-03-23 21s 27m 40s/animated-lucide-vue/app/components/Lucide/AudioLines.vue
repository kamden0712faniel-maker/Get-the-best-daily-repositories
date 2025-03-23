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

const lineVariants = {
  line6: {
    normal: { d: 'M6 6v11' },
    animate: {
      d: ['M6 6v11', 'M6 10v3', 'M6 6v11'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
      },
    },
  },
  line10: {
    normal: { d: 'M10 3v18' },
    animate: {
      d: ['M10 3v18', 'M10 9v5', 'M10 3v18'],
      transition: {
        duration: 1,
        repeat: Infinity,
      },
    },
  },
  line14: {
    normal: { d: 'M14 8v7' },
    animate: {
      d: ['M14 8v7', 'M14 6v11', 'M14 8v7'],
      transition: {
        duration: 0.8,
        repeat: Infinity,
      },
    },
  },
  line18: {
    normal: { d: 'M18 5v13' },
    animate: {
      d: ['M18 5v13', 'M18 7v9', 'M18 5v13'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
      },
    },
  },
};

const isControlled = ref(false);
const currentState = ref('normal');

// Animation controls
const startAnimation = () => {
  currentState.value = 'animate';
};

const stopAnimation = () => {
  currentState.value = 'normal';
};

// Mouse event handlers
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

// Expose methods for external control
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
      <path d="M2 10v3" />
      <motion.path
        d="M6 6v11"
        :animate="currentState"
        :variants="lineVariants.line6"
      />
      <motion.path
        d="M10 3v18"
        :animate="currentState"
        :variants="lineVariants.line10"
      />
      <motion.path
        d="M14 8v7"
        :animate="currentState"
        :variants="lineVariants.line14"
      />
      <motion.path
        d="M18 5v13"
        :animate="currentState"
        :variants="lineVariants.line18"
      />
      <path d="M22 10v3" />
    </svg>
  </div>
</template>
