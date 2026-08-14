# Present the Patient

*Category: interactivity · August 2026*

**Dek:** Coding agents turned every engineer into an ER attending running a floor of brilliant, overconfident residents. The tools worth building aren't better ways to talk to them — they're teaching the residents to present the patient.

---

## You're Not the Coder Anymore

Watch an engineer work with coding agents for a day — Claude Code, Cursor, any of them — and the job description has clearly changed. Something pops up. You tell the agent what it is and what needs to happen, and while it's going, you've already turned to the next thing — another codebase, another project, another fire. You're not writing most of the code. You're running the team.

Medicine already has a name for this role. In a teaching hospital's emergency room, the senior doctor — the one with final responsibility for every patient on the floor — is the **attending physician**. Under the attending are **residents**: fully licensed doctors still in training, who work up the patients, run the tests, and do most of the hands-on medicine. The attending doesn't touch every patient. The attending supervises, decides, and catches what the residents miss.

That's the modern engineer. You are the attending. The agents are your residents. And the whole floor is an emergency room: cases arrive on their own schedule, several are open at once, and you are constantly shuffling between them — plus the meetings, plus your personal life, plus everything else that doesn't pause because a build is running.

## The Translator Trap

Now look at what's being built for this new job. There's a wave of startups making tools for a *better interaction with the agent* — cleaner interfaces to prompt it, nicer ways to watch it work, tighter loops for steering it mid-task.

That's helpful — but it misses the fundamental problem. A better way to talk to your agent is like hiring a translator for a colleague who doesn't share your language: real friction, worth removing — but removing it doesn't make either of you a better doctor. It gets you clean communication with a resident who still doesn't know how to brief you.

