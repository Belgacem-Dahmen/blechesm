<template>
  <div class="bg-bg min-h-screen text-text overflow-x-hidden">
    <NavBar />

    <!-- ── HERO ─────────────────────────────────────────────────────── -->
    <section class="relative pt-24 pb-16 overflow-hidden hero-section">
      <div class="absolute inset-0 grid-bg opacity-[0.07] pointer-events-none" />
      <div class="spray spray-orange absolute -top-12 -right-12 w-[260px] h-[260px]" style="opacity:0.045" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-1.5 mb-8 text-xs text-text-3 h-eyebrow">
          <RouterLink to="/" class="hover:text-text transition-colors">Accueil</RouterLink>
          <ChevronRight class="w-3 h-3" />
          <span class="text-accent font-medium">Configurateur IA</span>
        </nav>

        <div class="flex items-start justify-between gap-8">
          <div class="max-w-2xl">
            <!-- Eyebrow -->
            <div class="flex items-center gap-3 mb-5 h-eyebrow2">
              <span class="w-6 h-px bg-accent" />
              <span class="text-xs font-mono uppercase tracking-widest text-accent">Blechesm AI Platform</span>
              <svg width="48" height="22" viewBox="0 0 48 22" class="text-warning opacity-60 hidden sm:block" fill="none" aria-hidden="true">
                <path d="M3,11 C12,4 30,4 42,11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M35,6 L43,12 L35,16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tightest leading-[0.92] mb-5 h-title">
              {{ currentService.heroTitle }}<br />
              <span class="relative inline-block text-accent">
                {{ currentService.heroAccent }}
                <svg class="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 400 8" preserveAspectRatio="none" fill="none" aria-hidden="true">
                  <path d="M0,4 Q50,0 100,4 Q150,8 200,4 Q250,0 300,4 Q350,8 400,4" stroke="#FF6B35" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
                </svg>
              </span>
            </h1>

            <p class="text-text-2 text-base leading-relaxed mb-8 max-w-lg h-sub">
              {{ currentService.heroDesc }}
            </p>

            <!-- 3-step funnel -->
            <div class="flex items-center gap-0 h-funnel">
              <div v-for="(step, i) in funnelSteps" :key="i" class="flex items-center">
                <div class="funnel-step" :style="{ '--fs': step.color }"
                  :class="i === 0 ? 'funnel-step--active' : ''">
                  <span class="funnel-num">{{ String(i+1).padStart(2,'0') }}</span>
                  <span class="funnel-label">{{ step.label }}</span>
                </div>
                <svg v-if="i < funnelSteps.length - 1" width="28" height="14" viewBox="0 0 28 14" class="shrink-0 text-text-3 opacity-40 mx-1" fill="none">
                  <path d="M2,7 Q12,2 22,7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M18,4 L23,7 L18,10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Desktop stickers -->
          <div class="hidden lg:flex flex-col items-end gap-3 pt-8 shrink-0 h-stickers">
            <div v-for="(s, i) in currentService.stickers" :key="s.label"
              class="sticker" :style="{ '--sc': s.color, transform: `rotate(${s.rotate}deg)`, animationDelay: `${0.3 + i * 0.1}s` }">
              {{ s.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── SERVICE SELECTOR ───────────────────────────────────────────── -->
    <div class="sticky top-16 z-40 bg-bg/95 backdrop-blur-md border-b border-border h-service-tabs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex gap-1 py-2 overflow-x-auto scrollbar-none">
          <button
            v-for="svc in services"
            :key="svc.id"
            class="service-tab"
            :class="{ 'service-tab--active': store.serviceType === svc.id }"
            :style="store.serviceType === svc.id ? { '--tc': svc.color } : {}"
            @click="store.serviceType = svc.id"
          >
            <component :is="svc.icon" class="w-4 h-4 shrink-0" />
            <span class="font-medium">{{ svc.label }}</span>
            <span class="tab-badge hidden sm:inline">{{ svc.badge }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ── MAIN CONTENT ──────────────────────────────────────────────── -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

        <!-- ── LEFT: FORM ─────────────────────────────────────────── -->
        <div class="lg:col-span-3 space-y-4">
          <form @submit.prevent="handleGenerate" novalidate>

            <!-- ── MURAL SERVICE ── -->
            <template v-if="store.serviceType === 'mural'">

              <!-- Step 1 — Wall photo -->
              <div class="config-card" :class="store.wallPhoto ? 'config-card--done' : ''" style="--cc: #FB923C">
                <div class="config-accent" />
                <div class="flex items-start gap-4 mb-5">
                  <div class="config-badge" :class="store.wallPhoto ? 'config-badge--done' : 'config-badge--active'">
                    <Check v-if="store.wallPhoto" class="w-4 h-4" />
                    <span v-else>01</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <h3 class="font-display font-semibold text-text">Photo de votre mur</h3>
                      <span class="req-badge req-badge--required">Requis</span>
                    </div>
                    <p class="text-text-3 text-xs">Photographiez le mur entier en lumière naturelle pour un rendu IA optimal</p>
                  </div>
                </div>
                <FileDropzone
                  v-model="store.wallPhoto"
                  placeholder="Glissez ou cliquez pour importer votre mur"
                  hint="PNG, JPG, WEBP · max 10 Mo · lumière naturelle recommandée"
                  icon="upload"
                  required
                  :error="errors.wall"
                  @update:modelValue="store.setWallPhoto"
                />
              </div>

              <!-- Step 2 — Reference photo -->
              <div class="config-card" :class="store.referencePhoto ? 'config-card--done' : ''" style="--cc: #F472B6">
                <div class="config-accent" />
                <div class="flex items-start gap-4 mb-5">
                  <div class="config-badge" :class="store.referencePhoto ? 'config-badge--done' : 'config-badge--idle'">
                    <Check v-if="store.referencePhoto" class="w-4 h-4" />
                    <span v-else>02</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <h3 class="font-display font-semibold text-text">Image de référence</h3>
                      <span class="req-badge req-badge--optional">Optionnel</span>
                    </div>
                    <p class="text-text-3 text-xs">Un artiste, un style, une ambiance — guidez notre IA pour un résultat plus précis</p>
                  </div>
                </div>
                <FileDropzone
                  v-model="store.referencePhoto"
                  placeholder="Glissez ou cliquez pour importer une inspiration"
                  hint="Style, artiste, ambiance souhaitée"
                  icon="image"
                  @update:modelValue="store.setReferencePhoto"
                />
              </div>

              <!-- Step 3 — Dimensions -->
              <div class="config-card" style="--cc: #22D3EE">
                <div class="config-accent" />
                <div class="flex items-start gap-4 mb-5">
                  <div class="config-badge config-badge--idle">
                    <span>03</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <h3 class="font-display font-semibold text-text">Dimensions du mur</h3>
                      <span class="req-badge req-badge--optional">Optionnel</span>
                    </div>
                    <p class="text-text-3 text-xs">Utilisé pour l'estimation tarifaire en temps réel</p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs text-text-3 mb-1.5 font-mono uppercase tracking-wider">Largeur (m)</label>
                    <input
                      v-model="store.dimensions.width"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="Ex: 8"
                      class="dim-input"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-text-3 mb-1.5 font-mono uppercase tracking-wider">Hauteur (m)</label>
                    <input
                      v-model="store.dimensions.height"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="Ex: 4"
                      class="dim-input"
                    />
                  </div>
                </div>
                <p v-if="wallArea > 0" class="mt-3 text-xs font-mono text-accent">
                  Surface : {{ wallArea.toFixed(1) }} m² · Estimation : {{ priceRange }}
                </p>
              </div>

            </template>

            <!-- ── SCULPTURE SERVICE ── -->
            <template v-if="store.serviceType === 'sculpture'">

              <!-- Step 1 — Reference image -->
              <div class="config-card" :class="store.referencePhoto ? 'config-card--done' : ''" style="--cc: #A78BFA">
                <div class="config-accent" />
                <div class="flex items-start gap-4 mb-5">
                  <div class="config-badge" :class="store.referencePhoto ? 'config-badge--done' : 'config-badge--active'">
                    <Check v-if="store.referencePhoto" class="w-4 h-4" />
                    <span v-else>01</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <h3 class="font-display font-semibold text-text">Image de référence</h3>
                      <span class="req-badge req-badge--required">Requis</span>
                    </div>
                    <p class="text-text-3 text-xs">Photo plate ou illustration qui sera transformée en concept 3D par notre IA</p>
                  </div>
                </div>
                <FileDropzone
                  v-model="store.referencePhoto"
                  placeholder="Glissez votre image de référence"
                  hint="Portrait, objet, logo — notre IA sculpte votre vision"
                  icon="image"
                  required
                  :error="errors.wall"
                  @update:modelValue="store.setReferencePhoto"
                />
              </div>

              <!-- Step 2 — Material style -->
              <div class="config-card" style="--cc: #A78BFA">
                <div class="config-accent" />
                <div class="flex items-start gap-4 mb-5">
                  <div class="config-badge config-badge--active">
                    <span>02</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <h3 class="font-display font-semibold text-text">Matière & texture</h3>
                      <span class="req-badge req-badge--required">Requis</span>
                    </div>
                    <p class="text-text-3 text-xs">Choisissez le rendu matière de votre sculpture</p>
                  </div>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    v-for="mat in materials"
                    :key="mat.id"
                    type="button"
                    class="material-btn"
                    :class="{ 'material-btn--active': store.materialStyle === mat.id }"
                    :style="store.materialStyle === mat.id ? { '--mb': mat.color } : {}"
                    @click="store.materialStyle = mat.id"
                  >
                    <span class="material-dot" :style="{ background: mat.color }" />
                    <span class="text-sm font-medium">{{ mat.label }}</span>
                    <Check v-if="store.materialStyle === mat.id" class="w-3.5 h-3.5 ml-auto" :style="{ color: mat.color }" />
                  </button>
                </div>
              </div>

              <!-- Step 3 — Refinement sliders -->
              <div class="config-card" style="--cc: #A78BFA">
                <div class="config-accent" />
                <div class="flex items-start gap-4 mb-5">
                  <div class="config-badge config-badge--idle">
                    <span>03</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <h3 class="font-display font-semibold text-text">Affinage manuel</h3>
                      <span class="req-badge req-badge--optional">Optionnel</span>
                    </div>
                    <p class="text-text-3 text-xs">Ajustez l'épaisseur et le contraste de la sculpture</p>
                  </div>
                </div>
                <div class="space-y-5">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <label class="text-xs font-mono uppercase tracking-wider text-text-3">Épaisseur</label>
                      <span class="text-xs font-mono text-accent">{{ thickness }}%</span>
                    </div>
                    <input type="range" v-model="thickness" min="20" max="100" class="slider" />
                  </div>
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <label class="text-xs font-mono uppercase tracking-wider text-text-3">Contraste</label>
                      <span class="text-xs font-mono text-accent">{{ contrast }}%</span>
                    </div>
                    <input type="range" v-model="contrast" min="20" max="100" class="slider" />
                  </div>
                </div>
              </div>

            </template>

            <!-- ── SOL SERVICE ── -->
            <template v-if="store.serviceType === 'sol'">

              <!-- Step 1 — Floor photo -->
              <div class="config-card" :class="store.wallPhoto ? 'config-card--done' : ''" style="--cc: #FF6B35">
                <div class="config-accent" />
                <div class="flex items-start gap-4 mb-5">
                  <div class="config-badge" :class="store.wallPhoto ? 'config-badge--done' : 'config-badge--active'">
                    <Check v-if="store.wallPhoto" class="w-4 h-4" />
                    <span v-else>01</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <h3 class="font-display font-semibold text-text">Photo du sol</h3>
                      <span class="req-badge req-badge--required">Requis</span>
                    </div>
                    <p class="text-text-3 text-xs">Vue de dessus ou à 45° — notre IA corrige la perspective automatiquement</p>
                  </div>
                </div>
                <FileDropzone
                  v-model="store.wallPhoto"
                  placeholder="Glissez ou cliquez pour importer votre sol"
                  hint="PNG, JPG, WEBP · vue de dessus ou à 45° recommandée"
                  icon="upload"
                  required
                  :error="errors.wall"
                  @update:modelValue="store.setWallPhoto"
                />
              </div>

              <!-- Step 2 — Surface finish -->
              <div class="config-card" style="--cc: #FF6B35">
                <div class="config-accent" />
                <div class="flex items-start gap-4 mb-5">
                  <div class="config-badge config-badge--active">
                    <span>02</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <h3 class="font-display font-semibold text-text">Finition de surface</h3>
                      <span class="req-badge req-badge--required">Requis</span>
                    </div>
                    <p class="text-text-3 text-xs">Choisissez le type de finition époxy</p>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-3">
                  <button
                    v-for="finish in surfaceFinishes"
                    :key="finish.id"
                    type="button"
                    class="finish-btn"
                    :class="{ 'finish-btn--active': store.surfaceFinish === finish.id }"
                    :style="store.surfaceFinish === finish.id ? { '--fb': finish.color } : {}"
                    @click="store.surfaceFinish = finish.id"
                  >
                    <span class="finish-icon" :style="{ background: finish.gradient }" />
                    <span class="text-sm font-medium">{{ finish.label }}</span>
                    <span class="text-[10px] font-mono text-text-3">{{ finish.desc }}</span>
                  </button>
                </div>
              </div>

              <!-- Step 3 — Surface area -->
              <div class="config-card" style="--cc: #FF6B35">
                <div class="config-accent" />
                <div class="flex items-start gap-4 mb-5">
                  <div class="config-badge config-badge--idle">
                    <span>03</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <h3 class="font-display font-semibold text-text">Surface à couvrir</h3>
                      <span class="req-badge req-badge--optional">Optionnel</span>
                    </div>
                    <p class="text-text-3 text-xs">Utilisé pour l'estimation automatique du coût</p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs text-text-3 mb-1.5 font-mono uppercase tracking-wider">Longueur (m)</label>
                    <input v-model="store.dimensions.width" type="number" min="0" step="0.5" placeholder="Ex: 10" class="dim-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-text-3 mb-1.5 font-mono uppercase tracking-wider">Largeur (m)</label>
                    <input v-model="store.dimensions.height" type="number" min="0" step="0.5" placeholder="Ex: 6" class="dim-input" />
                  </div>
                </div>
                <p v-if="wallArea > 0" class="mt-3 text-xs font-mono text-accent">
                  Surface : {{ wallArea.toFixed(1) }} m² · Estimation : {{ solPriceRange }}
                </p>
              </div>

            </template>

            <!-- ── AI CHAT DESCRIPTION ────────────────────────────────── -->
            <div class="chat-card" :class="chatDone ? 'chat-card--done' : ''" style="--cc: #3D7BFF">
              <div class="config-accent" />

              <!-- Step header — matches config-card structure -->
              <div class="chat-header">
                <div class="flex items-start gap-4">
                  <div class="config-badge shrink-0" :class="chatDone ? 'config-badge--done' : 'config-badge--active'">
                    <Check v-if="chatDone" class="w-4 h-4" />
                    <span v-else>04</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 class="font-display font-semibold text-text">Décrivez votre projet</h3>
                      <span class="req-badge req-badge--required">Requis</span>
                    </div>
                    <p class="text-[10px] font-mono text-text-3 uppercase tracking-wider">Guidez l'IA — style, couleurs, références</p>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <div class="ai-avatar shrink-0">
                    <Sparkles class="w-3.5 h-3.5" />
                  </div>
                  <span v-if="chatDone" class="flex items-center gap-1 text-xs text-success font-semibold">
                    <CheckCircle2 class="w-3.5 h-3.5" /> Prêt
                  </span>
                  <span v-else class="chat-live-dot" />
                </div>
              </div>

              <!-- Messages -->
              <div ref="chatContainer" class="chat-messages">
                <TransitionGroup name="msg">
                  <div
                    v-for="(msg, i) in chatMessages"
                    :key="i"
                    :class="msg.role === 'ai' ? 'chat-row chat-row--ai' : 'chat-row chat-row--user'"
                  >
                    <div v-if="msg.role === 'ai'" class="ai-avatar ai-avatar--sm shrink-0">
                      <Sparkles class="w-3 h-3" />
                    </div>
                    <div :class="msg.role === 'ai' ? 'chat-bubble chat-bubble--ai' : 'chat-bubble chat-bubble--user'">
                      {{ msg.text }}
                    </div>
                  </div>
                </TransitionGroup>

                <!-- Typing indicator -->
                <div v-if="isTyping" class="chat-row chat-row--ai">
                  <div class="ai-avatar ai-avatar--sm shrink-0"><Sparkles class="w-3 h-3" /></div>
                  <div class="chat-bubble chat-bubble--ai chat-typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>

              <!-- Suggestion chips -->
              <div v-if="currentSuggestions.length && !chatDone && !isTyping" class="chat-suggestions">
                <button
                  v-for="s in currentSuggestions"
                  :key="s"
                  type="button"
                  class="chip"
                  @click="sendMessage(s)"
                >{{ s }}</button>
              </div>

              <!-- Input -->
              <div class="chat-input-row">
                <input
                  ref="chatInputEl"
                  v-model="chatInput"
                  :placeholder="chatDone ? 'Discussion terminée ✓' : 'Votre réponse…'"
                  :disabled="chatDone || isTyping"
                  class="chat-input"
                  @keydown.enter.prevent="sendMessage()"
                />
                <button
                  type="button"
                  class="chat-send"
                  :disabled="!chatInput.trim() || chatDone || isTyping"
                  @click="sendMessage()"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13,8 L3,8 M9,4 L13,8 L9,12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- ── CTA BLOCK ──────────────────────────────────────────── -->
            <div class="cta-block">
              <!-- Spray accent -->
              <div class="absolute -top-8 right-8 w-48 h-48 rounded-full pointer-events-none"
                style="background:#3D7BFF; filter:blur(70px); opacity:0.08;" />

              <div class="relative z-10">
                <!-- Checklist -->
                <div class="flex flex-wrap gap-x-6 gap-y-2 mb-5">
                  <div class="check-row" :class="(store.wallPhoto || store.referencePhoto) ? 'check-row--done' : ''">
                    <CheckCircle2 v-if="store.wallPhoto || store.referencePhoto" class="w-3.5 h-3.5" />
                    <Circle v-else class="w-3.5 h-3.5" />
                    Photo importée
                  </div>
                  <div v-if="store.serviceType === 'sculpture'" class="check-row check-row--done">
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    Matière : {{ materials.find(m => m.id === store.materialStyle)?.label }}
                  </div>
                  <div v-if="store.serviceType === 'sol'" class="check-row check-row--done">
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    Finition : {{ surfaceFinishes.find(f => f.id === store.surfaceFinish)?.label }}
                  </div>
                  <div class="check-row" :class="chatDone ? 'check-row--done' : ''">
                    <CheckCircle2 v-if="chatDone" class="w-3.5 h-3.5" />
                    <Circle v-else class="w-3.5 h-3.5" />
                    Description IA
                  </div>
                </div>

                <!-- Button row -->
                <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <BaseButton type="submit" size="lg" :loading="loading" class="w-full sm:w-auto">
                    <Sparkles class="w-4 h-4" />
                    {{ currentService.cta }}
                  </BaseButton>
                  <div>
                    <p class="text-text-3 text-xs font-mono">⚡ Résultat en ~2 secondes</p>
                    <p class="text-text-3 text-xs">Gratuit · Sans engagement</p>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        <!-- ── RIGHT: SIDEBAR ─────────────────────────────────────── -->
        <div class="lg:col-span-2 space-y-5 lg:sticky lg:top-28">

          <!-- Live preview -->
          <div class="preview-card">
            <div class="preview-card-header">
              <span class="font-mono text-xs font-bold uppercase tracking-widest text-text-2">Aperçu live</span>
              <span class="flex items-center gap-1.5 text-xs text-text-3">
                <span class="w-1.5 h-1.5 rounded-full transition-colors"
                  :class="previewUrl ? 'bg-success' : 'bg-border-strong'" />
                {{ previewUrl ? 'Photo importée' : 'En attente' }}
              </span>
            </div>
            <div class="aspect-video bg-surface-2 relative overflow-hidden">
              <Transition name="preview">
                <img v-if="previewUrl" :src="previewUrl" :alt="currentService.previewAlt" class="w-full h-full object-cover" />
                <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-text-3 p-6 text-center">
                  <div class="w-16 h-16 rounded-xl border-2 border-dashed border-border-strong flex items-center justify-center">
                    <ImageIcon class="w-7 h-7 opacity-40" />
                  </div>
                  <p class="text-xs leading-relaxed opacity-60">{{ currentService.previewHint }}</p>
                </div>
              </Transition>
              <div v-if="!previewUrl"
                class="absolute bottom-2 right-2 font-mono text-[9px] font-bold uppercase tracking-widest text-text-3/30 select-none">
                {{ currentService.previewWatermark }}
              </div>
            </div>
          </div>

          <!-- Live estimator -->
          <div v-if="wallArea > 0" class="estimator-card">
            <div class="flex items-center gap-2 mb-4">
              <span class="w-4 h-px bg-warning" />
              <p class="font-mono text-[11px] font-bold uppercase tracking-widest text-warning">Estimateur en direct</p>
            </div>
            <div class="space-y-3">
              <div class="est-row">
                <span class="text-text-3 text-xs">Surface</span>
                <span class="font-mono text-sm font-semibold text-text">{{ wallArea.toFixed(1) }} m²</span>
              </div>
              <div class="est-row">
                <span class="text-text-3 text-xs">Tarif unitaire</span>
                <span class="font-mono text-sm font-semibold text-text">{{ currentService.unitRate }} / m²</span>
              </div>
              <div class="est-row border-t border-border pt-3">
                <span class="text-text-3 text-sm font-medium">Estimation totale</span>
                <span class="font-display text-lg font-bold text-accent">{{ estimatedTotal }}</span>
              </div>
              <p class="text-text-3 text-[10px] font-mono">* Estimation indicative · Devis précis sous 24h</p>
            </div>
          </div>

          <!-- What happens next -->
          <div class="next-card">
            <div class="flex items-center gap-2 mb-5">
              <span class="w-4 h-px bg-accent" />
              <p class="font-mono text-[11px] font-bold uppercase tracking-widest text-accent">Ce qui se passe ensuite</p>
            </div>
            <div class="space-y-3">
              <div v-for="(n, i) in nextSteps" :key="i" class="next-step" :style="{ '--ns': n.color }">
                <div class="next-step-num">{{ String(i+2).padStart(2,'0') }}</div>
                <div class="flex-1 min-w-0">
                  <p class="font-display font-semibold text-text text-sm leading-tight">{{ n.title }}</p>
                  <p class="text-text-3 text-xs mt-0.5 leading-relaxed">{{ n.desc }}</p>
                </div>
                <component :is="n.icon" class="w-4 h-4 shrink-0 opacity-60" :style="{ color: n.color }" />
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div class="bg-surface-1 border border-border rounded-xl p-5">
            <p class="font-display font-semibold text-text text-sm mb-4 flex items-center gap-2">
              <Lightbulb class="w-4 h-4 text-warning shrink-0" />
              Conseils pour un meilleur résultat
            </p>
            <ul class="space-y-2.5">
              <li v-for="tip in currentService.tips" :key="tip.text" class="flex items-start gap-2.5">
                <component :is="tip.icon" class="w-3.5 h-3.5 shrink-0 mt-0.5" :style="{ color: tip.color }" />
                <span class="text-text-2 text-xs leading-relaxed">{{ tip.text }}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronRight, Check, CheckCircle2, Circle,
  Sparkles, Lightbulb, ImageIcon, Eye, FileText,
  Sun, Maximize2, AlignLeft, PenLine, Layers, Grid3x3,
} from 'lucide-vue-next'
import { useRequestStore } from '@/stores/request.js'
import { generateFresco } from '@/mocks/api.js'
import NavBar from '@/components/layout/NavBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import FileDropzone from '@/components/ui/FileDropzone.vue'

const store = useRequestStore()
const router = useRouter()
const loading = ref(false)
const errors = reactive({ wall: '', description: '' })
const thickness = ref(60)
const contrast = ref(70)

// ── Service definitions ────────────────────────────────────────────
const services = [
  {
    id: 'mural',
    label: 'Dessin Mural',
    badge: 'Fresque IA',
    color: '#3D7BFF',
    icon: PenLine,
    heroTitle: 'Visualisez votre fresque,',
    heroAccent: 'avant de commencer.',
    heroDesc: "Uploadez une photo de votre mur, décrivez votre vision. Notre IA génère un aperçu réaliste en 2 secondes — puis nos artistes le réalisent.",
    cta: 'Générer ma fresque →',
    unitRate: '180 – 350 DT',
    previewAlt: 'Votre mur',
    previewHint: 'Importez votre photo\nde mur pour prévisualiser',
    previewWatermark: 'VOTRE MUR',
    stickers: [
      { label: 'IA Générative', color: '#3D7BFF', rotate: -3 },
      { label: 'Gratuit',       color: '#4ADE80', rotate:  2 },
      { label: 'Art Mural',     color: '#FB923C', rotate: -2 },
      { label: '~2 secondes',   color: '#F472B6', rotate:  2 },
    ],
    tips: [
      { icon: Sun,       color: '#FBBF24', text: 'Photographiez le mur en pleine lumière naturelle pour un meilleur rendu.' },
      { icon: Maximize2, color: '#3D7BFF', text: "Cadrez le mur entier dans l'image, sans objets qui le cachent." },
      { icon: AlignLeft, color: '#F472B6', text: "Plus votre description est précise, plus le résultat est fidèle à votre vision." },
      { icon: ImageIcon, color: '#4ADE80', text: "Une image de référence (artiste, style) améliore significativement la génération." },
    ],
  },
  {
    id: 'sculpture',
    label: 'Sculpture 3D',
    badge: 'Photo → 3D',
    color: '#A78BFA',
    icon: Layers,
    heroTitle: 'Transformez vos images',
    heroAccent: 'en sculptures 3D.',
    heroDesc: "Importez une photo de référence, choisissez votre matière. Notre IA génère le concept sculpture en 3D — argile, marbre, métal, béton ou néon.",
    cta: 'Générer ma sculpture →',
    unitRate: '800 – 3 000 DT',
    previewAlt: 'Votre référence',
    previewHint: 'Importez votre image\nde référence à sculpter',
    previewWatermark: 'RÉFÉRENCE',
    stickers: [
      { label: 'Sculpture 3D', color: '#A78BFA', rotate: -3 },
      { label: '5 matières',   color: '#4ADE80', rotate:  2 },
      { label: 'IA Générative', color: '#FB923C', rotate: -2 },
      { label: 'Sur mesure',   color: '#22D3EE', rotate:  2 },
    ],
    tips: [
      { icon: ImageIcon, color: '#A78BFA', text: "Utilisez une image nette avec un sujet bien défini (portrait, logo, objet)." },
      { icon: Sun,       color: '#FBBF24', text: "Un fond neutre ou contrasté aide l'IA à isoler le sujet." },
      { icon: Maximize2, color: '#3D7BFF', text: "Plus la résolution est haute, plus les détails sculptés sont fins." },
      { icon: AlignLeft, color: '#F472B6', text: "Précisez l'usage prévu : indoor/outdoor, taille estimée, emplacement." },
    ],
  },
  {
    id: 'sol',
    label: 'Design Sol',
    badge: 'Époxy & Art',
    color: '#FF6B35',
    icon: Grid3x3,
    heroTitle: 'Art au sol haute gamme,',
    heroAccent: 'visualisé par IA.',
    heroDesc: "Photographiez votre sol, choisissez la finition époxy. Notre IA rend votre design au sol avec correction de perspective automatique.",
    cta: 'Générer mon sol →',
    unitRate: '120 – 280 DT',
    previewAlt: 'Votre sol',
    previewHint: 'Importez votre photo\nde sol pour prévisualiser',
    previewWatermark: 'VOTRE SOL',
    stickers: [
      { label: 'Art au Sol',   color: '#FF6B35', rotate: -3 },
      { label: 'Époxy Pro',    color: '#4ADE80', rotate:  2 },
      { label: 'IA Générative', color: '#3D7BFF', rotate: -2 },
      { label: 'Devis Auto',   color: '#F472B6', rotate:  2 },
    ],
    tips: [
      { icon: Maximize2, color: '#FF6B35', text: "Prenez la photo de dessus ou à 45° pour une correction de perspective optimale." },
      { icon: Sun,       color: '#FBBF24', text: "Bonne luminosité — évitez les reflets et les ombres projetées." },
      { icon: AlignLeft, color: '#4ADE80', text: "Précisez le type de local : garage, showroom, appartement, parking…" },
      { icon: ImageIcon, color: '#22D3EE', text: "Une image de référence de style (décalcomanie, époxy rivière) aide l'IA." },
    ],
  },
]

const currentService = computed(() => services.find(s => s.id === store.serviceType) ?? services[0])

// ── Materials (sculpture) ──────────────────────────────────────────
const materials = [
  { id: 'clay',     label: 'Argile',     color: '#FB923C' },
  { id: 'marble',   label: 'Marbre',     color: '#E2E8F0' },
  { id: 'metal',    label: 'Métal',      color: '#94A3B8' },
  { id: 'concrete', label: 'Béton',      color: '#78716C' },
  { id: 'neon',     label: 'Néon Glaze', color: '#22D3EE' },
]

// ── Surface finishes (sol) ─────────────────────────────────────────
const surfaceFinishes = [
  { id: 'mat',        label: 'Mat',        desc: 'Élégant & sobre',     color: '#94A3B8', gradient: 'linear-gradient(135deg, #334155, #64748B)' },
  { id: 'brillant',   label: 'Brillant',   desc: 'Haut-reflet & luxe',  color: '#22D3EE', gradient: 'linear-gradient(135deg, #0891B2, #67E8F9)' },
  { id: 'metallique', label: 'Métallique', desc: 'Effet miroir & chrome', color: '#A78BFA', gradient: 'linear-gradient(135deg, #7C3AED, #C4B5FD)' },
]

// ── Computed preview URL ───────────────────────────────────────────
const previewUrl = computed(() => {
  if (store.serviceType === 'sculpture') return store.referencePhotoUrl
  return store.wallPhotoUrl
})

// ── Estimator ─────────────────────────────────────────────────────
const wallArea = computed(() => {
  const w = parseFloat(store.dimensions.width)
  const h = parseFloat(store.dimensions.height)
  if (!w || !h || w <= 0 || h <= 0) return 0
  return w * h
})

const priceRange = computed(() => {
  const a = wallArea.value
  if (!a) return ''
  const low = Math.round(a * 180 / 100) * 100
  const high = Math.round(a * 350 / 100) * 100
  return `${low} – ${high} DT`
})

const solPriceRange = computed(() => {
  const a = wallArea.value
  if (!a) return ''
  const low = Math.round(a * 120 / 100) * 100
  const high = Math.round(a * 280 / 100) * 100
  return `${low} – ${high} DT`
})

const estimatedTotal = computed(() => {
  if (store.serviceType === 'sol') return solPriceRange.value
  return priceRange.value
})

// ── Static data ────────────────────────────────────────────────────
const funnelSteps = [
  { label: 'Configurer',    color: '#FB923C' },
  { label: 'Visualiser',   color: '#3D7BFF' },
  { label: 'Recevoir devis', color: '#4ADE80' },
]

const nextSteps = [
  {
    title: "L'IA génère votre rendu",
    desc: "En ~2 secondes, notre modèle visualise votre projet.",
    color: '#3D7BFF',
    icon: Sparkles,
  },
  {
    title: 'Vous visualisez le résultat',
    desc: "Comparez avant/après et régénérez sans limite.",
    color: '#A78BFA',
    icon: Eye,
  },
  {
    title: 'Vous recevez votre devis',
    desc: "Nos artistes préparent un devis personnalisé sous 24h.",
    color: '#4ADE80',
    icon: FileText,
  },
]

// ── AI Chat ───────────────────────────────────────────────────────
const chatMessages  = ref([])
const chatInput     = ref('')
const chatStep      = ref(0)
const isTyping      = ref(false)
const chatDone      = ref(false)
const chatContainer = ref(null)
const chatInputEl   = ref(null)

const chatQuestionSets = {
  mural: [
    { text: "Bonjour 👋 Je suis votre assistant Blechesm AI. Quel univers visuel vous inspire pour cette fresque ? (street art, abstrait, nature, figuratif, lettrage…)", suggestions: ['Street art', 'Abstrait', 'Nature', 'Figuratif', 'Lettrage'] },
    { text: "Quelles couleurs dominent votre vision ?", suggestions: ['Tons chauds', 'Tons froids', 'Monochrome', 'Multicolore', 'Noir & blanc'] },
    { text: "Des artistes ou références qui vous inspirent ?", suggestions: ['Banksy', 'Retna', 'Os Gemeos', 'Kobra', 'Pas de référence'] },
    { text: "Des contraintes ou éléments particuliers à intégrer ?", suggestions: ['Aucune contrainte', 'Façade extérieure', 'Logo à intégrer', 'Personnages', 'Texte / lettrage'] },
  ],
  sculpture: [
    { text: "Bonjour 👋 Décrivez-moi le sujet de votre sculpture. (portrait, buste, objet, logo 3D, forme abstraite…)", suggestions: ['Portrait / buste', 'Objet design', 'Logo 3D', 'Forme abstraite', 'Animal'] },
    { text: "Quelle atmosphère visuelle souhaitez-vous ?", suggestions: ['Imposant & monumental', 'Délicat & fin', 'Brut & expressif', 'Épuré & minimal', 'Organique'] },
    { text: "Où sera exposée la sculpture ?", suggestions: ['Entrée villa', 'Espace commercial', 'Jardin extérieur', 'Bureau / lobby', 'Événement'] },
  ],
  sol: [
    { text: "Bonjour 👋 Quel type de design au sol vous attire ?", suggestions: ['Époxy rivière', 'Géométrique', 'Effet marbre', 'Décalcomanie', 'Abstrait'] },
    { text: "Quel est l'usage de l'espace concerné ?", suggestions: ['Garage', 'Showroom', 'Appartement', 'Restaurant', 'Parking'] },
    { text: "Des couleurs ou ambiances particulières souhaitées ?", suggestions: ['Bleu nuit & gris', 'Tons chauds terracotta', 'Noir & métallique', 'Blanc luxe', 'Naturel & bois'] },
  ],
}

const chatQuestions     = computed(() => chatQuestionSets[store.serviceType] ?? chatQuestionSets.mural)
const currentSuggestions = computed(() => chatQuestions.value[chatStep.value]?.suggestions ?? [])

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

function scrollChat() {
  nextTick(() => {
    if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  })
}

function initChat() {
  chatMessages.value = []
  chatStep.value     = 0
  chatDone.value     = false
  chatInput.value    = ''
  store.description  = ''
  setTimeout(() => {
    chatMessages.value.push({ role: 'ai', text: chatQuestions.value[0].text })
    scrollChat()
  }, 350)
}

async function sendMessage(suggestion) {
  const text = (suggestion ?? chatInput.value).trim()
  if (!text || isTyping.value || chatDone.value) return
  chatInput.value = ''
  chatMessages.value.push({ role: 'user', text })
  scrollChat()

  // Build description from all user messages
  store.description = chatMessages.value
    .filter(m => m.role === 'user')
    .map(m => m.text)
    .join(' — ')

  const next = chatStep.value + 1
  chatStep.value = next

  isTyping.value = true
  await delay(650)
  isTyping.value = false

  if (next >= chatQuestions.value.length) {
    chatDone.value = true
    chatMessages.value.push({ role: 'ai', text: "✓ Parfait ! J'ai tout ce qu'il faut pour guider l'IA. Cliquez sur Générer pour lancer la visualisation." })
  } else {
    chatMessages.value.push({ role: 'ai', text: chatQuestions.value[next].text })
  }
  scrollChat()
}

onMounted(initChat)
watch(() => store.serviceType, initChat)

// ── Form submit ────────────────────────────────────────────────────
async function handleGenerate() {
  errors.wall = ''
  const needsPhoto = store.serviceType === 'sculpture' ? store.referencePhoto : store.wallPhoto
  if (!needsPhoto) {
    errors.wall = 'Veuillez importer une photo.'
    return
  }
  loading.value = true
  try {
    const url = await generateFresco(store.wallPhoto ?? store.referencePhoto, store.referencePhoto, store.description)
    store.setGeneratedImage(url)
    router.push('/resultat')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ── Hero section ───────────────────────────────────────────────── */
.hero-section {
  background: linear-gradient(180deg, var(--color-surface-1) 0%, var(--color-bg) 90%);
  border-bottom: 1px solid var(--color-border);
}

/* ── Spray blobs ────────────────────────────────────────────────── */
.spray {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.07;
  pointer-events: none;
}
.spray-orange { background: #FF6B35; }
.spray-cyan   { background: #22D3EE; }

/* ── Hero animations ────────────────────────────────────────────── */
.h-eyebrow  { animation: fade-up 0.4s ease 0.05s both; }
.h-eyebrow2 { animation: fade-up 0.5s ease 0.12s both; }
.h-title    { animation: fade-up 0.6s ease 0.22s both; }
.h-sub      { animation: fade-up 0.5s ease 0.36s both; }
.h-funnel   { animation: fade-up 0.5s ease 0.48s both; }
.h-stickers { animation: fade-left 0.6s ease 0.2s both; }
.h-service-tabs { animation: fade-up 0.4s ease 0.55s both; }

/* ── Service tabs ───────────────────────────────────────────────── */
.scrollbar-none { scrollbar-width: none; }
.scrollbar-none::-webkit-scrollbar { display: none; }

.service-tab {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 16px;
  border-radius: 6px;
  border: 1.5px solid transparent;
  font-size: 13px;
  color: var(--color-text-3);
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.service-tab:hover {
  color: var(--color-text);
  background: rgba(255,255,255,0.04);
}
.service-tab--active {
  color: var(--tc);
  border-color: color-mix(in srgb, var(--tc) 40%, transparent);
  background: color-mix(in srgb, var(--tc) 8%, transparent);
}

.tab-badge {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(255,255,255,0.07);
  color: var(--color-text-3);
}
.service-tab--active .tab-badge {
  background: color-mix(in srgb, var(--tc) 15%, transparent);
  color: var(--tc);
}

/* ── Stickers ───────────────────────────────────────────────────── */
.sticker {
  display: inline-block;
  padding: 5px 12px;
  border: 2px solid var(--sc);
  color: var(--sc);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  white-space: nowrap;
  background: rgba(0,0,0,0.25);
  animation: fade-left 0.5s ease both;
  transition: box-shadow 0.2s;
}
.sticker:hover { box-shadow: 0 0 14px color-mix(in srgb, var(--sc) 40%, transparent); }

/* ── Funnel steps ───────────────────────────────────────────────── */
.funnel-step {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 4px;
  border: 1.5px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  transition: border-color 0.2s, background 0.2s;
}
.funnel-step--active {
  border-color: rgba(61,123,255,0.35);
  background: rgba(61,123,255,0.08);
}
.funnel-num {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 800;
  color: var(--fs);
  letter-spacing: 0.05em;
}
.funnel-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-2);
}
.funnel-step--active .funnel-label { color: var(--color-text); }

/* ── Config cards ───────────────────────────────────────────────── */
.config-card {
  position: relative;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
  animation: fade-up 0.45s ease both;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.config-card:nth-child(1) { animation-delay: 0.05s; }
.config-card:nth-child(2) { animation-delay: 0.13s; }
.config-card:nth-child(3) { animation-delay: 0.21s; }
.config-card:nth-child(4) { animation-delay: 0.29s; }
.config-card:hover {
  border-color: color-mix(in srgb, var(--cc) 40%, transparent);
}
.config-card--done {
  border-color: color-mix(in srgb, var(--cc) 30%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--cc) 12%, transparent);
}

.config-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--cc);
  border-radius: 12px 0 0 12px;
  opacity: 0.6;
  transition: width 0.2s, opacity 0.2s;
}
.config-card:hover .config-accent,
.config-card--done .config-accent { opacity: 1; width: 4px; }

.config-badge {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
}
.config-badge--active {
  background: color-mix(in srgb, var(--cc) 18%, transparent);
  color: var(--cc);
  border: 1px solid color-mix(in srgb, var(--cc) 35%, transparent);
}
.config-badge--idle {
  background: var(--color-surface-2);
  color: var(--color-text-3);
  border: 1px solid var(--color-border-strong);
}
.config-badge--done {
  background: var(--color-success);
  color: var(--color-bg);
  border: none;
}

/* ── Required / optional badges ─────────────────────────────────── */
.req-badge {
  font-size: 10px;
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 7px;
  border-radius: 3px;
  border: 1px solid;
}
.req-badge--required {
  color: #FBBF24;
  border-color: rgba(251,191,36,0.35);
  background: rgba(251,191,36,0.07);
}
.req-badge--optional {
  color: var(--color-text-3);
  border-color: var(--color-border-strong);
  background: transparent;
}

/* ── Dimension inputs ───────────────────────────────────────────── */
.dim-input {
  width: 100%;
  background: rgba(255,255,255,0.07);
  border: 1.5px solid rgba(255,255,255,0.18);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  color: #fff;
  font-family: var(--font-mono);
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  outline: none;
}
.dim-input::placeholder { color: rgba(255,255,255,0.3); }
.dim-input:focus {
  border-color: var(--color-accent);
  background: rgba(61,123,255,0.08);
  box-shadow: 0 0 0 3px rgba(61,123,255,0.15);
}
.dim-input::-webkit-inner-spin-button,
.dim-input::-webkit-outer-spin-button { opacity: 0.4; }

/* ── Material buttons ───────────────────────────────────────────── */
.material-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.75);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.material-btn:hover {
  border-color: rgba(255,255,255,0.28);
  color: #fff;
  background: rgba(255,255,255,0.1);
}
.material-btn--active {
  border-color: var(--mb);
  background: color-mix(in srgb, var(--mb) 14%, rgba(255,255,255,0.05));
  color: #fff;
}

.material-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── Range sliders ──────────────────────────────────────────────── */
.slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--color-border-strong);
  border-radius: 4px;
  outline: none;
  cursor: pointer;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-accent);
  border: 2px solid var(--color-bg);
  box-shadow: 0 0 0 2px rgba(61,123,255,0.3);
  transition: box-shadow 0.15s;
}
.slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 4px rgba(61,123,255,0.25);
}

