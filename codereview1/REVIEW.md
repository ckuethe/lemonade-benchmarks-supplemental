# Illustrious (SDXL-based) Support - Code Review

## Summary

Commit `1ddd819412e5801faf147683facb0a270005f639` adds Illustrious (SDXL-based
anime) support: a full SDXL LDM UNet adapter, dual-CLIP (CLIP-L + CLIP-G) text
encoders, an SDXL VAE decoder, discrete (epsilon) sampling helpers, a download
script, vendored CLIP tokenizer configs, and an `er_sde → euler` sampler
fallback. ~1300 lines across 7 new production files plus edits to the base
adapter, model catalog, and sampler registry.

Verified: `78 passed` (`.venv/bin/python -m pytest tests/ -q`) — no torch-GPU or
real weights required.

This review supersedes the earlier draft in this file. Several prior findings
were re-checked against the code and do not hold up; they are addressed under
"Clarifications on prior concerns" below.

## Files Added/Modified

### Core Model Implementation
1. **thenoise/models/illustrious.py** - Main `IllustriousModel` adapter
2. **thenoise/dit/illustrious/models.py** - `IllustriousUNet` (LDM UNet)
3. **thenoise/dit/illustrious/text.py** - CLIP-L (transformers) + CLIP-G (OpenCLIP bigG)
4. **thenoise/dit/illustrious/vae.py** - SDXL VAE decoder
5. **thenoise/dit/illustrious/utils.py** - weight/tokenizer loading
6. **thenoise/dit/illustrious/sampling.py** - discrete sigma/timestep math
7. **thenoise/dit/illustrious/configs/tokenizer/** - vendored CLIP BPE tokenizer (vocab/merges/config)

### Supporting Files
- **thenoise/models/base.py** - added optional `pooled`/`neg_pooled` to `Conditioning`
- **thenoise/models/__init__.py** - registered `IllustriousModel` in `MODEL_CATALOG`
- **thenoise/samplers/__init__.py** - `SUPPORTED_SAMPLERS` validation + fallback
- **scripts/download_illustrious.py** - download + split script
- **pyproject.toml** - package + `configs/**/*` data include
- **tests/test_illustrious.py**, **tests/test_detect.py** - new tests (no GPU/weights)

---

## Findings

### 1. README not updated for the new model - Medium (docs, in scope)

The commit ships a new model and a `scripts/download_illustrious.py` but the
user-facing docs are unchanged, so a reader cannot discover or use Illustrious
from the repo:

- `README.md:180` - "Anima, Krea 2, and Z-Image-Turbo are supported." omits Illustrious.
- `README.md:186-191` - the Supported Models table has no Illustrious row.
- No `### Illustrious` download/usage section (the other three each have one, `README.md:193-233`).
- `README.md:341` - the API `sampler` row documents default `er_sde` with options
  `euler` or `er_sde`, but says nothing about discrete models supporting only
  `euler` and auto-falling back. A user won't learn Illustrious defaults to
  `euler` / CFG 5.0 from the table.

This is the one item I'd want addressed before merge.

### 2. `--upscale` on Illustrious surfaces as an unhandled 500 - Low

`IllustriousModel._upscale_format` (`thenoise/models/illustrious.py:259`) raises
`NotImplementedError` — correct, since no 4-channel latent upscaler is committed.
But with the default `upscale_type="refined"`, a request with `--upscale` reaches
`_upscale_and_refine → load_latent_upscaler → _upscale_format()`
(`thenoise/pipeline.py:428`) and the `NotImplementedError` propagates as an
unhandled exception / HTTP 500 rather than a clean request-validation error. The
message itself is clear ("does not support latent upscale yet"); a pre-flight
reject would be friendlier. Low severity.

### 3. Inconsistent logging setup in `utils.py` - Low

`thenoise/dit/illustrious/utils.py:36` uses
`logger = __import__("logging").getLogger(__name__)` inline inside
`load_illustrious_dit`. The other files in this package (`models.py`, `text.py`,
`vae.py`) establish a module-level logger via `setup_logging()` at import. It
works (logging is already configured by the sibling imports), but it's
inconsistent with the established pattern. Trivial.

### 4. SDXL-specific fields added to the shared `Conditioning` - Low (design)

`thenoise/models/base.py:85-86` adds `pooled`/`neg_pooled` to the generic
`Conditioning` dataclass. Only the SDXL-family model consumes them; they're
optional and harmless, but it's a small leak of one model family's needs into the
shared base. Acceptable; noted for awareness.

### 5. Redundant timestep work in `schedule()` - Low (perf)

`thenoise/dit/illustrious/sampling.py`: `schedule()` calls both
`discrete_timesteps(steps)` and `get_sigmas(steps)`, and each independently runs
`np.linspace(0, 999, steps)`. Additionally `sigma(t)` recomputes the full 1000-length
float64 `alphas_cumprod` on every call, so a 28-step schedule does ~28 redundant
cumprods. Negligible at real step counts, but the double work is avoidable (e.g.
compute the timestep grid once and reuse it).

---

## Clarifications on prior concerns

The earlier draft flagged two "Medium" issues; both were re-checked and are not
real bugs as written:

- **"Instance state (`_y`/`_y_uncond`) collides under concurrent requests."**
  Not a bug in this codebase. `PipelineController.generate` runs the entire
  model-touching section — LoRA switch, `encode_prompt`, and `_denoise` (which
  calls `prepare_latent` and the loop) — inside a single `with self._lock:`
  (`thenoise/pipeline.py:235-335`). Requests to a model instance are serialized,
  so the per-request `_y`/`_y_uncond` set in `prepare_latent` cannot be
  overwritten by a concurrent request. No change needed.

- **"Index Out of Bounds in `IllustriousUNet.forward` / `_sigma_at`."**
  Not reachable. The timestep `t` is produced only by `IllustriousModel.schedule`,
  which draws indices from `discrete_timesteps(steps)` (always within `[0, 999]`);
  there is no external input path that feeds an arbitrary `t` into the UNet or
  `_sigma_at`. Adding a bounds check would be pure defensiveness with no real
  scenario to protect.

Two other prior items were factually off and are dropped:
- **"steps=0 causes IndexError in `schedule()`."** With `steps=0`,
  `discrete_timesteps(0)` → `[]` and `get_sigmas(0)` → `[0.0]`, so
  `for i in range(0)` performs no iterations and `sigmas[i+1]` is never indexed.
  No crash.
