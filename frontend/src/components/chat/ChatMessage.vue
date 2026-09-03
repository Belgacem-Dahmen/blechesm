<template>
  <!-- ── AI Message ──────────────────────────────────────────────────────── -->
  <Motion
    v-if="message.role === 'ai'"
    :initial="{ opacity: 0, x: -18, y: 8 }"
    :animate="{ opacity: 1, x: 0, y: 0 }"
    :transition="{ duration: 0.45, ease: EASE }"
    class="flex items-start gap-3 mt-6 mb-6"
  >
    <!-- Avatar with ambient pulse -->
    <div class="ai-avatar w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0 mt-0.5">
      <Sparkles class="w-[14px] h-[14px] text-accent" />
    </div>

    <div class="flex-1 min-w-0 space-y-3">
      <p class="text-[10px] font-mono uppercase tracking-widest text-text-3 -mb-1 select-none">BlechESM IA</p>

      <!-- Typing indicator -->
      <div
        v-if="message.type === 'typing'"
        class="inline-flex items-center gap-[5px] px-4 py-3 bg-surface-2 border border-border rounded-2xl rounded-tl-sm"
      >
        <span class="w-[6px] h-[6px] rounded-full bg-text-3 typing-dot" />
        <span class="w-[6px] h-[6px] rounded-full bg-text-3 typing-dot" style="animation-delay:0.15s" />
        <span class="w-[6px] h-[6px] rounded-full bg-text-3 typing-dot" style="animation-delay:0.3s" />
      </div>

      <!-- Text bubble -->
      <div
        v-else-if="message.type === 'text'"
        class="inline-block max-w-[85%] px-4 py-3 bg-surface-2 border rounded-2xl rounded-tl-sm text-text text-sm leading-relaxed"
        :class="message.payload.isError ? 'border-warning/40 bg-warning/5' : 'border-border'"
        v-html="formatText(message.payload.text)"
      />

      <!-- Service picker -->
      <div v-else-if="message.type === 'service_picker'" class="space-y-2 w-full max-w-sm">
        <Motion
          v-for="(svc, i) in message.payload.services"
          :key="svc.id"
          as="button"
          :initial="{ opacity: 0, y: 12 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4, ease: EASE, delay: i * 0.09 }"
          :whileHover="{ y: -3, scale: 1.015, transition: { duration: 0.2, ease: EASE } }"
          :whileTap="{ scale: 0.975, y: 0, transition: { duration: 0.1 } }"
          class="w-full flex items-center gap-3 px-4 py-3 bg-surface-2 border border-border rounded-xl text-left transition-colors duration-150 hover:border-[var(--sc)] hover:bg-[color-mix(in_srgb,var(--sc)_5%,transparent)] group"
          :style="{ '--sc': svc.color }"
          @click="$emit('pick-service', svc.id)"
        >
          <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[var(--sc)] bg-[color-mix(in_srgb,var(--sc)_12%,transparent)] border border-[color-mix(in_srgb,var(--sc)_25%,transparent)] transition-all duration-150 group-hover:scale-110 group-hover:bg-[color-mix(in_srgb,var(--sc)_20%,transparent)]">
            <Brush v-if="svc.id === 'mural'" class="w-4 h-4" />
            <Box v-else-if="svc.id === 'sculpture'" class="w-4 h-4" />
            <Grid3X3 v-else class="w-4 h-4" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-medium text-text text-sm">{{ svc.label }}</span>
              <span class="text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-[2px] rounded border text-[var(--sc)] border-[color-mix(in_srgb,var(--sc)_30%,transparent)] bg-[color-mix(in_srgb,var(--sc)_8%,transparent)]">{{ svc.badge }}</span>
            </div>
            <p class="text-text-3 text-xs mt-0.5 leading-relaxed">{{ svc.desc }}</p>
          </div>
          <ChevronRight class="w-4 h-4 text-text-3 group-hover:text-[var(--sc)] group-hover:translate-x-0.5 transition-all shrink-0" />
        </Motion>
      </div>

      <!-- Photo upload -->
      <div v-else-if="message.type === 'photo_upload'" class="w-full max-w-full space-y-2">
        <div class="bg-surface-2 border border-border rounded-xl p-4 transition-colors hover:border-border-strong">
          <p class="text-xs text-text-2 mb-3 font-medium">{{ message.payload.label }}</p>
          <FileDropzone
            v-model="uploadedFile"
            placeholder="Glissez ou cliquez pour importer"
            hint="PNG, JPG, WEBP · max 10 Mo"
            icon="upload"
          />
        </div>
        <Motion
          v-if="message.payload.optional"
          as="button"
          :whileHover="{ x: 5, transition: { duration: 0.15 } }"
          :whileTap="{ scale: 0.96, transition: { duration: 0.08 } }"
          class="text-xs text-text-3 hover:text-text-2 transition-colors hover:underline underline-offset-2"
          @click="$emit('skip-photo')"
        >
          Passer cette étape →
        </Motion>
      </div>

      <!-- Chips (question with quick answers) -->
      <div v-else-if="message.type === 'chips'" class="space-y-2 max-w-[85%]">
        <div class="px-4 py-3 bg-surface-2 border border-border rounded-2xl rounded-tl-sm text-text text-sm leading-relaxed">
          {{ message.payload.text }}
        </div>
        <div class="flex flex-wrap gap-2 pt-1">
          <Motion
            v-for="(chip, i) in message.payload.chips"
            :key="chip"
            as="button"
            :initial="{ opacity: 0, scale: 0.82, y: 8 }"
            :animate="{ opacity: 1, scale: 1, y: 0 }"
            :transition="{ duration: 0.32, ease: EASE, delay: i * 0.055 }"
            :whileHover="{ scale: 1.07, y: -1.5, transition: { duration: 0.15 } }"
            :whileTap="{ scale: 0.91, transition: { duration: 0.08 } }"
            class="px-3 py-1.5 text-xs font-medium border border-border-strong bg-surface-3 text-text-2 rounded-full hover:border-accent/60 hover:text-text hover:bg-accent/10 hover:shadow-[0_0_12px_rgba(61,123,255,0.15)] transition-colors duration-150"
            @click="$emit('submit-chips', chip)"
          >{{ chip }}</Motion>
        </div>
      </div>

      <!-- Dimensions form -->
      <div v-else-if="message.type === 'dimensions_form'" class="bg-surface-2 border border-border rounded-xl p-4 w-full max-w-xs space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[10px] font-mono uppercase tracking-widest text-text-3 mb-1.5">Largeur (m)</label>
            <input
              v-model="dimW"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="ex: 5"
              :disabled="dimSubmitted"
              class="w-full px-3 py-2 bg-surface-3 border border-border rounded-lg text-text text-sm focus:outline-none focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(61,123,255,0.08)] transition-all placeholder:text-text-3 disabled:opacity-50"
            />
          </div>
          <div>
            <label class="block text-[10px] font-mono uppercase tracking-widest text-text-3 mb-1.5">Hauteur (m)</label>
            <input
              v-model="dimH"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="ex: 3"
              :disabled="dimSubmitted"
              class="w-full px-3 py-2 bg-surface-3 border border-border rounded-lg text-text text-sm focus:outline-none focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(61,123,255,0.08)] transition-all placeholder:text-text-3 disabled:opacity-50"
            />
          </div>
        </div>
        <button
          class="w-full py-2 rounded-lg bg-accent text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          :class="dimSubmitted ? '' : 'hover:bg-accent/90 hover:shadow-[0_4px_16px_rgba(61,123,255,0.3)]'"
          :disabled="!dimW || !dimH || dimSubmitted"
          @click="onSubmitDimensions"
        >
          {{ dimSubmitted ? 'Confirmé ✓' : 'Confirmer' }}
        </button>
      </div>

      <!-- Contact form -->
      <div v-else-if="message.type === 'contact_form'" class="w-full max-w-sm">

        <!-- ── Confirmed state: compact success card ── -->
        <Motion
          v-if="cSubmitted"
          :initial="{ opacity: 0, scale: 0.93, y: 6 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :transition="{ duration: 0.38, ease: EASE }"
          class="flex items-center gap-3 bg-success/8 border border-success/25 rounded-xl px-4 py-3"
        >
          <div class="w-7 h-7 rounded-full bg-success/15 flex items-center justify-center shrink-0">
            <UserCheck class="w-3.5 h-3.5 text-success" />
          </div>
          <div class="min-w-0">
            <p class="text-xs font-medium text-text-2 truncate">{{ cForm.name }}</p>
            <p class="text-[11px] text-text-3 truncate">{{ cForm.email }}</p>
          </div>
          <span class="ml-auto text-[10px] font-mono text-success shrink-0">Confirmé ✓</span>
        </Motion>

        <!-- ── Form state ── -->
        <div v-else class="bg-surface-2 border border-border rounded-xl overflow-hidden">

          <!-- Header -->
          <div class="px-4 py-3 border-b border-border bg-surface-3/40 flex items-center gap-2.5">
            <div class="w-6 h-6 rounded-lg bg-accent/12 border border-accent/20 flex items-center justify-center shrink-0">
              <UserCheck class="w-3.5 h-3.5 text-accent" />
            </div>
            <p class="text-xs font-medium text-text-2">Vos coordonnées</p>
            <span class="ml-auto text-[10px] text-text-3 font-mono">* requis</span>
          </div>

          <!-- Fields -->
          <div class="p-4 space-y-3">

            <!-- Nom -->
            <Motion
              :initial="{ opacity: 0, x: -8 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.3, ease: EASE, delay: 0.05 }"
            >
              <label class="block text-[10px] font-mono uppercase tracking-widest text-text-3 mb-1.5">Nom complet *</label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-3 pointer-events-none" />
                <input
                  v-model="cForm.name"
                  type="text"
                  placeholder="Votre nom"
                  class="w-full pl-8 pr-3 py-2 bg-surface-3 border border-border rounded-lg text-text text-sm focus:outline-none focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(61,123,255,0.08)] transition-all placeholder:text-text-3"
                />
              </div>
              <p v-if="cErrors.name" class="text-warning text-xs mt-1 flex items-center gap-1">
                <span class="inline-block w-1 h-1 rounded-full bg-warning" />{{ cErrors.name }}
              </p>
            </Motion>

            <!-- Email -->
            <Motion
              :initial="{ opacity: 0, x: -8 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.3, ease: EASE, delay: 0.1 }"
            >
              <label class="block text-[10px] font-mono uppercase tracking-widest text-text-3 mb-1.5">Email *</label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-3 pointer-events-none" />
                <input
                  v-model="cForm.email"
                  type="email"
                  placeholder="votre@email.com"
                  class="w-full pl-8 pr-3 py-2 bg-surface-3 border border-border rounded-lg text-text text-sm focus:outline-none focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(61,123,255,0.08)] transition-all placeholder:text-text-3"
                />
              </div>
              <p v-if="cErrors.email" class="text-warning text-xs mt-1 flex items-center gap-1">
                <span class="inline-block w-1 h-1 rounded-full bg-warning" />{{ cErrors.email }}
              </p>
            </Motion>

            <!-- Phone + City -->
            <div class="grid grid-cols-2 gap-2.5">
              <Motion
                :initial="{ opacity: 0, x: -8 }"
                :animate="{ opacity: 1, x: 0 }"
                :transition="{ duration: 0.3, ease: EASE, delay: 0.15 }"
              >
                <label class="block text-[10px] font-mono uppercase tracking-widest text-text-3 mb-1.5">Tél. *</label>
                <div class="relative">
                  <Phone class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-3 pointer-events-none" />
                  <input
                    v-model="cForm.phone"
                    type="tel"
                    placeholder="+216 …"
                    class="w-full pl-7 pr-2 py-2 bg-surface-3 border border-border rounded-lg text-text text-sm focus:outline-none focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(61,123,255,0.08)] transition-all placeholder:text-text-3"
                  />
                </div>
                <p v-if="cErrors.phone" class="text-warning text-[10px] mt-1">{{ cErrors.phone }}</p>
              </Motion>

              <Motion
                :initial="{ opacity: 0, x: -8 }"
                :animate="{ opacity: 1, x: 0 }"
                :transition="{ duration: 0.3, ease: EASE, delay: 0.18 }"
              >
                <label class="block text-[10px] font-mono uppercase tracking-widest text-text-3 mb-1.5">Ville</label>
                <div class="relative">
                  <MapPin class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-3 pointer-events-none" />
                  <input
                    v-model="cForm.city"
                    type="text"
                    placeholder="Tunis"
                    class="w-full pl-7 pr-2 py-2 bg-surface-3 border border-border rounded-lg text-text text-sm focus:outline-none focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(61,123,255,0.08)] transition-all placeholder:text-text-3"
                  />
                </div>
              </Motion>
            </div>

            <!-- Budget -->
            <Motion
              :initial="{ opacity: 0, y: 6 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.3, ease: EASE, delay: 0.22 }"
            >
              <label class="block text-[10px] font-mono uppercase tracking-widest text-text-3 mb-2">Budget estimé *</label>
              <div class="flex flex-wrap gap-1.5">
                <Motion
                  v-for="(opt, i) in message.payload.budgetOptions"
                  :key="opt"
                  as="button"
                  :initial="{ opacity: 0, scale: 0.85 }"
                  :animate="{ opacity: 1, scale: 1 }"
                  :transition="{ duration: 0.25, ease: EASE, delay: 0.25 + i * 0.045 }"
                  :whileTap="{ scale: 0.92, transition: { duration: 0.08 } }"
                  class="px-2.5 py-1 text-xs rounded-full border transition-all duration-150"
                  :class="cForm.budget === opt
                    ? 'border-accent bg-accent/15 text-accent shadow-[0_0_10px_rgba(61,123,255,0.22)]'
                    : 'border-border-strong bg-surface-3 text-text-3 hover:border-accent/40 hover:text-text-2'"
                  @click="cForm.budget = opt"
                >{{ opt }}</Motion>
              </div>
              <p v-if="cErrors.budget" class="text-warning text-xs mt-1.5 flex items-center gap-1">
                <span class="inline-block w-1 h-1 rounded-full bg-warning" />{{ cErrors.budget }}
              </p>
            </Motion>

            <!-- Submit -->
            <Motion
              as="button"
              :initial="{ opacity: 0, y: 6 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.3, ease: EASE, delay: 0.35 }"
              :whileHover="{ scale: 1.02, transition: { duration: 0.15 } }"
              :whileTap="{ scale: 0.97, transition: { duration: 0.08 } }"
              class="w-full py-2.5 rounded-lg bg-accent text-white text-sm font-medium shadow-[0_2px_12px_rgba(61,123,255,0.3)] hover:shadow-[0_4px_20px_rgba(61,123,255,0.45)] transition-shadow mt-1"
              @click="onSubmitContact"
            >
              Confirmer mes informations
            </Motion>
          </div>
        </div>
      </div>

      <!-- Confirm recap -->
      <div v-else-if="message.type === 'confirm_recap'" class="bg-surface-2 border border-border rounded-xl overflow-hidden w-full max-w-sm">
        <div class="px-4 py-3 border-b border-border flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: message.payload.serviceColor }" />
          <span class="text-xs font-mono uppercase tracking-widest text-text-2">{{ message.payload.service }}</span>
          <span class="ml-auto text-[10px] text-text-3 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-success animate-pulse inline-block" />
            Prêt à générer
          </span>
        </div>
        <div class="px-4 py-3 space-y-2">
          <div v-if="message.payload.hasWallPhoto" class="flex items-center gap-2 text-xs text-text-2">
            <CheckCircle class="w-3.5 h-3.5 text-success shrink-0" />
            <span>Photo principale importée</span>
          </div>
          <div v-if="message.payload.hasRefPhoto" class="flex items-center gap-2 text-xs text-text-2">
            <CheckCircle class="w-3.5 h-3.5 text-success shrink-0" />
            <span>Image de référence importée</span>
          </div>
          <div v-for="item in message.payload.items" :key="item.label" class="flex items-start gap-2 text-xs">
            <CheckCircle class="w-3.5 h-3.5 text-success shrink-0 mt-px" />
            <span class="text-text-3">
              <span class="font-medium text-text-2">{{ item.label }} :</span>
              {{ item.value }}
            </span>
          </div>
        </div>
        <div class="px-4 pb-4">
          <Motion
            as="button"
            :whileHover="{ scale: 1.025, transition: { duration: 0.2, ease: EASE } }"
            :whileTap="{ scale: 0.97, transition: { duration: 0.1 } }"
            class="btn-generate w-full py-2.5 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2"
            @click="$emit('generate')"
          >
            <Sparkles class="w-4 h-4" />
            Générer ma visualisation
          </Motion>
        </div>
      </div>

      <!-- Generating progress -->
      <div v-else-if="message.type === 'generating_progress'" class="gen-progress-card bg-surface-2 border border-border rounded-xl p-6 w-full max-w-sm">
        <div class="flex flex-col items-center gap-6">
          <!-- Loader with pulsing ring -->
          <div class="relative flex items-center justify-center">
            <div class="gen-ring absolute rounded-full pointer-events-none" style="width:76px;height:76px" />
            <div class="gen-ring-2 absolute rounded-full pointer-events-none" style="width:92px;height:92px" />
            <BlechEsmLoader size="60px" />
          </div>
          <!-- Steps -->
          <div class="space-y-3 w-full">
            <div
              v-for="(step, i) in message.payload.steps"
              :key="step"
              class="flex items-center gap-2.5 gen-step"
              :style="{ animationDelay: `${i * 0.8}s` }"
            >
              <div
                class="w-5 h-5 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center shrink-0 gen-step"
                :style="{ animationDelay: `${i * 0.8}s` }"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-accent gen-dot-pulse" :style="{ animationDelay: `${i * 0.8 + 0.45}s` }" />
              </div>
              <span class="text-xs text-text-3">{{ step }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Result image -->
      <div v-else-if="message.type === 'result_image'" class="w-full max-w-md space-y-3">
        <p class="text-[10px] font-mono uppercase tracking-widest text-text-3 flex items-center gap-2">
          <span class="w-3 h-px bg-text-3 inline-block" />
          Version {{ message.payload.versionNum }}
        </p>
        <div class="rounded-xl overflow-hidden border border-border-strong bg-surface-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <img
            :src="message.payload.url"
            alt="Visualisation générée"
            class="result-image w-full object-contain max-h-[480px]"
          />
        </div>
        <!-- Action buttons with staggered entrance -->
        <template v-if="isLatestResult">
          <Motion
            :initial="{ opacity: 0, y: 14 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.4, ease: EASE, delay: 0.18 }"
          >
            <Motion
              as="button"
              :whileHover="{ scale: 1.02, transition: { duration: 0.18 } }"
              :whileTap="{ scale: 0.97, transition: { duration: 0.1 } }"
              class="w-full py-2.5 rounded-lg bg-success/15 border border-success/30 text-success text-sm font-medium hover:bg-success/22 hover:shadow-[0_4px_20px_rgba(74,222,128,0.12)] transition-colors flex items-center justify-center gap-2"
              @click="$emit('validate')"
            >
              <Check class="w-4 h-4" />
              Valider &amp; envoyer ma demande
            </Motion>
          </Motion>

          <Motion
            :initial="{ opacity: 0, y: 14 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.4, ease: EASE, delay: 0.28 }"
            class="grid grid-cols-2 gap-2"
          >
            <Motion
              as="button"
              :whileHover="{ scale: 1.03, y: -1, transition: { duration: 0.15 } }"
              :whileTap="{ scale: 0.95, transition: { duration: 0.08 } }"
              class="py-2 rounded-lg bg-surface-3 border border-border text-text-2 text-sm hover:border-accent/40 hover:text-text transition-colors flex items-center justify-center gap-2"
              @click="$emit('modify')"
            >
              <Pencil class="w-3.5 h-3.5" />
              Modifier
            </Motion>
            <Motion
              as="button"
              :whileHover="{ scale: 1.03, y: -1, transition: { duration: 0.15 } }"
              :whileTap="{ scale: 0.95, transition: { duration: 0.08 } }"
              class="py-2 rounded-lg bg-surface-3 border border-border text-text-2 text-sm hover:border-accent/40 hover:text-text transition-colors flex items-center justify-center gap-2"
              @click="$emit('regenerate')"
            >
              <RefreshCw class="w-3.5 h-3.5" />
              Régénérer
            </Motion>
          </Motion>

          <Motion
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :transition="{ duration: 0.35, ease: EASE, delay: 0.38 }"
          >
            <Motion
              as="button"
              :whileHover="{ scale: 1.01, transition: { duration: 0.15 } }"
              :whileTap="{ scale: 0.97, transition: { duration: 0.08 } }"
              class="w-full py-2 rounded-lg bg-surface-3 border border-border text-text-3 text-xs hover:text-text-2 transition-colors flex items-center justify-center gap-2"
              @click="$emit('download')"
            >
              <Download class="w-3.5 h-3.5" />
              Télécharger
            </Motion>
          </Motion>
        </template>
      </div>

    </div>
  </Motion>

  <!-- ── User Message ─────────────────────────────────────────────────────── -->
  <Motion
    v-else
    :initial="{ opacity: 0, x: 16, y: 6 }"
    :animate="{ opacity: 1, x: 0, y: 0 }"
    :transition="{ duration: 0.35, ease: EASE }"
    class="flex justify-end mt-4 mb-2"
  >
    <!-- Photo preview -->
    <div v-if="message.type === 'photo_preview'" class="max-w-[70%] space-y-1 mt-2">
      <div class="rounded-xl overflow-hidden border border-border-strong shadow-[0_4px_20px_rgba(0,0,0,0.3)] user-photo-reveal">
        <img :src="message.payload.url" :alt="message.payload.label" class="w-full max-h-52 object-cover" />
      </div>
      <p class="text-right text-[10px] text-text-3 font-mono">{{ message.payload.label }}</p>
    </div>
    <!-- Text -->
    <div
      v-else
      class="max-w-[80%] px-4 py-2.5 bg-surface-3 border border-border-strong rounded-2xl rounded-tr-sm text-text text-sm leading-relaxed"
    >
      {{ message.payload.text }}
    </div>
  </Motion>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { Motion } from 'motion-v'
import {
  Sparkles, ChevronRight, Check, CheckCircle, Pencil, RefreshCw, Download,
  Brush, Box, Grid3X3, User, Mail, Phone, MapPin, UserCheck,
} from 'lucide-vue-next'
import FileDropzone from '@/components/ui/FileDropzone.vue'
import BlechEsmLoader from '@/components/ui/BlechEsmLoader.vue'
import { EASE } from '@/utils/motion.js'

const props = defineProps({
  message:        { type: Object, required: true },
  isLatestResult: { type: Boolean, default: false },
})

const emit = defineEmits([
  'pick-service', 'submit-photo', 'skip-photo', 'submit-chips',
  'submit-dimensions', 'submit-contact',
  'generate', 'modify', 'regenerate', 'validate', 'download',
])

// ── Text formatter ────────────────────────────────────────────────────────────
function formatText(text) {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>')
}

// ── Photo upload ──────────────────────────────────────────────────────────────
const uploadedFile = ref(null)
watch(uploadedFile, (file) => {
  if (file) emit('submit-photo', { file, role: props.message.payload.role })
})

// ── Dimensions form ───────────────────────────────────────────────────────────
const dimW         = ref('')
const dimH         = ref('')
const dimSubmitted = ref(false)

function onSubmitDimensions() {
  if (!dimW.value || !dimH.value || dimSubmitted.value) return
  dimSubmitted.value = true
  emit('submit-dimensions', { w: dimW.value, h: dimH.value })
}

// ── Contact form ──────────────────────────────────────────────────────────────
const cForm    = reactive({ name: '', email: '', phone: '', city: '', budget: '' })
const cErrors  = reactive({ name: '', email: '', phone: '', budget: '' })
const cSubmitted = ref(false)

function onSubmitContact() {
  if (cSubmitted.value) return
  cErrors.name   = ''
  cErrors.email  = ''
  cErrors.phone  = ''
  cErrors.budget = ''
  let valid = true
  if (!cForm.name.trim())  { cErrors.name   = 'Nom requis';          valid = false }
  if (!cForm.email.trim()) { cErrors.email  = 'Email requis';         valid = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cForm.email)) {
    cErrors.email = 'Email invalide'; valid = false
  }
  if (!cForm.phone.trim()) { cErrors.phone  = 'Téléphone requis';    valid = false }
  if (!cForm.budget)       { cErrors.budget = 'Sélectionnez un budget'; valid = false }
  if (!valid) return
  cSubmitted.value = true
  emit('submit-contact', { ...cForm })
}
</script>

