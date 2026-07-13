# EducationLab — a play-first curriculum for AI fluency

**Thesis:** kids don't need a tutorial to learn AI. They need to *play*, and to be
handed play that quietly builds real skill. EducationLab teaches four core
constructs, each as a game a child would choose to play — and each maps to a
pillar of Anthropic's 4D AI-fluency framework and to a rung of the learning loop
in the essay *[Learning Through Play](/#journal)*.

## The spine

Learning is a loop: **play → want more capability → learn → build → share.**
Every activity here lives on that loop and pushes the child one rung up it.
The measure of success is never time-on-app — it's whether capability *persists
when the scaffolding comes off* (the withdrawal test appears in every pillar).

| # | Construct | Tab | 4D pillar | Loop rung | Status |
|---|-----------|-----|-----------|-----------|--------|
| 1 | Describing precisely | Say It, See It | **Description** | "learn something" | ✅ built |
| 2 | Automating repeatable tasks | Loops | **Delegation** | "build something" | next |
| 3 | Critical thinking | Is That True? | **Discernment** | "judge the result" | planned |
| 4 | Reflecting on learning | Field Notes | **Diligence / metacognition** | "what would I do next" | planned |

---

## Pillar 1 — Description  ·  *Say It, See It*  ✅

**Teaches:** specifying intent precisely enough to get what you pictured — the
first real prompting skill.

**The play:** the child tells Sprout what to do; Sprout acts it out. The more
detail they give (a doing word, a size, a speed, a count, a feeling, a color),
the richer and more exact the result. A **Describing Power meter** lights up per
dimension, making the invisible quality of a prompt *visible*.

**Why it works:** no lesson — the child just notices better words make Sprout
cooler and chases it. Vague prompts still work; Sprout asks a friendly question
about the one missing detail (a nudge, never an error).

**Measure:** Describing Power per prompt across a session (does it climb?);
unique dimensions used; revision rate after a low-detail try; **withdrawal test:**
hide the meter and idea drawer — do richer prompts persist?

---

## Pillar 2 — Delegation  ·  *Loops*  (build next)

**Teaches:** automating a repeatable task — define a process once, let it run
many times. The first agentic paradigm.

**The play:** the child assembles a short sequence of Sprout actions (e.g.
`hop → spin`), then wraps it in **⟳ repeat N×**. Crucially, they first do it the
tedious manual way (`hop hop hop hop hop…`) and *then* discover the loop does it
in one block. The friction is the lesson: they feel why automation exists.

**Progression:** single action → sequence → repeat-loop → (later) a stopping
condition ("keep going *until*…").

**Why it works:** the child invents the abstraction because the manual path is
annoying and the loop is delightful. "You taught Sprout a trick it can do by
itself" is the delegation insight in kid language.

**Measure:** after discovering the loop, does the child choose it over manual
repetition? steps saved per task; do they build reusable "tricks"? **withdrawal
test:** give a fresh repeat-heavy task — do they reach for a loop unprompted?

---

## Pillar 3 — Discernment  ·  *Is That True?*  (planned)

**Teaches:** don't accept the first answer — question it, ask why, and check.
The antidote to AI over-reliance, and the counterweight to Pillar 1 (a good
describer still has to judge what comes back).

**The play:** Sprout makes claims, some true and some confidently wrong
("Spiders are insects!"). The child chooses **Believe / Ask why / Check**.
"Ask why" surfaces reasoning with a hole in it; "Check" reveals the truth. Points
come from *catching* the wrong ones, not from answering fast.

**Why it works:** it rewards skepticism as a game move. The child learns that a
confident answer isn't a correct answer — the single most important habit for
living with fluent machines.

**Measure:** rate of checking before accepting; planted-error catch rate; does
skepticism transfer to novel claims later in the session? **withdrawal test:**
remove the points/prompts — does the child still question a fresh claim?

---

## Pillar 4 — Metacognition  ·  *Field Notes*  (planned)

**Teaches:** reflect on what you learned and what you'd try next — closing the
loop so the next session starts higher than the last.

**The play:** a light end-of-session screen — *What did you teach Sprout? What
was tricky? What will you try next?* — that saves a small, revisitable learning
journal. Can also be woven into the end of every other tab.

**Why it works:** naming what you learned consolidates it; naming a "next" turns
a play session into a plan. It makes the child the narrator of their own growth.

**Measure:** specificity of reflection over time; does a stated "next" predict
what they actually try next session (loop closure)?

---

## Design principles (all pillars)

- **Deterministic engines, no LLM.** Instant, offline, free, safe for kids — and
  it lets us author the exact pedagogy each game depends on.
- **Implicit learning.** No tutorials or onboarding flows. The feedback loop is
  the lesson.
- **Make the invisible visible.** Prompt quality, a loop's savings, a claim's
  shakiness — surface the thing the skill is about.
- **Scaffold that fades.** Idea drawers and hints lower the floor, then get out
  of the way as the child takes over.
- **Nudge, never punish.** A weak attempt still works; the game asks a friendly
  question instead of throwing an error.
- **Accessibility from the start.** Full keyboard use, labeled controls,
  `aria-live` narration, and a real `prefers-reduced-motion` path.
- **Capability, not engagement.** Every pillar is scored by a withdrawal test:
  the only success that counts is skill that survives the scaffold coming off.

## Build order

1. ✅ Description — *Say It, See It*
2. **Loops** — *Delegation*  ← next
3. Critical thinking — *Discernment*
4. Reflection — woven into each tab, then its own *Field Notes* surface

Companion essays: *[The First Friend](/#journal)* (why the companion is a friend,
not a vending machine) and *[Learning Through Play](/#journal)* (the loop this
curriculum is built to protect).
