<script setup lang="ts">
interface Props {
  class?: string;
}

const props = defineProps<Props>();

const iconRef = ref();

const startAnimation = () => {
  iconRef.value?.startAnimation();
};

const stopAnimation = () => {
  iconRef.value?.stopAnimation();
};

const handleButtonEnter = () => {
  startAnimation();
};

const handleButtonLeave = () => {
  stopAnimation();
};

// Expose the ref so parent can access it if needed
defineExpose({
  iconRef,
});
</script>

<template>
  <button
    :class="[
      'h-full w-full aspect-square bg-neutral-50 hover:bg-neutral-100 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl cursor-pointer',
      props.class,
    ]"
    @mouseenter="handleButtonEnter"
    @mouseleave="handleButtonLeave"
  >
    <slot :ref="(el) => (iconRef = el)" :controlled="true" />
  </button>
</template>
