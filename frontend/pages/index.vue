<template>
  <div class="search-page">
    <div class="search-container">
      <h2>Buscador de Libros</h2>

      <input
        v-model="query"
        type="text"
        placeholder="Escribe el nombre de un Libro para continuar"
        @keyup.enter="searchBooks"
      />
      <button @click="searchBooks">Buscar</button>

      <!-- Historial de últimas 5 búsquedas -->
      <div class="search-history" v-if="booksStore.lastSearches.length">
        <h3>Últimas búsquedas</h3>
        <ul>
          <li v-for="(item, idx) in booksStore.lastSearches" :key="idx" @click="searchFromHistory(item)">
            {{ item }}
          </li>
        </ul>
      </div>

      <!-- Resultados -->
      <div v-if="booksStore.loading">Cargando...</div>
      <div v-else>
        <div v-if="booksStore.books.length === 0 && query">
          No encontramos libros con el título ingresado
        </div>
        <div class="results" v-else>
          <BookCard v-for="book in booksStore.books.slice(0,10)" :key="book.title" :book="book" @select="selectBook"/>
        </div>
      </div>
    </div>

    <BookDetail
      v-if="selectedBook"
      :book="selectedBook"
      @saved="onBookSaved"
      @close="selectedBook = null"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  requiresAuth: true
})

import { ref, onMounted } from 'vue'
import { useBooksStore } from '~/stores/books'
import BookCard from '~/components/BookCard.vue'
import BookDetail from '~/components/BookDetail.vue'

const booksStore = useBooksStore()
const query = ref('')
const selectedBook = ref<any>(null)

onMounted(() => {
  booksStore.fetchLastSearches()
})

function searchBooks() {
  if (query.value.trim()) booksStore.fetchBooks(query.value)
}

function searchFromHistory(text: string) {
  query.value = text
  searchBooks()
}

function selectBook(book: any) {
  selectedBook.value = book
}

function onBookSaved() {
  alert('Libro guardado correctamente!')
  booksStore.fetchMyLibrary()
  selectedBook.value = null
}
</script>
