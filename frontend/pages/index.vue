<template>
  <div class="search-page">
    <div class="search-container">
      <h2>🔎 Buscador de Libros</h2>

      <!-- Barra de búsqueda -->
      <div class="search-bar">
        <input
          v-model="query"
          type="text"
          placeholder="Escribe el nombre de un libro para continuar..."
          @keyup.enter="searchBooks"
        />
        <button @click="searchBooks">Buscar</button>
      </div>

      <!-- Historial de últimas búsquedas -->
      <div class="search-history" v-if="booksStore.lastSearches.length">
        <h3>📖 Últimas búsquedas</h3>
        <ul>
          <li
            v-for="(item, idx) in booksStore.lastSearches"
            :key="idx"
            @click="searchFromHistory(item)"
          >
            {{ item }}
          </li>
        </ul>
      </div>

      <!-- Resultados -->
      <div v-if="booksStore.loading" class="loading">Cargando...</div>
      <div v-else>
        <div v-if="booksStore.books.length === 0 && query">
          ⚠️ No encontramos libros con el título ingresado
        </div>
        <div class="results" v-else>
          <BookCard
            v-for="book in booksStore.books.slice(0,10)"
            :key="book.title"
            :book="book"
            @select="selectBook"
          />
        </div>
      </div>
    </div>

    <!-- Detalle del libro -->
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

<style lang="scss">
.search-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;

  .search-container {
    background: #fff;
    border-radius: 14px;
    padding: 2rem;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);

    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      font-size: 2rem;
      font-weight: bold;
      background: linear-gradient(90deg, #3498db, #9b59b6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .search-bar {
      display: flex;
      gap: 0.8rem;
      justify-content: center;
      margin-bottom: 1.5rem;

      input {
        flex: 1;
        padding: 0.7rem 1rem;
        border-radius: 10px;
        border: 1px solid #ccc;
        transition: 0.3s;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 6px rgba(52, 152, 219, 0.4);
        }
      }

      button {
        background: #3498db;
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 0.7rem 1.2rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s, transform 0.2s;

        &:hover {
          background: #2980b9;
          transform: scale(1.05);
        }
      }
    }

    .search-history {
      margin-bottom: 1.5rem;
      h3 {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
      }
      ul {
        list-style: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;

        li {
          background: #f3f4f6;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: #e1e4e8;
          }
        }
      }
    }

    .results {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1rem;
      margin-top: 1.2rem;
    }

    .loading {
      text-align: center;
      font-weight: bold;
      color: #555;
    }
  }
}
</style>
