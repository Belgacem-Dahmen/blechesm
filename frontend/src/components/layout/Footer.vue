<template>
  <footer class="relative overflow-hidden" style="background: #04060F;">
    <!-- Spray atmosphere -->
    <div class="spray spray-orange absolute top-0 right-1/4 w-[500px] h-[500px] -translate-y-1/2" />
    <div class="spray spray-cyan   absolute bottom-0 left-1/4  w-[400px] h-[400px]  translate-y-1/2" />
    <div class="absolute inset-0 grid-bg opacity-10 pointer-events-none" />


    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">

      <!-- ── BIG TAGLINE ──────────────────────────────────────────── -->
      <div class="mb-16 pb-14 border-b border-white/8">
        <div class="flex items-center gap-3 mb-5">
          <span class="w-6 h-px bg-accent" />
          <span class="text-xs font-mono uppercase tracking-widest text-accent">Blechesm</span>
          <svg width="48" height="20" viewBox="0 0 48 20" class="text-warning opacity-60" fill="none" aria-hidden="true">
            <path d="M3,10 C12,3 30,3 42,10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M36,5 L43,10 L36,15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tightest leading-[0.92] text-white">
            L'art dans la rue,<br />
            <span class="relative inline-block text-accent">
              partout en Tunisie.
              <svg class="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 400 8" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <path d="M0,4 Q50,0 100,4 Q150,8 200,4 Q250,0 300,4 Q350,8 400,4" stroke="#FF6B35" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
              </svg>
            </span>
          </h2>

          <RouterLink to="/configurateur" class="shrink-0 mb-1">
            <button class="footer-cta">
              Visualiser ma fresque
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3,8 H13 M9,4 L13,8 L9,12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </RouterLink>
        </div>
      </div>

      <!-- ── COLUMNS ─────────────────────────────────────────────── -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

        <!-- Brand -->
        <div class="lg:col-span-2">
          <RouterLink to="/" class="inline-block mb-5">
            <img :src="logo" alt="Blechesm" class="h-10 w-auto" style="filter: drop-shadow(0 0 20px rgba(61,123,255,0.4))" />
          </RouterLink>
          <p class="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
            Artistes muralistes professionnels basés à Tunis. Nous transformons vos murs en œuvres d'art durables depuis 2016.
          </p>
          <!-- Socials -->
          <div class="flex gap-2.5">
            <a
              v-for="s in socials"
              :key="s.label"
              :href="s.href"
              :aria-label="s.label"
              class="social-btn"
              :style="{ '--sb': s.color }"
              target="_blank"
              rel="noopener"
            >
              <component :is="s.icon" class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Navigation -->
        <div>
          <p class="footer-col-title">Navigation</p>
          <ul class="space-y-2.5">
            <li v-for="link in navLinks" :key="link.to">
              <RouterLink :to="link.to" class="footer-link">
                <span class="footer-link-arrow">→</span>
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <p class="footer-col-title">Contact</p>
          <ul class="space-y-2.5">
            <li v-for="c in contacts" :key="c.label">
              <a :href="c.href" class="footer-link">
                <component :is="c.icon" class="w-3.5 h-3.5 shrink-0 text-accent" />
                {{ c.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <p class="footer-col-title">Légal</p>
          <ul class="space-y-2.5">
            <li>
              <RouterLink to="/mentions-legales" class="footer-link">
                <span class="footer-link-arrow">→</span>
                Mentions légales &amp; CGU
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/admin/login" class="footer-link footer-link--dim">
                <span class="footer-link-arrow">→</span>
                Espace admin
              </RouterLink>
            </li>
          </ul>

          <!-- City tags -->
          <p class="footer-col-title mt-7">Zones</p>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="city in cities" :key="city.name" class="city-tag" :style="{ '--ct': city.color }">
              {{ city.name }}
            </span>
          </div>
        </div>

      </div>

      <!-- ── BOTTOM BAR ──────────────────────────────────────────── -->
      <div class="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <!-- Spray tag sticker -->
          <span class="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border border-accent/40 text-accent rounded"
            style="transform: rotate(-1deg); display: inline-block;">BLECHESM</span>
          <p class="text-white/30 text-xs">© {{ new Date().getFullYear() }} — Tous droits réservés</p>
        </div>
        <div class="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" class="text-white/20" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1"/>
            <path d="M5,7 H9 M7,5 V9" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
          </svg>
          <p class="text-white/30 text-xs">Tunisie & Maghreb · Déplacement inclus</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Instagram, Facebook, Linkedin, Mail, Phone } from 'lucide-vue-next'
import logo from '@/assets/logo.png'

const navLinks = [
  { to: '/',              label: 'Accueil' },
  { to: '/configurateur', label: 'Configurateur IA' },
  { to: '/portfolio',     label: 'Portfolio' },
  { to: '/a-propos',      label: 'À propos' },
  { to: '/contact',       label: 'Contact' },
]

const contacts = [
  { label: 'blechesmcom@gmail.com', href: 'mailto:blechesmcom@gmail.com', icon: Mail },
  { label: '+216 50 133 961',       href: 'tel:+21650133961',             icon: Phone },
]

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/blech.esm/',               icon: Instagram, color: '#E1306C' },
  { label: 'Facebook',  href: 'https://www.facebook.com/blecheseem/?locale=fr_FR',  icon: Facebook,  color: '#1877F2' },
  { label: 'LinkedIn',  href: '#',                                                   icon: Linkedin,  color: '#0A66C2' },
]