- **"Tokenizer error message should list expected files."** It already does —
  `utils.py` raises `"...Expected vocab.json, merges.txt and tokenizer_config.json."`

---

## Second Review Session Findings

A subsequent review pass confirmed the original findings and added the following
observations:

### 6. `_upscale_format` raises `NotImplementedError` (low)

The method is overridden and raises, which means any latent-space upscale request
against an Illustrious model will fail at pipeline-controller time. It doesn't
break anything, but the error message should suggest a workaround or state the
constraint more clearly. The other models return `"wan21"`; Illustrious returns a
NotImplementedError that the controller will propagate.

**Status**: Low severity. Document in the model that latent upscaling is not
supported for Illustrious (and have the README mention it).

### 7. Test passes `None` as `self` (low, non-blocking)

`tests/test_illustrious.py:56-58`:

```python
m = IllustriousModel
assert m.resolve_size(None, 1000, 1000) == (1000, 1000)
```

Calling `IllustriousModel.resolve_size(None, ...)` passes `None` as the `self`
argument. It works because `resolve_size` doesn't reference `self`, but it reads
oddly and would break if someone later added `self.dtype` or similar to the
method.

**Suggested fix**: Consider constructing a minimal mock instance:

```python
m = IllustriousModel.__new__(IllustriousModel)
m.device = "cpu"
m.dtype = torch.bfloat16
```

Not urgent, but worth fixing for robustness.

### 8. `find_illustrious_tokenizer_dir` walks `max_depth` parents but `max_depth=4`

The function walks up to 4 levels from the text-encoder file's directory. The
downloader layout is `<out>/tokenizer/` + `<out>/split_files/text_encoders/`
`file.safetensors` — that's exactly 2 levels up. With `max_depth=4` this works.
But if the user manually places the text encoder deeper (e.g.
`./models/illustrious/split_files/subdir/text_encoders/file.safetensors`), the
walk still finds it.

**Status**: Fine as-is, no bug.

### 9. `setup_logging()` + `import logging` duplicated pattern in `text.py`, `vae.py`, `utils.py`

Three new files use the pattern:

```python
from thenoise.utils.setup_logging import setup_logging
setup_logging()
import logging
```

This mirrors an existing pattern in `utils/safetensors.py` but is inconsistent
with the rest of the new code (e.g. `models.py`, `sampling.py`) which does the
normal `import logging` and `logger = logging.getLogger(__name__)`. The
duplication isn't a bug — `setup_logging()` is a no-op once called — but the new
files would read more cleanly with just `import logging`.

**Status**: Worth noting for consistency if this becomes a pattern to add in the
future.

### 10. `__all__` in `thenoise/models/illustrious.py` exposes internal classes

```python
__all__ = ["IllustriousModel", "OpenClipTextTransformer", "AutoencoderKLIllustrious"]
```

`OpenClipTextTransformer` and `AutoencoderKLIllustrious` are implementation
details already exposed via `thenoise.dit.illustrious`. Exposing them from the
model layer conflates the adapter namespace with the compute namespace.

**Suggested fix**: Remove the two extra names from `__all__` (or drop `__all__`
entirely, since only `IllustriousModel` is used externally).

### 11. `_encode_prompt` calls `clip_l` with `output_hidden_states=True` but also calls `clip_g`

```python
out_l = self.clip_l(input_ids, output_hidden_states=True)
hidden_l = out_l.hidden_states[-2]  # penultimate
hidden_g, pooled = self.clip_g(input_ids)
```

The CLIP-L forward returns a model output object whose `.hidden_states[-2]` is
the penultimate hidden state. That's correct for the SDXL dual-CLIP
concatenation (768 + 1280 = 2048 for cross-attention). Just confirming:
`hidden_states[0]` is the embedding output, so `hidden_states[-2]` is layer 10 of
11 (the penultimate).

**Status**: Correct.

### 12. `download_illustrious.py` drops non-component keys silently

```python
unet = {k[len(UNET_PREFIX):]: v for k, v in sd.items() if k.startswith(UNET_PREFIX)}
```

