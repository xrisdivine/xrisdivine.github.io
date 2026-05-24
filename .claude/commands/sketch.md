# /sketch — Hand-Drawn Illustration Generator

Generate SVG illustrations that look authentically hand-drawn — like someone sketched them with a pencil on a scratch pad, or pen on crumpled paper. The output should feel personal, imperfect, and human.

## Critical Design Rules

### Lines Must Be Imperfect
- NEVER use straight `<line>` elements or clean `<polygon>` shapes
- ALL lines must be `<path>` elements with cubic bezier curves that wobble slightly
- Add micro-variations: no two parallel lines should be perfectly parallel
- Endpoints should slightly overshoot or undershoot — like a real pen stroke
- Vary stroke-width along paths using `stroke-width` between 0.8 and 2.0

### Technique: Wobbly Lines
To draw a "straight" line from (x1,y1) to (x2,y2), use a path with 2-4 control points that deviate 1-3px from the true line:
```
<path d="M x1,y1 C (x1+dx1),(y1+dy1) (x2+dx2),(y2+dy2) x2,y2" />
```
Where dx/dy are small random offsets (±1 to ±3px).

For longer lines, chain multiple curve segments so the wobble feels natural, not wavy.

### Text Must Look Handwritten
- Use a combination of slight `transform="rotate()"` (±1 to ±3 degrees) on each text element
- Vary font sizes slightly between labels (±1px)
- Use `font-family: "Caveat", "Segoe Print", "Comic Sans MS", cursive` as the font stack
- Include a Google Fonts link for Caveat if the SVG will be embedded in HTML:
  `<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet">`
- For annotations/margin notes: smaller size, more rotation, lighter color (#777 or #999)

### Paper Texture
- Background should feel like paper, not a white void
- Use a subtle noise pattern or off-white fill (#f5f0e8 or #faf6ee)
- Optional: add a very subtle paper grain using an SVG filter:
```xml
<filter id="paper">
  <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise"/>
  <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
  <feBlend in="SourceGraphic" in2="gray" mode="multiply"/>
</filter>
```

### Pencil/Pen Stroke Style
- Stroke color: NOT pure black. Use #333 or #444 for main strokes, #888 for lighter sketch lines
- Stroke linecap: "round"
- Stroke linejoin: "round"
- Add slight opacity variation on annotation strokes (0.6-0.8)
- For emphasis lines (underlines, circles around things): use stroke-dasharray with irregular values like "3,2,8,2"

### Arrows
- Arrow heads should be two short lines at an angle, NOT a clean triangular marker
- Draw them as two separate small paths that don't perfectly meet
- Example arrowhead at point (x,y) pointing right:
```xml
<path d="M x-8,y-5 L x+1,y+0.5" stroke="#444" stroke-width="1.2" fill="none" stroke-linecap="round"/>
<path d="M x-7,y+5 L x,y-0.5" stroke="#444" stroke-width="1.2" fill="none" stroke-linecap="round"/>
```

### Scratch Pad Feel
- Add 1-2 "scratch out" marks or small doodles in margins if appropriate
- Annotations should look like afterthoughts — offset, slightly rotated, with an arrow or line connecting to the main diagram
- Leave some whitespace asymmetric — don't center everything perfectly
- Elements should be positioned as if someone drew them freehand on a pad, not laid out on a grid

## Process

1. Read the user's description of what to illustrate
2. Plan the layout on a roughly 440x320 viewBox (adjust as needed)
3. Generate the SVG following ALL rules above
4. Wrap it in a container div with paper-like background
5. Output the full HTML/SVG block ready to paste into a page

## What NOT to Do
- No clean geometric shapes (rectangles, perfect circles, straight lines)
- No monospace/system fonts for labels
- No solid fills on shapes — use `fill="none"` with stroked outlines
- No perfect symmetry
- No SVG markers for arrowheads — draw them by hand
- No drop shadows or modern UI effects
- Never make it look like a PowerPoint diagram or infographic
