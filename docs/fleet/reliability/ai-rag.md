---
id: ai-rag
title: Built for AI agents to read
sidebar_label: Built for AI agents to read
---

> 📘 **EXPLANATION** · Audience: Architect, Documentation owner · Read time: ~5 min

Technical documentation in 2026 is consumed by humans **and** by AI agents — copilots in IDEs, RAG-backed assistants, MCP-driven tools that read your docs to answer engineer questions. The IOTC documentation surface is designed to perform well for both audiences. This chapter explains the design choices and how to extend them.

### Why this matters

A developer who pastes a half-written `set_operating_mode` payload into Cursor or Copilot expects the assistant to complete it correctly. That assistant likely retrieved a chunk from somewhere — often the API reference, sometimes a concept chapter — and is constructing the completion from that chunk. **If the chunk is wrong, ambiguous, or under-contextualised, the assistant produces wrong code.** The cost is debt the documentation team is now paying.

Five design choices in these docs are made to make that retrieval better.

### 1. Atomicity — one operation, one page

Every `mqtt-api-reference/<command>.md` file is **one operation, one event, one page**. No multi-operation pages. No "see also the related command below." A retrieval pulls one page and gets the complete contract.

This is opposite to the older REST-style convention of grouping operations by resource. Resource grouping helps human navigation but hurts retrieval: the assistant pulls the page and has to disambiguate which of three operations the user actually meant.

### 2. Schema fidelity — one shape, no envelopes

Every example payload in `mqtt-api-reference/` is the **native MQTT shape** — the exact form the reader accepts. No OpenAPI-style nested `params` wrappers. No multi-shape "here's how it looks in REST, here's how in MQTT" choice points. The example is what you publish.

This matters for retrieval because LLMs do not reliably reason about which shape applies to which protocol. Given two shapes, an assistant picks one — and it's a coin flip which. Given one shape, the answer is deterministic.

### 3. Outcome-led titles, semantic scent

Every chapter title predicts what the reader (or the assistant retrieving for the reader) will know after reading:

- **Outcome-led:** "Where tag reads come from" → reader gets the `dataEVT` schema.
- **Resource-led (avoided):** "Tag Data Event" → reader gets *something about tag data*; assistant has less to disambiguate from.

Outcome-led titles increase the **semantic specificity** of every chunk. Embedding-based retrieval works better when chunks have clear, distinct semantic centres.

### 4. Cross-walks, not cross-links

Each concept chapter in Parts 4–6 carries a "See in the API Reference" callout naming the matching sub-tag and every operation in it. Each API reference page has the inverse callout pointing to the concept chapter.

For human readers, this is two clicks instead of one. For retrieval-based assistants, it's the **anchor for chained retrieval** — pull the concept chunk, pull the linked operation chunk, assemble a complete answer.

The cross-walk lives in `chapter-knowledge-mapping.md` Part 9. Maintain it as the docs grow.

### 5. Failure-mode index instead of FAQ

Part 8 — Diagnose & Reference — uses a **symptom-first index** (`reference/diagnose/symptom-index`) rather than a Q&A FAQ. Each symptom links to a failure-mode page or recovery playbook.

Symptom-first is RAG-friendly: a user pastes their error into a chat, the assistant retrieves on symptom match rather than on "what is the FAQ entry that might be relevant?" The mapping from symptom phrase to fix is mechanical.

### What an AI-friendly contribution looks like

When adding new chapters, follow these rules to keep retrieval quality high:

- **One concept per page.** If a page is two concepts, split it.
- **Title is outcome-led.** "How X works" or "What X is" or "When to use X."
- **First paragraph is the answer.** Don't bury the lead; the first paragraph is what shows up in search snippets and embedding-based retrieval previews.
- **Include named examples.** A `dataEVT` chunk that says "the reader publishes tag reads" loses to one that says "the reader publishes a `dataEVT` with `type: BALANCED_PERFORMANCE` and `data.tagData[]`."
- **Avoid implicit references.** "As mentioned earlier" doesn't work when a retrieval pulls only this chunk. Repeat the antecedent.
- **Cross-walk explicitly.** When a chapter touches another's domain, link with the exact target chapter title.

### What we don't do

- **Auto-generated docs from schemas alone.** Schemas are accurate but lack the *why*. RAG over schema-only docs produces correct code that the user can't reason about.
- **Long chapters.** Above ~2,000 words, chunkers split unpredictably. Five 400-word chapters beat one 2,000-word chapter for retrieval consistency.
- **Code-only pages.** Code without surrounding prose retrieves poorly. The prose contains the embedding's semantic signal.
- **Multilingual mixed content.** Translation pages live in separate sites/paths.

### The MCP angle

[Model Context Protocol](https://modelcontextprotocol.io) servers can expose documentation as a tool an agent calls directly. For IOTC, a hypothetical `iotc-docs` MCP server would:

- Take a question or symptom as input.
- Search across concept chapters and API references.
- Return the most relevant atomic chunks plus their cross-walked siblings.

The atomicity of the API reference files is what makes this useful. A server that returned multi-operation pages would fail at the "give me the contract for `control_operation`" prompt.

### Measurement

How do we know this works? Two signals:

- **Time-to-correct-payload.** The metric is "how long from question to a runnable payload." Atomic, outcome-titled docs measurably reduce this — the assistant retrieves the right chunk on the first try.
- **Misconception rate.** When `chapter 2.5 (The OpenAPI Illusion)` is in the retrieval pool, the rate of generated payloads with extraneous `params` envelopes drops sharply. The misconception inventory in `chapter 8.4` exists to absorb retrieval against wrong models.

### What this chapter does not cover

- **Tooling specifics** — embedding choice, chunk size, vector store. Different consumers will make different choices; the document corpus is designed to be agnostic.
- **Building your own RAG/MCP integration** — outside scope; the docs are an input, not an integration product.
- **Localisation** — not yet addressed.

**Related:** 📘 [Pairing the docs with the API Reference](/foundations/orient/docs-and-api-ref) · 📘 [Things people get wrong about IOTC](/reference/diagnose/misconceptions) · 📕 [Glossary, limits, and cheat sheets](/foundations/introduction/glossary)
