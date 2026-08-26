<template>
  <div class="bg-bg min-h-screen text-text overflow-x-hidden">
    <NavBar />

    <!-- ── HERO ─────────────────────────────────────────────────────── -->
    <section class="relative pt-24 pb-10 overflow-hidden hero-section">
      <div class="absolute inset-0 grid-bg opacity-[0.07] pointer-events-none" />
      <div class="spray spray-orange absolute -top-12 -right-12 w-[260px] h-[260px]" style="opacity:0.045" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-1.5 mb-6 text-xs text-text-3">
          <RouterLink to="/" class="hover:text-text transition-colors">Accueil</RouterLink>
          <ChevronRight class="w-3 h-3" />
          <span class="text-accent font-medium">Configurateur IA</span>
        </nav>

        <div class="flex items-start justify-between gap-8">
          <div class="max-w-2xl">
            <div class="flex items-center gap-3 mb-4">
              <span class="w-6 h-px bg-accent" />
              <span class="text-xs font-mono uppercase tracking-widest text-accent">Blechesm AI Platform</span>
            </div>
            <h1 class="font-display text-4xl sm:text-5xl font-semibold tracking-tightest leading-[0.92] mb-4 h-title">
              Configurateur IA<br />
              <span class="relative inline-block text-accent">
                en 4 étapes
                <svg class="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 400 8" preserveAspectRatio="none" fill="none" aria-hidden="true">
                  <path d="M0,4 Q50,0 100,4 Q150,8 200,4 Q250,0 300,4 Q350,8 400,4" stroke="#FF6B35" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
                </svg>
              </span>
            </h1>
            <p class="text-text-2 text-base leading-relaxed max-w-lg h-sub">
              Suivez les étapes pour configurer votre projet. Notre IA génère un aperçu réaliste en ~2 secondes.
            </p>
          </div>

          <!-- Desktop stickers -->
          <div v-if="currentStep > 1" class="hidden lg:flex flex-col items-end gap-3 pt-6 shrink-0">
            <div v-for="(s, i) in currentService.stickers" :key="s.label"
              class="sticker" :style="{ '--sc': s.color, transform: `rotate(${s.rotate}deg)`, animationDelay: `${0.3 + i * 0.1}s` }">
              {{ s.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── STEP INDICATOR ───────────────────────────────────────────── -->
    <div class="sticky top-16 z-40 bg-bg/95 backdrop-blur-md border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center py-3 gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
          <div
            v-for="(step, i) in wizardSteps"
            :key="i"
            class="flex items-center gap-1 sm:gap-2 shrink-0"
          >
            <button
              class="step-pill"
              :class="{
                'step-pill--done': currentStep > i + 1,
                'step-pill--active': currentStep === i + 1,
                'step-pill--idle': currentStep < i + 1,
              }"
              :style="currentStep >= i + 1 ? { '--sp': step.color } : {}"
              @click="goToStep(i + 1)"
            >
              <span class="step-pill-num">
                <Check v-if="currentStep > i + 1" class="w-3 h-3" />
                <span v-else>{{ String(i + 1).padStart(2, '0') }}</span>
              </span>
              <span class="step-pill-label hidden sm:inline">{{ step.label }}</span>
            </button>
            <svg v-if="i < wizardSteps.length - 1" width="20" height="8" viewBox="0 0 20 8" class="shrink-0 text-text-3 opacity-30" fill="none">
              <path d="M1,4 Q8,1 16,4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M13,2 L17,4 L13,6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <!-- Progress fraction -->
          <div class="ml-auto shrink-0 font-mono text-[11px] text-text-3">
            {{ currentStep }}/{{ wizardSteps.length }}
          </div>
        </div>

        <!-- Progress bar -->
        <div class="h-0.5 bg-border-strong -mx-4 sm:-mx-6 lg:-mx-8">
          <div
            class="h-full transition-all duration-500 ease-out"
            :style="{ width: `${(currentStep / wizardSteps.length) * 100}%`, background: currentServiceColor }"
          />
        </div>
      </div>
    </div>

    <!-- ── MAIN CONTENT ──────────────────────────────────────────────── -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

        <!-- ── LEFT: STEP CONTENT ──────────────────────────────────── -->
        <div class="lg:col-span-3 space-y-4">

          <!-- ══ STEP 1 — Choose service ══════════════════════════════ -->
          <Transition name="step" mode="out-in">
          <div v-if="currentStep === 1" key="step1" class="space-y-4">
            <div class="step-header">
              <h2 class="font-display text-2xl font-semibold text-text">Quel type de projet ?</h2>
              <p class="text-text-3 text-sm mt-1">Sélectionnez le service qui correspond à votre besoin</p>
            </div>

            <div class="grid gap-4">
              <button
                v-for="svc in services"
                :key="svc.id"
                class="service-card"
                :class="{ 'service-card--active': store.serviceType === svc.id }"
                :style="store.serviceType === svc.id ? { '--sc': svc.color } : {}"
                @click="selectService(svc.id)"
              >
                <div class="service-card-icon" :style="{ '--sc': svc.color }">
                  <component :is="svc.icon" class="w-6 h-6" />
                </div>
                <div class="flex-1 text-left">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-display font-semibold text-text text-base">{{ svc.label }}</span>
                    <span class="svc-badge" :style="{ '--sc': svc.color }">{{ svc.badge }}</span>
                  </div>
                  <p class="text-text-3 text-sm leading-relaxed">{{ svc.heroDesc }}</p>
                </div>
                <div class="service-card-check" :class="store.serviceType === svc.id ? 'service-card-check--active' : ''">
                  <Check v-if="store.serviceType === svc.id" class="w-4 h-4" :style="{ color: svc.color }" />
                </div>
              </button>
            </div>

            <!-- Nav -->
            <div class="step-nav">
              <div />
              <BaseButton size="lg" @click="nextStep">
                Continuer
                <ChevronRight class="w-4 h-4" />
              </BaseButton>
            </div>
          </div>
          </Transition>

          <!-- ══ STEP 2 — Photos ═══════════════════════════════════════ -->
          <Transition name="step" mode="out-in">
          <div v-if="currentStep === 2" key="step2" class="space-y-4">
            <div class="step-header">
              <h2 class="font-display text-2xl font-semibold text-text">Importez vos photos</h2>
              <p class="text-text-3 text-sm mt-1">
                <span v-if="store.serviceType === 'mural'">Photographiez votre mur entier en lumière naturelle</span>
                <span v-else-if="store.serviceType === 'sculpture'">Importez une image nette de votre sujet à sculpter</span>
                <span v-else>Prenez une photo de dessus ou à 45° de votre sol</span>
              </p>
            </div>

            <!-- Mural: wall photo (required) -->
            <template v-if="store.serviceType === 'mural'">
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
            </template>

            <!-- Sculpture: reference image (required) -->
            <template v-if="store.serviceType === 'sculpture'">
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
            </template>

            <!-- Sol: floor photo (required) -->
            <template v-if="store.serviceType === 'sol'">
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
            </template>

            <!-- Error message -->
            <p v-if="errors.wall" class="text-xs text-error font-mono flex items-center gap-1.5">
              <span class="w-1 h-1 rounded-full bg-error" />
              {{ errors.wall }}
            </p>

            <!-- Nav -->
            <div class="step-nav">
              <button class="step-back" @click="prevStep">
                <ChevronLeft class="w-4 h-4" />
                Retour
              </button>
              <BaseButton size="lg" @click="validateAndNext">
                Continuer
                <ChevronRight class="w-4 h-4" />
              </BaseButton>
            </div>
          </div>
          </Transition>

          <!-- ══ STEP 3 — Options ══════════════════════════════════════ -->
          <Transition name="step" mode="out-in">
          <div v-if="currentStep === 3" key="step3" class="space-y-4">
            <div class="step-header">
              <h2 class="font-display text-2xl font-semibold text-text">Personnalisez</h2>
              <p class="text-text-3 text-sm mt-1">
                <span v-if="store.serviceType === 'mural'">Indiquez les dimensions pour une estimation de prix</span>
                <span v-else-if="store.serviceType === 'sculpture'">Choisissez la matière et ajustez les détails</span>
                <span v-else>Sélectionnez la finition et renseignez la surface</span>
              </p>
            </div>

            <!-- Mural: dimensions -->
            <template v-if="store.serviceType === 'mural'">
              <div class="config-card" style="--cc: #22D3EE">
                <div class="config-accent" />
                <div class="flex items-start gap-4 mb-5">
                  <div class="config-badge config-badge--idle">
                    <span>01</span>
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
                    <input v-model="store.dimensions.width" type="number" min="0" step="0.5" placeholder="Ex: 8" class="dim-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-text-3 mb-1.5 font-mono uppercase tracking-wider">Hauteur (m)</label>
                    <input v-model="store.dimensions.height" type="number" min="0" step="0.5" placeholder="Ex: 4" class="dim-input" />
                  </div>
                </div>
                <p v-if="wallArea > 0" class="mt-3 text-xs font-mono text-accent">
                  Surface : {{ wallArea.toFixed(1) }} m² · Estimation : {{ priceRange }}
                </p>
              </div>
            </template>

            <!-- Sculpture: material + sliders -->
            <template v-if="store.serviceType === 'sculpture'">
              <div class="config-card" style="--cc: #A78BFA">
                <div class="config-accent" />
                <div class="flex items-start gap-4 mb-5">
                  <div class="config-badge config-badge--active">
                    <span>01</span>
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

              <div class="config-card" style="--cc: #A78BFA">
                <div class="config-accent" />
                <div class="flex items-start gap-4 mb-5">
                  <div class="config-badge config-badge--idle">
                    <span>02</span>
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

            <!-- Sol: surface finish + dimensions -->
            <template v-if="store.serviceType === 'sol'">
              <div class="config-card" style="--cc: #FF6B35">
                <div class="config-accent" />
                <div class="flex items-start gap-4 mb-5">
                  <div class="config-badge config-badge--active">
                    <span>01</span>
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

              <div class="config-card" style="--cc: #FF6B35">
                <div class="config-accent" />
                <div class="flex items-start gap-4 mb-5">
                  <div class="config-badge config-badge--idle">
                    <span>02</span>
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

            <!-- Nav -->
            <div class="step-nav">
              <button class="step-back" @click="prevStep">
                <ChevronLeft class="w-4 h-4" />
                Retour
              </button>
              <BaseButton size="lg" @click="nextStep">
                Continuer
                <ChevronRight class="w-4 h-4" />
              </BaseButton>
            </div>
          </div>
          </Transition>

          <!-- ══ STEP 4 — AI Description + Generate ═══════════════════ -->
          <Transition name="step" mode="out-in">
          <div v-if="currentStep === 4" key="step4" class="space-y-4">
            <div class="step-header">
              <h2 class="font-display text-2xl font-semibold text-text">Décrivez votre vision</h2>
              <p class="text-text-3 text-sm mt-1">Guidez l'IA en répondant à quelques questions rapides</p>
            </div>

            <!-- AI Chat -->
            <div class="chat-card" :class="chatDone ? 'chat-card--done' : ''" style="--cc: #3D7BFF">
              <div class="config-accent" />
              <div class="chat-header">
                <div class="flex items-start gap-4">
                  <div class="config-badge shrink-0" :class="chatDone ? 'config-badge--done' : 'config-badge--active'">
                    <Check v-if="chatDone" class="w-4 h-4" />
                    <span v-else>01</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 class="font-display font-semibold text-text">Assistant IA</h3>
                      <span class="req-badge req-badge--required">Requis</span>
                    </div>
                    <p class="text-[10px] font-mono text-text-3 uppercase tracking-wider">Style, couleurs, références</p>
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
                <div v-if="isTyping" class="chat-row chat-row--ai">
                  <div class="ai-avatar ai-avatar--sm shrink-0"><Sparkles class="w-3 h-3" /></div>
                  <div class="chat-bubble chat-bubble--ai chat-typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>

              <div v-if="currentSuggestions.length && !chatDone && !isTyping" class="chat-suggestions">
                <button v-for="s in currentSuggestions" :key="s" type="button" class="chip" @click="sendMessage(s)">
                  {{ s }}
                </button>
              </div>

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

            <!-- Summary checklist + CTA -->
            <div class="cta-block">
              <div class="absolute -top-8 right-8 w-48 h-48 rounded-full pointer-events-none"
                style="background:#3D7BFF; filter:blur(70px); opacity:0.08;" />
              <div class="relative z-10">
                <p class="font-mono text-[11px] font-bold uppercase tracking-widest text-text-3 mb-4">Récapitulatif</p>
                <div class="flex flex-wrap gap-x-6 gap-y-2 mb-5">
                  <div class="check-row check-row--done">
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    Service : {{ currentService.label }}
                  </div>
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

                <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <BaseButton size="lg" :loading="loading" :disabled="!chatDone" class="w-full sm:w-auto" @click="handleGenerate">
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

            <!-- Nav -->
            <div class="step-nav">
              <button class="step-back" @click="prevStep">
                <ChevronLeft class="w-4 h-4" />
                Retour
              </button>
            </div>
          </div>
          </Transition>

        </div>

        <!-- ── RIGHT: SIDEBAR ─────────────────────────────────────── -->
        <div v-if="currentStep > 1" class="lg:col-span-2 space-y-5 lg:sticky lg:top-28">

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
import { useRouter, useRoute } from 'vue-router'
import {
  ChevronRight, ChevronLeft, Check, CheckCircle2, Circle,
  Sparkles, Lightbulb, ImageIcon, Eye, FileText,
  Sun, Maximize2, AlignLeft, PenLine, Layers, Grid3x3,
} from 'lucide-vue-next'
import { useRequestStore } from '@/stores/request.js'
import { generateFresco } from '@/mocks/api.js'
import NavBar from '@/components/layout/NavBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FileDropzone from '@/components/ui/FileDropzone.vue'

const store = useRequestStore()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const errors = reactive({ wall: '' })
const thickness = ref(60)
const contrast = ref(70)

// ── Wizard step state ──────────────────────────────────────────────
const currentStep = ref(1)
const totalSteps = 4

const wizardSteps = [
  { label: 'Service',     color: '#FB923C' },
  { label: 'Photos',      color: '#3D7BFF' },
  { label: 'Options',     color: '#A78BFA' },
  { label: 'Description', color: '#4ADE80' },
]

function goToStep(n) {
  if (n < currentStep.value) currentStep.value = n
}

function nextStep() {
  if (currentStep.value < totalSteps) currentStep.value++
}

function prevStep() {
  if (currentStep.value > 1) currentStep.value--
}

function validateAndNext() {
  errors.wall = ''
  const needsPhoto = store.serviceType === 'sculpture' ? store.referencePhoto : store.wallPhoto
  if (!needsPhoto) {
    errors.wall = 'Veuillez importer une photo avant de continuer.'
    return
  }
  nextStep()
}

function selectService(id) {
  store.serviceType = id
  nextStep()
}

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
const currentServiceColor = computed(() => currentService.value.color)

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

// ── Preview URL ────────────────────────────────────────────────────
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

// ── AI Chat ────────────────────────────────────────────────────────
const chatMessages   = ref([])
const chatInput      = ref('')
const chatStep       = ref(0)
const isTyping       = ref(false)
const chatDone       = ref(false)
const chatContainer  = ref(null)
const chatInputEl    = ref(null)

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

const chatQuestions      = computed(() => chatQuestionSets[store.serviceType] ?? chatQuestionSets.mural)
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

onMounted(() => {
  const validServices = ['mural', 'sculpture', 'sol']
  const requested = route.query.service
  if (requested && validServices.includes(requested)) {
    store.serviceType = requested
    currentStep.value = 2
  }
  initChat()
})

watch(() => store.serviceType, initChat)

watch(() => route.query.service, (newService) => {
  const validServices = ['mural', 'sculpture', 'sol']
  if (newService && validServices.includes(newService)) {
    store.serviceType = newService
  }
})

// ── Generate ───────────────────────────────────────────────────────
async function handleGenerate() {
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

/* ── Hero animations ────────────────────────────────────────────── */
.h-title { animation: fade-up 0.6s ease 0.1s both; }
.h-sub   { animation: fade-up 0.5s ease 0.2s both; }

/* ── Scrollbar none ─────────────────────────────────────────────── */
.scrollbar-none { scrollbar-width: none; }
.scrollbar-none::-webkit-scrollbar { display: none; }

/* ── Step pills ─────────────────────────────────────────────────── */
.step-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1.5px solid transparent;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.step-pill--active {
  border-color: color-mix(in srgb, var(--sp) 45%, transparent);
  background: color-mix(in srgb, var(--sp) 10%, transparent);
}
.step-pill--done {
  border-color: color-mix(in srgb, var(--sp) 25%, transparent);
  background: transparent;
}
.step-pill--idle {
  border-color: var(--color-border);
  background: transparent;
  cursor: default;
}

.step-pill-num {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.step-pill--active .step-pill-num {
  background: var(--sp);
  color: #000;
}
.step-pill--done .step-pill-num {
  background: color-mix(in srgb, var(--sp) 20%, transparent);
  color: var(--sp);
}
.step-pill--idle .step-pill-num {
  background: var(--color-surface-2);
  color: var(--color-text-3);
}

.step-pill-label {
  font-size: 12px;
  font-weight: 500;
}
.step-pill--active .step-pill-label { color: var(--color-text); }
.step-pill--done .step-pill-label { color: var(--color-text-2); }
.step-pill--idle .step-pill-label { color: var(--color-text-3); }

/* ── Step header ────────────────────────────────────────────────── */
.step-header {
  margin-bottom: 4px;
  animation: fade-up 0.35s ease both;
}

/* ── Service cards (step 1) ─────────────────────────────────────── */
.service-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  border: 1.5px solid var(--color-border);
  background: var(--color-surface-1);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  animation: fade-up 0.35s ease both;
  width: 100%;
}
.service-card:nth-child(1) { animation-delay: 0.05s; }
.service-card:nth-child(2) { animation-delay: 0.1s; }
.service-card:nth-child(3) { animation-delay: 0.15s; }
.service-card:hover {
  border-color: color-mix(in srgb, var(--sc, #3D7BFF) 40%, transparent);
  background: color-mix(in srgb, var(--sc, #3D7BFF) 5%, var(--color-surface-1));
}
.service-card--active {
  border-color: var(--sc);
  background: color-mix(in srgb, var(--sc) 8%, var(--color-surface-1));
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--sc) 20%, transparent);
}

.service-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--sc) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--sc) 30%, transparent);
  color: var(--sc);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.service-card-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.5px solid var(--color-border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s, background 0.15s;
}
.service-card-check--active {
  border-color: var(--sc, currentColor);
  background: color-mix(in srgb, var(--sc, currentColor) 10%, transparent);
}

.svc-badge {
  font-size: 10px;
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 2px 7px;
  border-radius: 3px;
  border: 1px solid color-mix(in srgb, var(--sc) 35%, transparent);
  background: color-mix(in srgb, var(--sc) 10%, transparent);
  color: var(--sc);
}

/* ── Step navigation ────────────────────────────────────────────── */
.step-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
}