<style scoped>
/* ── AI avatar ambient glow pulse ─────────────────────────────────── */
@keyframes avatar-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(61, 123, 255, 0); }
  50%       { box-shadow: 0 0 14px 3px rgba(61, 123, 255, 0.28); }
}
.ai-avatar {
  animation: avatar-glow 3.5s ease-in-out infinite;
}

/* ── Typing dots ──────────────────────────────────────────────────── */
@keyframes typing-bounce {
  0%, 80%, 100% { transform: translateY(0) scale(1); opacity: 0.35; }
  40%            { transform: translateY(-5px) scale(1.1); opacity: 1; }
}
.typing-dot {
  animation: typing-bounce 1.3s ease-in-out infinite;
}

/* ── Generation ring pulses ───────────────────────────────────────── */
@keyframes ring-expand {
  0%   { transform: scale(0.88); opacity: 0.6; }
  70%  { transform: scale(1.14); opacity: 0; }
  100% { transform: scale(0.88); opacity: 0; }
}
.gen-ring {
  border: 1.5px solid rgba(61, 123, 255, 0.4);
  animation: ring-expand 2s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}
.gen-ring-2 {
  border: 1px solid rgba(61, 123, 255, 0.15);
  animation: ring-expand 2s cubic-bezier(0.22, 1, 0.36, 1) infinite 0.6s;
}

