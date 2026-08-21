# Subjective Review of Code Review

Working on [this pr](https://github.com/lemonade-sdk/thenoise/pull/19)
presented a good opportunity to evaluate LLMs as code reviewers using
[opencode](https://github.com/anomalyco/opencode) to drive the review.

All testing done with a 128GB Minisforum MS-S1 Strix Halo. Speed is
recorded since I don't want my development to be slowed down waiting
for code review. 

[REVIEW.md](REVIEW.md) is the combination of outputs of each of the
reviewers; the were each asked to update this document.

### LLMs tested
| LLM                    | Size | TPS, Time | Verdict | Comments |
|------------------------|------|-------|---------|----------|
| DeepSeek-V4-Flash-0731 | 97.1 | 15.8, 29:06 | Good | Synthesized all previous reviews|
| GLM-4.7-Flash          | 29.7 | 9.5, 23:19 | good | Updating the review file took an extra 39:54! :( |
| Qwen3.6-35B-A3B        | 56.9 | 44.2, 06:35 | good | Found false positives in previous reviews |
| Qwen3.8-27B            | 21.7 | 13.3, 23:26 | good | Slow, thinks too much, aborts output on the sub-agent after almost 35m |
| GPT-OSS-120B           | 59.0 | 45.2, 07:28 | good | ... |
| Muse-Glimmer-30B       | 47.0 | 13.2, 24:55 | good | ... |
| North-Mini-Code        | 30.9 | 38.1, 07:39 | good | first time through it got stuck in a loop |
| Orinth-1.0-35B         | 29.1 | 54.3, 05:44 | good | didn't update the REVIEW.md quite right |
| Orinth-1.5-35B         | 36.0 | 32.2, 10:57 | good | ... |
| Nemotron-3-Nano        | 21.3 | 64.3, 02:38 | bad | not much commentary |
| Laguna-S-2.1           | 82.0 | 26.0, 38:13  | good | IQ4-XS reprocessed sub-agent output after 35:01|
| Step-3.7-Flash         | 92.9 | 16.0, 26:42 | good | IQ4-XS |
| GLM-4.5-Air            | 63.1 | 0 | broken | IQ4-XS, tried both unsloth and bartowski, rocm and vulkan |
| Ling-3.0-Flash         | 64.0 | 0 | broken | IQ4-XS, needs very recent llama, turn on MTP, still stalls |

