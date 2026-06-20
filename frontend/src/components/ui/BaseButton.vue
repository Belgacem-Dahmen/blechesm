<template>
  <component
    :is="tag"
    v-bind="$attrs"
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      (disabled || loading) && 'btn--disabled',
    ]"
    :disabled="tag === 'button' ? (disabled || loading) : undefined"
    :aria-disabled="disabled || loading"
  >
    <span v-if="loading" class="btn-spinner" aria-hidden="true" />
    <slot />
  </component>
</template>

<script setup>
defineProps({
  variant:  { type: String, default: 'primary' }, // primary | secondary | ghost
  size:     { type: String, default: 'md' },       // sm | md | lg
  loading:  { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  tag:      { type: String, default: 'button' },
})
</script>

<style scoped>
/* ── Base ───────────────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  border-radius: 4px;          /* sharp — graffiti sticker corners */
  white-space: nowrap;
  user-select: none;
  text-decoration: none;
  position: relative;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease,
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
}
.btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

/* ── Sizes ──────────────────────────────────────────────────────── */
.btn--sm { padding: 6px  14px; font-size: 12px; min-height: 36px; }
.btn--md { padding: 10px 20px; font-size: 14px; min-height: 44px; }
.btn--lg { padding: 14px 28px; font-size: 16px; min-height: 52px; }

/* ── Primary — offset sticker ───────────────────────────────────── */
/*   Solid accent fill + hard shadow → hand-pressed sticker feel    */
.btn--primary {
  background: var(--color-accent);
  color: #fff;
  border: 2px solid rgba(0, 0, 0, 0.25);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.50);
}
.btn--primary:hover:not(.btn--disabled) {
  background: var(--color-accent-hover);
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.50);
}
.btn--primary:active:not(.btn--disabled) {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0 rgba(0, 0, 0, 0.50);
}

/* ── Secondary — outline sticker ────────────────────────────────── */
.btn--secondary {
  background: transparent;
  color: var(--color-text);
  border: 2px solid var(--color-border-strong);
  box-shadow: 4px 4px 0 rgba(255, 255, 255, 0.06);
}
.btn--secondary:hover:not(.btn--disabled) {
  border-color: var(--color-text-2);
  background: var(--color-surface-2);
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 rgba(255, 255, 255, 0.06);
}
.btn--secondary:active:not(.btn--disabled) {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0;
}

/* ── Ghost — dashed cutout ──────────────────────────────────────── */
.btn--ghost {
  background: transparent;
  color: var(--color-text-2);
  border: 1.5px dashed var(--color-border-strong);
  box-shadow: none;
}
.btn--ghost:hover:not(.btn--disabled) {
  color: var(--color-accent);
  border-color: var(--color-accent);
  border-style: solid;
  background: rgba(61, 123, 255, 0.07);
}
.btn--ghost:active:not(.btn--disabled) {
  background: rgba(61, 123, 255, 0.12);
}

/* ── Disabled ───────────────────────────────────────────────────── */
.btn--disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

/* ── Loading spinner ────────────────────────────────────────────── */
.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  flex-shrink: 0;
  animation: btn-spin 0.7s linear infinite;
}
@keyframes btn-spin { to { transform: rotate(360deg); } }

/* ── Reduced motion ─────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .btn { transition: none; }
  .btn-spinner { animation: none; border-top-color: currentColor; opacity: 0.5; }
}
</style>
