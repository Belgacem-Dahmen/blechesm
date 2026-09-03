import { ref, computed } from 'vue'
import { useRequestStore } from '@/stores/request.js'

// ── Static data ──────────────────────────────────────────────────────────────

export const SERVICE_DEFS = [
  {
    id: 'mural',
    label: 'Dessin Mural',
    badge: 'Fresque & Graffiti',
    color: '#3D7BFF',
    desc: "Transformez vos murs en œuvres d'art graffiti uniques.",
  },
  {
    id: 'sculpture',
    label: 'Sculpture 3D',
    badge: 'Volume & Matière',
    color: '#A78BFA',
    desc: 'Portrait, logo 3D, forme abstraite — visualisez votre sculpture.',
  },
  {
    id: 'sol',
    label: 'Design Sol',
    badge: 'Époxy & Art',
    color: '#FF6B35',
    desc: 'Design époxy unique pour vos sols avec correction de perspective.',
  },
]

export const QUESTION_SETS = {
  mural: [
    {
      label: 'Style visuel',
      text: 'Quel univers visuel vous inspire pour cette fresque ?',
      chips: ['Street art', 'Abstrait', 'Nature', 'Figuratif', 'Lettrage'],
    },
    {
      label: 'Couleurs',
      text: 'Quelles couleurs dominent votre vision ?',
      chips: ['Tons chauds', 'Tons froids', 'Monochrome', 'Multicolore', 'Noir & blanc'],
    },
    {
      label: 'Références',
      text: 'Des artistes ou références qui vous inspirent ?',
      chips: ['Banksy', 'Retna', 'Os Gemeos', 'Kobra', 'Pas de référence'],
    },
    {
      label: 'Contraintes',
      text: 'Des éléments particuliers à intégrer ?',
      chips: ['Aucune contrainte', 'Façade extérieure', 'Logo à intégrer', 'Personnages', 'Texte / lettrage'],
    },
  ],
  sculpture: [
    {
      label: 'Sujet',
      text: 'Décrivez le sujet de votre sculpture.',
      chips: ['Portrait / buste', 'Objet design', 'Logo 3D', 'Forme abstraite', 'Animal'],
    },
    {
      label: 'Atmosphère',
      text: 'Quelle atmosphère visuelle souhaitez-vous ?',
      chips: ['Imposant & monumental', 'Délicat & fin', 'Brut & expressif', 'Épuré & minimal', 'Organique'],
    },
    {
      label: 'Lieu',
      text: 'Où sera exposée la sculpture ?',
      chips: ['Entrée villa', 'Espace commercial', 'Jardin extérieur', 'Bureau / lobby', 'Événement'],
    },
  ],
  sol: [
    {
      label: 'Design',
      text: 'Quel type de design au sol vous attire ?',
      chips: ['Époxy rivière', 'Géométrique', 'Effet marbre', 'Décalcomanie', 'Abstrait'],
    },
    {
      label: 'Usage',
      text: "Quel est l'usage de l'espace concerné ?",
      chips: ['Garage', 'Showroom', 'Appartement', 'Restaurant', 'Parking'],
    },
    {
      label: 'Couleurs',
      text: 'Des couleurs ou ambiances particulières ?',
      chips: ['Bleu nuit & gris', 'Tons chauds terracotta', 'Noir & métallique', 'Blanc luxe', 'Naturel & bois'],
    },
  ],
}

export const BUDGET_OPTIONS = [
  '< 500 DT',
  '500 – 1 500 DT',
  '1 500 – 3 000 DT',
  '3 000 – 5 000 DT',
  '> 5 000 DT',
]

// ── Internal ID counter ──────────────────────────────────────────────────────

let _id = 0
function uid() { return ++_id }

// ── Composable ───────────────────────────────────────────────────────────────

