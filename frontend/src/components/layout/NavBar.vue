<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'nav-scrolled' : 'nav-transparent'
    ]"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 group">
          <img
            :src="logo"
            alt="Blechesm"
            class="h-8 w-auto transition-all duration-300"
            :style="scrolled
              ? 'filter: drop-shadow(0 0 12px rgba(61,123,255,0.5))'
              : 'filter: drop-shadow(0 0 20px rgba(61,123,255,0.35))'"
          />
          <!-- Sticker tag next to logo -->
          <span
            class="nav-sticker hidden sm:inline-block"
            :class="scrolled ? 'opacity-60' : 'opacity-80'"
          >SINCE '16</span>
        </RouterLink>

        <!-- Desktop nav -->
        <div class="hidden lg:flex items-center gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link"
            :class="{ 'nav-link--active': $route.path === link.to }"
          >
            {{ link.label }}
          </RouterLink>
        </div>

        <!-- Desktop CTA -->
        <div class="hidden lg:flex items-center gap-3">
          <!-- Tag label -->
          <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-text-3 hidden lg:block">
            Gratuit →
          </span>
          <RouterLink to="/configurateur" class="nav-cta">
            Visualiser ma fresque
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2,7 H12 M8,3 L12,7 L8,11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </RouterLink>
        </div>

        <!-- Mobile hamburger -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="lg:hidden hamburger-btn"
          :class="{ 'hamburger-btn--open': mobileOpen }"
          :aria-expanded="mobileOpen"
          aria-label="Menu"
        >
          <span class="hamburger-bar" />
          <span class="hamburger-bar" />
          <span class="hamburger-bar" />
        </button>

      </div>
    </nav>

    <!-- Mobile drawer -->
    <Transition name="drawer">
      <div v-if="mobileOpen" class="mobile-drawer lg:hidden">
        <!-- Spray blob inside drawer -->
        <div class="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
          style="background:#3D7BFF; filter:blur(80px); opacity:0.06; transform:translate(30%,-30%)" />

        <div class="relative flex flex-col gap-1 px-4 pb-6 pt-4">
          <!-- Nav links -->
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="mobile-link"
            :class="{ 'mobile-link--active': $route.path === link.to }"
            @click="mobileOpen = false"
          >
            <span class="mobile-link-arrow">→</span>
            {{ link.label }}
            <span v-if="$route.path === link.to" class="ml-auto">
              <span class="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            </span>
          </RouterLink>

          <!-- Divider with tag -->
          <div class="flex items-center gap-3 my-3">
            <div class="flex-1 h-px bg-border" />
            <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-text-3">Action</span>
            <div class="flex-1 h-px bg-border" />
          </div>

          <!-- CTA -->
          <RouterLink
            to="/configurateur"
            class="mobile-cta"
            @click="mobileOpen = false"
          >
            Visualiser ma fresque
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2,7 H12 M8,3 L12,7 L8,11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </RouterLink>

          <!-- Bottom row -->
          <div class="flex items-center gap-3 mt-4 pt-4 border-t border-border">
            <span class="nav-sticker opacity-60 text-[9px]">BLECHESM</span>
            <span class="text-text-3 text-xs font-mono">Tunis · Sfax · Sousse</span>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import logo from '@/assets/logo.png'

const scrolled = ref(false)
const mobileOpen = ref(false)

const navLinks = [
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact',  label: 'Contact' },
]

function handleScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
/* ── Nav states ─────────────────────────────────────────────────── */
.nav-transparent {
  background: transparent;
}
.nav-scrolled {
  background: rgba(8, 11, 20, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  box-shadow: 0 1px 0 rgba(61,123,255,0.08);
}

/* ── Sticker tag ────────────────────────────────────────────────── */
.nav-sticker {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-accent);
  border: 1.5px solid rgba(61,123,255,0.4);
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(61,123,255,0.06);
  transform: rotate(-2deg);
  display: inline-block;
  transition: opacity 0.3s;
}

