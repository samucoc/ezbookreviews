import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: [] as any[],
    myLibrary: [] as any[],
    lastSearches: [] as string[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    // Función para enviar token en headers
    getAuthHeaders() {
      const auth = useAuthStore()
      return auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
    },

    // =========================
    // Buscar libros en MongoDB
    // =========================
    async fetchBooks(query: string = '') {
      this.loading = true
      this.error = null
      try {
        const auth = useAuthStore()
        const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
        
        const { data }: any = await useFetch(
          `http://localhost:4000/api/books/search?q=${query}`,
          { headers }
        )
        this.books = data.value || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // =========================
    // Últimas 5 búsquedas
    // =========================
    async fetchLastSearches() {
      this.loading = true
      this.error = null
      try {
        const auth = useAuthStore()
        const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
        
        const { data }: any = await useFetch(
          `http://localhost:4000/api/books/last-search`,
          { headers }
        )
        this.lastSearches = data.value || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // =========================
    // Mi Biblioteca
    // =========================
    async fetchMyLibrary(filters: { title?: string; author?: string; withReview?: boolean } = {}) {
      this.loading = true
      this.error = null
      try {
        const params = new URLSearchParams()
        if (filters.title) params.append('title', filters.title)
        if (filters.author) params.append('author', filters.author)
        if (filters.withReview) params.append('withReview', 'true')

        const auth = useAuthStore()
        const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
        
        const { data }: any = await useFetch(
          `http://localhost:4000/api/books/my-library?${params.toString()}`,
          { headers }
        )
        this.myLibrary = data.value || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async addBookToLibrary(book: any) {
      this.loading = true
      this.error = null
      try {
        const auth = useAuthStore()
        const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
        
        const { data }: any = await useFetch(
          `http://localhost:4000/api/books/my-library`,
          {
            method: 'POST',
            body: book,
            headers
          }
        )
        this.myLibrary.push(data.value)
        return data.value
      } catch (err: any) {
        this.error = err.message
        return null
      } finally {
        this.loading = false
      }
    },

    async getBookFromLibrary(id: string) {
      this.loading = true
      this.error = null
      try {
        const auth = useAuthStore()
        const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
        
        const { data }: any = await useFetch(
          `http://localhost:4000/api/books/my-library/${id}`,
          { headers }
        )
        return data.value
      } catch (err: any) {
        this.error = err.message
        return null
      } finally {
        this.loading = false
      }
    },

    async updateBook(id: string, updates: { review?: string; rating?: number; coverBase64?: string }) {
      this.loading = true
      this.error = null
      try {
        const auth = useAuthStore()
        const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
        
        const { data }: any = await useFetch(
          `http://localhost:4000/api/books/my-library/${id}`,
          {
            method: 'PUT',
            body: updates,
            headers
          }
        )
        const index = this.myLibrary.findIndex(b => b._id === id)
        if (index !== -1) this.myLibrary[index] = data.value
        return data.value
      } catch (err: any) {
        this.error = err.message
        return null
      } finally {
        this.loading = false
      }
    },

    async deleteBook(id: string) {
      this.loading = true
      this.error = null
      try {
        const auth = useAuthStore()
        const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
        
        await useFetch(
          `http://localhost:4000/api/books/my-library/${id}`,
          { method: 'DELETE', headers }
        )
        this.myLibrary = this.myLibrary.filter(b => b._id !== id)
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // =========================
    // Obtener URL de portada
    // =========================
    getCoverUrl(id: string) {
      return `http://localhost:4000/api/books/library/front-cover/${id}`
    }
  }
})
