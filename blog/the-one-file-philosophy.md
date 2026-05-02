---
title: "The One-File Philosophy"
date: "2025-02-01"
tags: [design, simplicity, tools]
excerpt: "The best tools ask you for one thing and do the rest. Here's why I care about that more than ever."
---

# The One-File Philosophy

The best tools I've ever used share one characteristic: they ask you for exactly one thing.

A spreadsheet asks you for data. A compiler asks you for code. A camera asks you to point and press.

They don't ask you to understand how they work.

## The cognitive cost of configuration

Most developer tools are built by developers, for developers. That means they expose every option, every escape hatch, every "advanced setting" — because the people who built them use every single one.

For everyone else, this is a wall.

I've watched talented people abandon good tools because the setup process required too many decisions before they could do anything useful. The tool won before they even started.

## What one file changes

When everything lives in one place, a few things happen:

- **The barrier to starting disappears.** You open one file, fill in the blanks, and you're done.
- **The barrier to changing things disappears.** Don't like your colour scheme? One line. Wrong job title? Ten seconds.
- **The mental model stays intact.** There's no "where did I put that setting?" moment. It's in the file. The file is always in the same place.

## The trade-off is real

You lose flexibility. Some things that would be configurable in a more complex system aren't options here.

That's a trade I'll make every time. Flexibility is only valuable when it gets used. Unused options are just noise — and noise has a cost.

## One file is a design decision

Deciding that your tool will have one entry point isn't laziness. It's a strong opinion about where the user's attention should go. The constraint forces you to make decisions that the user shouldn't have to.

That's the job. Do the hard thinking so the user doesn't have to.

---

*Everything in this portfolio lives in one file: `portfolio.config.yaml`. That was an intentional choice. I hope it shows.*