Because here's the actual shape of the interaction today: the agent finishes, or gets stuck, or wanders — and *you* do the rounds. You go find out what happened. You read the diff, or the Claude Code summary, or you just assume it's done... The attending is doing the resident's paperwork. Every context switch starts from zero because the context lives in your questions, not in their report. Memory helps — I've written before about [what changes when the AI carries your full context](https://aisdivine.github.io/#journal-full-context-ai) — but memory solves the *agent's* continuity. It does nothing for yours. The report still has to make it into your head.

## Present the Patient

Emergency rooms have been working this problem for decades, because people died when they didn't. When a resident brings a case to the attending, they don't wait to be interrogated. They **present**: here's the patient, here's the history, here are the vitals, here's what's abnormal, here's what I think it is, and here's what I plan to do. Hospitals even standardized the format — SBAR: situation, background, assessment, recommendation. Fair warning about the legend, though: SBAR's own evidence base is messier than "solved" — reviews find it reliably improves how well clinicians *communicate and feel heard* more than it moves hard patient outcomes. For our purposes, that's fine. Moving decision-relevant context into the decision-maker's head is precisely the part it demonstrably helps, and that's the part we're borrowing: a ritual engineered to transfer maximum context in minimum time, at exactly the moment a decision is needed. This is what a real handoff looks like: not a transcript to dig through — a case, assembled for the person who has to decide.

And medicine isn't even the strictest teacher here. Aviation looked at the same problem and went a step past structure — it standardized the *words*. ASD-STE100, Simplified Technical English, is the controlled language of aircraft maintenance manuals: a dictionary of roughly nine hundred approved words, one meaning per word, one instruction per sentence, written so that an exhausted mechanic — often reading in their second language — cannot misread the step. When misunderstanding costs lives, industries don't polish their communication. They engineer it. Medicine constrained the format of the handoff; aviation constrained the language itself. Software is the outlier: we let our residents freestyle.

That is the interaction mode coding agents need, and mostly don't have. Not "ask me anything about what I did" — that's a chart you have to go read. Presenting: the agent comes to *you*, at the decision point, with the case already assembled. Here's what I was doing. Here's what I found that you didn't know when you assigned this. Here's the risk I'm seeing. Here's what I plan to do next — stop me if I'm wrong. The agent owns the burden of context transfer, because the attending's attention is the scarcest resource on the floor and everyone on a real ER floor knows it.

We are still in the passive phase — brilliant residents, no presentation skills. And so the attending's day is consumed by the one task the whole hierarchy exists to eliminate: walking room to room, figuring out what's going on. And don't forget what happens when you forget about a session... that patient just sits there, worked up and undischarged, until you wander back in days later and have to re-derive why you ordered the tests in the first place.

## The Confident Resident

There's one more trait of today's residents, and it deserves its own room: they are incredibly — and I mean *incredibly* — over-confident.

That's not a side complaint. It's a hole in my own proposal, so let me name it. A presentation is a persuasion channel. Teach a miscalibrated resident to present fluently and you haven't fixed the problem — you've amplified it: confidently wrong briefings, delivered in exactly the format designed to let the attending trust and move on. Hospitals get away with SBAR because residents are calibrated by consequences — present a bad assessment, get caught by the attending, sit through the case review, carry it with you onto the next floor. Agents feel none of that. And the research on AI-assisted decisions is clear that stated confidence shifts how much humans rely on a system whether or not that confidence tracks accuracy.

So the presentation agents need to learn isn't just situation-background-assessment-recommendation. It's the part good residents learn last: *here's what I'm not sure about.* And I'll be honest that this is an open research problem, not a product-roadmap item — a model can produce a calibrated-sounding hedge as fluently as a confident plan, and whether its stated uncertainty tracks anything real is still contested. The best current answer is something like: mostly, sometimes, and it degrades exactly when the case gets weird. But that's the bar. An agent that briefs its uncertainty as credibly as its plan is the one that has earned the attending's trust. Fluency without calibration is just a better-dressed mistake.

## Where the Analogy Breaks

To be fair to my own metaphor, here's where it breaks — because the breaks are the point. Residents learn: every patient makes them better, while today's agents wake up new each session. Residents are accountable: there's a name on the chart when things go wrong, while with agents, all the accountability pools up to you. And residents become attendings — the hierarchy is a training pipeline, not just a delegation scheme. If agents fill every resident slot, it's fair to ask where the next generation of attendings comes from. I don't have that answer. But a teaching hospital with no teaching is a different institution, and we should at least notice we're building one.

## The Attending Stays in the Loop

Will agents eventually just fix things themselves? Sure — some of it, more over time. But the human in the loop isn't a transitional inconvenience to engineer away. It's the same reason the attending exists even though residents are real doctors: there is stuff the resident will miss. Judgment about what matters, what's acceptable to ship, what the patient two rooms over means for this one. The goal isn't to remove the attending. The goal is to stop wasting the attending — to make the loop so information-dense that human judgment lands exactly where it's valuable and cuts the rest of the noise.

That's why the framing matters. The modern coding environment isn't a conversation to smooth over. It's **emergency room management** — a supervision problem, a floor-load problem, a handoff problem. Which cases need me now? Which are stable? What changed since I last looked? Which resident is about to do something irreversible? The tools worth building are the ones that make *that* process excellent.

And "excellent" here is measurable. Time from handoff to decision. Defects caught at the briefing instead of in production. Sessions that never get forgotten. If a tool can't move one of those numbers, it's a nicer chat window.

One more thing the ER framing hides: the attending I've been describing — six open cases, thriving on interrupts — is one kind of engineer, and honestly a pretty specific one. Plenty of great engineers work serially and deeply, and for them this environment isn't an aspiration, it's a hazard. Which is actually the strongest case for structured presentation: a predictable, consistent briefing, arriving at a moment you chose, is exactly what makes this way of working accessible to people who can't — or won't — live interrupt-driven. The protocol isn't for the multitasker. The multitasker was already surviving without it.

## Focus on the Human

Here's the bet hiding under all of this. If you build the better-agent-communication layer, you are betting against the model labs — because agent capability is exactly what improves with every release. Whatever Claude Code can't do this month, the next Fable release does — or the next Qwen, Gemini, or Grok. Build there and your product is a feature of someone else's roadmap. That's the wrapper graveyard of the last few years: startups killed not because they built badly, but because they were standing on the part of the stack that's still moving.

The sharp objection: isn't *presenting* also a capability? Won't some next release brief you SBAR-style out of the box? Probably — and good. But be careful with the tempting version of the counter — "no lab can own the floor" — because it isn't quite true. The IDE owns a floor. GitHub owns a floor. The labs are already sketching their own multi-session board views. What's actually true is narrower: the floor is only safe ground while the world stays multi-provider — six cases across three codebases and two providers, the meeting you're late for, the session you forgot on Tuesday — and the durable asset was never the dashboard anyway. It's the trust relationship with the attending's attention: knowing when *this* human wants to be interrupted, what they count as decision-worthy, how they take a briefing. Your attention is the one resource on nobody's release schedule. Build there.

The attending's side of the loop is the part that isn't moving. Human attention doesn't get a next release. The engineer running six cases at once, deciding where judgment goes next, needing the right context at the right moment — that problem gets *bigger* as the residents get better, because better residents mean more open cases per attending.

So: the models will get better. The communication will get better. Those capabilities are coming whether you build them or not. Focus on the human.

---

*Next in this thread: if "present the patient" is the interaction mode we need, someone has to write the protocol. In the next post I'll propose a framework for how agents should communicate with the humans supervising them — what goes in the briefing, when it arrives, what it admits it doesn't know, and how it earns the attending's trust. SBAR for software.*

---

## Further Reading

- Institute for Healthcare Improvement. ["SBAR Tool: Situation-Background-Assessment-Recommendation."](https://www.ihi.org/resources/tools/sbar-tool-situation-background-assessment-recommendation) — The standardized case-presentation format this essay wants agents to learn. Born on nuclear submarines, adopted by hospitals for exactly the reason it applies here: transferring decision-relevant context under time pressure.
- ASD. [ASD-STE100: Simplified Technical English.](https://www.asd-ste100.org/) — Aviation's answer to the same problem, taken further: a controlled language of ~900 approved words, one meaning each, so a maintenance instruction cannot be misread. Proof that when misreading kills, you constrain the language, not just the format.
- Sutton, R. (2019). ["The Bitter Lesson."](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) — Why betting against general capability improvements is how you lose. The startup-killer argument, made about research methods seventy years deep.
- Horvitz, E. (1999). ["Principles of Mixed-Initiative User Interfaces."](https://dl.acm.org/doi/10.1145/302979.303030) — The original case for systems that reason about when to interrupt, what to surface, and when human attention is worth its cost. The attending's loop, designed twenty-five years early.
- Mark, G., Gudith, D., & Klocke, U. (2008). ["The Cost of Interrupted Work: More Speed and Stress."](https://dl.acm.org/doi/10.1145/1357054.1357072) — What context-switching actually costs the human doing it. The reason the presentation ritual exists.
- Zhang, Y., Liao, Q.V., & Bellamy, R. (2020). ["Effect of Confidence and Explanation on Accuracy and Trust Calibration in AI-Assisted Decision Making."](https://dl.acm.org/doi/10.1145/3351095.3372852) — Stated confidence shifts human reliance whether or not it tracks accuracy. The Confident Resident section, measured.
- Amershi, S., et al. (2019). ["Guidelines for Human-AI Interaction."](https://dl.acm.org/doi/10.1145/3290605.3300233) — Eighteen tested guidelines; several ("make clear what the system can do," "when it's uncertain," "why it did what it did") are the presentation requirements, stated as testable design guidance.
- Parasuraman, R., Sheridan, T., & Wickens, C. (2000). ["A Model for Types and Levels of Human Interaction with Automation."](https://ieeexplore.ieee.org/document/844354) — The canonical framework for which functions to automate and to what degree. "ER management" is supervisory control, and this is its founding map.
- Müller, M., et al. (2018). ["Impact of the communication and patient hand-off tool SBAR on patient safety: a systematic review."](https://bmjopen.bmj.com/content/8/8/e022202) — The honest version of the SBAR legend: solid evidence it improves communication, thinner evidence on hard outcomes. The concession in the Present the Patient section.
- Lin, S., Hilton, J., & Evans, O. (2022). ["Teaching Models to Express Their Uncertainty in Words."](https://arxiv.org/abs/2205.14334) — What it takes for a model's stated confidence to mean something. The open problem under the Confident Resident's bar.
- Kadavath, S., et al. (2022). ["Language Models (Mostly) Know What They Know."](https://arxiv.org/abs/2207.05221) — The "mostly" is the finding: self-knowledge exists and degrades off-distribution — exactly when the case gets weird.
