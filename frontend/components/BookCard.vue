<template>
  <div class="book-card" @click="$emit('select', book)">
    <img :src="book.cover || '/placeholder.jpg'" alt="Portada"/>
    <h3>{{ book.title }}</h3>
    <p>{{ book.author }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ book: any }>()
</script>

<style lang="scss">
.book-card {
  cursor: pointer;
  text-align: center;
  img {
    width: 100px;
    height: 150px;
    object-fit: cover;
    margin-bottom: 0.5rem;
  }
}
</style>