/* ── Finish buttons ─────────────────────────────────────────────── */
.finish-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px;
  border-radius: 10px;
  border: 1.5px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.75);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
  text-align: center;
}
.finish-btn:hover {
  border-color: rgba(255,255,255,0.28);
  color: #fff;
  background: rgba(255,255,255,0.1);
}
.finish-btn--active {
  border-color: var(--fb);
  background: color-mix(in srgb, var(--fb) 14%, rgba(255,255,255,0.05));
  color: #fff;
}

.finish-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  flex-shrink: 0;
}

/* ── AI Chat card ───────────────────────────────────────────────── */
.chat-card {
  position: relative;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  animation: fade-up 0.45s ease 0.25s both;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.chat-card:hover {
  border-color: color-mix(in srgb, var(--cc) 40%, transparent);
}
.chat-card--done {
  border-color: color-mix(in srgb, var(--color-success) 30%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-success) 12%, transparent);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
}

.ai-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-accent-soft);
  border: 1px solid rgba(61,123,255,0.3);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ai-avatar--sm {
  width: 24px;
  height: 24px;
  border-radius: 6px;
}

.chat-live-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 6px var(--color-success);
  animation: live-pulse 1.8s ease-in-out infinite;
}
@keyframes live-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 24px;
  max-height: 280px;
  overflow-y: auto;
  scroll-behavior: smooth;
}
.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-thumb { background: var(--color-border-strong); border-radius: 4px; }

