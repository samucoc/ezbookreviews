<template>
  <div class="modal-overlay">
    <div class="modal">
      <button class="close-btn" @click="$emit('close')">&times;</button>

      <div class="book-info">
        <h2>{{ book.title }}</h2>
        <p><strong>Autor:</strong> {{ book.author }}</p>
        <p><strong>Año:</strong> {{ book.year }}</p>
        <img :src="coverSrc" alt="Portada" class="cover" />
      </div>

      <div class="review-section">
        <label>Review (máx 500 caracteres)</label>
        <textarea
          v-model="review"
          maxlength="500"
          placeholder="Escribe tu review..."
        ></textarea>

        <label>Calificación</label>
        <div class="stars">
          <span
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ filled: n <= rating }"
            @click="rating = n"
          >&#9733;</span>
        </div>

        <button @click="saveBook">Guardar</button>
        <div v-if="successMessage" class="success">{{ successMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useBooksStore } from '~/stores/books'

const props = defineProps<{
  book: any
}>()

const booksStore = useBooksStore()
const review = ref(props.book.review || '')
const rating = ref(props.book.rating || 0)
const successMessage = ref('')

// Convertir portada a Base64 automáticamente
const coverSrc = ref(props.book.cover)
watch(() => props.book.cover, async (newCover) => {
  if (!newCover) return
  if (newCover.startsWith('data:image')) {
    coverSrc.value = newCover
  } else {
    // Fetch la imagen y convertir a base64
    const res = await fetch(newCover)
    const blob = await res.blob()
    const reader = new FileReader()
    reader.onloadend = () => {
      coverSrc.value = reader.result as string
    }
    reader.readAsDataURL(blob)
  }
}, { immediate: true })

async function saveBook() {
  const payload = {
    ...props.book,
    review: review.value,
    rating: rating.value,
    cover: coverSrc.value // guardamos portada en Base64
  }
  const saved = await booksStore.updateBook(props.book._id, payload)
  if (saved) {
    successMessage.value = 'Libro guardado correctamente!'
    setTimeout(() => {
      successMessage.value = ''
      // Emitimos evento para refrescar lista en SPA
      // eslint-disable-next-line vue/no-mutating-props
      props.book.review = review.value
      props.book.rating = rating.value
      props.book.cover = coverSrc.value
      // Cerramos modal si se desea
      // $emit('close')
      // También emitimos saved
      emit('saved')
    }, 1500)
  }
}
</script>

<style lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;

  .modal {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    width: 400px;
    max-width: 90%;
    position: relative;

    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }

    .book-info {
      text-align: center;
      .cover {
        max-width: 200px;
        margin: 1rem 0;
      }
    }

    .review-section {
      display: flex;
      flex-direction: column;

      textarea {
        width: 100%;
        height: 100px;
        margin-bottom: 1rem;
        padding: 0.5rem;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 1rem;
        resize: none;
      }

      .stars {
        font-size: 1.5rem;
        color: #ccc;
        margin-bottom: 1rem;

        .star {
          cursor: pointer;
          &.filled {
            color: #f39c12;
          }
        }
      }

      button {
        background: #3498db;
        color: #fff;
        border: none;
        padding: 0.5rem;
        border-radius: 8px;
        cursor: pointer;

        &:hover {
          background: darken(#3498db, 10%);
        }
      }

      .success {
        margin-top: 0.5rem;
        color: #27ae60;
      }
    }
  }
}
</style>
