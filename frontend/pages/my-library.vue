<template>
  <div class="library-container">
    <h2>📚 Mi Biblioteca</h2>

    <!-- Filtros -->
    <div class="controls">
      <input v-model="searchTitle" placeholder="🔍 Buscar por título" />
      <input v-model="searchAuthor" placeholder="✍️ Buscar por autor" />
      <select v-model="sortRating">
        <option value="">⭐ Ordenar por calificación</option>
        <option value="asc">Ascendente</option>
        <option value="desc">Descendente</option>
      </select>
      <label>
        <input type="checkbox" v-model="withReview" />
        Solo con review
      </label>
    </div>

    <!-- Lista de libros -->
    <div class="library-books">
      <div v-for="book in filteredBooks" :key="book._id" class="book-wrapper">
        <BookCard :book="book" @select="openEditModal(book)" />
        <div class="actions">
          <button class="edit-btn" @click="openEditModal(book)">✏️ Editar</button>
          <button class="delete-btn" @click="deleteBook(book)">🗑️ Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Modal de edición -->
    <EditBookModal
      v-if="editingBook !== null"
      :book="editingBook"
      @close="closeEditModal"
      @saved="refreshLibrary"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  requiresAuth: true
})

import { ref, computed, onMounted } from 'vue'
import { useBooksStore } from '../stores/books'
import BookCard from '../components/BookCard.vue'
import EditBookModal from '../components/EditBookModal.vue'

const booksStore = useBooksStore()

const searchTitle = ref('')
const searchAuthor = ref('')
const sortRating = ref('')
const withReview = ref(false)

// Referencia al libro que se edita
const editingBook = ref<any | null>(null)

onMounted(() => booksStore.fetchMyLibrary())

const filteredBooks = computed(() => {
  let result = booksStore.myLibrary
  if (searchTitle.value) result = result.filter(b => b.title.toLowerCase().includes(searchTitle.value.toLowerCase()))
  if (searchAuthor.value) result = result.filter(b => b.author.toLowerCase().includes(searchAuthor.value.toLowerCase()))
  if (withReview.value) result = result.filter(b => b.review && b.review.length > 0)
  if (sortRating.value) result = result.sort((a,b) => sortRating.value === 'asc' ? a.rating - b.rating : b.rating - a.rating)
  return result
})

// Abrir modal de edición
function openEditModal(book: any) {
  editingBook.value = { ...book }
}

// Cerrar modal
function closeEditModal() {
  editingBook.value = null
}

// Eliminar libro
async function deleteBook(book: any) {
  if (confirm(`¿Deseas eliminar "${book.title}" permanentemente?`)) {
    const deleted = await booksStore.deleteBook(book._id)
    if (deleted) refreshLibrary()
  }
}

// Refrescar lista
function refreshLibrary() {
  booksStore.fetchMyLibrary()
}
</script>

<style lang="scss">
.library-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem;

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: bold;
    background: linear-gradient(90deg, #3498db, #9b59b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
    justify-content: center;

    input,
    select {
      padding: 0.7rem 1rem;
      border-radius: 10px;
      border: 1px solid #ddd;
      min-width: 200px;
      transition: 0.3s;
      font-size: 0.95rem;
      background: #fff;

      &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 6px rgba(52, 152, 219, 0.4);
      }
    }

    label {
      display: flex;
      align-items: center;
      font-size: 0.95rem;
      cursor: pointer;

      input {
        margin-right: 0.4rem;
        accent-color: #3498db;
      }
    }
  }

  .library-books {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.2rem;

    .book-wrapper {
      background: linear-gradient(145deg, #ffffff, #f0f0f0);
      border-radius: 14px;
      padding: 1rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.25s ease, box-shadow 0.25s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
      }

      .actions {
        display: flex;
        gap: 0.7rem;
        margin-top: 0.7rem;
        width: 100%;
        justify-content: center;

        button {
          flex: 1;
          padding: 0.5rem 0.7rem;
          border-radius: 8px;
          cursor: pointer;
          border: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: background-color 0.3s, transform 0.2s;

          &:hover {
            transform: scale(1.05);
          }
        }

        .edit-btn {
          background-color: #3498db;
          color: white;
          &:hover {
            background-color: #2980b9;
          }
        }

        .delete-btn {
          background-color: #e74c3c;
          color: white;
          &:hover {
            background-color: #c0392b;
          }
        }
      }
    }
  }
}
</style>