export function useChatFlow() {
  const store = useRequestStore()

  const phase           = ref('welcome')
  const messages        = ref([])
  const questionIdx     = ref(0)
  const answers         = ref([])
  const versions        = ref([])
  const isTyping        = ref(false)
  const pickedService   = ref(null)
  const localDimensions = ref({ width: '', height: '' })

  // ── Internal helpers ─────────────────────────────────────────────────────

  function _push(role, type, payload = {}) {
    messages.value.push({ id: uid(), role, type, payload, ts: Date.now() })
  }

  async function _pushAI(type, payload = {}) {
    isTyping.value = true
    _push('ai', 'typing', {})
    await new Promise(r => setTimeout(r, 650))
    isTyping.value = false
    const last = messages.value[messages.value.length - 1]
    if (last?.type === 'typing') {
      messages.value[messages.value.length - 1] = {
        id: last.id,
        role: 'ai',
        type,
        payload,
        ts: Date.now(),
      }
    } else {
      _push('ai', type, payload)
    }
  }

  function _buildDescription() {
    const svc = SERVICE_DEFS.find(s => s.id === pickedService.value)
    const qs  = QUESTION_SETS[pickedService.value] ?? QUESTION_SETS.mural
    const parts = answers.value
      .map((a, i) => qs[i] ? `${qs[i].label} : ${a}` : null)
      .filter(Boolean)
    const { width: w, height: h } = localDimensions.value
    let desc = `Service : ${svc?.label ?? pickedService.value}. ${parts.join('. ')}.`
    if (w && h) desc += ` Dimensions : ${w}×${h}m.`
    store.description = desc
  }

  async function _startQuestions() {
    phase.value = 'questions'
    questionIdx.value = 0
    const qs = QUESTION_SETS[pickedService.value] ?? QUESTION_SETS.mural
    await _pushAI('text', {
      text: "Parfait ! Quelques questions rapides pour affiner votre vision 🎨",
    })
    await _pushAI('chips', { text: qs[0].text, chips: qs[0].chips })
  }

  // ── Public API ───────────────────────────────────────────────────────────

  async function init(servicePreset) {
    phase.value           = 'welcome'
    messages.value        = []
    questionIdx.value     = 0
    answers.value         = []
    versions.value        = []
    isTyping.value        = false
    pickedService.value   = null
    localDimensions.value = { width: '', height: '' }

    if (servicePreset && ['mural', 'sculpture', 'sol'].includes(servicePreset)) {
      const svc = SERVICE_DEFS.find(s => s.id === servicePreset)
      pickedService.value = servicePreset
      store.serviceType   = servicePreset
      phase.value = 'photo'
      await _pushAI('text', {
        text: `Bonjour 👋 Je suis **BlechESM IA**.\n\nService sélectionné : **${svc?.label}**.\nCommençons par votre photo principale.`,
      })
      await _pushAI('photo_upload', {
        role: 'wall',
        label: svc?.id === 'mural' ? 'Photo de votre mur' : svc?.id === 'sculpture' ? 'Photo de votre sujet' : 'Photo de votre sol',
        optional: false,
      })
      return
    }

    await _pushAI('text', {
      text: "Bonjour 👋 Je suis **BlechESM IA**.\n\nJe vais vous accompagner pour créer votre visualisation personnalisée.\n\nPar quel type de projet souhaitez-vous commencer ?",
    })
    await _pushAI('service_picker', { services: SERVICE_DEFS })
  }

  async function pickService(id) {
    if (!['welcome', 'service'].includes(phase.value)) return
    const svc = SERVICE_DEFS.find(s => s.id === id)
    pickedService.value = id
    store.serviceType   = id
    _push('user', 'text', { text: svc?.label ?? id })
    phase.value = 'photo'
    await _pushAI('text', {
      text: `Excellent choix ! **${svc?.label}** — ${svc?.desc}\n\nCommençons par votre photo principale.`,
    })
    await _pushAI('photo_upload', {
      role: 'wall',
      label: svc?.id === 'mural' ? 'Photo de votre mur' : svc?.id === 'sculpture' ? 'Photo de votre sujet' : 'Photo de votre sol',
      optional: false,
    })
  }

  async function submitPhoto(file, role) {
    if (!file) return
    const previewUrl = URL.createObjectURL(file)

    if (role === 'wall') {
      store.setWallPhoto(file)
      _push('user', 'photo_preview', { url: previewUrl, label: 'Photo principale' })
      if (pickedService.value === 'mural') {
        phase.value = 'ref_photo'
        await _pushAI('text', {
          text: "Votre photo est bien reçue ✓\n\nSouhaitez-vous ajouter une **image de référence** ? (style artistique, artiste inspirant…)\nCela aide l'IA à mieux cibler votre vision.",
        })
        await _pushAI('photo_upload', {
          role: 'ref',
          label: 'Image de référence (optionnel)',
          optional: true,
        })
      } else {
        await _startQuestions()
      }
    } else if (role === 'ref') {
      store.setReferencePhoto(file)
      _push('user', 'photo_preview', { url: previewUrl, label: 'Image de référence' })
      await _startQuestions()
    }
  }

  async function skipRefPhoto() {
    _push('user', 'text', { text: 'Passer' })
    await _startQuestions()
  }

  async function submitAnswer(text) {
    if (!text?.trim()) return
    const qs = QUESTION_SETS[pickedService.value] ?? QUESTION_SETS.mural
    _push('user', 'text', { text })
    answers.value.push(text)
    const next = questionIdx.value + 1
    questionIdx.value = next
    if (next < qs.length) {
      await _pushAI('chips', { text: qs[next].text, chips: qs[next].chips })
    } else {
      await _startDimensions()
    }
  }

  async function _startDimensions() {
    phase.value = 'dimensions'
    _buildDescription()
    await _pushAI('text', {
      text: "Très bien, j'ai bien compris votre projet ✓\n\nQuelles sont les **dimensions** approximatives de la surface ?",
    })
    await _pushAI('dimensions_form', {})
  }

  async function submitDimensions(w, h) {
    localDimensions.value = { width: String(w), height: String(h) }
    store.dimensions      = { width: String(w), height: String(h) }
    _buildDescription()
    _push('user', 'text', { text: `${w} m × ${h} m` })
    phase.value = 'contact'
    await _pushAI('text', {
      text: "Parfait !\n\nPour vous envoyer votre devis, j'ai besoin de quelques informations de contact.",
    })
    await _pushAI('contact_form', { budgetOptions: BUDGET_OPTIONS })
  }

  async function submitContact(data) {
    store.contact = { ...store.contact, ...data }
    _push('user', 'text', { text: `${data.name} · ${data.email}` })
    _buildDescription()
    phase.value = 'confirm'
    const svc  = SERVICE_DEFS.find(s => s.id === pickedService.value)
    const qs   = QUESTION_SETS[pickedService.value] ?? QUESTION_SETS.mural
    const items = answers.value.map((a, i) => ({ label: qs[i]?.label ?? '', value: a }))
    if (localDimensions.value.width) {
      items.push({ label: 'Dimensions', value: `${localDimensions.value.width} × ${localDimensions.value.height} m` })
    }
    if (data.budget) items.push({ label: 'Budget', value: data.budget })

    await _pushAI('confirm_recap', {
      service:      svc?.label,
      serviceColor: svc?.color,
      items,
      hasWallPhoto: !!store.wallPhoto,
      hasRefPhoto:  !!store.referencePhoto,
    })
  }

  function startGenerating() {
    phase.value = 'generating'
    _push('ai', 'generating_progress', {
      steps: [
        'Analyse de votre photo…',
        'Application de votre style…',
        'Génération de la fresque…',
        'Finalisation des détails…',
      ],
    })
  }

  function onGenerationDone(url) {
    store.setGeneratedImage(url)
    const versionNum = versions.value.length + 1
    versions.value.push({ url, label: `Version ${versionNum}` })

    const idx = messages.value.findLastIndex(m => m.type === 'generating_progress')
    const resultMsg = {
      id: uid(),
      role: 'ai',
      type: 'result_image',
      payload: { url, versionNum },
      ts: Date.now(),
    }
    if (idx !== -1) {
      messages.value.splice(idx, 1, resultMsg)
    } else {
      messages.value.push(resultMsg)
    }
    phase.value = 'result'
  }

  function onGenerationError(msg) {
    const idx = messages.value.findLastIndex(m => m.type === 'generating_progress')
    const errMsg = {
      id: uid(),
      role: 'ai',
      type: 'text',
      payload: { text: `❌ ${msg}\n\nVoulez-vous réessayer ?`, isError: true },
      ts: Date.now(),
    }
    if (idx !== -1) {
      messages.value.splice(idx, 1, errMsg)
    } else {
      messages.value.push(errMsg)
    }
    phase.value = 'result'
  }

  async function startModify() {
    phase.value = 'modify'
    await _pushAI('text', {
      text: "Bien sûr ! Décrivez la modification que vous souhaitez apporter à l'image.",
    })
  }

  async function submitModification(text) {
    _push('user', 'text', { text })
    store.description += ` Modification : ${text}`
  }

  function reGenerate() {
    _push('user', 'text', { text: 'Régénérer' })
  }

  // ── Computed ─────────────────────────────────────────────────────────────

  const collectedData = computed(() => ({
    service:    SERVICE_DEFS.find(s => s.id === pickedService.value) ?? null,
    hasWall:    !!store.wallPhoto,
    hasRef:     !!store.referencePhoto,
    wallUrl:    store.wallPhotoUrl,
    refUrl:     store.referencePhotoUrl,
    answers:    answers.value,
    questions:  QUESTION_SETS[pickedService.value] ?? [],
    dimensions: localDimensions.value,
    contact:    store.contact,
    versions:   versions.value,
    phase:      phase.value,
  }))

  return {
    phase, messages, isTyping, pickedService,
    collectedData,
    init, pickService, submitPhoto, skipRefPhoto,
    submitAnswer, submitDimensions, submitContact,
    startGenerating, onGenerationDone, onGenerationError,
    startModify, submitModification, reGenerate,
  }
}