/* ── Desktop nav links ──────────────────────────────────────────── */
.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-2);
  text-decoration: none;
  transition: color 0.15s;
  z-index: 0;
}
.nav-link:hover {
  color: var(--color-text);
}

/* ── Spray active state ─────────────────────────────────────────── */
.nav-link--active {
  color: #fff;
  font-weight: 600;
}

/* Main spray blob — blurred radial behind the text */
.nav-link--active::before {
  content: '';
  position: absolute;
  inset: -6px -10px;
  background: radial-gradient(ellipse 85% 70% at 48% 55%,
    rgba(61, 123, 255, 0.45) 0%,
    rgba(61, 123, 255, 0.18) 45%,
    transparent 75%
  );
  filter: blur(10px);
  border-radius: 50%;
  z-index: -1;
  transform: rotate(-2deg) scaleX(1.05);
  animation: spray-in 0.35s ease both;
}

/* Second layer — tighter hot spot for depth */
.nav-link--active::after {
  content: '';
  position: absolute;
  inset: 2px 4px;
  background: radial-gradient(ellipse 60% 55% at 50% 60%,
    rgba(61, 123, 255, 0.22) 0%,
    transparent 80%
  );
  filter: blur(5px);
  border-radius: 50%;
  z-index: -1;
  transform: rotate(1deg);
  animation: spray-in 0.35s ease 0.05s both;
}

@keyframes spray-in {
  from { opacity: 0; transform: rotate(-2deg) scaleX(0.6) scaleY(0.4); }
  to   { opacity: 1; transform: rotate(-2deg) scaleX(1.05) scaleY(1); }
}

/* ── CTA button ─────────────────────────────────────────────────── */
.nav-cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 18px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 13px;
  color: #fff;
  background: var(--color-accent);
  border: 2px solid rgba(0,0,0,0.2);
  border-radius: 4px;
  box-shadow: 3px 3px 0 rgba(0,0,0,0.5);
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease;
}
.nav-cta:hover {
  background: var(--color-accent-hover);
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 rgba(0,0,0,0.5);
}
.nav-cta:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0;
}

/* ── Hamburger ──────────────────────────────────────────────────── */
@media (min-width: 1024px) {
  .hamburger-btn { display: none !important; }
}
.hamburger-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 1.5px solid rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.08);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.hamburger-btn:hover {
  border-color: rgba(61,123,255,0.6);
  background: rgba(61,123,255,0.12);
}
.hamburger-bar {
  display: block;
  width: 18px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transform-origin: center;
  transition: transform 0.25s ease, opacity 0.2s ease, width 0.2s ease;
}
.hamburger-btn--open .hamburger-bar:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.hamburger-btn--open .hamburger-bar:nth-child(2) { opacity: 0; width: 0; }
.hamburger-btn--open .hamburger-bar:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* ── Mobile drawer ──────────────────────────────────────────────── */
.mobile-drawer {
  position: relative;
  overflow: hidden;
  background: rgba(8, 11, 20, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-2);
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
  border-left: 2px solid transparent;
}
.mobile-link:hover {
  color: var(--color-text);
  background: rgba(255,255,255,0.04);
}
.mobile-link--active {
  color: var(--color-text);
  border-left-color: var(--color-accent);
  background: rgba(61,123,255,0.06);
}
.mobile-link-arrow {
  font-size: 11px;
  color: var(--color-accent);
  opacity: 0.5;
  transition: opacity 0.15s, transform 0.15s;
}
.mobile-link:hover .mobile-link-arrow {
  opacity: 1;
  transform: translateX(2px);
}

.mobile-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  background: var(--color-accent);
  border: 2px solid rgba(0,0,0,0.2);
  border-radius: 4px;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.5);
  text-decoration: none;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}
.mobile-cta:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 rgba(0,0,0,0.5);
}

/* ── Drawer transition ──────────────────────────────────────────── */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ── Reduced motion ─────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .nav-cta, .mobile-cta, .hamburger-bar, .nav-link { transition: none; }
  .drawer-enter-active, .drawer-leave-active { transition: none; }
  .nav-link--active::before, .nav-link--active::after { animation: none; }
}
</style>
