<template>
  <div class="history" v-if="history.length">
    <p>Últimas búsquedas:</p>
    <ul>
      <li v-for="item in history" :key="item" @click="$emit('select', item)">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{ history: string[] }>()
</script>

<style lang="scss">
.history {
  margin-top: 1rem;
  ul { list-style: none; padding: 0; }
  li { cursor: pointer; color: blue; text-decoration: underline; margin-bottom: 0.25rem; }
}
</style>
