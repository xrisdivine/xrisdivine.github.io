# Your Users Don't (Really) Care About Benchmarks

*Category: societal · August 2026*

**Dek:** Most AI labs are fighting over benchmark scores users can't even feel. The speed and the price tag? Those they feel instantly. And the only benchmark that ever mattered — did you walk away with the thing you came for — is one nobody publishes.

---

## The Fight Nobody Can Feel

Every model launch comes with the same slide now. The labs are locked in a war over benchmark deltas — two points on GPQA, a few Elo on the Arena, a decimal on SWE-bench. I don't doubt the work; the work is real. But from where the user sits, that entire war is invisible.

You know what's perceptible? Speed and price. One lands in your patience, the other in your wallet, and both arrive within seconds of opening the product. Usability and effectiveness are felt too — just on a longer clock: over the session, over the week, at the moment you find out whether the advice actually held up. The industry competes hardest on the thing users can *never* feel, and treats the things they feel instantly — or eventually — as an afterthought. That asymmetry is where the story starts.

## What the User Actually Cares About

Not a score. It's **time**. It's **energy**. It's the feeling of thoroughness — that you're talking to one of the best in the world at this thing. It's being **understood**: it gets you, your context, what you actually meant, not the literal words you fumbled out. And it's getting the answer in an *appropriate* amount of time.

Read that list again and notice: not one item on it appears on a leaderboard.

## "Appropriate Time" Is the Tell

Appropriate is doing a lot of work in that sentence, because appropriate is *super* subjective. Three seconds is an eternity for "what's the capital of France" and a miracle for "review this contract." And because it's subjective, it's hard to measure — and because it's hard to measure, the industry doesn't compete on it. We optimize what benchmarks can hold, not what users can feel. It's the old streetlight problem: the drunk looks for his keys under the lamp, not because he dropped them there, but because that's where the light is.

## Five People on One Street

Take five people on my street. Different AI fluency. Different use cases. Different patience, different stakes, different hours in the day. The rushed parent wants the fast good-enough answer. The researcher wants the model to think for three minutes and show its work. The first-timer needs it to be forgiving about a badly phrased question. The developer wants it terse. The fifth neighbor uses a screen reader, and for her, verbosity isn't a style preference — it's minutes of her life, read aloud, one word at a time.

That last one generalizes: "appropriate" varies most exactly where ability varies. When typing is the bottleneck, every clarifying round-trip has a physical cost. When working memory is the bottleneck, the wall-of-text answer doesn't inform, it excludes. The felt layer isn't a nicety at the margins — it's most acute for the people the leaderboard was never going to see.

One leaderboard cannot rank for all five — not because ranking is hard, but because "best" was never a single question.

## What You Walk Away With: A Taxonomy

I started listing what people actually come to a model for — sorted by what you walk away with — and every request I could think of kept landing in the same five branches:

**1. Make me something.** Code, a website, a diagram, a document, an email. You walk away with an artifact that didn't exist before. *Done* means the artifact works, reads, looks right — the most verifiable branch, which is exactly why coding benchmarks are the least-bad benchmarks we have.

**2. Tell me something.** Information, explanations, summaries, what-does-this-mean. You walk away knowing something you didn't. *Done* means you actually understand — which depends on you: your level, your framing, your fluency. The same answer completes the task for one neighbor and fails it for the one next door. This is where the five people on one street live.

**3. Help me decide.** Advice, recommendations, tradeoffs, should-I-take-this-job. You walk away with a decision, or confidence in one. *Done* means you moved forward and it held up — the slowest feedback loop of all, invisible to benchmarks, and almost entirely about being understood.

**4. Do it for me.** Book it, send it, fix it, run it across my tools. You walk away with the world changed and your hands never touched it. *Done* is at its most literal here: it happened, correctly, without babysitting.

**5. Think it through with me.** Brainstorming, rubber-ducking, working a problem out loud. You walk away with better thoughts than you brought. *Done* is the fuzziest of all — the interaction itself is the product. No benchmark will ever touch this branch.

And across all five runs the felt layer — time, energy, thoroughness, expertise, being understood. Those aren't a sixth branch; they're the live mix over every branch — the faders riding on top of whatever you came for. What you came for, times how it felt getting it: that's the real grid. A benchmark score captures maybe one cell of it.

The reason "best" fragments per person isn't just fluency. It's that your five neighbors aren't even on the same branch — and neither are you, hour to hour. (Treat the five as a hypothesis, not a census — anyone sitting on real usage logs could test it, and I hope someone does.)

## Best Is Personal

Here's the part I keep coming back to. Users still want the best model — of course they do. But when a user says *the best*, they mean *the best for them, right now, for this*. Best is indexical, like "here" or "now." It points at the person saying it.

So don't hand them a model picker and a benchmark chart. Don't tell them which one is 3% faster or 2 points better on an eval they've never heard of. Just give them the best one for them — silently. "This is the best for you" is the product. The comparison table is homework you've outsourced to the customer.

