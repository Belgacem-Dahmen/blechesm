import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRequestStore = defineStore('request', () => {
  const serviceType = ref('mural')   // 'mural' | 'sculpture' | 'sol'
  const wallPhoto = ref(null)        // File object or data URL
  const wallPhotoUrl = ref(null)     // Preview URL
  const referencePhoto = ref(null)   // File object or data URL
  const referencePhotoUrl = ref(null)
  const description = ref('')
  const generatedImage = ref(null)   // URL returned by mock API
  const dimensions = ref({ width: '', height: '' })
  const materialStyle = ref('marble')  // sculpture: clay | marble | metal | concrete | neon
  const surfaceFinish = ref('mat')     // sol: mat | brillant | metallique
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
    materialStyle.value = 'marble'
    surfaceFinish.value = 'mat'
    contact.value = { name: '', email: '', phone: '', city: '' }
  }

  return {
    serviceType,
    wallPhoto, wallPhotoUrl,
    referencePhoto, referencePhotoUrl,
    description, generatedImage,
    dimensions, materialStyle, surfaceFinish,
    contact,
    setWallPhoto, setReferencePhoto, setGeneratedImage, reset,
  }
})
