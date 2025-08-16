<template>
  <div class="library-container">
    <h2>Mi Biblioteca</h2>

    <!-- Filtros -->
    <div class="controls">
      <input v-model="searchTitle" placeholder="Buscar por título"/>
      <input v-model="searchAuthor" placeholder="Buscar por autor"/>
      <select v-model="sortRating">
        <option value="">Ordenar por calificación</option>
        <option value="asc">Ascendente</option>
        <option value="desc">Descendente</option>
      </select>
      <label><input type="checkbox" v-model="withReview"/> Solo con review</label>
    </div>

    <!-- Lista de libros -->
    <div class="library-books">
      <div v-for="book in filteredBooks" :key="book._id" class="book-wrapper">
        <BookCard :book="book" @select="openEditModal(book)" />
        <div class="actions">
          <button class="edit-btn" @click="openEditModal(book)">Editar</button>
          <button class="delete-btn" @click="deleteBook(book)">Eliminar</button>
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
  // Crear un objeto nuevo para que Vue detecte el cambio reactivo
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
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
    justify-content: center;

    input,
    select {
      padding: 0.5rem;
      border-radius: 6px;
      border: 1px solid #ccc;
      min-width: 180px;
    }

    label {
      display: flex;
      align-items: center;
      input {
        margin-right: 0.3rem;
      }
    }
  }

  .library-books {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;

    .book-wrapper {
      background: #f9f9f9;
      border-radius: 10px;
      padding: 0.5rem;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;

      .actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
        width: 100%;
        justify-content: center;

        button {
          flex: 1;
          padding: 0.3rem 0;
          border-radius: 6px;
          cursor: pointer;
          border: none;
          font-size: 0.85rem;
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
