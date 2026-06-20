import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRequestStore = defineStore('request', () => {
  const wallPhoto = ref(null)        // File object or data URL
  const wallPhotoUrl = ref(null)     // Preview URL
  const referencePhoto = ref(null)   // File object or data URL
  const referencePhotoUrl = ref(null)
  const description = ref('')
  const generatedImage = ref(null)   // URL returned by mock API
  const dimensions = ref({ width: '', height: '' })
  const contact = ref({ name: '', email: '', phone: '', city: '' })

  function setWallPhoto(file) {
    wallPhoto.value = file
    wallPhotoUrl.value = file ? URL.createObjectURL(file) : null
  }

  function setReferencePhoto(file) {
    referencePhoto.value = file
    referencePhotoUrl.value = file ? URL.createObjectURL(file) : null
  }

  function setGeneratedImage(url) {
    generatedImage.value = url
  }

  function reset() {
    wallPhoto.value = null
    wallPhotoUrl.value = null
    referencePhoto.value = null
    referencePhotoUrl.value = null
    description.value = ''
    generatedImage.value = null
    dimensions.value = { width: '', height: '' }
    contact.value = { name: '', email: '', phone: '', city: '' }
  }

  return {
    wallPhoto, wallPhotoUrl,
    referencePhoto, referencePhotoUrl,
    description, generatedImage,
    dimensions, contact,
    setWallPhoto, setReferencePhoto, setGeneratedImage, reset,
  }
})
