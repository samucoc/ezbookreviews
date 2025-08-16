<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal">
      <button class="close-btn" @click="close">✖</button>
      <h2>Editar Libro</h2>

      <img :src="coverPreview || editableBook.coverBase64 || editableBook.cover" 
           alt="Portada" class="cover-preview"/>

      <label>Título</label>
      <input type="text" v-model="editableBook.title" disabled />

      <label>Autor</label>
      <input type="text" v-model="editableBook.author" disabled />

      <label>Año</label>
      <input type="text" v-model="editableBook.year" disabled />

      <label>Review (máx 500 caracteres)</label>
      <textarea v-model="editableBook.review" maxlength="500" placeholder="Escribe tu review"></textarea>

      <label>Calificación</label>
      <StarRating v-model="editableBook.rating" />

      <label>Actualizar portada</label>
      <input type="file" @change="onFileChange" accept="image/*"/>

      <button class="save-btn" @click="saveBook">Guardar</button>

      <div v-if="message" class="success-message">{{ message }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import StarRating from './StarRating.vue'
import { useBooksStore } from '~/stores/books'

export default defineComponent({
  name: 'EditBookModal',
  components: { StarRating },
  props: {
    book: { type: Object, required: true }
  },
  emits: ['saved', 'close'],
  setup(props, { emit }) {
    const booksStore = useBooksStore()
    const message = ref('')
    const coverPreview = ref<string | null>(null)

    // Copia editable del libro
    const editableBook = reactive({ ...props.book })

    // Escuchar cambios en props.book
    watch(() => props.book, (newVal) => {
      Object.assign(editableBook, newVal)
      coverPreview.value = null
    })

    // Convertir archivo a base64
    function onFileChange(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = () => {
        coverPreview.value = reader.result as string
        editableBook.coverBase64 = coverPreview.value
      }
      reader.readAsDataURL(file)
    }

    // Guardar libro
    async function saveBook() {
      const payload = {
        review: editableBook.review,
        rating: editableBook.rating,
        coverBase64: editableBook.coverBase64
      }
      const updated = await booksStore.updateBook(editableBook._id, payload)
      if (updated) {
        message.value = 'Libro guardado correctamente'
        emit('saved')
        setTimeout(() => message.value = '', 3000)
      }
    }

    function close() {
      emit('close')
    }

    return { editableBook, coverPreview, message, onFileChange, saveBook, close }
  }
})
</script>

<style lang="scss">
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);

  .close-btn {
    position: absolute;
    top: 10px; right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .cover-preview {
    width: 120px;
    height: 160px;
    object-fit: cover;
    margin-bottom: 1rem;
  }

  label { font-weight: bold; margin-top: 0.5rem; display: block; }
  input, textarea { width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border-radius: 6px; border: 1px solid #ccc; }
  textarea { resize: none; height: 80px; }

  .save-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    margin-top: 1rem;
    //&:hover { background-color: darken(#3498db, 10%); }
  }

  .success-message {
    color: green;
    margin-top: 0.5rem;
    font-weight: bold;
    text-align: center;
  }
}
</style>