const cities = [
  { name: 'Tunis',    color: '#3D7BFF' },
  { name: 'Sfax',     color: '#4ADE80' },
  { name: 'Sousse',   color: '#FB923C' },
  { name: 'Bizerte',  color: '#F472B6' },
  { name: 'Nabeul',   color: '#22D3EE' },
  { name: 'Monastir', color: '#A78BFA' },
  { name: 'Hammamet', color: '#FBBF24' },
]
</script>

<style scoped>
/* ── Spray blobs ────────────────────────────────────────────────── */
.spray {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.06;
  pointer-events: none;
}
.spray-orange { background: #FF6B35; }
.spray-cyan   { background: #22D3EE; }

/* ── Footer CTA button ──────────────────────────────────────────── */
.footer-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  background: var(--color-accent);
  border: 2px solid rgba(0,0,0,0.25);
  border-radius: 4px;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.5);
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease;
  white-space: nowrap;
}
.footer-cta:hover {
  background: var(--color-accent-hover);
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 rgba(0,0,0,0.5);
}
.footer-cta:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0;
}

/* ── Social buttons ─────────────────────────────────────────────── */
.social-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1.5px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.04);
  transition: border-color 0.15s, color 0.15s, background 0.15s, transform 0.1s, box-shadow 0.1s;
}
.social-btn:hover {
  color: var(--sb);
  border-color: var(--sb);
  background: rgba(255,255,255,0.07);
  box-shadow: 2px 2px 0 rgba(0,0,0,0.4);
  transform: translate(-1px, -1px);
}

/* ── Column title ───────────────────────────────────────────────── */
.footer-col-title {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(255,255,255,0.3);
  margin-bottom: 14px;
}

/* ── Links ──────────────────────────────────────────────────────── */
.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  transition: color 0.15s, gap 0.15s;
}
.footer-link:hover { color: #fff; gap: 9px; }
.footer-link--dim { color: rgba(255,255,255,0.25); }
.footer-link--dim:hover { color: rgba(255,255,255,0.5); }
.footer-link-arrow {
  font-size: 11px;
  color: var(--color-accent);
  opacity: 0.6;
  transition: opacity 0.15s;
}
.footer-link:hover .footer-link-arrow { opacity: 1; }

/* ── City tags ──────────────────────────────────────────────────── */
.city-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 3px 8px;
  border-radius: 3px;
  border: 1px solid var(--ct);
  color: var(--ct);
  background: rgba(0,0,0,0.3);
  opacity: 0.7;
  transition: opacity 0.15s;
}
.city-tag:hover { opacity: 1; }
</style>
