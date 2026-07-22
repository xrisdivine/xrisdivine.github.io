# Evaluation Is the Product

*Category: interaction models · July 2026*

**Dek:** When any AI product can be built in a weekend, the software isn't the scarce thing — software is cheap. A precise definition of what it should do — and an instrument that says whether it did — is. For interaction models, agents loose in a room full of people, that definition doesn't exist yet. So build it first — that's the product.

---

## Winter Is Coming — Evaluation Is Coming

In *Game of Thrones*, everyone is busy playing the game — alliances, marriages, the throne — while the Starks keep muttering the line nobody wants to hear: *winter is coming.* It's not a threat but a season, and the houses that spent everything on the game die of the thing they ignored.

Right now everyone is playing the game. The move is to ship a model — any model, just bigger and better — and the same rush is coming for interaction models: an agent that sits on the video call or in the channel and listens to a room of people continuously, in real time, the way Thinking Machines describes it and the way Claude already half does in Slack. The demos are extraordinary. They are also cheap — and will get cheaper: code generation collapsed the cost of building the thing, so the meeting agent you imagine this morning exists by Friday.

Winter is coming, Jon Snow. Evals are coming. The season nobody is spending attention on is the one where you have to prove the thing works over and over and over again, in many settings and environments and interactions you haven't even considered — not just in the demo, in the room — and discover you never defined what "works" means. And "coming" is not the same as "should exist." Some of these rooms — an always-listening classroom, an ambient clinical suite — an honest eval is what talks you out of. The eval isn't only the thing that lets you ship; it's the thing that lets you decide not to.

## Software Got Cheap. Evaluation Is More Expensive.

Here is the shift the demos hide. When building is cheap, the software stops being the product. Everyone can build it. What's scarce moved somewhere else: to a precise definition of what the thing is supposed to do, and a way to measure whether it did. Experiment definition and evaluation is the product now. The rest is a commodity you can generate.

