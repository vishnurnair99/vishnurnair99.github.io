# Vishnu Rajendran Nair — Engineering Portfolio

Live site: https://vishnurnair99.github.io/

GitHub Pages publishes the repository root from the main branch.

## Editing

- index.html: profile, experience, projects and contact links
- style.css: core layout
- redesign.css: aerospace presentation and responsive 3D viewer styles
- engine.js: original procedural 3D engine and interaction controls
- script.js: email copy control

The engine is an illustrative hardware study, not project CAD, a validated engineering design, or a replica of a company's engine. It supports dragging, keyboard rotation, zoom, pause/resume, wireframe and view reset. A static illustration appears if WebGL is unavailable. Reduced-motion preferences disable automatic rotation. Rendering pauses while the viewer is off screen or the page is hidden.

Three.js r170 is included locally under vendor/ with its MIT license. No external model or texture downloads are required.

Use a local HTTP server to preview the site; ES modules do not work reliably by opening index.html as a file.