/* ── Generation steps ─────────────────────────────────────────────── */
@keyframes gen-step-in {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}
.gen-step {
  opacity: 0;
  animation: gen-step-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50%       { transform: scale(1.5); opacity: 1; }
}
.gen-dot-pulse {
  animation: dot-pulse 1.2s ease-in-out infinite;
}

/* ── Gen progress card border shimmer ────────────────────────────── */
@keyframes border-shimmer {
  0%, 100% { border-color: rgba(61, 123, 255, 0.2); }
  50%       { border-color: rgba(61, 123, 255, 0.5); }
}
.gen-progress-card {
  animation: border-shimmer 2s ease-in-out infinite;
}

/* ── Generate button shimmer ──────────────────────────────────────── */
@keyframes shimmer-slide {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}
.btn-generate {
  background: linear-gradient(
    105deg,
    var(--accent) 0%,
    var(--accent-hover) 28%,
    rgba(255, 255, 255, 0.28) 47%,
    rgba(255, 255, 255, 0.28) 53%,
    var(--accent-hover) 72%,
    var(--accent) 100%
  );
  background-size: 260% auto;
  box-shadow: 0 4px 20px rgba(61, 123, 255, 0.35), 0 0 0 1px rgba(255,255,255,0.08) inset;
  animation: shimmer-slide 2.8s linear infinite;
}

/* ── Result image reveal ──────────────────────────────────────────── */
@keyframes reveal-image {
  from {
    opacity: 0;
    transform: scale(0.96);
    filter: blur(14px) brightness(0.7) saturate(0.4);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: blur(0px) brightness(1) saturate(1);
  }
}
.result-image {
  animation: reveal-image 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ── User photo reveal ────────────────────────────────────────────── */
@keyframes photo-pop {
  from { opacity: 0; transform: scale(0.93) translateY(4px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.user-photo-reveal {
  animation: photo-pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .ai-avatar,
  .typing-dot,
  .gen-ring,
  .gen-ring-2,
  .gen-step,
  .gen-dot-pulse,
  .gen-progress-card,
  .btn-generate,
  .result-image,
  .user-photo-reveal {
    animation: none;
    opacity: 1;
    transform: none;
    filter: none;
  }
}
</style>
