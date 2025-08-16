<template>
  <div class="stars">
    <span
      v-for="i in 5"
      :key="i"
      @click="$emit('update:modelValue', i)"
      :class="{ active: i <= modelValue }"
    >★</span>
  </div>
</template>

<script setup lang="ts">
defineProps({ modelValue: Number })
defineEmits(['update:modelValue'])
</script>

<style lang="scss">
.stars span {
  font-size: 2rem;
  cursor: pointer;
  &.active { color: gold; }
}
</style>