Every dropdown with six model names in it is a quiet confession: we haven't done the routing work, so you do it. Nobody picks their Netflix encoder. The endgame is models as infrastructure — invisible selection, tuned to your task, your fluency, your patience — where the felt result is just: it's fast, it gets me, it's worth it. And yes, power users, this includes you: lovingly maintaining a mental map of which model to use for what *is* the router's job, done by hand, for free.

One guardrail, though, because my own argument cuts both ways: if you can't feel a benchmark, you also can't feel a quiet downgrade. Silent routing is exactly how a provider protects its margins — you get the cheap model on a hard day and never know, precisely *because* the difference sits below perception. So the rule is: silent by default, inspectable on demand. The router decides; the receipt exists. Invisible choice is a feature. Unauditable choice is a trap.

Two more things I wrestle with. The fifth branch of the taxonomy resists routing entirely: when the interaction itself is the product, continuity — not optimality — is what the user wants, and swapping the model mid-relationship swaps the product. Some people will rightly want to pick their model and keep it; the router owes them that. And the router that knows your patience had to learn it from somewhere — the model *of you* deserves the same rule as the model choice: inspectable on demand.

## The Entire Scorecard

The last benchmark that matters is the one no lab *ranks* on: **task completion, as judged by the person who had the task.** I came for code, for advice, for a diagram, for an explanation, for a website — did I leave with that thing achieved? In the time I had, at a price I didn't notice, feeling understood along the way?

And here's the uncomfortable part: this isn't unmeasured terrain. HCI has been measuring exactly this for decades — SUS has scored user-judged usability since the eighties, NASA-TLX made "it's energy" an operational instrument in 1988, and Google's HEART framework put *task success* — the literal letter T — into production metrics at scale back in 2010. The benchmark nobody publishes isn't unmeasurable. It's *unranked* — because it's expensive, it's slow, and it refuses to collapse into a single number you can tweet. So the charge isn't that we can't measure what users feel. The measurements exist. Nobody competes on them.

One caveat, and it's a real one: the user's verdict is the right authority, not an infallible one. A fluent model is very good at producing the *feeling* of understanding without the substance — perceived completion and actual completion can diverge, and the confident wrong answer is exactly where they do. That gap is real, and design choices control its size. But given the choice between a proxy that never asks the person and a verdict that occasionally flatters them, the authority still belongs with the person.

That's the entire scorecard. Everything else is proxy.

The lab that wins the consumer war won't be the one at the top of the leaderboard. It'll be the one that made the leaderboard irrelevant to the person using it.

---

## Further Reading

- Nielsen, J. (1993). ["Response Times: The 3 Important Limits."](https://www.nngroup.com/articles/response-times-3-important-limits/) — 0.1s, 1s, 10s: the perceptual thresholds of waiting, established thirty years before anyone streamed a token. Why speed is felt, not read.
- Simon, H. (1956). ["Rational Choice and the Structure of the Environment."](https://psycnet.apa.org/doi/10.1037/h0042769) — Satisficing: real people don't optimize, they take the first option that clears their bar. "Best for them" is satisficing, formalized seventy years ago.
- Christensen, C., Hall, T., Dillon, K., & Duncan, D. (2016). ["Know Your Customers' 'Jobs to Be Done.'"](https://hbr.org/2016/09/know-your-customers-jobs-to-be-done) — People don't buy products, they hire them for a job. The taxonomy above is a jobs-to-be-done map for models.
- Singh, S., et al. (2025). ["The Leaderboard Illusion."](https://arxiv.org/abs/2504.20879) — What the Arena actually measures and who it favors. The case that even the benchmark designed to capture preference doesn't capture yours.
- Strathern, M. (1997). ["'Improving Ratings': Audit in the British University System"](https://en.wikipedia.org/wiki/Goodhart%27s_law) (via Goodhart's law). — "When a measure becomes a target, it ceases to be a good measure." Goodhart's law, as lived by institutions that optimized the score instead of the thing.
- Rodden, K., Hutchinson, H., & Fu, X. (2010). ["Measuring the User Experience on a Large Scale: User-Centered Metrics for Web Applications."](https://dl.acm.org/doi/10.1145/1753326.1753687) — The HEART framework: happiness, engagement, adoption, retention, task success. The "unpublished" benchmark, operationalized sixteen years ago; the question is why it never became a leaderboard.
- Hart, S. & Staveland, L. (1988). ["Development of NASA-TLX: Results of Empirical and Theoretical Research."](https://ntrs.nasa.gov/citations/19890006123) — Subjective workload — effort, frustration, time pressure — as a validated instrument. "It's energy," measured since 1988.
- Buçinca, Z., Malaya, M., & Gajos, K. (2021). ["To Trust or to Think: Cognitive Forcing Functions Can Reduce Overreliance on AI in AI-assisted Decision-making."](https://dl.acm.org/doi/10.1145/3449287) — Perceived success and actual success diverge, and design controls the gap. The check on treating the user's feeling as ground truth.
