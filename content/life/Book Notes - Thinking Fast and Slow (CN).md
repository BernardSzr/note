---
title: "Book Notes: Thinking, Fast and Slow"
date: 2024-02-28
tags: [books, psychology, decision-making, cognitive-bias]
aliases: [思考快与慢, Kahneman]
lang: zh-CN
---

# Book Notes: Thinking, Fast and Slow

> [!quote] Daniel Kahneman
> "A reliable way to make people believe in falsehoods is frequent repetition, because familiarity is not easily distinguished from truth."

## Overview

*Thinking, Fast and Slow* by Daniel Kahneman[^1] explores the two systems that drive the way we think:

- **System 1** — Fast, automatic, intuitive, emotional
- **System 2** — Slow, deliberate, logical, calculating

> [!info] Author
> Daniel Kahneman is a Nobel Prize winner in Economics (2002) for his work on judgment and decision-making under uncertainty.

## Key Concepts

### Cognitive Biases

> [!warning] These affect everyone
> Understanding biases is crucial for [[Machine Learning Intro|ML model evaluation]] and everyday decisions.

| Bias | Description | Example |
|------|-------------|---------|
| Anchoring | Over-relying on first information | Initial price affects negotiation |
| Availability | Judging by easily recalled examples | Fear of plane crashes after news |
| Confirmation | Seeking confirming evidence | Ignoring contradictory data |
| Framing | Different reactions based on presentation | "90% success" vs "10% failure" |

### Prospect Theory

> [!math] Value Function
> Kahneman and Tversky's value function:

$$v(x) = \begin{cases} x^\alpha & \text{if } x \geq 0 \\ -\lambda(-x)^\beta & \text{if } x < 0 \end{cases}$$

Where $\lambda > 1$ captures loss aversion.

> [!tip] Loss Aversion
> Losses are felt approximately 2x more strongly than equivalent gains. This explains why people hold losing stocks too long.

### The Planning Fallacy

> [!danger] Personal Application
> This is one of the most practically relevant biases. We consistently underestimate:

- Time to complete projects
- Costs involved
- Risks of adverse outcomes

See [[Healthy Habits]] for how I apply this to personal planning.

## Memorable Quotes

> [!quote] On Intuition
> "The confidence that individuals have in their beliefs depends mostly on the quality of the story they can tell about what they see, even if they see little."

> [!quote] On Happiness
> "The idea that the future is unpredictable is undermined every day by the ease with which the past is explained."

## Personal Takeaways

> [!todo] Applying These Lessons
> - [x] Check for anchoring in negotiations
> - [x] Consider base rates before making predictions
> - [ ] Use checklists to counter overconfidence — see [[How I Take Notes]]
> - [ ] Be aware of framing effects in [[Web Development Basics|web design]]

## Notes on Related Reading

> [!note] Related Books
> - *Nudge* by Thaler and Sunstein
> - *Predictably Irrational* by Dan Ariely
> - *The Art of Thinking Clearly* by Rolf Dobelli

[^1]: Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux.

> [!note] See Also
> - [[Healthy Habits]] — Using decision science in daily life
> - [[Machine Learning Intro]] — Cognitive biases in data analysis
> - [[My PKM System]] — Organizing book notes

---

*Tags: #books #psychology #decision-making #cognitive-bias*