.chat-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.chat-row--user { flex-direction: row-reverse; }

.chat-bubble {
  max-width: 78%;
  padding: 9px 13px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.55;
}
.chat-bubble--ai {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.88);
  border-bottom-left-radius: 3px;
}
.chat-bubble--user {
  background: var(--color-accent);
  color: #fff;
  border-bottom-right-radius: 3px;
}

/* Typing indicator */
.chat-typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 12px 16px;
}
.chat-typing span {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-text-3);
  animation: typing-dot 1.2s ease-in-out infinite;
}
.chat-typing span:nth-child(2) { animation-delay: 0.2s; }
.chat-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing-dot {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30%           { transform: translateY(-5px); opacity: 1; }
}

/* Suggestion chips */
.chat-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 24px 16px;
}
.chip {
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.75);
  font-size: 12px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  white-space: nowrap;
}
.chip:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: rgba(61,123,255,0.12);
}

/* Input row */
.chat-input-row {
  display: flex;
  gap: 8px;
  padding: 14px 24px;
  border-top: 1px solid rgba(255,255,255,0.08);
  background: rgba(4,6,18,0.6);
}
.chat-input {
  flex: 1;
  background: rgba(255,255,255,0.08);
  border: 1.5px solid rgba(255,255,255,0.18);
  border-radius: 8px;
  padding: 9px 13px;
  font-size: 13px;
  color: #fff;
  outline: none;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}