[The chatbox had it easy](#who-owns-interaction), and it let us skip this for a decade. A wrong answer in a one-on-one box is *visibly* wrong — you read the reply, you see it missed, you try again. Correctness was eyeball-shaped and self-evident, so eval felt optional. You could get away with shipping on vibes — this is NOT the way.

When the assistant listens to the whole room at once, instead of one turn at a time, that free signal disappears. The most important thing it now does is decide when *not* to respond — and a good silence and a bad silence look identical from the outside. You cannot eyeball whether it stayed quiet for the right reason. Worse: for a whole class of these situations there is *no correct answer to grade against.* When two people who both have the right to direct it want opposite things, there's no ground truth — [Arrow proved in 1951](https://plato.stanford.edu/entries/arrows-theorem/) that no rule fairly settles conflicting preferences. You can't eyeball it and you can't look it up.

So the eval is the only thing standing between an impressive demo and something that works in the room, continually. That's the product.

## You Can't Measure "Interaction Model"

There's no single eval for "interaction model," the same way there's no single test for "software." The thing you measure is the *shape of the room* — who's in it, who has standing, what going wrong even looks like.

Sort those uses by shape and they cluster. I land on six groupings — the seam lines are my own guess, and someone else might draw them differently. Each group leans on a different stage of the same pipeline: **attribution → addressivity → authorization → arbitration → control.** So each group fails in its own way, and that is why they are worth separating. Here are the six:

- **Meeting Participant** — a live call with several people talking at once. It names decisions and owners as they land. It fails when it comes in at the wrong moment, or credits a line to the wrong speaker.
- **Shared Channel Co-worker** — a busy async channel. It answers when paged and stays out of the rest. It fails when it barges into a thread meant for someone else — or obeys a "ship it" pasted from a quoted email.
- **Live-Ops / Command Room** — real-time authority, high stakes. It takes orders only from the current incident commander and halts on "stand down." It fails when it obeys the wrong voice, or stops too slowly.
- **Multi-Stakeholder Advisor** — a few people with real but conflicting authority. It fails when it quietly picks a side instead of showing there are two.
- **Ambient / Always-On Space** — a physical room, continuous audio, bystanders. A classroom co-teacher. It fails when it records someone who never consented, or gives the floor to the loudest child.
- **Customer-Facing Multi-Party** — internal and external people together. A three-way support call. It fails when it leaks the supervisor's coaching to the customer.

The point isn't the count. It's that once you name the archetype, you've named the failure — and the failure is the thing you measure. Measure the archetype well and you've measured every product that maps to it.

## So How Would You Even Know?

Start with the sentence a user would say, not the metric. One umbrella: *it answers what's meant for me, on legitimate authority, and stops when told.* That unpacks into a dozen plain-language expectations — did it come in at the right moment, does it know who said what, can it be driven by a faked identity, does it stop when the right person says stop — and only *then* does each one earn a number.

From there it's a hierarchy, and every rung has to hold: the **experience** a user feels, the **end-to-end** behavior that delivers it, the **system** decision underneath, and the **component** metric with a target you can put a threshold on. Trace one all the way down and it looks like this — the meeting facilitator:

> *Experience:* right voice, right moment — answer what's addressed to it, stay quiet on the rest, and come in before the moment passes.
> *End-to-end:* follows several overlapping speakers, names a decision and its owner as it lands, holds its tongue while people think aloud.
> *Critical stage:* addressivity.
> *Metric + target:* addressee precision ≥ 0.97 (it barges in on at most 3% of what it answers); floor-equity parity 0.9–1.1 (it doesn't systematically favor the loudest speaker).

Do that for each archetype and "test the whole thing" becomes a single legible matrix instead of vibes.

The part that makes this honest — and the part most eval decks skip — is naming what *can't* be a metric. Conflict resolution has no right answer, so you don't score whether it picked correctly. You score whether it **surfaced** the conflict and handed the decision back. And you pair every metric with its counter-metric, because a single number is a thing to game: reward "don't barge in" alone and the agent learns to say nothing; you have to hold barge-in and miss rate against each other. An eval that reports one clean number is usually lying to you.

## A Chain Multiplies Its Errors

What we call "the interaction model" is not one model. It is a pipeline. It works out who is speaking. It decides whether the line was addressed to it. It checks whether that speaker is allowed to direct it. It arbitrates when two people both have that right, and disagree. Then it acts, or holds. Five decisions, five components, each with its own error rate. Two of those are not the same question, and treating them as one is an old mistake: whether the addressee classifier is correct is a *system* fact; whether the person in the room feels heard is an *experience*. One has never cleanly predicted the other.

A chain is less forgiving than any one part of it. Put five stages in a row, each 95% accurate. If their errors were independent, the chain would be right about 77% of the time — and that is the optimistic case. The errors are not independent, so the real number is lower, and you can't know it until you measure the whole chain. A wrong guess about who is speaking corrupts the addressee decision that reads it. A wrong addressee decision hands the authority check the wrong person. Errors don't add up; they compound. So a strong per-component score flatters the product: every part looks good and the whole still fails in the room. The only score a user feels is the one at the end of the chain. So measure the parts and the whole, and treat the gap between them as the real finding.

## When It Breaks, Which Part Broke?

Say it does fail. The agent answers a question that wasn't for it, and does it in the boss's name. HCI has a word for the moment a tool announces itself by going wrong — Winograd and Flores called it a *breakdown* — and the trouble with a compound system is that the breakdown surfaces at the end while its cause sits somewhere upstream. Was that a diarization error, an addressee error, or an authority error? From the outside they produce the identical wrong behavior.

So you can't evaluate an interaction model as a black box that emits a score. You need it instrumented — every stage's decision logged and inspectable — so a single end-to-end failure decomposes into *which rung gave way.* This also serves the two readers of an eval. The per-component metrics are **formative**: they tell the model team the one stage to fix. The experience KPI is **summative**: it is the ship gate the buyer reads. A good eval lets you walk from the gate that failed down to the part that failed it, in one trace.

## The Lab Is Not the Room

One more, because it's the failure that quietly voids all the others. An eval built from clean single-speaker clips is measuring a different task than the one the product does — a quiet lab is not a standup with three people cutting each other off, a baby in the background, and someone dialing in from a car. Every metric above is only as trustworthy as the room it was measured in. The HCI name for taking this seriously is evaluation *in the wild*: you study a system where it actually lives, not where it's convenient to measure. So you build the eval out of real, messy, multi-party rooms — captured or adversarially synthesized — because a benchmark that strips out the crosstalk has quietly stripped out the whole problem the interaction model exists to solve.

## Measured on Whom?

Every threshold in an eval like this is a number attached to a population, and the population is a design choice most evals never say out loud. Measure addressee accuracy on a few fluent speakers taking clean turns and the score is easy. Measure it on the people the loud room already talks over — someone speaking a second language, someone who stutters, a Deaf participant reading captions a beat behind the audio, an autistic speaker whose turn-taking timing doesn't match what the model learned a "turn" sounds like — and the number you were about to ship is a fiction for exactly the people the system was most likely to fail.

This is why equity can't sit in a footnote. An always-on agent gives the floor to whoever grabs it fastest. That was never the group that needed help being heard. Continuous interaction is, quietly, a tax on everyone who can't compete for the floor in real time. So the equity metric is not a nice-to-have next to the accuracy metric. It is a check on whether the accuracy metric is even valid. A precision score reported without the population it was measured on is not a strong result. It is just an untested claim with a number attached. So you report every metric disaggregated by group — language, disability, seniority, speaking style — not as one aggregate, and you let the worst group set the score. A number that only holds for the people the room already favored is not the number you ship on.

## It's a Loop, Not a Gate

There's a trap folded into "the failure is the thing you measure": you can only measure the failures you already imagined. Six archetypes is a taxonomy, and every taxonomy is a closed list pretending the world is closed too. Deployment will produce a seventh — a room you didn't picture, a failure that fits none of your categories — and by construction your eval is silent on exactly the thing about to hurt you, because you built it to grade the six.

So the eval can't be a gate you clear once. It has to be a loop. The in-the-wild rooms that stress the metrics also feed them: a surprising failure in production isn't just a bug to patch, it's a missing archetype to add, a metric that didn't exist yesterday, a counter-metric you now need. You reassess and repeat. Red-team for the categories you haven't named yet; log the outputs that surprised you and treat the pile of surprises as the backlog for the next version of the eval. An eval that never changes is grading a product that stopped moving — and none of these have stopped moving. The taxonomy is a snapshot of what you understand so far, and the whole discipline is staying honest about how little that still is.

## The Eval Is the Spec

Notice what the eval turned into once you built it. It's not a report card you run at the end. It's the specification you should have started with — it names every behavior the product owes, every way it's allowed to fail, the threshold that separates shipping from not, and the population all of that was measured on. The same criteria that grade the listen decision also tell the model team what to train on and tell a buyer whether the thing clears the bar on the crowded call, not just the tidy one-on-one box.

That's why, when the software is free, this is the asset. Anyone can build the meeting agent. The house that survives the winter is the one that defined, in advance and in numbers, what it would mean for that agent to actually work — and then went and measured it.

The [companion essay](#who-owns-interaction) to this one asks the human question: when the assistant is in the room with everyone, *whose voice counts as yours?* This is the operational twin of that question. How would you even know if it got the answer right?

You'd write the eval first. With models running in the wild, the eval is as much the product as the code — the code is what the thing does, and the eval is the only reason to believe it does it where it actually has to. Winter is coming.

---

## Further Reading

- Thinking Machines Lab. ["Interaction Models: A Scalable Approach to Human-AI Collaboration."](https://thinkingmachines.ai/blog/interaction-models/) — The argument this post is in conversation with: interactivity should scale alongside intelligence, through continuous real-time audio, video, and text.
- Arrow, K. (1951). ["Social Choice and Individual Values"](https://plato.stanford.edu/entries/arrows-theorem/) (impossibility theorem). — No rule fairly aggregates conflicting preferences. Why some of what an interaction model does has no ground truth to grade against.
- Winograd, T., & Flores, F. (1986). *Understanding Computers and Cognition.* — Where the idea of a *breakdown* comes from: a tool becomes visible at the moment it fails. The "when it breaks, which part broke?" section, named.
- Amershi, S., et al. (2019). ["Guidelines for Human-AI Interaction."](https://dl.acm.org/doi/10.1145/3290605.3300233) CHI. — Design guidelines for AI-infused systems; several bear directly on the addressivity and timing KPIs here.
- Selbst, A., boyd, d., Friedler, S., Venkatasubramanian, S., & Vertesi, J. (2019). ["Fairness and Abstraction in Sociotechnical Systems."](https://dl.acm.org/doi/10.1145/3287560.3287598) FAccT. — The "portability" and "framing" traps: a component measured apart from its social frame produces valid-looking, meaningless numbers. The formal version of "measured on whom?"
- Mitchell, M., et al. (2019). ["Model Cards for Model Reporting."](https://dl.acm.org/doi/10.1145/3287560.3287596) FAccT. — Report performance *disaggregated by group*, as a norm. The method behind "measured on whom?"
- Bender, E. M., & Friedman, B. (2018). ["Data Statements for Natural Language Processing."](https://aclanthology.org/Q18-1041/) TACL. — Documenting *who is in your evaluation population* as a first-class artifact.