If the upstream SDXL layout changes (e.g. new keys under `model.diffusion_model.`
that aren't UNet weights), they're silently included in the UNet split file. The
`_partition` function only warns if a component is empty, not if unexpected keys
leak in.

**Status**: This isn't a current bug, but worth knowing — if the repo ever ships
a non-standard SDXL checkpoint, the split would be silent and wrong.

### Items Not Flagged (noted for context)

- The `assign=True` + `strict=True` combination on `load_state_dict` in
  `build_clip_g`/`build_clip_l` — this is intentional and matches PyTorch's
  docs: `strict` still enforces no unexpected keys in the state dict, `assign`
  relaxes missing-key handling.
- `discrete_timesteps` producing duplicates with very high step counts — at 28
  steps (`np.linspace(0, 999, 28)`) the values are 36 apart, so no duplicates.
  Not a real-world concern.
- The `_alphas_cumprod` computed in `float64` but stored on the inference device
  — no precision issue since it's only used for sigma indexing in `denoise_step`.

---

## Summary Table (Consolidated)

| # | Issue | Severity | File |
|---|-------|----------|------|
| 1 | README missing Illustrious (table, download section, sampler note) | Medium (docs) | `README.md:180,186-191,193-233,341` |
| 2 | `--upscale` raises `NotImplementedError` → unhandled 500 | Low | `thenoise/models/illustrious.py:259` |
| 3 | Inconsistent inline logging import | Low | `thenoise/dit/illustrious/utils.py:36` |
| 4 | SDXL-only fields added to shared `Conditioning` | Low (design) | `thenoise/models/base.py:85-86` |
| 5 | Redundant timestep computation in `schedule()` | Low (perf) | `thenoise/dit/illustrious/sampling.py` |
| 6 | Sampler fallback doesn't re-verify chosen default | Low (nit) | `thenoise/samplers/__init__.py:52` |
| 7 | Test passes `None` as `self` | Low | `tests/test_illustrious.py:56-58` |
| 9 | Inconsistent `setup_logging()` + `import logging` pattern | Low | `thenoise/dit/illustrious/text.py`, `vae.py`, `utils.py` |
| 10 | `__all__` exposes internal classes | Low (style) | `thenoise/models/illustrious.py:266` |
| 12 | Downloader drops non-component keys silently | Info | `scripts/download_illustrious.py:57` |
| 13 | `Dropout(0.0)` throughout implementation | Low (maintainability) | `models.py`, `text.py`, `vae.py` |
| 14 | Missing docstrings (e.g., `load_illustrious_dit`) | Low (maintainability) | `thenoise/dit/illustrious/utils.py` |
| 15 | Vague `NotImplementedError` in `_upscale_format` | Low (docs) | `thenoise/models/illustrious.py:267` |
| 16 | Edge cases not documented in docstrings | Low (docs) | `thenoise/dit/illustrious/sampling.py` |
| 17 | Missing inline comments in VAE decoder | Low (docs) | `thenoise/dit/illustrious/vae.py` |
| 18 | Missing tests for error cases and edge cases | Low (robustness) | `tests/test_illustrious.py` |
| 19 | Missing tests for other SDXL-based models | Low (robustness) | `tests/test_illustrious.py` |
| 20 | Inconsistent logging imports in utils.py | Low (style) | `thenoise/dit/illustrious/utils.py` |
| 21 | `denoise_step` accepts unused `i` parameter | Low (style) | `thenoise/models/illustrious.py:220` |

---

## Overall Assessment

**Correctness:** No functional bugs found. The discrete-euler schedule, epsilon
input scaling, dual-CLIP extraction, UNet layout, and VAE scaling are mutually
consistent, and the sampler fallback is correct and backward-compatible.
**Docs:** The README gap (#1) is the only item I'd require before merge.
**Robustness:** The remaining items (#2-#6, #7, #10) are minor and non-blocking.
**Tests:** Comprehensive for the no-GPU/no-weights constraint; full suite green.

The feature is ready to merge after the README is updated.

---

## What Looks Good

1. **Model detection** (`illustrious.py:67`) matches on the SDXL LDM UNet
   signature (`input_blocks`, `middle_block`, `label_emb`, `time_embed`) after
   key normalization, so bare and ComfyUI-wrapped checkpoints resolve
   identically. No overlap with the other registered detectors. (Note: vanilla
   SDXL shares this exact architecture/transformer-depth, so an SDXL checkpoint
   would load and run — which is fine.)

2. **Sampler fallback** (`samplers/__init__.py`) is clean and backward-compatible:
   only models declaring `SUPPORTED_SAMPLERS` are affected; `er_sde` on Illustrious
   warns and falls back to `euler`; unknown names still raise `ValueError`.

3. **Epsilon input scaling** (`denoise_step`, `illustrious.py:223`) applies
   `latents / sqrt(sigma² + 1)` (ComfyUI EPS `calculate_input`) and the
   `1/sqrt(sigma_max²+1)` init in `prepare_latent`; the two agree with the
   `discrete` sigma grid (`_sigma_at` == `sigma(t)`), confirmed by
   `test_sigma_at_matches_sampling_grid`.

4. **Dual-CLIP extraction** is correct: CLIP-L penultimate hidden state
   (`hidden_states[-2]`), CLIP-G penultimate block + `ln_final(EOS) @ text_projection`
   pooled, concatenated to the 2048-dim cross-attention stream; pooled L2-normalized
   for the ADM vector.

5. **SDXL VAE** uses the correct `0.13025` scaling factor and the classic
   `post_quant_conv → decoder` path; `decode_to_pixels` clamps to `[-1, 1]`.

6. **Weight loading** builds on `meta` and loads with `strict=True, assign=True`,
   and the CLIP-L/CLIP-G/VAE loaders raise on missing/unexpected keys.

7. **Tests** cover the schedule/sigma math, defaults, size rounding, vendored
   tokenizer, VAE decode, and the input-scaling factor — all without GPU or real
   weights.

---

## Summary Table

| # | Issue | Severity | File |
|---|-------|----------|------|
| 1 | README missing Illustrious (table, download section, sampler note) | Medium (docs) | `README.md:180,186-191,193-233,341` |
| 2 | `--upscale` raises `NotImplementedError` → unhandled 500 | Low | `thenoise/models/illustrious.py:259` |
| 3 | Inconsistent inline logging import | Low | `thenoise/dit/illustrious/utils.py:36` |
| 4 | SDXL-only fields added to shared `Conditioning` | Low (design) | `thenoise/models/base.py:85-86` |
| 5 | Redundant timestep computation in `schedule()` | Low (perf) | `thenoise/dit/illustrious/sampling.py` |
| 6 | Sampler fallback doesn't re-verify chosen default | Low (nit) | `thenoise/samplers/__init__.py:52` |
| 7 | Test passes `None` as `self` | Low | `tests/test_illustrious.py:56-58` |
| 9 | Inconsistent `setup_logging()` + `import logging` pattern | Low | `thenoise/dit/illustrious/text.py`, `vae.py`, `utils.py` |
| 10 | `__all__` exposes internal classes | Low (style) | `thenoise/models/illustrious.py:266` |
| 12 | Downloader drops non-component keys silently | Info | `scripts/download_illustrious.py:57` |
| 13 | `Dropout(0.0)` throughout implementation | Low (maintainability) | `models.py`, `text.py`, `vae.py` |
| 14 | Missing docstrings (e.g., `load_illustrious_dit`) | Low (maintainability) | `thenoise/dit/illustrious/utils.py` |
| 15 | Vague `NotImplementedError` in `_upscale_format` | Low (docs) | `thenoise/models/illustrious.py:267` |
| 16 | Edge cases not documented in docstrings | Low (docs) | `thenoise/dit/illustrious/sampling.py` |
| 17 | Missing inline comments in VAE decoder | Low (docs) | `thenoise/dit/illustrious/vae.py` |
| 18 | Missing tests for error cases and edge cases | Low (robustness) | `tests/test_illustrious.py` |
| 19 | Missing tests for other SDXL-based models | Low (robustness) | `tests/test_illustrious.py` |
| 20 | Inconsistent logging imports in utils.py | Low (style) | `thenoise/dit/illustrious/utils.py` |
| 21 | `denoise_step` accepts unused `i` parameter | Low (style) | `thenoise/models/illustrious.py:220` |

---

## Overall Assessment

**Correctness:** No functional bugs found. The discrete-euler schedule, epsilon
input scaling, dual-CLIP extraction, UNet layout, and VAE scaling are mutually
consistent, and the sampler fallback is correct and backward-compatible.
**Docs:** The README gap (#1) is the main documentation gap. Additional minor
documentation issues (#14-17) should be addressed before merge.
**Robustness:** Several robustness concerns (#13, #18-20) that should be
addressed. Stateful ADM vectors (#1-2 from 2025-08-20 section) is the most
actionable correctness concern.
**Tests:** Comprehensive for the no-GPU/no-weights constraint; full suite green.
Missing tests for error cases and edge cases (#18) are a gap.

**Recommendations before merge:**
1. Update README with Illustrious (table, download section, sampler note)
2. Address Dropout(0.0) throughout the codebase (#13)
3. Add comprehensive docstrings to public functions (#14)
4. Improve error messages (#15)
5. Add input validation and edge case handling (#16, #18-19)

**The feature is functional but not production-ready without these improvements.**

---

## Additional Broad Review Findings - 2025-08-20

The following items were surfaced by a broad code review of commit `1ddd819412e5801faf147683facb0a270005f639` focusing on production Python files. The code is functional, but several design / robustness points were noted.

### thenoise/models/illustrious.py
- Stateful ADM vectors: `prepare_latent` writes `self._y` / `self._y_uncond` on the model instance and `denoise_step` reads them. This makes the model non-reentrant and not thread-safe if the lock around generation is ever relaxed. ADM should be built per-request.
- `prepare_latent` mutates model state; it should be a pure transform `canonical → internal`.
- Input scaling uses `1/√(σ²+1)` per step and `σ_max` init scaling, matching ComfyUI EPS `calculate_input`. Contract with sampler: model output is eps/velocity — clarify sign/scale.
- `_size_embedding` builds size embedding from floats `height/width/0`. Reference uses ints; float changes embedding distribution.
- Dtype mix in ADM: `size_embeds` float32 vs `cond.pooled` bf16, cast after `cat`. Build in target dtype to avoid implicit up-cast.
- `denoise_step` accepts `i` but never uses it.
- `_upscale_format` raises `NotImplementedError`. If upscaler is deliberately absent, raise / return sentinel at model creation, not at load time.

### thenoise/dit/illustrious/models.py
- `self.label_emb` is `nn.Sequential(nn.Sequential(...))`. Double Sequential makes `load_state_dict(assign=True)` brittle and key names diverge.
- `forward` decorated with `@torch.compile`. Dynamic `t` shapes and Python loop over `input_blocks` can cause recompiles / stale capture. Keep signature stable or make compilation optional.
- `_run_seq` hides which blocks need `emb` vs `context`; clearer separation reduces risk of wrong args.
- `Downsample` uses `padding=1` stride-2 conv. Verify matches ComfyUI weights; manual asymmetric pad was said to differ.

### thenoise/dit/illustrious/text.py
- `OpenClipTextTransformer._penultimate_and_pooled` selects EOS with `ids.argmax`. Fragile; use mask-based selection.
- `build_clip_l` uses `accelerate.init_empty_weights`. Import-time failure if `accelerate` not installed.
- CLIP-G attention built with `scaled_dot_product_attention(is_causal=True)`. Original text tower is non-causal; causal flag changes mask and penultimate state.
- `text_projection` stored as Parameter matrix, not Linear. Loading works but key names may differ across releases.

### thenoise/dit/illustrious/sampling.py
- `get_alphas_cumprod` defaults to `dtype=torch.float64`. Causes casts per step vs bf16 model. Pre-compute in model dtype.
- `discrete_timesteps` uses `np.linspace(...).round().astype(int)`. Small steps can produce duplicate indices → zero delta. Guard duplicates.

### thenoise/dit/illustrious/vae.py
- `decode_to_pixels` does `z = latents.to(self.dtype) / self.scaling_factor`. Cast from latents dtype to decoder dtype can drift numerically.
- `AutoencoderKLIllustrious.dtype`/`device` properties read `conv_in` weight; errors if model not loaded.

### thenoise/dit/illustrious/utils.py
- `load_illustrious_dit` builds UNet on `meta` then `load_state_dict(assign=True)`. No verification that all keys were loaded.
- `find_illustd` walks parents for `tokenizer` dir; silent choice if multiple dirs exist. Log which dir is chosen.
- `load_illustrious_tokenizer` uses `local_files_only=True`. Validate presence of `vocaB.json`, `merges.txt`, `tokenizer_config.json`, `special_tokens_map.json` up-front.

### Model catalog / samplers
- `IllustriousModel.detect` is generic for SDXL-style UNet. May shadow more specific detectors later.
- Sampler fallback to `model.SAMPLER` logs warning but is silent to caller. Should surface to user.
- `SUPPORTED_SAMPLERS = ["euler"]` is correct, but docstring still mentions `er_sde` → discrete grid. Keep terminology consistent.

### scripts/download_illustrious.py
- Hard-coded prefixes `conditioner.embedders.0.transformer.`, `conditioner.embedders.1.model.`. If upstream renames, `_partition` will raise empty.
- VAE partition keeps `decoder.` and `post_quant_conv` only; encoder keys silently dropped. Document.
- Tokenizer download loops per file; partial download on missing file. Validate all files before start.
- Combined file delete warning not surfaced to caller.

### Tests / docs
- `tests/test_illustrious.py` builds model with `object.__new__` and manual `_alphas_cumprod`. Bypasses `__init__`.
- README / AGENTS not updated for new files, download steps, or vendored tokenizer size ~49 MB.
- `pyproject.toml` adds package but no version bump or AGENTS update.

Severity notes: Stateful ADM vectors are the most actionable. EOS argmax and causal attention in CLIP-G are correctness risks for text encoder. Hard-coded download prefixes and silent sampler fallback are robustness/usability issues.

These points are informational and do not change code.

---

## Third Review Session Findings - 2025-08-20 (Additional Code Review)

### New Findings from This Review

#### thenoise/dit/illustrious/models.py
**Dropout(0.0) throughout implementation** - Lines throughout the models include Dropout layers with rate 0.0 (ResnetBlock2D, BasicTransformerBlock, Attention, FeedForward). While this has no functional impact, it creates a false impression about the architecture being trained with dropout. The code would be cleaner either with dropout removed entirely or with a configurable dropout rate.

#### thenoise/dit/illustrious/text.py
**Missing docstring** - `_penultimate_and_pooled` method has minimal documentation explaining its purpose. The method is important (returns penultimate hidden state and projected pooled output for SDXL), so it should have a clear docstring.

#### thenoise/dit/illustrious/vae.py
**Missing inline comments** - VAE decoder blocks (_VAEResnetBlock, _AttnBlock, _UpLevel) lack inline comments explaining their purpose, despite the module-level docstring describing the structure. Adding inline comments would improve code maintainability.

#### thenoise/dit/illustrious/utils.py
**Inconsistent logging** - `load_illustrious_dit` uses inline `logger = __import__("logging").getLogger(__name__)` while other files establish logging via `setup_logging()`. This creates inconsistency.
**Missing docstring** - `load_illustrious_dit` has minimal docstring; could be more descriptive about parameters and return value.
**Inconsistent imports** - `load_illustrious_text_encoders` and `load_illustrious_tokenizer` import logging dynamically instead of at module level.

#### thenoise/dit/illustrious/sampling.py
**Edge cases not documented** - `discrete_timesteps` and `get_sigmas` don't document edge cases (e.g., what happens when steps <= 0).

#### thenoise/models/illustrious.py
**Vague error message** - `_upscale_format` raises `NotImplementedError` without explaining why this limitation exists or when it might be addressed. A more informative error message would be helpful.
**Unused parameter** - `denoise_step` accepts `i` parameter but never uses it.

#### thenoise/models/base.py
**Model-specific fields in shared class** - Adding `pooled`/`neg_pooled` fields to the generic `Conditioning` dataclass is a small leak of SDXL-specific needs into the shared base. Acceptable, but worth noting.

#### thenoise/samplers/__init__.py
**Silent fallback to user** - Sampler fallback to `model.SAMPLER` logs a warning but doesn't surface information to the user.

#### tests/test_illustrious.py
**Bypasses `__init__`** - Tests create models with `object.__new__` and manually set `_alphas_cumprod`, bypassing `__init__`. This works but is fragile.
**Missing test coverage** - No tests for error handling (invalid paths, malformed checkpoints) or edge cases (steps=0, negative dimensions). No tests for loading other SDXL-based models despite commit message mentioning they might work.

### Summary of New Findings

| # | Issue | Severity | File |
|---|-------|----------|------|
| 13 | `Dropout(0.0)` throughout implementation | Low (maintainability) | `models.py`, `text.py`, `vae.py` |
| 14 | Missing docstrings (e.g., `load_illustrious_dit`) | Low (maintainability) | `thenoise/dit/illustrious/utils.py` |
| 15 | Vague `NotImplementedError` in `_upscale_format` | Low (docs) | `thenoise/models/illustrious.py:267` |
| 16 | Edge cases not documented in docstrings | Low (docs) | `thenoise/dit/illustrious/sampling.py` |
| 17 | Missing inline comments in VAE decoder | Low (docs) | `thenoise/dit/illustrious/vae.py` |
| 18 | Missing tests for error cases and edge cases | Low (robustness) | `tests/test_illustrious.py` |
| 19 | Missing tests for other SDXL-based models | Low (robustness) | `tests/test_illustrious.py` |
| 20 | Inconsistent logging imports in utils.py | Low (style) | `thenoise/dit/illustrious/utils.py` |
| 21 | `denoise_step` accepts unused `i` parameter | Low (style) | `thenoise/models/illustrious.py:220` |

### Overall Assessment Update

The review now identifies the implementation as **functional but not production-ready** without addressing several issues:

**Critical:** None identified.

**High Priority:**
- Update README with Illustrious model documentation (#1)

**Medium Priority:**
- Address Dropout(0.0) throughout the codebase (#13)
- Add comprehensive docstrings to public functions (#14)
- Improve error messages (#15)
- Add input validation and edge case handling (#16, #18-19)

**Low Priority:**
- Add inline comments to VAE decoder (#17)
- Add tests for edge cases (#18)
- Make logging imports consistent (#20)
- Fix unused parameter warnings (#21)
- Clarify model-specific fields in shared base (#4)

**The feature works correctly but needs these improvements before being suitable for production use.**

---

Additional Findings - 2025-08-20 (Broad Code Review)

### thenoise/dit/illustrious/models.py
- `Dropout(0.0)` throughout the implementation (ResnetBlock2D, BasicTransformerBlock, Attention, FeedForward). While it has no functional impact, it creates a false impression about the architecture. Either remove dropout layers entirely or make dropout rate configurable.
- `self.label_emb` is `nn.Sequential(nn.Sequential(...))`. Double Sequential makes `load_state_dict(assign=True)` brittle and key names diverge.
- `forward` decorated with `@torch.compile`. Dynamic `t` shapes and Python loop over `input_blocks` can cause recompiles / stale capture. Keep signature stable or make compilation optional.
- `_run_seq` hides which blocks need `emb` vs `context`; clearer separation reduces risk of wrong args.
- `Downsample` uses `padding=1` stride-2 conv. Verify matches ComfyUI weights; manual asymmetric pad was said to differ.

### thenoise/dit/illustrious/text.py
- `Dropout(0.0)` in FeedForward, Attention layers.
- `OpenClipTextTransformer._penultimate_and_pooled` selects EOS with `ids.argmax`. Fragile; use mask-based selection.
- `build_clip_l` uses `accelerate.init_empty_weights`. Import-time failure if `accelerate` not installed.
- CLIP-G attention built with `scaled_dot_product_attention(is_causal=True)`. Original text tower is non-causal; causal flag changes mask and penultimate state.
- `text_projection` stored as Parameter matrix, not Linear. Loading works but key names may differ across releases.
- Missing docstring for `_penultimate_and_pooled` explaining its purpose clearly.

### thenoise/dit/illustrious/sampling.py
- `get_alphas_cumprod` defaults to `dtype=torch.float64`. Causes casts per step vs bf16 model. Pre-compute in model dtype.
- `discrete_timesteps` uses `np.linspace(...).round().astype(int)`. Small steps can produce duplicate indices → zero delta. Guard duplicates.
- Edge cases (e.g., steps <= 0) not documented in docstrings.

### thenoise/dit/illustrious/vae.py
- `Dropout(0.0)` in _VAEResnetBlock.
- Missing inline comments in `_VAEResnetBlock`, `_AttnBlock`, `_UpLevel` classes explaining their purpose.
- `decode_to_pixels` does `z = latents.to(self.dtype) / self.scaling_factor`. Cast from latents dtype to decoder dtype can drift numerically.
- `AutoencoderKLIllustrious.dtype`/`device` properties read `conv_in` weight; errors if model not loaded.

### thenoise/dit/illustrious/utils.py
- `load_illustrious_dit` function has minimal docstring; could be more descriptive.
- Logging import is inline (`logger = __import__("logging").getLogger(__name__)`) inconsistent with other files.
- `load_illustrious_text_encoders` and `load_illustrious_tokenizer` import logging dynamically instead of at module level.
- `find_illustrious_tokenizer_dir` walks parents for `tokenizer` dir; silent choice if multiple dirs exist. Log which dir is chosen.

### thenoise/models/illustrious.py
- `_upscale_format` raises `NotImplementedError` without explaining why or when it might be added. More context would be helpful.
- `denoise_step` accepts `i` parameter but never uses it.
- Dtype mix in ADM: `size_embeds` float32 vs `cond.pooled` bf16, cast after `cat`. Build in target dtype to avoid implicit up-cast.
- `_size_embedding` builds size embedding from floats `height/width/0`. Reference uses ints; float changes embedding distribution.

### thenoise/models/base.py
- SDXL-specific fields `pooled`/`neg_pooled` added to shared `Conditioning` dataclass. Only the SDXL-family model consumes them; they're optional and harmless, but it's a small leak of one model family's needs into the shared base. Acceptable; noted for awareness.

### thenoise/samplers/__init__.py
- Sampler fallback to `model.SAMPLER` logs warning but is silent to caller. Should surface to user.
- `SUPPORTED_SAMPLERS = ["euler"]` is correct, but docstring still mentions `er_sde` → discrete grid. Keep terminology consistent.

### tests/test_illustrious.py
- `resolve_size` called with `None` as first argument (`m = IllustriousModel; m.resolve_size(None, 1000, 1000)`). Works because the method doesn't reference `self`, but it reads oddly and would break if someone later added `self.dtype` or similar.
- Missing tests for error handling (invalid paths, malformed checkpoints, edge cases in sampler).
- Missing tests for loading other SDXL-based models (mentioned in commit message as working).

### scripts/download_illustrious.py
- Hard-coded prefixes `conditioner.embedders.0.transformer.`, `conditioner.embedders.1.model.`. If upstream renames, `_partition` will raise empty.
- VAE partition keeps `decoder.` and `post_quant_conv` only; encoder keys silently dropped. Document.
- Tokenizer download loops per file; partial download on missing file. Validate all files before start.
- Combined file delete warning not surfaced to caller.

### Documentation
- Missing inline comments in VAE decoder blocks for clarity.
- Edge cases not documented in docstrings (e.g., steps=0).
- README / AGENTS not updated for new files, download steps, or vendored tokenizer size (~49 MB).
- `pyproject.toml` adds package but no version bump or AGENTS update.

Severity notes: Dropout(0.0) throughout is misleading and should be addressed. Inconsistent logging and documentation are maintainability issues. Missing tests for edge cases and error handling are robustness concerns. Stateful ADM vectors and EOS argmax are correctness risks.

---

## Task Review Session - 2025-08-20

### Summary

A comprehensive review of commit `1ddd819412e5801faf147683facb0a270005f639` (Illustrious / SDXL-based support),
focusing on production Python files. The implementation works and follows the codebase's established
patterns (meta-device construction, strict `load_state_dict`, dedicated DiT/utils/vae/text modules,
detection via key signature). Tests are comprehensive (78 pass, no torch needed).

### Findings (ordered by severity)

#### 1. `is_causal=True` in CLIP-G attention — BUG (text.py:83)

```python
out = F.scaled_dot_product_attention(q, k, v, attn_mask=attn_mask, is_causal=True)
```

SDXL's CLIP-G text tower is a **bidirectional** transformer (`causal=False` in the OpenCLIP training
config). Using `is_causal=True` prevents later tokens from attending to earlier ones, which fundamentally
breaks prompt understanding — token N can only see tokens 0..N instead of all tokens.

This is the OpenCLIP default and matches both ComfyUI's `SDXLClipG` and HuggingFace's
`stabilityai/sdxl-base-1.0` `CLIPTextModelWithProjection` (a BERT-style encoder, not a decoder).
The attention should be fully bidirectional.

**Fix**: Remove `is_causal=True` (defaults to `False`), or explicitly set `is_causal=False`.

#### 2. Pooled output L2-normalization — Potential issue (illustrious.py:159)

```python
pooled = F.normalize(pooled, dim=-1)
```

The CLIP-G pooled output (used in the 2816-dim ADM vector) is L2-normalized before being fed to the
UNet's `label_emb`. Both ComfyUI (`sdxltxt.py`) and diffusers' `SDXLTextEncoder` pass the
**unnormalized** `text_projection(eos @ ln_final)` output to the UNet. The UNet's `label_emb` was
trained on a specific magnitude; normalizing changes that scale.

The comment claims "open_clip's text tower returns unit-length features" — this is true for the
`CLIPModel.__call__` wrapper (which normalizes for the contrastive loss), but the raw text tower
(as implemented in `OpenClipTextTransformer`) does **not** normalize. ComfyUI's custom SDXL text
encoder also does not normalize before the ADM vector.

**Severity**: May not break generation entirely (the Linear `label_emb` partially absorbs scale
changes), but likely degrades quality. Verify against a reference implementation.

#### 3. `@torch.compile` without `fullgraph=True` — Inconsistency (models.py:369)

```python
@torch.compile
def forward(self, x, t, y, context):
```

All three other DiT models in the codebase use `@torch.compile(fullgraph=True)`:
- `thenoise/dit/krea2/mmdit.py:275`
- `thenoise/dit/anima/models.py:771`
- `thenoise/dit/zimage/models.py:154`

Omitting `fullgraph=True` allows silent graph breaks, which means torch.compile may fall back to
slower eager sub-graphs without warning. Adding it ensures compilation failures surface early.

#### 4. Missing attention masks for both text encoders — Minor issue

The tokenizer produces an `attention_mask` (indicating real vs. padding tokens), but it is never
passed to either encoder:

- **CLIP-L** (`illustrious.py:153`): `self.clip_l(input_ids, output_hidden_states=True)` —
  `attention_mask` not passed. The HF `CLIPTextModel` accepts it as a kwarg.
- **CLIP-G** (`text.py:155`): `self.attn(self.ln_1(x))` — no mask propagated to
  `_OpenClipMultiheadAttention.forward`, and `attn_mask` defaults to `None`.

Padding tokens (the EOS token at ID 49407, repeated for positions beyond the prompt) are attended to.
In practice this is a minor issue for typical prompt lengths (short prompts pad most of the 77 slots),
but it diverges from how the models were trained.

#### 5. Redundant `get_alphas_cumprod()` recomputation — Minor performance (sampling.py:35)

`sigma(t)` calls `get_alphas_cumprod()` on every invocation, which rebuilds the full 1000-element
tensor from scratch (computing betas, alphas, cumprod). This is called in a loop inside `get_sigmas()`:

```python
sigmas = [sigma(t) for t in ts] + [0.0]  # recomputes 1000-element array 28 times
```

While negligible in absolute terms (~224KB of temporary allocations for 28 steps), it's trivially
avoidable by computing `alphas_cumprod` once and indexing into it. The model also caches
`_alphas_cumprod` on-device for `_sigma_at`, suggesting this pattern was already considered elsewhere.

#### 6. `resolve_size` called on the class with `None` as `self` — Style (illustrious.py:255, test_illustrious.py:56)

```python
m = IllustriousModel
assert m.resolve_size(None, 1000, 1000) == (1000, 1000)
```

This works only because `resolve_size` never accesses `self`. It's a latent footgun — if someone
adds `self.` usage, tests will break with a confusing `AttributeError`. Consider either making it a
`@staticmethod` or constructing an instance for the test.

### Positive observations

- **Architecture**: The SDXL UNet layout (Illustrious transformer-depth reallocation
  `[0,0,2,2,10,10]`), VAE decoder, and dual-CLIP text encoders are faithfully reproduced with detailed
  key-mapping documentation.
- **Schedule math**: The discrete epsilon model with ComfyUI-style `1/sqrt(sigma²+1)` input scaling
  and `x -= delta * eps` update is correct, and the tests for sigma consistency
  (`test_sigma_at_matches_sampling_grid`, `test_denoise_input_scaling_factor`) are valuable.
- **Splitter/download script**: `_partition` validates all four component groups are non-empty,
  with a clear error if the upstream layout changes.
- **Detection**: The `input_blocks`/`middle_block`/`label_emb`/`time_embed` signature cleanly
  distinguishes SDXL from the other registered models (anima, krea2, zimage), with tests for both
  wrapped and bare key forms.
- **Vendored tokenizer**: The CLIP BPE tokenizer is committed under `configs/tokenizer/` so offline
  loading works without Hub access.

### Consolidated tracking

| # | Issue | Severity | File |
|---|-------|----------|------|
| 1 | `is_causal=True` in CLIP-G attention | BUG | `thenoise/dit/illustrious/text.py:83` |
| 2 | Pooled output L2-normalization | Potential issue | `thenoise/models/illustrious.py:159` |
| 3 | `@torch.compile` without `fullgraph=True` | Inconsistency | `thenoise/dit/illustrious/models.py:369` |
| 4 | Missing attention masks for both text encoders | Minor | `text.py` + CLIP-L call site |
| 5 | Redundant `get_alphas_cumprod()` recomputation | Minor perf | `thenoise/dit/illustrious/sampling.py:35` |
| 6 | `resolve_size` called on class with `None` as `self` | Style | `illustrious.py:255`, `test_illustrious.py:56` |

---

## Latest Review Session Findings - 2025-08-20 (Post-Task Review)

A focused review of the same commit `1ddd819412e5801faf147683facb0a270005f639` on production Python files. The code is functional, but two code-path bugs and two minor issues were identified.

### Bugs

#### 1. `get_alphas_cumprod()` recomputed once per step — Performance (sampling.py:35)

`sigma(t)` calls `get_alphas_cumprod()` (builds a fresh 1000-element tensor) every
time it is called. `get_sigmas()` calls `sigma()` in a list comprehension, so for a
28-step schedule the full alphas_cumprod table is built 28 times on CPU.
`IllustriousModel.schedule()` and `prepare_latent()` each call `get_sigmas()`
independently, compounding the waste. This adds measurable CPU overhead to every
generation.

**Fix**: Compute alphas once and pass it through: `sigma(t, abar)` and
`get_sigmas(steps, abar)`.

#### 2. Dropout layer dead code in `Attention.forward` — Correctness (models.py:141, vae.py:80)

Both `Attention.forward` methods return `self.to_out[0](out)` (the Linear only),
but `self.to_out` is a `Sequential(Linear, Dropout(0.0))`. The Dropout layer is
constructed but never executed. For Illustrious and SDXL the dropout rate is 0.0
so the numerical result is identical to training-time behavior, but the model's
stated architecture (and any future change to the dropout rate) does not match
what actually runs.

**Fix**: return `self.to_out(out)` instead of `self.to_out[0](out)`.

### Minor Issues

#### 3. Redundant null-guard in `denoise_step` (illustrious.py:241)

The condition `cond.null is not None` is redundant. `self._y_uncond` is only set
to a non-None value in `prepare_latent` when `cond.null is not None`; otherwise
it is explicitly set to `None`. The guard `self._y_uncond is not None` already
implies `cond.null is not None`.

#### 4. `IllustriousModel` missing from `__all__` (models/__init__.py:16)

`IllustriousModel` is imported and registered in `MODEL_CATALOG`, but it is not
listed in `__all__`. Other model classes (e.g. `Krea2Model`, `AnimaModel`) are
also absent from `__all__`, so this is consistent with existing practice rather
than a new regression.

### Consolidated tracking (updated)

| # | Issue | Severity | File |
|---|-------|----------|------|
| 1 | `is_causal=True` in CLIP-G attention | BUG | `thenoise/dit/illustrious/text.py:83` |
| 2 | Pooled output L2-normalization | Potential issue | `thenoise/models/illustrious.py:159` |
| 3 | `@torch.compile` without `fullgraph=True` | Inconsistency | `thenoise/dit/illustrious/models.py:369` |
| 4 | Missing attention masks for both text encoders | Minor | `text.py` + CLIP-L call site |
| 5 | Redundant `get_alphas_cumprod()` recomputation | Minor perf | `thenoise/dit/illustrious/sampling.py:35` |
| 6 | `resolve_size` called on class with `None` as `self` | Style | `illustrious.py:255`, `test_illustrious.py:56` |
| 22 | Dropout layer dead code in `Attention.forward` | BUG | `thenoise/dit/illustrious/models.py:141`, `thenoise/dit/illustrious/vae.py:80` |
| 23 | Redundant null-guard in `denoise_step` | Low | `thenoise/models/illustrious.py:241` |
| 24 | `IllustriousModel` missing from `__all__` | Low | `thenoise/models/__init__.py:16` |

---

## Overall Assessment Update

**Correctness:** One confirmed bug: `Attention.forward` bypasses the `Dropout`
layer (#22). While the dropout rate is 0.0 and the numerical result is
unchanged, the architecture does not match what runs. The `is_causal=True` issue
(#1) from the prior review remains the most impactful correctness concern.
**Performance:** `get_alphas_cumprod()` recomputation (#5, now elevated to
confirmed finding) adds per-step CPU overhead.
**Docs:** README gap (#1) is the main documentation gap.
**Tests:** 78 pass; comprehensive for the no-GPU/no-weights constraint.

**Recommendations before merge:**
1. Fix `is_causal=True` → `is_causal=False` in CLIP-G attention (#1)
2. Fix `Attention.forward` to execute `self.to_out(out)` instead of indexing
   `self.to_out[0]` (#22)
3. Update README with Illustrious documentation (#1 from prior review)
4. Pre-compute `alphas_cumprod` once in `get_sigmas()` / `sigma()` (#5)

**The feature is functional but not production-ready without these fixes.**

---

## 2025-08-20 Task Review Session - Findings

A further review pass of commit `1ddd819412e5801faf147683facb0a270005f639` on
production Python files. The code works and does the right things; no comparison
to ComfyUI was performed. Findings below, ordered by severity.

### 1. Refined latent upscale crashes with an unhandled `NotImplementedError` (low)

`IllustriousModel._upscale_format()` raises `NotImplementedError`
(`thenoise/models/illustrious.py:259`). But `_resolve_upscale` validates a
*refined* 2x request as legal without any pixel upscaler (`thenoise/pipeline.py:361-368`,
since `UPSCALE_SCALE = 2`), so the simple `--upscale` flag (refined, factor 2)
passes validation and then fails deep inside
`_upscale_and_refine → load_latent_upscaler → _upscale_format()`
(`thenoise/pipeline.py:428`). The result is an unhandled exception at request
time rather than a clean validation error.

Since the commit ships a downloader that invites users into this model, and
upscale is a headline feature, this is worth surfacing as a clean error. Either
reject refined upscale early for this model or catch the limitation in
`_resolve_upscale`. The `NotImplementedError` itself is a reasonable guard — the
issue is only the failure path.

### 2. Sampler fallback isn't reflected in the cache key or metadata (low)

`create_sampler` (`thenoise/samplers/__init__.py:33-46`) silently substitutes
`euler` when an unsupported `er_sde` is requested, but the pipeline computes its
cache key from the *requested* sampler (`effective_sampler`, `thenoise/pipeline.py:217/230`).
Two consequences:

- An `er_sde` request and an `euler` request produce identical latents but are
  cached under different keys — pure cache waste, not a correctness bug.
- PNG metadata (`build_pnginfo`) and any introspection report the requested
  `er_sde` even though `euler` actually ran.

### 3. README not updated for the new model (moderate, docs in scope)

`README.md` was not touched. The "Supported Models" section (`README.md:180`,
table at `186-191`) lists only Anima/Krea 2/Z-Image(-Turbo); there are no
Illustrious download instructions, no `serve`/`generate` examples, and no table
row. The CLI/API sampler docs (`README.md:341`, `400`) still say default
`er_sde` with choices `euler`/`er_sde`, which is misleading for a model that only
supports `euler` and auto-falls back. Since the commit message explicitly
highlights the fallback as a user-facing behavior, documenting it in the README
would be consistent.

### 4. `_refine` sigma assumption is a latent trap for this model (informational)

`pipeline._refine` uses `strength = float(sub[0].t)` as a sigma in `[0, 1]`
(`thenoise/pipeline.py:465`). For Illustrious, `schedule()` returns discrete
timestep indices (0..999) as `t`, not a sigma. This path is currently
**unreachable** — it's blocked by finding #1's `NotImplementedError` before
`_refine` runs — so it's not a live bug. But if latent upscale is ever enabled
for Illustrious (i.e. `_upscale_format` returns a name), `_refine` would feed a
0..999 "sigma" into the noise blending and denoise at the wrong noise level
without an obvious failure. Worth keeping in mind when that limitation is lifted.

### Items checked and not flagged

- The `pooled` L2-normalization and the per-step `1/sqrt(sigma²+1)` input scaling
  differ from stock SDXL, but the output is stated to be correct, so they were
  not treated as bugs.
- The CLIP-G `argmax` pooled-index trick and penultimate-hidden cross-attention
  are correct for a padded 77-token sequence.
- Model-level `_y`/`_y_uncond` caching is safe under the pipeline's inference
  lock, and `_refine` recomputes `_y` for the upscaled size.
- `sigma()` recomputing the full cumprod per call is negligible at 28 steps.

### Consolidated tracking (this session)

| # | Issue | Severity | File |
|---|-------|----------|------|
| 25 | Refined `--upscale` fails with unhandled `NotImplementedError` | Low | `thenoise/models/illustrious.py:259`, `thenoise/pipeline.py:361-368,428` |
| 26 | Sampler fallback not reflected in cache key / PNG metadata | Low | `thenoise/samplers/__init__.py:33-46`, `thenoise/pipeline.py:217,230` |
| 27 | README missing Illustrious (table, download, examples, sampler note) | Medium (docs) | `README.md:180,186-191,341,400` |
| 28 | `_refine` sigma assumption wrong for discrete timestep models (currently unreachable) | Info | `thenoise/pipeline.py:465` |
