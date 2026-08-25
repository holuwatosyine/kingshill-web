# Live Runtime Audit — Current Implementation

## Environment

The restored `holuwatosyine/kingshill-web` repository was overlaid with the in-progress WebGL source changes, dependencies were installed, and the project was served from Vite on `http://127.0.0.1:8080/`. A local headless Chromium CDP target was used with software WebGL/WebGPU support for deterministic DOM and canvas diagnostics.

## Build and route status

- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- Homepage route: HTTP 200.
- `public/experience/models/c-transformed.glb`: valid glTF binary, 177,044 bytes.
- `public/material-lab/lens-transformed.glb`: valid glTF binary, 16,048 bytes.
- `public/material-lab/flower-transformed.glb`: valid glTF binary, 62,828 bytes.
- `public/material-lab/dflat.glb`: valid glTF binary, 11,468 bytes.
- The missing Passage/Material Lab lens asset was restored from the user’s pmndrs examples repository. The missing Material Lab font JSON was restored from a bundled Three.js example typeface and is isolated to `/material-lab`.

## Runtime mount and entry

After asset restoration, React mounted without ErrorBoundary activation. The live DOM contained the semantic Hero, About, Training, Testimonials, and Footer sections. The internal preloader wheel test moved the application from `kh-is-loading` to the normal `lenis` state. The cloud canvas became a hidden 1×1 lifecycle artifact rather than a visible homepage layout section; the homepage document did not gain cloud spacer height.

## Canvas inventory after entry

The CDP diagnostic found 11 canvas elements after entry in the 780px-wide headless viewport. Representative backing/client dimensions were:

| Surface | Backing size | CSS/client size | Notes |
|---|---:|---:|---|
| Shader cursor | 780×437 | 780×437 | Package-owned shader canvas corrected by ShaderSurface. |
| Cloud lifecycle canvas | 1×1 hidden | 0×0 | Preloader-only and no longer visible. |
| Hero R3F | 780×437 | 780×437 | Active Hero renderer. |
| Liquid button | 215×44 | 215×44 | Button-local raw WebGL surface. |
| Kage cloth | 493×370 | 493×370 | About image WebGL2 surface. |
| Training raw shader | 780×1023 | 780×1023 | Wrapper sizing fix corrected the former 300×150 layout. |
| Testimonials shader | 780×1220 | 780×1220 | ShaderSurface corrected package canvas backing size. |
| Footer shader | 780×822 | 780×822 | Footer containment fix prevents full-document 4,500px rendering. |
| Footer closing text | 732×366 | 732×366 | Closing block canvas now follows its real responsive box. |
| Footer wordmark | 732×140 | 732×140 | Particle wordmark surface. |

## Actual context acquisitions

The instrumentation recorded 14 context acquisitions across initial loading, cleanup/re-entry, and active render surfaces. Context types included WebGL2 for R3F/raw scenes, WebGL for Kage/image work, 2D contexts for text rasterization, and WebGPU-backed shader-package canvases not exposed through the WebGL `getContext` hook. This means the raw context count is a lifecycle acquisition count, not a simple simultaneous-live-context count. A production specialist should still verify simultaneous live contexts and GPU memory on physical phones.

## Verified implementation changes

- Three custom Hero body variants are present: `dialogue`, `focus`, and `progression`. The existing Connector rigid-body contract remains in use.
- Shared chapter state is present and consumed by Passage, Training, Footer closing particles, Footer wordmark, and homepage CSS variables.
- The global runtime pauses while the document is hidden and emits context-loss/restoration diagnostics.
- Training raw shader, package-owned shader surfaces, Footer containment, Footer closing text, and LiquidButton now have intentional responsive canvas boxes.
- The project still preserves full mobile motion. No ordinary viewport-width branch unmounts or staticizes the WebGL scenes.

## Remaining validation limits

The headless environment uses software rendering and does not represent a physical mobile GPU. The actual visual appearance of the three altered Hero bodies still requires screenshot/human review on a stable browser and target phone. The package shader surfaces now have correct observed backing dimensions in the headless runtime, but GPU timing and thermal behavior remain unverified on physical mobile hardware.

## Sequential-pass additions

The source now contains an explicit preloader `Finalizing` state, an internal forward-only gesture accumulator, and reverse wheel/touch/keyboard input that is prevented without advancing the cloud walk. Pointer Events are the primary mobile input path; legacy TouchEvent listeners are registered only when Pointer Events are unavailable, while pointer-type `touch` moves still feed the shared touch impulse state.

The measured render-scale signal now propagates to the preloader cloud renderer, Hero/Passage/Training/ShaderSurface surfaces, Footer particle surfaces, LiquidButton, Kage cloth output, and secondary-route atmosphere. The Kage canvas also resynchronizes after layout and observer callbacks to avoid a default 300×150 backing buffer when its lazy-loaded image becomes visible.

The testimonial section now has an explicit pale mineral background and dark text/divider policy. The Passage layer remains transparent and pointer-events-none; its DOM-aware placement solver avoids testimonial quote/client/stat rectangles and applies a conservative occlusion guard when no safe candidate remains. Its FBO clear sequence still restores `gl.setClearColor("#000000", 0)` after portal rendering.

The unused recovered `public/favicon.ico` was removed. The explicit browser icon remains the official Kingshill logo asset in `index.html`; no Lovable branding reference remains in the entrypoint or public configuration.

The active homepage source was type-checked and production-built again after these changes. The browser evidence observed `Finalizing`, full semantic section mounting, full connector Hero canvas mounting, and the prior mobile responsive canvas behavior. The Kage default-buffer check must be repeated with the lazy About image actually in view in a stable browser session. Physical iPhone/Android GPU profiling, thermal behavior, context pressure, and final human visual approval remain open.

## Rollback note — 25 August 2026

Following visual review, the homepage no longer mounts the Training, Testimonials, or Footer shader presentation layers introduced during the unification pass. The earlier dark Training/selected-pathway presentation, light editorial Client Stories arrangement, and simpler dark Footer/contact composition are restored. The Hero logo/menu positioning was corrected from off-screen viewport offsets back to the Hero top. The shared runtime, Passage, cloud preloader, touch handling, Kage lifecycle, Hero physics, and measured-quality code remain in place.

A fresh browser load after the rollback mounted the official logo and Menu, all semantic homepage content, and the Footer wordmark without ErrorBoundary activation. The remaining visual review is intentionally left to the user’s browser/device, but the source-level rollback and build checks are complete.
