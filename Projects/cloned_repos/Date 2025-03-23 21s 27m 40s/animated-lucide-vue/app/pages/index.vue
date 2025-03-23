<template>
  <UContainer class="py-12">
    <div class="mb-12 flex items-start md:items-center gap-4 justify-between">
      <div>
        <h1 class="text-2xl font-bold">Animated Lucide Vue Icons</h1>
        <p class="text-sm text-gray-500 mt-4">
          A collection of animated icons using Lucide and Vue Motion. Ported
          from the awesome lib
          <a
            href="https://icons.pqoqubbw.dev/"
            class="text-primary-500 hover:underline"
            >pqoqubbw/icons</a
          >
          by
          <a
            href="https://x.com/pqoqubbw"
            class="text-primary-500 hover:underline"
            >dmytro</a
          >
        </p>
        <p class="text-sm text-gray-500 mt-4">
          Made by
          <a
            href="https://x.com/fayazara"
            class="text-primary-500 hover:underline"
            >Fayaz</a
          >. Work in progress, feel free to contribute on GitHub.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <ThemeToggle/>
        <ThemePicker v-model="primaryColor" />
        <UButton
          icon="i-lucide-github"
          variant="ghost"
          target="_blank"
          to="https://github.com/fayazara/animated-lucide-vue"
        />
      </div>
    </div>
    <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideAArrowDown
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideEarth
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideAudioLines
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideSquareStack
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideSlidersHorizontal
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideSquareActivity
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideUserRound
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideHome
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideFileStack
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideAlarmClock
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideSettings
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideMenu
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideDelete
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideClock
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideCalendarDays
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideBluetoothSearching
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideSmartphoneCharging
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideSearch
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideWaves
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideMoon
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideSun
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideCircleCheck
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideUsers
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
      <AnimatedIconButton>
        <template #default="{ ref, controlled }">
          <LucideBell
            :ref="ref"
            :controlled="controlled"
            :class="primaryColor"
          />
        </template>
      </AnimatedIconButton>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const primaryColor = ref('text-neutral-700 dark:text-neutral-300');
</script>