.step-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1.5px solid var(--color-border-strong);
  background: transparent;
  color: var(--color-text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.step-back:hover {
  border-color: var(--color-text-3);
  color: var(--color-text);
  background: rgba(255,255,255,0.04);
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

/* ── Config cards ───────────────────────────────────────────────── */
.config-card {
  position: relative;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
  animation: fade-up 0.35s ease both;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.config-card:nth-child(2) { animation-delay: 0.06s; }
.config-card:nth-child(3) { animation-delay: 0.12s; }
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
  animation: fade-up 0.35s ease both;
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

.chat-row { display: flex; align-items: flex-end; gap: 8px; }
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

.chat-typing { display: flex; align-items: center; gap: 5px; padding: 12px 16px; }
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
  animation: fade-up 0.35s ease 0.06s both;
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
.est-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }

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

/* ── Step transition ────────────────────────────────────────────── */
.step-enter-active,
.step-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.step-enter-from   { opacity: 0; transform: translateX(20px); }
.step-leave-to     { opacity: 0; transform: translateX(-20px); }

/* ── Preview transition ─────────────────────────────────────────── */
.preview-enter-active, .preview-leave-active { transition: opacity 0.3s ease; }
.preview-enter-from, .preview-leave-to { opacity: 0; }

/* ── Keyframes ──────────────────────────────────────────────────── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-left {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ── Reduced motion ─────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .h-title, .h-sub, .sticker, .config-card, .cta-block, .chat-card,
  .service-card, .step-header { animation: none; }
  .config-accent, .config-badge, .next-step,
  .material-btn, .finish-btn, .chip, .chat-send, .chat-input,
  .step-pill, .service-card, .step-back { transition: none; }
  .chat-live-dot, .chat-typing span { animation: none; }
  .msg-enter-active, .step-enter-active, .step-leave-active { transition: none; }
}
</style>