.chat-input::placeholder { color: rgba(255,255,255,0.35); }
.chat-input:focus {
  border-color: var(--color-accent);
  background: rgba(61,123,255,0.08);
  box-shadow: 0 0 0 3px rgba(61,123,255,0.13);
}
.chat-input:disabled { opacity: 0.45; cursor: not-allowed; }

.chat-send {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: var(--color-accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, opacity 0.15s, transform 0.1s;
}
.chat-send:hover:not(:disabled) { background: var(--color-accent-hover); transform: scale(1.05); }
.chat-send:disabled { opacity: 0.35; cursor: not-allowed; }

/* Message transition */
.msg-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.msg-enter-from   { opacity: 0; transform: translateY(8px); }

/* ── CTA block ──────────────────────────────────────────────────── */
.cta-block {
  position: relative;
  background: var(--color-surface-1);
  border: 1.5px solid var(--color-border-strong);
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
  animation: fade-up 0.45s ease 0.35s both;
}

.check-row {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--color-text-3);
  transition: color 0.2s;
}
.check-row--done { color: var(--color-success); }

/* ── Preview card ───────────────────────────────────────────────── */
.preview-card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}
.preview-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

/* ── Estimator card ─────────────────────────────────────────────── */
.estimator-card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-top: 2px solid var(--color-warning);
  border-radius: 12px;
  padding: 20px;
}
.est-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

/* ── What's next card ───────────────────────────────────────────── */
.next-card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
}
.next-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: border-color 0.15s, background 0.15s;
}
.next-step:hover {
  border-color: color-mix(in srgb, var(--ns) 25%, transparent);
  background: color-mix(in srgb, var(--ns) 5%, transparent);
}
.next-step-num {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--ns);
  flex-shrink: 0;
  padding-top: 2px;
}

/* ── Keyframes ──────────────────────────────────────────────────── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-left {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ── Preview transition ─────────────────────────────────────────── */
.preview-enter-active, .preview-leave-active { transition: opacity 0.3s ease; }
.preview-enter-from, .preview-leave-to { opacity: 0; }

/* ── Reduced motion ─────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .h-eyebrow, .h-eyebrow2, .h-title, .h-sub,
  .h-funnel, .h-stickers, .h-service-tabs, .sticker,
  .config-card, .cta-block, .chat-card { animation: none; }
  .config-accent, .config-badge, .next-step,
  .service-tab, .material-btn, .finish-btn,
  .chip, .chat-send, .chat-input { transition: none; }
  .chat-live-dot, .chat-typing span { animation: none; }
  .msg-enter-active { transition: none; }
}
</style>
