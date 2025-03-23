<template>
  <UPopover
    mode="hover"
    :ui="{ content: 'w-72 px-6 py-4 flex flex-col gap-4' }"
  >
    <template #default="{ open }">
      <UButton
        icon="i-lucide-swatch-book"
        :variant="open ? 'soft' : 'ghost'"
        square
        aria-label="Color picker"
      />
    </template>
    <template #content>
      <div class="grid grid-cols-2 gap-1 -mx-2">
        <UButton
          v-for="color in colors"
          :key="color.label"
          :class="color.color"
          color="neutral"
          variant="outline"
          size="sm"
          icon="i-ph-circle-duotone"
          :label="color.label"
          @click="model = color.color"
        />
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
const model = defineModel();

const colors = [
  {
    label: 'Gray',
    color: 'text-neutral-900',
  },
  {
    label: 'Red',
    color: 'text-red-500',
  },
  {
    label: 'Orange',
    color: 'text-orange-500',
  },
  {
    label: 'Yellow',
    color: 'text-yellow-500',
  },
  {
    label: 'Lime',
    color: 'text-lime-500',
  },
  {
    label: 'Green',
    color: 'text-green-500',
  },
  {
    label: 'Emerald',
    color: 'text-emerald-500',
  },
  {
    label: 'Teal',
    color: 'text-teal-500',
  },
  {
    label: 'Cyan',
    color: 'text-cyan-500',
  },
  {
    label: 'Sky',
    color: 'text-sky-500',
  },
  {
    label: 'Blue',
    color: 'text-blue-500',
  },
  {
    label: 'Indigo',
    color: 'text-indigo-500',
  },
  {
    label: 'Purple',
    color: 'text-purple-500',
  },
  {
    label: 'Fuchsia',
    color: 'text-fuchsia-500',
  },
  {
    label: 'Pink',
    color: 'text-pink-500',
  },
  {
    label: 'Rose',
    color: 'text-rose-500',
  },
];
</script>
