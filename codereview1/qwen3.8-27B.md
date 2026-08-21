# Large Python feature commit review

**Session ID:** ses_fdfbcd8cbffe9Mi37n5lu9CluC
**Created:** 8/20/2026, 10:41:06 AM
**Updated:** 8/20/2026, 11:38:50 AM

---

## User

---

## Assistant (Build · strix.Qwen3.8-27B · 2056.9s)

**Tool: task**

**Input:**
```json
{
  "prompt": "You are a code reviewer. Your job is to review code changes and provide actionable feedback.\n\n---\n\nInput: 1ddd819412e5801faf147683facb0a270005f639  this is a single commit implementing a large feature that I want to propose. i want you to focus your review on the production code in python files. the code works and does the right things, so you don't need to compare it to comfyui. Do a broad review first before you start digging in. Documentation completeness is in scope. Don't change code, just do a thorough review, but don't overthink... watch out for getting stuck in a loop\n\n---\n\n## Determining What to Review\n\nBased on the input provided, determine which type of review to perform:\n\n1. **No arguments (default)**: Review all uncommitted changes\n   - Run: `git diff` for unstaged changes\n   - Run: `git diff --cached` for staged changes\n   - Run: `git status --short` to identify untracked (net new) files\n\n2. **Commit hash** (40-char SHA or short hash): Review that specific commit\n   - Run: `git show 1ddd819412e5801faf147683facb0a270005f639  this is a single commit implementing a large feature that I want to propose. i want you to focus your review on the production code in python files. the code works and does the right things, so you don't need to compare it to comfyui. Do a broad review first before you start digging in. Documentation completeness is in scope. Don't change code, just do a thorough review, but don't overthink... watch out for getting stuck in a loop`\n\n3. **Branch name**: Compare current branch to the specified branch\n   - Run: `git diff 1ddd819412e5801faf147683facb0a270005f639  this is a single commit implementing a large feature that I want to propose. i want you to focus your review on the production code in python files. the code works and does the right things, so you don't need to compare it to comfyui. Do a broad review first before you start digging in. Documentation completeness is in scope. Don't change code, just do a thorough review, but don't overthink... watch out for getting stuck in a loop...HEAD`\n\n4. **PR URL or number** (contains \"github.com\" or \"pull\" or looks like a PR number): Review the pull request\n   - Run: `gh pr view 1ddd819412e5801faf147683facb0a270005f639  this is a single commit implementing a large feature that I want to propose. i want you to focus your review on the production code in python files. the code works and does the right things, so you don't need to compare it to comfyui. Do a broad review first before you start digging in. Documentation completeness is in scope. Don't change code, just do a thorough review, but don't overthink... watch out for getting stuck in a loop` to get PR context\n   - Run: `gh pr diff 1ddd819412e5801faf147683facb0a270005f639  this is a single commit implementing a large feature that I want to propose. i want you to focus your review on the production code in python files. the code works and does the right things, so you don't need to compare it to comfyui. Do a broad review first before you start digging in. Documentation completeness is in scope. Don't change code, just do a thorough review, but don't overthink... watch out for getting stuck in a loop` to get the diff\n\nUse best judgement when processing input.\n\n---\n\n## Gathering Context\n\n**Diffs alone are not enough.** After getting the diff, read the entire file(s) being modified to understand the full context. Code that looks wrong in isolation may be correct given surrounding logic—and vice versa.\n\n- Use the diff to identify which files changed\n- Use `git status --short` to identify untracked files, then read their full contents\n- Read the full file to understand existing patterns, control flow, and error handling\n- Check for existing style guide or conventions files (CONVENTIONS.md, AGENTS.md, .editorconfig, etc.)\n\n---\n\n## What to Look For\n\n**Bugs** - Your primary focus.\n- Logic errors, off-by-one mistakes, incorrect conditionals\n- If-else guards: missing guards, incorrect branching, unreachable code paths\n- Edge cases: null/empty/undefined inputs, error conditions, race conditions\n- Security issues: injection, auth bypass, data exposure\n- Broken error handling that swallows failures, throws unexpectedly or returns error types that are not caught.\n\n**Structure** - Does the code fit the codebase?\n- Does it follow existing patterns and conventions?\n- Are there established abstractions it should use but doesn't?\n- Excessive nesting that could be flattened with early returns or extraction\n\n**Performance** - Only flag if obviously problematic.\n- O(n²) on unbounded data, N+1 queries, blocking I/O on hot paths\n\n**Behavior Changes** - If a behavioral change is introduced, raise it (especially if it's possibly unintentional).\n\n---\n\n## Before You Flag Something\n\n**Be certain.** If you're going to call something a bug, you need to be confident it actually is one.\n\n- Only review the changes - do not review pre-existing code that wasn't modified\n- Don't flag something as a bug if you're unsure - investigate first\n- Don't invent hypothetical problems - if an edge case matters, explain the realistic scenario where it breaks\n- If you need more context to be sure, use the tools below to get it\n\n**Don't be a zealot about style.** When checking code against conventions:\n\n- Verify the code is *actually* in violation. Don't complain about else statements if early returns are already being used correctly.\n- Some \"violations\" are acceptable when they're the simplest option. A `let` statement is fine if the alternative is convoluted.\n- Excessive nesting is a legitimate concern regardless of other style choices.\n- Don't flag style preferences as issues unless they clearly violate established project conventions.\n\n---\n\n## Tools\n\nUse these to inform your review:\n\n- **Explore agent** - Find how existing code handles similar problems. Check patterns, conventions, and prior art before claiming something doesn't fit.\n- **Exa Code Context** - Verify correct usage of libraries/APIs before flagging something as wrong.\n- **Web Search** - Research best practices if you're unsure about a pattern.\n\nIf you're uncertain about something and can't verify it with these tools, say \"I'm not sure about X\" rather than flagging it as a definite issue.\n\n---\n\n## Output\n\n1. If there is a bug, be direct and clear about why it is a bug.\n2. Clearly communicate severity of issues. Do not overstate severity.\n3. Critiques should clearly and explicitly communicate the scenarios, environments, or inputs that are necessary for the bug to arise. The comment should immediately indicate that the issue's severity depends on these factors.\n4. Your tone should be matter-of-fact and not accusatory or overly positive. It should read as a helpful AI assistant suggestion without sounding too much like a human reviewer.\n5. Write so the reader can quickly understand the issue without reading too closely.\n6. AVOID flattery, do not give any comments that are not helpful to the reader. Avoid phrasing like \"Great job ...\", \"Thanks for ...\".",
  "description": "review changes [commit|branch|pr], defaults to uncommitted",
  "subagent_type": "build",
  "command": "review"
}
```

**Output:**
```
<task id="ses_fdfbcd892ffe60RQxDACOwmyZ1" state="completed">
<task_result>

</task_result>
</task>
```

---

## User

---

## Assistant (Build · strix.Qwen3.8-27B · 60.7s)

_Thinking:_

The task tool's output is empty. The subagent returned nothing. Let me re-run the review myself or check what happened. The task result is empty — the agent didn't produce output. Let me just do the review myself directly.

Let me look at the commit.


The subagent returned an empty result, so I'll do the review directly.



**Tool: bash**

**Input:**
```json
{
  "command": "git show --stat 1ddd819412e5801faf147683facb0a270005f639 | head -80"
}
```

**Output:**
```
commit 1ddd819412e5801faf147683facb0a270005f639
Author: Chris Kuethe <chris.kuethe@gmail.com>
Date:   Sun Aug 16 06:34:21 2026 -0700

    Add Illustrious (SDXL-based) support
    
    Vibe coded implementation of Illustrious. It seems fairly popular and easy
    to test. Was able to generate some images including loras. `er_sde` is not
    a supported sampler, so there's an automatic fallback to `euler` to be user
    friendly.
    
    Didn't test loading checkpoints other than the official one from huggingface
    or any other SDXL based models.
    
    Doesn't break any other model support.
    
    Co-authored-by: DeepSeek-V4-Flash-0731 (opencode, lemonade)

 pyproject.toml                                     |     3 +
 scripts/download_illustrious.py                    |   161 +
 tests/test_detect.py                               |    54 +-
 tests/test_illustrious.py                          |   146 +
 thenoise/dit/illustrious/__init__.py               |     1 +
 .../dit/illustrious/configs/tokenizer/merges.txt   | 48895 +++++++++++++++++++
 .../configs/tokenizer/special_tokens_map.json      |     1 +
 .../configs/tokenizer/tokenizer_config.json        |    34 +
 .../dit/illustrious/configs/tokenizer/vocab.json   |     1 +
 thenoise/dit/illustrious/models.py                 |   399 +
 thenoise/dit/illustrious/sampling.py               |    49 +
 thenoise/dit/illustrious/text.py                   |   213 +
 thenoise/dit/illustrious/utils.py                  |   107 +
 thenoise/dit/illustrious/vae.py                    |   208 +
 thenoise/models/__init__.py                        |     3 +-
 thenoise/models/base.py                            |     2 +
 thenoise/models/illustrious.py                     |   266 +
 thenoise/samplers/__init__.py                      |    21 +
 18 files changed, 50562 insertions(+), 2 deletions(-)

```

---

## Assistant (Build · strix.Qwen3.8-27B · 9.6s)

_Thinking:_

Let me look at the diff of the production python files. Let me get the full diff of the relevant files.


**Tool: bash**

**Input:**
```json
{
  "command": "git show 1ddd819412e5801faf147683facb0a270005f639 -- thenoise/models/illustrious.py thenoise/models/base.py thenoise/models/__init__.py thenoise/samplers/__init__.py"
}
```

**Output:**
```
commit 1ddd819412e5801faf147683facb0a270005f639
Author: Chris Kuethe <chris.kuethe@gmail.com>
Date:   Sun Aug 16 06:34:21 2026 -0700

    Add Illustrious (SDXL-based) support
    
    Vibe coded implementation of Illustrious. It seems fairly popular and easy
    to test. Was able to generate some images including loras. `er_sde` is not
    a supported sampler, so there's an automatic fallback to `euler` to be user
    friendly.
    
    Didn't test loading checkpoints other than the official one from huggingface
    or any other SDXL based models.
    
    Doesn't break any other model support.
    
    Co-authored-by: DeepSeek-V4-Flash-0731 (opencode, lemonade)

diff --git a/thenoise/models/__init__.py b/thenoise/models/__init__.py
index 27b9e47..a7be623 100644
--- a/thenoise/models/__init__.py
+++ b/thenoise/models/__init__.py
@@ -9,10 +9,11 @@ from typing import List, Type
 
 from .base import DiffusionModel
 from .anima import AnimaModel
+from .illustrious import IllustriousModel
 from .krea2 import Krea2Model
 from .zimage import ZImageModel
 
-MODEL_CATALOG: List[Type[DiffusionModel]] = [Krea2Model, AnimaModel, ZImageModel]
+MODEL_CATALOG: List[Type[DiffusionModel]] = [Krea2Model, AnimaModel, ZImageModel, IllustriousModel]
 
 
 def resolve(dit_path: str) -> Type[DiffusionModel]:
diff --git a/thenoise/models/base.py b/thenoise/models/base.py
index 8603228..f30d893 100644
--- a/thenoise/models/base.py
+++ b/thenoise/models/base.py
@@ -82,6 +82,8 @@ class Conditioning:
     cond_mask: Optional[torch.Tensor] = None
     null: Optional[torch.Tensor] = None
     null_mask: Optional[torch.Tensor] = None
+    pooled: Optional[torch.Tensor] = None
+    neg_pooled: Optional[torch.Tensor] = None
 
 
 # Generic wrapper prefixes that repackagings (e.g. ComfyUI's "diffusion_model"
diff --git a/thenoise/models/illustrious.py b/thenoise/models/illustrious.py
new file mode 100644
index 0000000..cdc0c2d
--- /dev/null
+++ b/thenoise/models/illustrious.py
@@ -0,0 +1,266 @@
+"""Illustrious (SDXL-based anime) adapter.
+
+Illustrious-XL is a Stable Diffusion XL derivative: an SDXL LDM UNet (with the
+Illustrious transformer-depth reallocation), the SDXL dual-CLIP text encoders
+(CLIP-L + CLIP-G -> 2048-dim cross-attention, CLIP-G pooled for the ADM vector),
+and the SDXL VAE (4 channels, 8x compression). It is a discrete
+noise-prediction (epsilon) model sampled with the shared ``euler`` sampler over
+a discrete DDIM-style sigma grid.
+"""
+from __future__ import annotations
+
+import logging
+from typing import List, Optional
+
+import torch
+import torch.nn.functional as F
+
+from thenoise.dit.illustrious.models import timestep_embedding
+from thenoise.dit.illustrious.sampling import (
+    discrete_timesteps,
+    get_alphas_cumprod,
+    get_sigmas,
+)
+from thenoise.dit.illustrious.text import OpenClipTextTransformer
+from thenoise.dit.illustrious.utils import (
+    find_illustrious_tokenizer_dir,
+    load_illustrious_dit,
+    load_illustrious_text_encoders,
+    load_illustrious_tokenizer,
+)
+from thenoise.dit.illustrious.vae import AutoencoderKLIllustrious, load_illustrious_vae
+from thenoise.models.base import Conditioning, DiffusionModel, Step, normalize_keys
+from thenoise.models.config import ModelConfig, SamplingParams
+from thenoise.utils.math import round_up
+
+logger = logging.getLogger(__name__)
+
+#: Pooled CLIP-G projection width (1280) and size-embedding width (6 x 256).
+POOLED_DIM = 1280
+SIZE_EMBED_DIM = 1536
+
+
+class IllustriousModel(DiffusionModel):
+    name = "illustrious"
+
+    # SDXL defaults: ~28 euler steps, CFG ~5, 1024x1024.
+    DEFAULT_STEPS = 28
+    DEFAULT_GUIDANCE_SCALE = 5.0
+    DEFAULT_WIDTH = 1024
+    DEFAULT_HEIGHT = 1024
+
+    # The shared euler sampler reproduces the discrete DDIM/euler update when
+    # ``denoise_step`` returns the predicted noise and the schedule's deltas are
+    # sigma differences.
+    SAMPLER = "euler"
+    # SDXL is a discrete-epsilon model; only the euler solver is valid. A
+    # requested ``er_sde`` falls back to euler with a warning (see create_sampler).
+    SUPPORTED_SAMPLERS = ["euler"]
+
+    # 4-channel SDXL latent, 8x spatial compression.
+    LATENT_CHANNELS = 4
+    _VAE_SCALE = 8
+
+    MAX_SEQUENCE_LENGTH = 77
+
+    @staticmethod
+    def detect(f) -> bool:
+        """True if this handle is an SDXL LDM UNet (Illustrious-compatible).
+
+        The classic CompVis ``UNetModel`` layout is uniquely identified by the
+        ``input_blocks`` / ``middle_block`` block lists together with the
+        ``label_emb`` and ``time_embed`` conditioning MLPs. Keys are normalized
+        first so repackaged checkpoints (``model.diffusion_model.``) resolve
+        identically. Other registered models (flow DiTs) share none of these.
+        """
+        keys = list(normalize_keys(f.keys()))
+        has_input = any(k.startswith("input_blocks.") for k in keys)
+        has_middle = any(k.startswith("middle_block.") for k in keys)
+        has_label = any(k.startswith("label_emb.") for k in keys)
+        has_time = any(k.startswith("time_embed.") for k in keys)
+        return has_input and has_middle and has_label and has_time
+
+    def __init__(
+        self,
+        *,
+        config: ModelConfig,
+    ):
+        super().__init__(config=config)
+
+        logger.info("Loading Illustrious UNet from %s", config.dit_path)
+        self.dit = load_illustrious_dit(config.dit_path, device=config.device, dtype=config.dtype)
+        self.dit.eval().requires_grad_(False)
+
+        logger.info(
+            "Loading Illustrious text encoders (CLIP-L + CLIP-G) from %s",
+            config.text_encoder_path,
+        )
+        self.clip_l, self.clip_g = load_illustrious_text_encoders(
+            config.text_encoder_path, device=config.device, dtype=config.dtype
+        )
+        self.clip_l.eval().requires_grad_(False)
+        self.clip_g.eval().requires_grad_(False)
+        self.tokenizer = load_illustrious_tokenizer(
+            find_illustrious_tokenizer_dir(config.text_encoder_path)
+        )
+
+        logger.info("Loading Illustrious SDXL VAE from %s", config.vae_path)
+        self.vae = load_illustrious_vae(self.vae_path, device=self.device, disable_mmap=True)
+        self.vae.to(self.dtype).eval().requires_grad_(False)
+
+        # Discrete alphas_cumprod grid on-device, for per-step sigma lookup.
+        # ComfyUI's EPS ``calculate_input`` scales the UNet input by
+        # ``1/sqrt(sigma^2 + 1)`` (see ``BaseModel._apply_model``); without it
+        # the noisiest input is ~sigma_max (~26) too large and denoise collapses.
+        self._alphas_cumprod = get_alphas_cumprod(device=self.device)
+
+        # Per-step cached ADM vector (pooled text + size embedding), built in
+        # ``prepare_latent`` from the request's ``Conditioning``.
+        self._y = None
+        self._y_uncond = None
+
+        logger.info("Illustrious model ready on %s (%s)", config.device, config.dtype)
+
+    # ------------------------------------------------------------ kernels
+    def encode_prompt(
+        self,
+        prompt: str,
+        negative_prompt: str = "",
+        *,
+        guidance_scale: float,
+    ) -> Conditioning:
+        context, pooled = self._encode_prompt(prompt)
+        null = None
+        neg_pooled = None
+        if guidance_scale > 1.0:
+            neg_context, neg_pooled = self._encode_prompt(negative_prompt)
+            null = neg_context
+        return Conditioning(cond=context, null=null, pooled=pooled, neg_pooled=neg_pooled)
+
+    def _encode_prompt(self, prompt: str) -> tuple[torch.Tensor, torch.Tensor]:
+        """Return ``(cross_attn_context [1,77,2048], pooled [1,1280])``."""
+        dev = torch.device(self.device)
+        inputs = self.tokenizer(
+            [prompt],
+            padding="max_length",
+            max_length=self.MAX_SEQUENCE_LENGTH,
+            truncation=True,
+            return_tensors="pt",
+        )
+        input_ids = inputs.input_ids.to(dev)
+
+        with torch.no_grad():
+            out_l = self.clip_l(input_ids, output_hidden_states=True)
+            hidden_l = out_l.hidden_states[-2]  # [1, 77, 768] penultimate
+            hidden_g, pooled = self.clip_g(input_ids)  # [1, 77, 1280], [1, 1280]
+            context = torch.cat([hidden_l, hidden_g], dim=-1)  # [1, 77, 2048]
+        # The CLIP-G pooled text vector is L2-normalized (open_clip's text tower
+        # returns unit-length features); the SDXL ADM vector expects it normalized.
+        pooled = F.normalize(pooled, dim=-1)
+        return context.to(self.dtype), pooled.to(self.dtype)
+
+    def init_latents(self, params: SamplingParams) -> torch.Tensor:
+        dev = torch.device(self.device)
+        shape = (
+            1,
+            self.dit.in_channels,
+            params.height // self._VAE_SCALE,
+            params.width // self._VAE_SCALE,
+        )
+        generator = torch.Generator(device=dev).manual_seed(params.seed)
+        return torch.randn(shape, generator=generator, device=dev, dtype=self.dtype)
+
+    def _size_embedding(self, height: int, width: int) -> torch.Tensor:
+        """ComfyUI SDXL size embedding: 6 timestep_embeddings of 256, concatenated.
+
+        Order: [height, width, crop_h, crop_w, target_height, target_width],
+        with crop = (0, 0) and target = (height, width). Returns ``[1, 1536]``.
+        """
+        dev = torch.device(self.device)
+        parts = []
+        for value in (height, width, 0, 0, height, width):
+            t = torch.tensor([float(value)], device=dev)
+            parts.append(timestep_embedding(t, 256).to(torch.float32))
+        return torch.cat(parts, dim=0).flatten().unsqueeze(0).to(dev)
+
+    def prepare_latent(
+        self,
+        latents: torch.Tensor,
+        cond: Conditioning,
+        params: SamplingParams,
+    ) -> torch.Tensor:
+        # Scale the initial noise by the scheduler's max sigma (ComfyUI's flow
+        # euler for the discrete SDXL EPS model: init = noise * sigma_max).
+        sigmas = get_sigmas(params.steps)
+        scaled = latents * sigmas[0]
+
+        size_embeds = self._size_embedding(params.height, params.width)
+        self._y = torch.cat([cond.pooled, size_embeds], dim=-1).to(self.dtype)
+        if cond.null is not None and cond.neg_pooled is not None:
+            self._y_uncond = torch.cat([cond.neg_pooled, size_embeds], dim=-1).to(self.dtype)
+        else:
+            self._y_uncond = None
+        return scaled
+
+    def schedule(self, params: SamplingParams) -> list[Step]:
+        dev = torch.device(self.device)
+        steps = params.steps
+        ts = discrete_timesteps(steps)  # noise -> clean
+        sigmas = get_sigmas(steps)      # noise -> clean, trailing 0
+        return [
+            Step(
+                t=torch.tensor(float(ts[i]), device=dev, dtype=torch.float32),
+                delta=torch.tensor(sigmas[i] - sigmas[i + 1], device=dev, dtype=torch.float32),
+            )
+            for i in range(steps)
+        ]
+
+    def _sigma_at(self, t: torch.Tensor) -> torch.Tensor:
+        """Sigma for discrete timestep index ``t`` (matches the sampling grid)."""
+        abar = self._alphas_cumprod[t.to(torch.long)]
+        return torch.sqrt((1.0 - abar) / abar)
+
+    def denoise_step(
+        self,
+        latents: torch.Tensor,
+        t: torch.Tensor,
+        cond: Conditioning,
+        guidance_scale: float,
+        i: int,
+    ) -> torch.Tensor:
+        dev = torch.device(self.device)
+        t_full = t.to(dev).reshape(1)
+        context = cond.cond.to(dev, dtype=self.dtype)
+        # ComfyUI EPS ``calculate_input``: the UNet expects the latent scaled by
+        # ``1/sqrt(sigma^2 + 1)`` (the DDPM-space latent x_t), not the raw
+        # EDM-space latent. Apply it before every (un)conditional forward.
+        sigma = self._sigma_at(t_full).to(latents.dtype)
+        scaled = latents / torch.sqrt(sigma**2 + 1)
+        with torch.no_grad():
+            eps = self.dit(scaled, t_full, self._y, context)
+            if guidance_scale > 1.0 and self._y_uncond is not None and cond.null is not None:
+                uncond = self.dit(
+                    scaled, t_full, self._y_uncond, cond.null.to(dev, dtype=self.dtype)
+                )
+                eps = uncond + guidance_scale * (eps - uncond)
+        # ComfyUI flow euler for the EPS model: the model output (eps) IS the
+        # velocity; the sampler integrates ``x -= delta * eps``.
+        return eps
+
+    def finalize_latent(self, latents: torch.Tensor, params: SamplingParams) -> torch.Tensor:
+        # The denoised latent is already in the UNet's scaled space; the VAE's
+        # ``decode_to_pixels`` applies the 1/scaling_factor before decoding.
+        return latents
+
+    def resolve_size(self, width: int, height: int) -> tuple[int, int]:
+        # SDXL latents are 8x compressed; round up to a multiple of 8.
+        return round_up(width, 8), round_up(height, 8)
+
+    def _upscale_format(self) -> str:
+        raise NotImplementedError(
+            "Illustrious (SDXL 4-channel latents) does not support latent upscale yet; "
+            "no 4-channel upscaler weights are committed."
+        )
+
+
+__all__ = ["IllustriousModel", "OpenClipTextTransformer", "AutoencoderKLIllustrious"]
diff --git a/thenoise/samplers/__init__.py b/thenoise/samplers/__init__.py
index cfa2d49..00c2172 100644
--- a/thenoise/samplers/__init__.py
+++ b/thenoise/samplers/__init__.py
@@ -11,8 +11,11 @@ samplers never import the model classes.
 """
 from __future__ import annotations
 
+import logging
 from typing import Dict, Type
 
+logger = logging.getLogger(__name__)
+
 from .base import Sampler, Step
 from .euler import EulerSampler
 from .er_sde import ErSdeSampler
@@ -27,8 +30,26 @@ SAMPLERS: Dict[str, Type[Sampler]] = {
 def create_sampler(name: str, model) -> Sampler:
     """Instantiate the named sampler bound to ``model``.
 
+    A model may declare ``SUPPORTED_SAMPLERS`` (list of names). If the requested
+    ``name`` is a known sampler but not in that list, warn and fall back to the
+    model's ``SAMPLER`` default instead of producing a wrong result (e.g. a flow
+    solver like ``er_sde`` on a discrete-epsilon model such as SDXL).
+
     Raises ``ValueError`` for an unknown sampler name.
     """
+    supported = getattr(model, "SUPPORTED_SAMPLERS", None)
+    if (
+        supported is not None
+        and name in SAMPLERS
+        and name not in supported
+    ):
+        logger.warning(
+            "%s sampler is not supported by %s; using %s instead",
+            name,
+            model.name,
+            model.SAMPLER,
+        )
+        name = model.SAMPLER
     cls = SAMPLERS.get(name)
     if cls is None:
         raise ValueError(

```

---

## Assistant (Build · strix.Qwen3.8-27B · 30.2s)

_Thinking:_

Now let me read the other production python files: models.py, sampling.py, text.py, utils.py, vae.py.


**Tool: bash**

**Input:**
```json
{
  "command": "git show 1ddd819412e5801faf147683facb0a270005f639 -- thenoise/dit/illustrious/sampling.py thenoise/dit/illustrious/utils.py thenoise/dit/illustrious/__init__.py"
}
```

**Output:**
```
commit 1ddd819412e5801faf147683facb0a270005f639
Author: Chris Kuethe <chris.kuethe@gmail.com>
Date:   Sun Aug 16 06:34:21 2026 -0700

    Add Illustrious (SDXL-based) support
    
    Vibe coded implementation of Illustrious. It seems fairly popular and easy
    to test. Was able to generate some images including loras. `er_sde` is not
    a supported sampler, so there's an automatic fallback to `euler` to be user
    friendly.
    
    Didn't test loading checkpoints other than the official one from huggingface
    or any other SDXL based models.
    
    Doesn't break any other model support.
    
    Co-authored-by: DeepSeek-V4-Flash-0731 (opencode, lemonade)

diff --git a/thenoise/dit/illustrious/__init__.py b/thenoise/dit/illustrious/__init__.py
new file mode 100644
index 0000000..7c2e7a0
--- /dev/null
+++ b/thenoise/dit/illustrious/__init__.py
@@ -0,0 +1 @@
+"""Illustrious (SDXL-based) implementation — LDM UNet + dual-CLIP text encoder + SDXL VAE."""
diff --git a/thenoise/dit/illustrious/sampling.py b/thenoise/dit/illustrious/sampling.py
new file mode 100644
index 0000000..aebbcd7
--- /dev/null
+++ b/thenoise/dit/illustrious/sampling.py
@@ -0,0 +1,49 @@
+# Illustrious (SDXL) discrete sampler helpers.
+#
+# SDXL is an epsilon-prediction (noise) model sampled with a discrete DDIM/euler
+# schedule. The beta schedule is ComfyUI's "linear" (= diffusers
+# "scaled_linear"): ``betas = (linspace(sqrt(0.00085), sqrt(0.012), 1000))**2``.
+#
+# For each discrete timestep index ``t`` (0..999) the noise level is
+# ``sigma(t) = sqrt((1 - alphas_cumprod[t]) / alphas_cumprod[t])``. The euler
+# update ``x -= (sigma_i - sigma_{i+1}) * eps`` reproduces the discrete
+# euler/DDIM integration when ``denoise_step`` returns the predicted noise and
+# the initial latent is scaled by the largest sigma.
+
+import math
+
+import numpy as np
+import torch
+
+#: SDXL beta schedule bounds (ComfyUI "linear" / diffusers "scaled_linear").
+LINEAR_START = 0.00085
+LINEAR_END = 0.012
+NUM_TIMESTEPS = 1000
+
+
+def get_alphas_cumprod(device=None, dtype=torch.float64) -> torch.Tensor:
+    """``alphas_cumprod`` over 1000 discrete timesteps, index 0 = clean."""
+    betas = torch.linspace(
+        math.sqrt(LINEAR_START), math.sqrt(LINEAR_END), NUM_TIMESTEPS, dtype=dtype
+    ) ** 2
+    alphas = 1.0 - betas
+    return torch.cumprod(alphas, dim=0).to(device)
+
+
+def sigma(t: int) -> float:
+    """Noise level at discrete timestep ``t`` (0 = clean, 999 = noisy)."""
+    abar = float(get_alphas_cumprod()[t])
+    return float(((1.0 - abar) / abar) ** 0.5)
+
+
+def discrete_timesteps(steps: int) -> list[int]:
+    """Discrete timestep indices, noise->clean, for ``steps`` euler steps."""
+    timesteps = np.linspace(0, NUM_TIMESTEPS - 1, steps).round().astype(int)
+    return timesteps[::-1].tolist()
+
+
+def get_sigmas(steps: int) -> list[float]:
+    """Sigma grid, noise->clean, with a trailing 0 (mirrors diffusers Euler)."""
+    ts = discrete_timesteps(steps)
+    sigmas = [sigma(t) for t in ts] + [0.0]
+    return sigmas
diff --git a/thenoise/dit/illustrious/utils.py b/thenoise/dit/illustrious/utils.py
new file mode 100644
index 0000000..aee61a4
--- /dev/null
+++ b/thenoise/dit/illustrious/utils.py
@@ -0,0 +1,107 @@
+# Illustrious model-loading utilities.
+#
+# The splitter produces four files from the combined single-file checkpoint:
+#   dit/         bare LDM UNet keys (input_blocks.*, middle_block.*, ...)
+#   vae/         bare SDXL VAE keys (post_quant_conv.*, decoder.*)
+#   clip_l/      bare CLIP-L keys (text_model.*)
+#   clip_g/      bare CLIP-G keys (token_embedding.*, transformer.*, ...)
+#
+# The CLIP tokenizer config files are vendored under ``configs/tokenizer/`` so
+# the tokenizer loads offline without fetching from the Hub.
+
+import os
+from typing import Optional, Union
+
+import torch
+
+from thenoise.dit.illustrious.models import IllustriousUNet
+from thenoise.utils.safetensors import load_split_weights, strip_wrap_prefixes
+
+#: Vendored CLIP tokenizer config directory (vocab.json, merges.txt, ...).
+ILLUSTRIOUS_TOKENIZER_CONFIG_DIR = os.path.join(
+    os.path.dirname(__file__), "configs", "tokenizer"
+)
+
+
+def load_illustrious_dit(
+    dit_path: str,
+    device: Union[str, torch.device] = "cpu",
+    dtype: torch.dtype = torch.bfloat16,
+    loading_device: Optional[Union[str, torch.device]] = None,
+) -> IllustriousUNet:
+    """Build the Illustrious UNet on meta and load weights (assign=True)."""
+    device = torch.device(device)
+    loading_device = device if loading_device is None else torch.device(loading_device)
+
+    logger = __import__("logging").getLogger(__name__)
+    logger.info(f"Loading Illustrious UNet weights from {dit_path}")
+    with torch.device("meta"):
+        dit = IllustriousUNet()
+
+    sd = load_split_weights(dit_path, device=str(loading_device), disable_mmap=True, dtype=dtype)
+    sd = strip_wrap_prefixes(sd)
+
+    dit.load_state_dict(sd, strict=True, assign=True)
+    return dit
+
+
+def find_illustrious_tokenizer_dir(text_encoder_path: str, max_depth: int = 4) -> Optional[str]:
+    """Locate a local CLIP ``tokenizer/`` directory near a text encoder file.
+
+    The downloader drops the tokenizer under ``<out>/tokenizer/`` while the
+    text encoders land under ``<out>/split_files/text_encoders/``. Search
+    ``max_depth`` parents so the tokenizer is loaded offline when present.
+    Returns ``None`` to fall back to the vendored ``configs/tokenizer/`` dir.
+    """
+    base = os.path.dirname(os.path.abspath(text_encoder_path))
+    for _ in range(max_depth):
+        cand = os.path.join(base, "tokenizer")
+        if os.path.isdir(cand):
+            return cand
+        parent = os.path.dirname(base)
+        if parent == base:
+            break
+        base = parent
+    return None
+
+
+def load_illustrious_tokenizer(tokenizer_dir: Optional[str] = None):
+    """Load the shared CLIP tokenizer (local ``tokenizer_dir`` or vendored)."""
+    from transformers import CLIPTokenizer
+
+    tokenizer_dir = tokenizer_dir or ILLUSTRIOUS_TOKENIZER_CONFIG_DIR
+    if not os.path.isdir(tokenizer_dir):
+        raise FileNotFoundError(
+            f"CLIP tokenizer config directory not found at {tokenizer_dir}. "
+            "Expected vocab.json, merges.txt and tokenizer_config.json."
+        )
+    return CLIPTokenizer.from_pretrained(tokenizer_dir, local_files_only=True)
+
+
+def load_illustrious_text_encoders(
+    text_encoder_path: str,
+    device: Union[str, torch.device] = "cpu",
+    dtype: torch.dtype = torch.bfloat16,
+):
+    """Load both CLIP text encoders from the splitter's combined file.
+
+    The combined file keys are prefixed ``clip_l.`` and ``clip_g.``. Loads
+    CLIP-L (transformers) and CLIP-G (OpenCLIP) and returns ``(clip_l, clip_g)``.
+    """
+    from thenoise.utils.safetensors import load_safetensors
+
+    from .text import build_clip_g, build_clip_l
+
+    device = torch.device(device)
+    sd = load_safetensors(text_encoder_path, device=str(device), disable_mmap=True, dtype=dtype)
+
+    clip_l_sd = {k[len("clip_l."):]: v for k, v in sd.items() if k.startswith("clip_l.")}
+    clip_g_sd = {k[len("clip_g."):]: v for k, v in sd.items() if k.startswith("clip_g.")}
+    if not clip_l_sd:
+        raise ValueError("combined text encoder file has no 'clip_l.' weights")
+    if not clip_g_sd:
+        raise ValueError("combined text encoder file has no 'clip_g.' weights")
+
+    clip_l = build_clip_l(clip_l_sd, device=device, dtype=dtype)
+    clip_g = build_clip_g(clip_g_sd, device=device, dtype=dtype)
+    return clip_l, clip_g

```

---

## Assistant (Build · strix.Qwen3.8-27B · 20.3s)

_Thinking:_

Note in `load_illustrious_dit`, `logger = __import__("logging").getLogger(__name__)` is a bit odd but works. Now let me look at models.py, text.py, vae.py.


**Tool: bash**

**Input:**
```json
{
  "command": "git show 1ddd819412e5801faf147683facb0a270005f639 -- thenoise/dit/illustrious/text.py"
}
```

**Output:**
```
commit 1ddd819412e5801faf147683facb0a270005f639
Author: Chris Kuethe <chris.kuethe@gmail.com>
Date:   Sun Aug 16 06:34:21 2026 -0700

    Add Illustrious (SDXL-based) support
    
    Vibe coded implementation of Illustrious. It seems fairly popular and easy
    to test. Was able to generate some images including loras. `er_sde` is not
    a supported sampler, so there's an automatic fallback to `euler` to be user
    friendly.
    
    Didn't test loading checkpoints other than the official one from huggingface
    or any other SDXL based models.
    
    Doesn't break any other model support.
    
    Co-authored-by: DeepSeek-V4-Flash-0731 (opencode, lemonade)

diff --git a/thenoise/dit/illustrious/text.py b/thenoise/dit/illustrious/text.py
new file mode 100644
index 0000000..5181c81
--- /dev/null
+++ b/thenoise/dit/illustrious/text.py
@@ -0,0 +1,213 @@
+# Illustrious text encoders: the SDXL dual-CLIP pair.
+#
+# The checkpoint stores the two CLIP encoders under ``conditioner.embedders``:
+#   embedders.0 -> CLIP-L (HF ``CLIPTextModel`` layout, 768 dim, 12 layers)
+#   embedders.1 -> CLIP-G (OpenCLIP ViT-bigG layout, 1280 dim, 32 layers)
+#
+# Both use the same CLIP BPE tokenizer (49408 vocab, 77 tokens). For the UNet's
+# 2048-dim cross-attention the two penultimate hidden states are concatenated;
+# the 1280-dim pooled output (used in the ADM vector) comes from CLIP-G only.
+#
+# CLIP-L is built with transformers' ``CLIPTextModel`` (a vendored config, no Hub
+# fetch). CLIP-G is the OpenCLIP bigG text tower, implemented here directly (the
+# fused-QKV ``in_proj_weight`` layout is not loadable by transformers), matching
+# ``open_clip`` / ComfyUI's ``SDXLClipG`` exactly: penultimate hidden state for
+# the cross-attention stream and ``text_projection(eos @ ln_final)`` for pooled.
+
+from collections import OrderedDict
+
+import torch
+import torch.nn as nn
+import torch.nn.functional as F
+
+from thenoise.utils.setup_logging import setup_logging
+
+setup_logging()
+import logging
+
+logger = logging.getLogger(__name__)
+
+#: CLIP-L (``openai/clip-vit-large-patch14``) config, vendored so the model is
+#: built offline without fetching ``config.json`` from the Hub.
+CLIP_L_CONFIG = {
+    "architectures": ["CLIPTextModel"],
+    "model_type": "clip_text_model",
+    "hidden_size": 768,
+    "num_hidden_layers": 12,
+    "num_attention_heads": 12,
+    "intermediate_size": 3072,
+    "max_position_embeddings": 77,
+    "vocab_size": 49408,
+    "layer_norm_eps": 1e-5,
+    "initializer_range": 0.02,
+    "attention_dropout": 0.0,
+    "pad_token_id": 1,
+    "bos_token_id": 49406,
+    "eos_token_id": 49407,
+    "projection_dim": 768,
+}
+
+#: OpenCLIP ViT-bigG text config (``laion/CLIP-ViT-bigG-14``).
+CLIP_G_CONFIG = {
+    "embed_dim": 1280,
+    "text_layers": 32,
+    "text_heads": 16,
+    "text_width": 1280,
+    "mlp_ratio": 4.0,
+    "vocab_size": 49408,
+    "text_max_len": 77,
+}
+
+
+class _OpenClipMultiheadAttention(nn.Module):
+    """OpenCLIP fused-QKV attention (``nn.MultiheadAttention``-style).
+
+    Keys: ``in_proj_weight`` (3*dim, dim), ``in_proj_bias``, ``out_proj``.
+    """
+
+    def __init__(self, dim, num_heads):
+        super().__init__()
+        self.dim = dim
+        self.num_heads = num_heads
+        self.head_dim = dim // num_heads
+        self.in_proj_weight = nn.Parameter(torch.empty(dim * 3, dim))
+        self.in_proj_bias = nn.Parameter(torch.empty(dim * 3))
+        self.out_proj = nn.Linear(dim, dim)
+
+    def forward(self, x, attn_mask=None):
+        B, L, _ = x.shape
+        q, k, v = F.linear(x, self.in_proj_weight, self.in_proj_bias).chunk(3, dim=-1)
+        q = q.view(B, L, self.num_heads, self.head_dim).transpose(1, 2)
+        k = k.view(B, L, self.num_heads, self.head_dim).transpose(1, 2)
+        v = v.view(B, L, self.num_heads, self.head_dim).transpose(1, 2)
+        out = F.scaled_dot_product_attention(q, k, v, attn_mask=attn_mask, is_causal=True)
+        out = out.transpose(1, 2).reshape(B, L, self.dim)
+        return self.out_proj(out)
+
+
+class _OpenClipResidualBlock(nn.Module):
+    """``ln_1 -> attn -> ln_2 -> mlp`` residual block. Keys match OpenCLIP."""
+
+    def __init__(self, dim, num_heads):
+        super().__init__()
+        mlp_width = int(dim * 4.0)
+        self.ln_1 = nn.LayerNorm(dim)
+        self.attn = _OpenClipMultiheadAttention(dim, num_heads)
+        self.ln_2 = nn.LayerNorm(dim)
+        self.mlp = nn.Sequential(
+            OrderedDict(
+                [
+                    ("c_fc", nn.Linear(dim, mlp_width)),
+                    ("gelu", nn.GELU()),
+                    ("c_proj", nn.Linear(mlp_width, dim)),
+                ]
+            )
+        )
+
+    def forward(self, x):
+        x = x + self.attn(self.ln_1(x))
+        x = x + self.mlp(self.ln_2(x))
+        return x
+
+
+class OpenClipTextTransformer(nn.Module):
+    """OpenCLIP bigG text tower (tokenizer-free).
+
+    Keys are the bare OpenCLIP names: ``token_embedding``,
+    ``positional_embedding``, ``transformer.resblocks.N.*``, ``ln_final``,
+    ``text_projection``, ``logit_scale``.
+    """
+
+    def __init__(self, embed_dim=1280, layers=32, heads=16, vocab_size=49408, max_len=77):
+        super().__init__()
+        self.embed_dim = embed_dim
+        self.max_len = max_len
+        self.token_embedding = nn.Embedding(vocab_size, embed_dim)
+        self.positional_embedding = nn.Parameter(torch.empty(max_len, embed_dim))
+        # ``transformer`` is a bare container whose ``resblocks`` ModuleList
+        # produces the OpenCLIP keys ``transformer.resblocks.N.*``.
+        self.transformer = nn.Module()
+        self.transformer.resblocks = nn.ModuleList(
+            [_OpenClipResidualBlock(embed_dim, heads) for _ in range(layers)]
+        )
+        self.ln_final = nn.LayerNorm(embed_dim)
+        # Bare parameter (checkpoint key is ``text_projection``, not Linear).
+        self.text_projection = nn.Parameter(torch.empty(embed_dim, embed_dim))
+        self.logit_scale = nn.Parameter(torch.ones(()))
+
+    def _penultimate_and_pooled(self, x, ids):
+        """Run the tower; return ``(penultimate_hidden, projected_pooled)``.
+
+        ``x`` is ``[B, 77, 1280]`` (token + positional embeddings). The
+        penultimate hidden state (output of layer ``layers-2``) feeds the UNet's
+        cross-attention; the pooled output is ``text_projection(eos @ ln_final)``
+        at the end-of-text token.
+        """
+        hidden = x
+        penultimate = None
+        blocks = self.transformer.resblocks
+        n = len(blocks)
+        for i, block in enumerate(blocks):
+            hidden = block(hidden)
+            if i == n - 2:
+                penultimate = hidden
+        x = self.ln_final(hidden)
+        idx = ids.argmax(dim=-1)
+        pooled = x[torch.arange(x.shape[0], device=x.device), idx]
+        pooled = pooled @ self.text_projection
+        return penultimate, pooled
+
+    def forward(self, input_ids):
+        """Encode token ids ``[B, 77]`` -> ``(penultimate [B, 77, 1280], pooled [B, 1280])``."""
+        ids = input_ids
+        x = self.token_embedding(ids) + self.positional_embedding.unsqueeze(0)
+        x = x.to(self.token_embedding.weight.dtype)
+        return self._penultimate_and_pooled(x, ids)
+
+
+def build_clip_l(sd, device="cpu", dtype=torch.bfloat16):
+    """Build and load the CLIP-L text encoder from a bare ``text_model.*`` state dict."""
+    from transformers import CLIPTextConfig, CLIPTextModel
+    from accelerate import init_empty_weights
+
+    config = CLIPTextConfig(**CLIP_L_CONFIG)
+    with init_empty_weights():
+        model = CLIPTextModel(config)
+    # transformers keeps ``position_ids`` as a non-persistent buffer, but the
+    # checkpoint carries it; drop it (transformers rebuilds arange(77) anyway).
+    sd = {k: v for k, v in sd.items() if k != "text_model.embeddings.position_ids"}
+    info = model.load_state_dict(sd, strict=True, assign=True)
+    if info.unexpected_keys or info.missing_keys:
+        raise RuntimeError(
+            f"CLIP-L checkpoint did not match CLIPTextModel: "
+            f"missing={info.missing_keys[:10]}, unexpected={info.unexpected_keys[:10]}"
+        )
+    model.to(device)
+    if dtype is not None:
+        model.to(dtype)
+    model.config.use_cache = False
+    logger.info("Loaded CLIP-L text encoder")
+    return model.eval().requires_grad_(False)
+
+
+def build_clip_g(sd, device="cpu", dtype=torch.bfloat16):
+    """Build and load the CLIP-G (OpenCLIP bigG) text tower from a bare state dict."""
+    cfg = CLIP_G_CONFIG
+    model = OpenClipTextTransformer(
+        embed_dim=cfg["embed_dim"],
+        layers=cfg["text_layers"],
+        heads=cfg["text_heads"],
+        vocab_size=cfg["vocab_size"],
+        max_len=cfg["text_max_len"],
+    )
+    info = model.load_state_dict(sd, strict=True, assign=True)
+    if info.unexpected_keys or info.missing_keys:
+        raise RuntimeError(
+            f"CLIP-G checkpoint did not match OpenClipTextTransformer: "
+            f"missing={info.missing_keys[:10]}, unexpected={info.unexpected_keys[:10]}"
+        )
+    model.to(device)
+    if dtype is not None:
+        model.to(dtype)
+    logger.info("Loaded CLIP-G text encoder")
+    return model.eval().requires_grad_(False)

```

---

## Assistant (Build · strix.Qwen3.8-27B · 56.7s)

_Thinking:_

Let me note potential issues in text.py:

1. `_OpenClipMultiheadAttention.forward` uses `F.scaled_dot_product_attention(..., is_causal=True)`. But CLIP text attention is causal (unidirectional). However, the input is padded with max_length=77. With `is_causal=True`, padding tokens at the end don't affect earlier tokens (causal mask only masks future). But wait — CLIP uses a causal attention mask but the standard CLIP text transformer applies attention over all tokens... Actually CLIP text encoder IS causal (autoregressive). The original open_clip text transformer uses a causal mask. So `is_causal=True` is correct. But there's a subtlety: with padding, the `is_causal` mask is lower-triangular, so padded tokens (at positions after real tokens) will attend to real tokens. That's fine since we only use penultimate hidden state and the EOS token. Actually the EOS argmax selects the last non-pad token. Good.

But wait, is_causal requires q_len == k_len typically and that the causal mask is standard. Since all sequences are length 77 (padded to max_length), it works. OK.

2. `idx = ids.argmax(dim=-1)` to find EOS. In CLIP, tokens are [SOS, ..., EOS, PAD...]. argmax would pick the largest token id, not necessarily EOS. This is a known ComfyUI trick actually — ComfyUI uses `ids.argmax()` to find the EOS token because in CLIP the EOS token id (49407) is larger than most text token ids. Actually this is a common trick: the last non-padding token. Hmm, but is argmax guaranteed to be the EOS? The EOS token id is 49407, which is near the top of vocab (49408). Text tokens generally have lower ids. PAD=0, SOS=49406, EOS=49407. So argmax picks 49407 if present. This is a well-known ComfyUI approach. OK, acceptable.

Now let me check vae.py and models.py.


**Tool: bash**

**Input:**
```json
{
  "command": "git show 1ddd819412e5801faf147683facb0a270005f639 -- thenoise/dit/illustrious/vae.py"
}
```

**Output:**
```
commit 1ddd819412e5801faf147683facb0a270005f639
Author: Chris Kuethe <chris.kuethe@gmail.com>
Date:   Sun Aug 16 06:34:21 2026 -0700

    Add Illustrious (SDXL-based) support
    
    Vibe coded implementation of Illustrious. It seems fairly popular and easy
    to test. Was able to generate some images including loras. `er_sde` is not
    a supported sampler, so there's an automatic fallback to `euler` to be user
    friendly.
    
    Didn't test loading checkpoints other than the official one from huggingface
    or any other SDXL based models.
    
    Doesn't break any other model support.
    
    Co-authored-by: DeepSeek-V4-Flash-0731 (opencode, lemonade)

diff --git a/thenoise/dit/illustrious/vae.py b/thenoise/dit/illustrious/vae.py
new file mode 100644
index 0000000..52cb971
--- /dev/null
+++ b/thenoise/dit/illustrious/vae.py
@@ -0,0 +1,208 @@
+# Illustrious (SDXL) VAE — decoder-only inference.
+#
+# The classic CompVis/LDM ``AutoencoderKL`` decoder shared by Stable Diffusion
+# XL. The checkpoint stores it under ``first_stage_model.`` (encoder /
+# ``quant_conv`` / ``post_quant_conv`` / decoder). Only the decoder is needed
+# for text-to-image; the splitter keeps ``post_quant_conv`` and the ``decoder``.
+#
+# Latent format: 4 channels, 8x spatial compression. The UNet operates on the
+# scaled latent space; the VAE decodes with ``latents / scaling_factor`` where
+# ``scaling_factor = 0.13025`` (SDXL), so ``decode_to_pixels`` applies that
+# before ``post_quant_conv -> decoder``.
+#
+# Decoder structure (LDM keys):
+#   conv_in: 4 -> 512
+#   mid:     block_1 (512), attn_1 (512), block_2 (512)
+#   up.3:    512, 3 blocks + upsample ; up.2: 512, 3 blocks + upsample
+#   up.1:    256, 3 blocks + upsample ; up.0: 128, 3 blocks (no upsample)
+#   (the up blocks are applied in *reverse* index order: up.3 -> up.0)
+#   norm_out (GroupNorm 128), conv_out: 128 -> 3
+
+from collections import OrderedDict
+
+import torch
+import torch.nn as nn
+import torch.nn.functional as F
+
+from thenoise.utils.setup_logging import setup_logging
+
+setup_logging()
+import logging
+
+logger = logging.getLogger(__name__)
+
+#: SDXL latent scaling factor (UNet latent space -> VAE raw space).
+SCALING_FACTOR = 0.13025
+
+
+class _VAEResnetBlock(nn.Module):
+    """``conv1 - norm1 - act - conv2 - norm2 - act`` + optional shortcut.
+
+    Keys: ``norm1``, ``conv1``, ``norm2``, ``conv2``, ``nin_shortcut``.
+    """
+
+    def __init__(self, in_channels, out_channels):
+        super().__init__()
+        self.norm1 = nn.GroupNorm(32, in_channels, eps=1e-6)
+        self.conv1 = nn.Conv2d(in_channels, out_channels, 3, padding=1)
+        self.norm2 = nn.GroupNorm(32, out_channels, eps=1e-6)
+        self.conv2 = nn.Conv2d(out_channels, out_channels, 3, padding=1)
+        if in_channels != out_channels:
+            self.nin_shortcut = nn.Conv2d(in_channels, out_channels, 1)
+        else:
+            self.nin_shortcut = nn.Identity()
+
+    def forward(self, x):
+        h = self.conv1(F.silu(self.norm1(x)))
+        h = self.conv2(F.silu(self.norm2(h)))
+        return self.nin_shortcut(x) + h
+
+
+class _AttnBlock(nn.Module):
+    """Single-head 1x1-conv attention. Keys: ``norm``, ``q``, ``k``, ``v``, ``proj_out``."""
+
+    def __init__(self, channels):
+        super().__init__()
+        self.norm = nn.GroupNorm(32, channels, eps=1e-6)
+        self.q = nn.Conv2d(channels, channels, 1)
+        self.k = nn.Conv2d(channels, channels, 1)
+        self.v = nn.Conv2d(channels, channels, 1)
+        self.proj_out = nn.Conv2d(channels, channels, 1)
+
+    def forward(self, x):
+        h = self.norm(x)
+        B, C, H, W = h.shape
+        q = self.q(h).view(B, C, -1).transpose(1, 2)  # [B, HW, C]
+        k = self.k(h).view(B, C, -1)  # [B, C, HW]
+        v = self.v(h).view(B, C, -1).transpose(1, 2)  # [B, HW, C]
+        attn = torch.bmm(q, k) * (C ** -0.5)
+        attn = attn.softmax(dim=-1)
+        out = torch.bmm(attn, v).transpose(1, 2).view(B, C, H, W)
+        return self.proj_out(out) + x
+
+
+class _Upsample(nn.Module):
+    """Nearest upsample + conv. Key: ``conv``."""
+
+    def __init__(self, channels):
+        super().__init__()
+        self.conv = nn.Conv2d(channels, channels, 3, padding=1)
+
+    def forward(self, x):
+        x = F.interpolate(x, scale_factor=2, mode="nearest")
+        return self.conv(x)
+
+
+class _UpLevel(nn.Module):
+    """One decoder up level: a ``block`` ModuleList of resnets + optional ``upsample``.
+
+    Keys: ``block.0/1/2.*`` (resnets), ``upsample.conv`` (when upsampling).
+    """
+
+    def __init__(self, in_ch, out_ch, num_res_blocks, upsample):
+        super().__init__()
+        self.block = nn.ModuleList(
+            [_VAEResnetBlock(in_ch, out_ch)]
+            + [_VAEResnetBlock(out_ch, out_ch) for _ in range(num_res_blocks)]
+        )
+        if upsample:
+            self.upsample = _Upsample(out_ch)
+        else:
+            self.upsample = None
+
+    def forward(self, x):
+        for b in self.block:
+            x = b(x)
+        if self.upsample is not None:
+            x = self.upsample(x)
+        return x
+
+
+class _Decoder(nn.Module):
+    def __init__(self, z_channels=4, base_dim=128, dim_mult=(1, 2, 4, 4), num_res_blocks=2):
+        super().__init__()
+        block_in = base_dim * dim_mult[-1]  # 512
+        self.conv_in = nn.Conv2d(z_channels, block_in, 3, padding=1)  # 4 -> 512
+
+        # middle: block_1 (512), attn_1 (512), block_2 (512)
+        self.mid = nn.Sequential(
+            OrderedDict(
+                [
+                    ("block_1", _VAEResnetBlock(block_in, block_in)),
+                    ("attn_1", _AttnBlock(block_in)),
+                    ("block_2", _VAEResnetBlock(block_in, block_in)),
+                ]
+            )
+        )
+
+        # up blocks. Index 0 is the *final* (128ch) block applied last; index 3
+        # is the first (512ch) applied right after ``mid``. Forward iterates in
+        # reverse index order: up.3 (512) -> up.2 (512) -> up.1 (256) -> up.0.
+        self.up = nn.ModuleList(
+            [
+                _UpLevel(256, 128, num_res_blocks, upsample=False),
+                _UpLevel(512, 256, num_res_blocks, upsample=True),
+                _UpLevel(512, 512, num_res_blocks, upsample=True),
+                _UpLevel(block_in, 512, num_res_blocks, upsample=True),
+            ]
+        )
+
+        self.norm_out = nn.GroupNorm(32, 128, eps=1e-6)
+        self.conv_out = nn.Conv2d(128, 3, 3, padding=1)
+
+    def forward(self, z):
+        h = self.conv_in(z)  # 4 -> 512
+        h = self.mid(h)
+        for module in reversed(self.up):
+            h = module(h)
+        h = self.norm_out(h)
+        h = F.silu(h)
+        h = self.conv_out(h)
+        return h
+
+
+class AutoencoderKLIllustrious(nn.Module):
+    """Decoder-only SDXL VAE. ``decode_to_pixels`` yields pixels in [-1, 1]."""
+
+    def __init__(self, scaling_factor=SCALING_FACTOR):
+        super().__init__()
+        self.z_dim = 4
+        self.compression = 8
+        self.scaling_factor = scaling_factor
+        self.post_quant_conv = nn.Conv2d(4, 4, 1)
+        self.decoder = _Decoder()
+
+    @property
+    def dtype(self):
+        return self.decoder.conv_in.weight.dtype
+
+    @property
+    def device(self):
+        return self.decoder.conv_in.weight.device
+
+    def decode_to_pixels(self, latents: torch.Tensor) -> torch.Tensor:
+        z = latents.to(self.dtype) / self.scaling_factor
+        z = self.post_quant_conv(z)
+        img = self.decoder(z)
+        return img.clamp(-1.0, 1.0)
+
+
+def load_illustrious_vae(vae_path: str, device="cpu", disable_mmap=True):
+    """Build and load the SDXL VAE decoder from a safetensors file.
+
+    ``vae_path`` holds ``post_quant_conv.*`` and ``decoder.*`` (the splitter
+    strips ``first_stage_model.``).
+    """
+    from thenoise.utils.safetensors import load_safetensors
+
+    vae = AutoencoderKLIllustrious()
+    sd = load_safetensors(vae_path, device=str(device), disable_mmap=disable_mmap)
+    info = vae.load_state_dict(sd, strict=True, assign=True)
+    if info.unexpected_keys or info.missing_keys:
+        raise RuntimeError(
+            f"SDXL VAE checkpoint did not match: "
+            f"missing={info.missing_keys[:10]}, unexpected={info.unexpected_keys[:10]}"
+        )
+    vae.to(device)
+    logger.info("Loaded Illustrious SDXL VAE")
+    return vae

```

---

## Assistant (Build · strix.Qwen3.8-27B · 22.4s)

_Thinking:_

Now models.py — the UNet. Let me read it.


**Tool: bash**

**Input:**
```json
{
  "command": "git show 1ddd819412e5801faf147683facb0a270005f639 -- thenoise/dit/illustrious/models.py"
}
```

**Output:**
```
commit 1ddd819412e5801faf147683facb0a270005f639
Author: Chris Kuethe <chris.kuethe@gmail.com>
Date:   Sun Aug 16 06:34:21 2026 -0700

    Add Illustrious (SDXL-based) support
    
    Vibe coded implementation of Illustrious. It seems fairly popular and easy
    to test. Was able to generate some images including loras. `er_sde` is not
    a supported sampler, so there's an automatic fallback to `euler` to be user
    friendly.
    
    Didn't test loading checkpoints other than the official one from huggingface
    or any other SDXL based models.
    
    Doesn't break any other model support.
    
    Co-authored-by: DeepSeek-V4-Flash-0731 (opencode, lemonade)

diff --git a/thenoise/dit/illustrious/models.py b/thenoise/dit/illustrious/models.py
new file mode 100644
index 0000000..d245867
--- /dev/null
+++ b/thenoise/dit/illustrious/models.py
@@ -0,0 +1,399 @@
+# Illustrious (SDXL-based) LDM UNet architecture.
+#
+# Illustrious-XL is a Stable Diffusion XL derivative whose UNet keeps the classic
+# CompVis/LDM ``UNetModel`` layout (``input_blocks`` / ``middle_block`` /
+# ``output_blocks`` with LDM-style resnets and diffusers-style transformer
+# blocks) but reallocates the transformer depth: attention is dropped entirely
+# at the lowest-resolution (320ch) stage, the 640ch stage uses 2 transformer
+# blocks, and the 1280ch stage (plus the middle block) uses 10 transformer
+# blocks. This matches ComfyUI's SDXL config ``transformer_depth``:
+# ``[0, 0, 2, 2, 10, 10]`` (input), ``transformer_depth_middle: 10``,
+# ``transformer_depth_output: [0, 0, 0, 2, 2, 2, 10, 10, 10]``.
+#
+# Weight key names are unchanged from the official / ComfyUI checkpoint, so the
+# single-file and split checkpoints load as-is:
+#   time_embed.{0,2}            Linear(320,1280) SiLU Linear(1280,1280)
+#   label_emb.0.{0,2}           Linear(2816,1280) SiLU Linear(1280,1280)
+#   input_blocks.N.M.*          conv/resnet/transformer/downsample
+#   middle_block.M.*            resnet/transformer
+#   output_blocks.N.M.*         resnet/transformer/upsample
+#   out.{0,2}                   GroupNorm(320) Conv2d(320,4)
+#
+# The model is an epsilon (noise-prediction) discrete model, not a flow model:
+# ``forward`` returns the predicted noise given a discrete timestep index
+# (0..999). The timestep embedding is ComfyUI's ``timestep_embedding``
+# (cos-then-sin, max_period 10000) fed through ``time_embed``, and the
+# ADM vector ``y`` (2816 = pooled text 1280 + size embedding 1536) is mapped by
+# ``label_emb`` and ADDED to the time embedding.
+#
+# Copyright 2025 OnomaAI (Illustrious-XL) / Stability AI (SDXL base), under
+# the CreativeML Open RAIL-M / SDXL licenses.
+
+import math
+
+import torch
+import torch.nn as nn
+import torch.nn.functional as F
+
+from thenoise.utils.attention import attention
+from thenoise.utils.setup_logging import setup_logging
+
+setup_logging()
+import logging
+
+logger = logging.getLogger(__name__)
+
+
+#: Channel count of the UNet's first stage (also the time-embedding input dim).
+MODEL_CHANNELS = 320
+#: ``time_embed`` / ``label_emb`` output width (320 * 4).
+TIME_EMBED_DIM = 1280
+#: Cross-attention context dim (77 x 2048 dual-CLIP concatenation).
+CONTEXT_DIM = 2048
+#: Per-head channel count for the transformer attention (heads = dim/64).
+HEAD_DIM = 64
+#: Group count for the resnet / transformer-input GroupNorms.
+NORM_GROUPS = 32
+
+
+def timestep_embedding(timesteps, dim, max_period=10000):
+    """Sinusoidal timestep embedding (ComfyUI's, cos-then-sin).
+
+    ``timesteps`` are discrete timestep indices in [0, 1000). Returns
+    ``[B, dim]``. Matches ``comfy/ldm/modules/diffusionmodules/util.py``.
+    """
+    half = dim // 2
+    freqs = torch.exp(
+        -math.log(max_period)
+        * torch.arange(start=0, end=half, dtype=torch.float32, device=timesteps.device)
+        / half
+    )
+    args = timesteps[:, None].float() * freqs[None]
+    embedding = torch.cat([torch.cos(args), torch.sin(args)], dim=-1)
+    if dim % 2:
+        embedding = torch.cat([embedding, torch.zeros_like(embedding[:, :1])], dim=-1)
+    return embedding
+
+
+class ResnetBlock2D(nn.Module):
+    """LDM/CompVis ``ResnetBlock2D`` with group-norm, SiLU and a time embedding.
+
+    Keys: ``in_layers.0`` (GN), ``in_layers.2`` (conv), ``emb_layers.1`` (time
+    MLP), ``out_layers.0`` (GN), ``out_layers.3`` (conv), ``skip_connection``.
+    """
+
+    def __init__(self, in_channels, out_channels, time_embed_dim=TIME_EMBED_DIM):
+        super().__init__()
+        self.in_layers = nn.Sequential(
+            nn.GroupNorm(NORM_GROUPS, in_channels, eps=1e-5),
+            nn.SiLU(),
+            nn.Conv2d(in_channels, out_channels, 3, padding=1),
+        )
+        self.emb_layers = nn.Sequential(
+            nn.SiLU(),
+            nn.Linear(time_embed_dim, out_channels),
+        )
+        self.out_layers = nn.Sequential(
+            nn.GroupNorm(NORM_GROUPS, out_channels, eps=1e-5),
+            nn.SiLU(),
+            nn.Dropout(0.0),
+            nn.Conv2d(out_channels, out_channels, 3, padding=1),
+        )
+        if in_channels != out_channels:
+            self.skip_connection = nn.Conv2d(in_channels, out_channels, 1)
+        else:
+            self.skip_connection = nn.Identity()
+
+    def forward(self, x, temb):
+        h = self.in_layers(x)
+        emb_out = self.emb_layers(temb).type_as(h)
+        h = h + emb_out[:, :, None, None]
+        h = self.out_layers(h)
+        return self.skip_connection(x) + h
+
+
+class Attention(nn.Module):
+    """diffusers-style MHA with fused q/k/v and an ``out`` projection.
+
+    Keys: ``to_q``, ``to_k``, ``to_v``, ``to_out.0``. Cross-attention uses a
+    different ``context_dim`` for k/v (2048 for the text stream).
+    """
+
+    def __init__(self, dim, num_heads, head_dim, context_dim=None):
+        super().__init__()
+        context_dim = context_dim if context_dim is not None else dim
+        self.num_heads = num_heads
+        self.head_dim = head_dim
+        inner_dim = num_heads * head_dim
+        # SDXL transformer attention has NO bias on q/k/v; only ``to_out.0``.
+        self.to_q = nn.Linear(dim, inner_dim, bias=False)
+        self.to_k = nn.Linear(context_dim, inner_dim, bias=False)
+        self.to_v = nn.Linear(context_dim, inner_dim, bias=False)
+        self.to_out = nn.Sequential(nn.Linear(inner_dim, dim), nn.Dropout(0.0))
+
+    def forward(self, hidden, context=None):
+        context = context if context is not None else hidden
+        B, L, _ = hidden.shape
+        q = self.to_q(hidden).view(B, -1, self.num_heads, self.head_dim)
+        k = self.to_k(context).view(B, -1, self.num_heads, self.head_dim)
+        v = self.to_v(context).view(B, -1, self.num_heads, self.head_dim)
+        out = attention([q, k, v], drop_rate=0.0)
+        return self.to_out[0](out)
+
+
+class GEGLU(nn.Module):
+    """GEGLU gated feed-forward entry. Key ``proj`` projects to 2*inner_dim."""
+
+    def __init__(self, dim, inner_dim):
+        super().__init__()
+        self.proj = nn.Linear(dim, 2 * inner_dim)
+
+    def forward(self, x):
+        x, gate = self.proj(x).chunk(2, dim=-1)
+        return x * F.gelu(gate)
+
+
+class FeedForward(nn.Module):
+    """``net.0`` = GEGLU, ``net.1`` = dropout, ``net.2`` = Linear(inner, dim)."""
+
+    def __init__(self, dim, inner_dim):
+        super().__init__()
+        self.net = nn.Sequential(GEGLU(dim, inner_dim), nn.Dropout(0.0), nn.Linear(inner_dim, dim))
+
+    def forward(self, x):
+        return self.net(x)
+
+
+class BasicTransformerBlock(nn.Module):
+    """One pre-norm attention block: self-attn, cross-attn, GEGLU feed-forward."""
+
+    def __init__(self, dim, num_heads, head_dim, context_dim=CONTEXT_DIM):
+        super().__init__()
+        self.norm1 = nn.LayerNorm(dim, eps=1e-5)
+        self.attn1 = Attention(dim, num_heads, head_dim)
+        self.norm2 = nn.LayerNorm(dim, eps=1e-5)
+        self.attn2 = Attention(dim, num_heads, head_dim, context_dim=context_dim)
+        self.norm3 = nn.LayerNorm(dim, eps=1e-5)
+        self.ff = FeedForward(dim, inner_dim=4 * dim)
+
+    def forward(self, x, context):
+        x = x + self.attn1(self.norm1(x))
+        x = x + self.attn2(self.norm2(x), context)
+        x = x + self.ff(self.norm3(x))
+        return x
+
+
+class Transformer2DModel(nn.Module):
+    """diffusers ``Transformer2DModel`` (``use_linear_projection=True``).
+
+    Keys: ``norm`` (GroupNorm), ``proj_in``, ``transformer_blocks.N.*``,
+    ``proj_out``. Operates on a ``[B, C, H, W]`` feature map.
+    """
+
+    def __init__(self, dim, num_heads, num_layers, context_dim=CONTEXT_DIM):
+        super().__init__()
+        head_dim = HEAD_DIM
+        self.norm = nn.GroupNorm(NORM_GROUPS, dim, eps=1e-6)
+        self.proj_in = nn.Linear(dim, dim)
+        self.transformer_blocks = nn.ModuleList(
+            [BasicTransformerBlock(dim, num_heads, head_dim, context_dim) for _ in range(num_layers)]
+        )
+        self.proj_out = nn.Linear(dim, dim)
+
+    def forward(self, x, context):
+        B, C, H, W = x.shape
+        x_in = x
+        h = self.norm(x)
+        h = self.proj_in(h.permute(0, 2, 3, 1)).permute(0, 3, 1, 2)  # [B,C,H,W]
+        h = h.permute(0, 2, 3, 1).reshape(B, H * W, C)
+        for block in self.transformer_blocks:
+            h = block(h, context)
+        h = self.proj_out(h)
+        h = h.reshape(B, H, W, C).permute(0, 3, 1, 2)
+        return h + x_in
+
+
+class Downsample(nn.Module):
+    """Strided conv downsampler. Key: ``op`` (Conv2d 3x3, stride 2)."""
+
+    def __init__(self, channels):
+        super().__init__()
+        # SDXL uses symmetric ``padding=1`` on the stride-2 conv (ComfyUI's
+        # ``Downsample``), not the LDM ``(0, 1, 0, 1)`` manual pad. The manual
+        # asymmetric pad produced a ~5% different latent and degraded images.
+        self.op = nn.Conv2d(channels, channels, 3, stride=2, padding=1)
+
+    def forward(self, x):
+        return self.op(x)
+
+
+class Upsample(nn.Module):
+    """Nearest upsample + conv. Key: ``conv`` (Conv2d 3x3)."""
+
+    def __init__(self, channels):
+        super().__init__()
+        self.conv = nn.Conv2d(channels, channels, 3, padding=1)
+
+    def forward(self, x):
+        x = F.interpolate(x, scale_factor=2, mode="nearest")
+        return self.conv(x)
+
+
+class IllustriousUNet(nn.Module):
+    """The Illustrious SDXL UNet (LDM ``UNetModel`` layout).
+
+    Args:
+        in_channels: latent channels (4).
+        out_channels: 4.
+        context_dim: 2048.
+        adm_in_channels: 2816 (pooled text 1280 + size embedding 1536).
+    """
+
+    def __init__(
+        self,
+        in_channels=4,
+        out_channels=4,
+        context_dim=CONTEXT_DIM,
+        adm_in_channels=2816,
+    ):
+        super().__init__()
+        self.in_channels = in_channels
+        self.out_channels = out_channels
+        self.adm_in_channels = adm_in_channels
+
+        ch = MODEL_CHANNELS          # 320
+        ch2 = MODEL_CHANNELS * 2     # 640
+        ch4 = MODEL_CHANNELS * 4     # 1280
+        td = TIME_EMBED_DIM          # 1280
+
+        # time_embed / label_emb. ``label_emb`` is doubly-nested (keys
+        # ``label_emb.0.0`` / ``label_emb.0.2``) matching the checkpoint.
+        self.time_embed = nn.Sequential(
+            nn.Linear(ch, td), nn.SiLU(), nn.Linear(td, td)
+        )
+        self.label_emb = nn.Sequential(
+            nn.Sequential(nn.Linear(adm_in_channels, td), nn.SiLU(), nn.Linear(td, td))
+        )
+
+        # ----------------------------------------------------- input blocks
+        # 0: conv_in 4->320 ; 1,2: resnet 320 (no attention)
+        # 3: downsample 320 ; 4,5: resnet 640 + transformer x2
+        # 6: downsample 640 ; 7,8: resnet 1280 + transformer x10
+        self.input_blocks = nn.ModuleList(
+            [
+                nn.Sequential(nn.Conv2d(in_channels, ch, 3, padding=1)),
+                nn.Sequential(ResnetBlock2D(ch, ch)),
+                nn.Sequential(ResnetBlock2D(ch, ch)),
+                nn.Sequential(Downsample(ch)),
+                nn.Sequential(
+                    ResnetBlock2D(ch, ch2), Transformer2DModel(ch2, num_heads=10, num_layers=2)
+                ),
+                nn.Sequential(
+                    ResnetBlock2D(ch2, ch2), Transformer2DModel(ch2, num_heads=10, num_layers=2)
+                ),
+                nn.Sequential(Downsample(ch2)),
+                nn.Sequential(
+                    ResnetBlock2D(ch2, ch4), Transformer2DModel(ch4, num_heads=20, num_layers=10)
+                ),
+                nn.Sequential(
+                    ResnetBlock2D(ch4, ch4), Transformer2DModel(ch4, num_heads=20, num_layers=10)
+                ),
+            ]
+        )
+
+        # ----------------------------------------------------- middle block
+        self.middle_block = nn.Sequential(
+            ResnetBlock2D(ch4, ch4),
+            Transformer2DModel(ch4, num_heads=20, num_layers=10),
+            ResnetBlock2D(ch4, ch4),
+        )
+
+        # ---------------------------------------------------- output blocks
+        # Each output resnet consumes ``cat(h, skip)``; in-channels follow the
+        # skip pairing (hs: [320,320,320,320,640,640,640,1280,1280]):
+        #   0,1: 2560 -> 1280 + transformer x10
+        #   2:   1920 -> 1280 + transformer x10 + upsample
+        #   3:   1920 -> 640 + transformer x2
+        #   4:   1280 -> 640 + transformer x2
+        #   5:   960  -> 640 + transformer x2 + upsample
+        #   6:   960  -> 320 ; 7,8: 640 -> 320 (no attention)
+        self.output_blocks = nn.ModuleList(
+            [
+                nn.Sequential(
+                    ResnetBlock2D(2 * ch4, ch4), Transformer2DModel(ch4, num_heads=20, num_layers=10)
+                ),
+                nn.Sequential(
+                    ResnetBlock2D(2 * ch4, ch4), Transformer2DModel(ch4, num_heads=20, num_layers=10)
+                ),
+                nn.Sequential(
+                    ResnetBlock2D(ch4 + ch2, ch4),
+                    Transformer2DModel(ch4, num_heads=20, num_layers=10),
+                    Upsample(ch4),
+                ),
+                nn.Sequential(
+                    ResnetBlock2D(ch4 + ch2, ch2), Transformer2DModel(ch2, num_heads=10, num_layers=2)
+                ),
+                nn.Sequential(
+                    ResnetBlock2D(2 * ch2, ch2), Transformer2DModel(ch2, num_heads=10, num_layers=2)
+                ),
+                nn.Sequential(
+                    ResnetBlock2D(ch2 + ch, ch2),
+                    Transformer2DModel(ch2, num_heads=10, num_layers=2),
+                    Upsample(ch2),
+                ),
+                nn.Sequential(ResnetBlock2D(ch2 + ch, ch)),
+                nn.Sequential(ResnetBlock2D(2 * ch, ch)),
+                nn.Sequential(ResnetBlock2D(2 * ch, ch)),
+            ]
+        )
+
+        # --------------------------------------------------------- head
+        self.out = nn.Sequential(
+            nn.GroupNorm(NORM_GROUPS, ch, eps=1e-5),
+            nn.SiLU(),
+            nn.Conv2d(ch, out_channels, 3, padding=1),
+        )
+
+    # ------------------------------------------------------------ helpers
+    def _run_seq(self, seq, x, emb, context):
+        for m in seq:
+            if isinstance(m, ResnetBlock2D):
+                x = m(x, emb)
+            elif isinstance(m, Transformer2DModel):
+                x = m(x, context)
+            else:
+                x = m(x)
+        return x
+
+    # ------------------------------------------------------------ forward
+    @torch.compile
+    def forward(self, x, t, y, context):
+        """Denoise one step.
+
+        Args:
+            x: latent ``[B, 4, H, W]`` (scaled by the scheduler's init sigma).
+            t: discrete timestep indices ``[B]`` in [0, 1000).
+            y: ADM vector ``[B, 2816]`` (pooled text + size embedding).
+            context: cross-attention text ``[B, 77, 2048]``.
+
+        Returns:
+            the predicted noise ``[B, 4, H, W]`` (epsilon prediction).
+        """
+        t_emb = timestep_embedding(t, MODEL_CHANNELS).to(x.dtype)
+        emb = self.time_embed(t_emb)
+        emb = emb + self.label_emb(y)
+
+        h = x
+        hs = []
+        for block in self.input_blocks:
+            h = self._run_seq(block, h, emb, context)
+            hs.append(h)
+
+        h = self._run_seq(self.middle_block, h, emb, context)
+
+        for block in self.output_blocks:
+            skip = hs.pop()
+            h = torch.cat([h, skip], dim=1)
+            h = self._run_seq(block, h, emb, context)
+
+        return self.out(h)

```

---

## Assistant (Build · strix.Qwen3.8-27B · 41.3s)

_Thinking:_

Now let me understand the base model and samplers to check for integration correctness. Let me read base.py and the samplers base/euler, and the config.


Now let me read the base model, samplers, and config for integration context.



**Tool: read**

**Input:**
```json
{
  "filePath": "/home/ckuethe/llm/git_repos/thenoise/thenoise/models/base.py"
}
```

**Output:**
```
<path>/home/ckuethe/llm/git_repos/thenoise/thenoise/models/base.py</path>
<type>file</type>
<content>
1: """Abstract interface for a diffusion model adapter.
2: 
3: The base class concerns itself ONLY with actual generation, finishing at the
4: final VAE decode step. It owns the model kernels and the load/switch logic that
5: is inseparable from the model's own weights (the DiT, VAE, text encoder, and
6: LoRAs). All *pipeline orchestration* — encode -> denoise -> decode -> postprocess
7: -> PIL, the inference lock, the stage cache, upscale planning, pixel-domain
8: upscaling, PNG metadata — lives in ``thenoise.pipeline.PipelineController``.
9: Pixel-domain upscaling (a pixel-space / postprocessing concern that needs no
10: model) lives in ``thenoise.upscale.pixel.PixelUpscalerManager``.
11: 
12: Subclasses implement the model-specific kernels and load their own VAE:
13: 
14:   * ``detect(f)``            — recognize this model's DiT from a safetensors handle.
15:   * ``encode_prompt(...)``   — text -> conditioning embeddings (cond + null).
16:   * ``init_latents(params)`` — seeded noise in the canonical 4D latent format.
17:   * ``prepare_latent(...)``  — canonical -> model-internal latent (once, pre-loop).
18:   * ``schedule(params)``     — the model's timestep/step-size schedule.
19:   * ``denoise_step(...)``    — one DiT forward + CFG, returning a velocity.
20:   * ``finalize_latent(...)`` — model-internal -> canonical latent (once, post-loop).
21:   * ``resolve_size(...)``    — per-model size rounding / validation.
22:   * ``decode(...)``          — canonical latent -> pixels (the generation end).
23:   * ``_upscale_format(...)``  — required: the latent-format name for this
24:     model's VAE (selected by ``load_latent_upscaler``).
25: 
26: Both models use the same Qwen-Image VAE (z_dim=16, spatial compression 8), so
27: ``init_latents`` produces and ``finalize_latent`` returns the canonical latent
28: format ``[B, C, H, W]`` (4D). The VAE's ``decode_to_pixels`` accepts that
29: directly (the VAE is 2D / single-frame; it no longer adds a frame axis).
30: Model-internal reshaping (e.g.
31: Anima's frame axis, Krea2's patchify) lives in ``prepare_latent``/``finalize_latent``
32: and runs ONCE around the loop, so the per-step ``denoise_step`` never re-converts
33: the latent.
34: 
35: The denoise loop itself (building the latent/schedule and dispatching to a solver
36: sampler) is orchestrated by the controller via ``thenoise.samplers``; each sampler
37: calls ``denoise_step`` exactly once per schedule step.
38: 
39: LoRA switching
40: ---------------
41: LoRAs are applied per-request via ``switch_loras()`` and are a model concern
42: (they mutate the DiT's parameters). The base model is loaded without any LoRA
43: baked in. At request time, the requested LoRA(s) are loaded from disk and their
44: deltas are added to the model's parameters. When the next request asks for
45: different LoRAs, the old deltas are subtracted (undo) before applying the new
46: ones. This avoids reloading the entire model from disk.
47: """
48: from __future__ import annotations
49: 
50: import logging
51: from abc import ABC, abstractmethod
52: from dataclasses import dataclass
53: from typing import Dict, List, Optional, Tuple
54: 
55: import torch
56: from safetensors.torch import load_file
57: 
58: from thenoise.models.config import ModelConfig, SamplingParams
59: from thenoise.samplers import Step
60: from thenoise.upscale import load_latent_upscaler
61: from thenoise.utils.model_dir import (
62:     ensure_safetensors,
63:     resolve_in_dir,
64:     list_safetensors,
65: )
66: from thenoise.utils.lora import apply_lora_to_model, undo_lora_on_model
67: from thenoise.utils.lora import LoRAApplyResult
68: from thenoise.utils.safetensors import WRAP_PREFIXES
69: 
70: logger = logging.getLogger(__name__)
71: 
72: 
73: @dataclass
74: class Conditioning:
75:     """Bundle of (un)conditional embeddings produced by ``encode_prompt``.
76: 
77:     ``null``/``null_mask`` are ``None`` when guidance is off (CFG disabled), so
78:     ``denoise_step`` can skip the unconditional forward.
79:     """
80: 
81:     cond: torch.Tensor
82:     cond_mask: Optional[torch.Tensor] = None
83:     null: Optional[torch.Tensor] = None
84:     null_mask: Optional[torch.Tensor] = None
85:     pooled: Optional[torch.Tensor] = None
86:     neg_pooled: Optional[torch.Tensor] = None
87: 
88: 
89: # Generic wrapper prefixes that repackagings (e.g. ComfyUI's "diffusion_model"
90: # export) prepend to *every* tensor name. Detection must strip these before
91: # matching on an architecture signature, otherwise a repackaged checkpoint is
92: # misidentified. The canonical list lives in ``thenoise.utils.safetensors``
93: # (shared with ``strip_wrap_prefixes`` used at load time) so detection and
94: # loading stay in sync.
95: 
96: 
97: def normalize_keys(keys):
98:     """Yield tensor names with any generic wrapper prefix stripped.
99: 
100:     Repackaged checkpoints often prefix every key with a shared wrapper such as
101:     ``model.diffusion_model.`` (ComfyUI) or ``net.``. Stripping it lets each
102:     ``detect`` match on the model's *own* distinctive key paths regardless of
103:     the wrapper, so raw and repackaged checkpoints resolve identically.
104:     """
105:     for k in keys:
106:         for p in WRAP_PREFIXES:
107:             if k.startswith(p):
108:                 k = k[len(p):]
109:                 break
110:         yield k
111: 
112: 
113: class DiffusionModel(ABC):
114:     """Base class for model adapters. Subclasses must set ``name``."""
115: 
116:     name: str = ""
117: 
118:     DEFAULT_WIDTH = 1024
119:     DEFAULT_HEIGHT = 1024
120:     DEFAULT_STEPS = 28
121:     DEFAULT_GUIDANCE_SCALE = 0.0
122: 
123:     SAMPLER = "er_sde"
124: 
125:     # Canonical latent geometry (shared Qwen-Image VAE).
126:     LATENT_CHANNELS = 16
127:     _VAE_SCALE = 8
128: 
129:     UPSCALE_SCALE = 2
130:     REFINE_STEPS = 1
131:     REFINE_DENOISE = 0.1
132: 
133:     @staticmethod
134:     @abstractmethod
135:     def detect(f) -> bool:
136:         """Return True if the open safetensors handle ``f`` is this model's DiT."""
137: 
138:     def __init__(self, *, config: ModelConfig):
139:         self.device = config.device
140:         self.dtype = config.dtype
141:         self.dit_path = config.dit_path
142:         self.vae_path = config.vae_path
143:         self.text_encoder_path = config.text_encoder_path
144:         self.lora_dir = config.lora_dir
145: 
146:         torch._dynamo.config.recompile_limit = 64
147: 
148:         # LoRA state: cached LoRA state dicts for clean switching.
149:         # Stores small rank-reduced factors instead of full-sized delta tensors.
150:         self._active_lora_result: Optional[LoRAApplyResult] = None
151:         self._active_lora_spec: Optional[str] = None
152: 
153:         # Lazy latent upscaler (only loaded if upscale is requested).
154:         # ``_upscale_format`` supplies the latent-format name matching the VAE.
155:         self._upscaler = None
156:         self._adaptor = None
157: 
158:     # ------------------------------------------------------------------ hooks
159:     @abstractmethod
160:     def encode_prompt(
161:         self,
162:         prompt: str,
163:         negative_prompt: str = "",
164:         *,
165:         guidance_scale: float,
166:     ) -> Conditioning:
167:         """Tokenize + encode prompt (and negative) into conditioning."""
168: 
169:     @abstractmethod
170:     def init_latents(self, params: SamplingParams) -> torch.Tensor:
171:         """Seed the canonical 4D latent ``[B, C, H//8, W//8]``."""
172: 
173:     def prepare_latent(
174:         self,
175:         latents: torch.Tensor,
176:         cond: Conditioning,
177:         params: SamplingParams,
178:     ) -> torch.Tensor:
179:         """Canonical -> model-internal latent. Runs ONCE before the loop.
180: 
181:         Override for reshaping (e.g. Krea2 patchify, Anima frame axis); default
182:         is the identity (canonical == internal).
183:         """
184:         return latents
185: 
186:     @abstractmethod
187:     def schedule(self, params: SamplingParams) -> list[Step]:
188:         """Build the model's denoising schedule (one ``Step`` per iteration)."""
189: 
190:     @abstractmethod
191:     def denoise_step(
192:         self,
193:         latents: torch.Tensor,
194:         t: torch.Tensor,
195:         cond: Conditioning,
196:         guidance_scale: float,
197:         i: int,
198:     ) -> torch.Tensor:
199:         """One DiT forward (+ CFG) returning the velocity in internal form."""
200: 
201:     def finalize_latent(
202:         self,
203:         latents: torch.Tensor,
204:         params: SamplingParams,
205:     ) -> torch.Tensor:
206:         """Model-internal -> canonical 4D latent. Runs ONCE after the loop.
207: 
208:         Override to invert ``prepare_latent``; default is the identity.
209:         """
210:         return latents
211: 
212:     def resolve_size(self, width: int, height: int) -> tuple[int, int]:
213:         """Return the effective (width, height). Override to round/validate."""
214:         return width, height
215: 
216:     def percent_to_sigma(self, percent: float) -> float:
217:         """Map a percent (0..1) to a sigma, used by the sampler's SNR offset.
218: 
219:         The ER-SDE solver needs ``sigma`` just below 1 (its ``sigma/(1-sigma)``
220:         blows up at exactly 1). Flow models override this with their shift
221:         the default is a linear fallback."""
222:         return 1.0 - percent
223: 
224:     # --------------------------------------------------------------- LoRA
225:     def _parse_lora_spec(self, spec: str) -> Tuple[str, float]:
226:         """Parse a 'filename:weight' spec into (filename, weight).
227: 
228:         Auto-appends .safetensors
229:         """
230:         if ":" in spec:
231:             filename, weight_str = spec.rsplit(":", 1)
232:             weight = float(weight_str)
233:         else:
234:             filename = spec
235:             weight = 1.0
236: 
237:         filename = ensure_safetensors(filename)
238: 
239:         return filename, weight
240: 
241:     def _resolve_lora_path(self, filename: str) -> str:
242:         """Resolve a LoRA filename to an absolute path, guarded against traversal.
243: 
244:         Subdirectories are allowed, but .. components that would escape lora_dir
245:         raise ValueError. Shared path logic lives in ``utils.model_dir``.
246:         """
247:         return resolve_in_dir(self.lora_dir, filename)
248: 
249:     def _get_lora_sd(self, filename: str) -> Dict[str, torch.Tensor]:
250:         """Load a LoRA state dict from disk."""
251:         filepath = self._resolve_lora_path(filename)
252: 
253:         logger.info("Loading LoRA: %s", filepath)
254:         return load_file(filepath, device=self.device)
255: 
256:     def _make_lora_spec_hash(self, lora_specs: Optional[List[str]]) -> str:
257:         """Create a hash string for the current LoRA configuration."""
258:         if not lora_specs:
259:             return "__none__"
260:         return "|".join(sorted(lora_specs))
261: 
262:     def switch_loras(
263:         self,
264:         lora_specs: Optional[List[str]],
265:         dit: torch.nn.Module,
266:     ) -> None:
267:         """Switch active LoRAs on the DiT module (in-place, under the lock).
268: 
269:         Args:
270:             lora_specs: list of "filename:weight" strings, or None for base model.
271:             dit: the DiT model module whose parameters will be modified.
272: 
273:         Skips the switch if the requested config matches the current one.
274:         """
275:         new_spec = self._make_lora_spec_hash(lora_specs)
276:         if new_spec == self._active_lora_spec:
277:             return  # no-op: same LoRA config
278: 
279:         # Undo any currently active LoRA
280:         if self._active_lora_result is not None:
281:             logger.debug("Undoing previous LoRA config")
282:             undo_lora_on_model(dit, self._active_lora_result, torch.device(self.device))
283:             self._active_lora_result = None
284: 
285:         # Apply new LoRAs
286:         if lora_specs and self.lora_dir is not None:
287:             lora_sds = []
288:             multipliers = []
289:             for spec in lora_specs:
290:                 filename, weight = self._parse_lora_spec(spec)
291:                 lora_sds.append(self._get_lora_sd(filename))
292:                 multipliers.append(weight)
293: 
294:             self._active_lora_result = apply_lora_to_model(
295:                 dit, lora_sds, multipliers, torch.device(self.device)
296:             )
297:             active_names = ", ".join(
298:                 self._parse_lora_spec(s)[0] for s in lora_specs
299:             )
300:             logger.info("Applied LoRA(s): %s", active_names)
301:         else:
302:             logger.debug("Using base model (no LoRA)")
303: 
304:         self._active_lora_spec = new_spec
305: 
306:     def list_loras(self) -> List[str]:
307:         """List available LoRA names relative to lora_dir.
308: 
309:         Names are relative paths with the .safetensors suffix stripped (e.g.
310:         "12345_something" or "sub/style"), so they can be used directly as
311:         lora_specs (which auto-appends the suffix). Shared listing logic lives
312:         in ``utils.model_dir``.
313:         """
314:         return list_safetensors(self.lora_dir)
315: 
316:     # ------------------------------------------------------- latent upscaler
317:     @abstractmethod
318:     def _upscale_format(self) -> str:
319:         """Return the latent-format name matching this model's VAE.
320: 
321:         Concrete subclasses must override this to return the name of their VAE's
322:         latent format (e.g. ``"wan21"`` for the shared Qwen-Image VAE). It is
323:         passed to ``load_latent_upscaler``, which selects the adaptor and weight file.
324:         """
325:         ...
326: 
327:     def load_latent_upscaler(self):
328:         """Load the latent upscaler (once, lazily, under the lock)."""
329:         if self._upscaler is None:
330:             self._upscaler, self._adaptor = load_latent_upscaler(
331:                 self._upscale_format(),
332:                 device=self.device,
333:                 dtype=self.dtype,
334:             )
335:         return self._upscaler, self._adaptor
336: 
337:     # ------------------------------------------------------------ decode
338:     def decode(self, latents: torch.Tensor) -> torch.Tensor:
339:         """Shared VAE decode — the final generation step.
340: 
341:         Accepts the canonical 4D latent ``[B, C, H, W]`` (the VAE is 2D /
342:         single-frame) and returns pixels ``[C, H, W]`` in [-1, 1] as an fp32
343:         GPU tensor, ready for the controller's postprocessing.
344:         """
345:         dev = torch.device(self.device)
346:         with torch.no_grad():
347:             pixels = self.vae.decode_to_pixels(latents.to(dev, dtype=self.vae.dtype))
348:         if pixels.ndim == 5:  # [B, C, 1, H, W] -> [B, C, H, W]
349:             pixels = pixels.squeeze(2)
350:         pixels = pixels.to(torch.float32)
351:         return pixels[0]  # [C, H, W] in [-1, 1]
352: 
353: 
354: # Imported lazily to avoid a cycle: samplers import Conditioning/DiffusionModel.
355: 
356: __all__ = ["DiffusionModel", "Conditioning", "normalize_keys"]

(End of file - total 356 lines)
</content>
```

---

## Assistant (Build · strix.Qwen3.8-27B · 37.6s)

_Thinking:_

Now let me check the euler sampler to understand how denoise_step output is used.


**Tool: read**

**Input:**
```json
{
  "filePath": "/home/ckuethe/llm/git_repos/thenoise/thenoise/samplers/euler.py"
}
```

**Output:**
```
<path>/home/ckuethe/llm/git_repos/thenoise/thenoise/samplers/euler.py</path>
<type>file</type>
<content>
1: """Euler sampler: first-order integration of a flow ODE with CFG."""
2: from __future__ import annotations
3: 
4: from typing import List
5: 
6: import torch
7: from tqdm import tqdm
8: 
9: from .base import Sampler, Step
10: 
11: 
12: class EulerSampler(Sampler):
13:     """Euler integration of the flow ODE with CFG.
14: 
15:     ``x <- x - delta * velocity``, one ``denoise_step`` per schedule step. Integration
16:     runs in fp32 (precise, cheap) and is cast back to the latent dtype each step.
17:     """
18: 
19:     def sample(
20:         self,
21:         x: torch.Tensor,
22:         schedule: List[Step],
23:         cond,
24:         guidance_scale: float,
25:         seed: int,
26:         desc: str = "sampling",
27:     ) -> torch.Tensor:
28:         dtype = x.dtype
29:         for i, step in tqdm(enumerate(schedule), total=len(schedule), desc=desc):
30:             v = self.model.denoise_step(x, step.t, cond, guidance_scale, i)
31:             x = x.float() - step.delta * v.float()
32:             x = x.to(dtype)
33:             # Synchronize to get accurate timing
34:             torch.cuda.synchronize()
35:         return x

(End of file - total 35 lines)
</content>
```

---

## Assistant (Build · strix.Qwen3.8-27B · 109.0s)

_Thinking:_

The euler sampler: x = x - delta * velocity. delta = sigma[i] - sigma[i+1]. The model returns eps. Initial latent scaled by sigma_max.

Wait, let me think about the discrete euler/DDIM. The standard discrete euler for eps-prediction:
- x_t = sigma_t * x_0 + ... actually x_t = sqrt(alpha_t) x_0 + sqrt(1-alpha_t) eps.
- In "sigma space" (where x = sigma * eps + x0-ish)... Actually ComfyUI's flow euler uses x_{t+1} = x_t + (sigma_{t+1} - sigma_t) * d, where for the "eps" model d = (model_output - x_t)/sigma_t... Hmm.

Actually the standard DDPM-to-DDIM euler: define x_t in the "noised" representation. ComfyUI's model_sampling_discrete_eps: model_output = eps. The euler step uses:
x = x + (sigma_next - sigma) * (model_output - x) / ... no.

Actually ComfyUI flow euler for eps model: it converts. Let me recall. ComfyUI's `FlowEuler` sampler works on the "latent" x where the model predicts velocity. For the eps model, ComfyUI wraps it so that the model output is treated as velocity: v = (eps - x)/sigma... Hmm, actually there is `model_sampling` that computes. Let me think about the sigma convention here.

Actually the code comment says "the model output (eps) IS the velocity; the sampler integrates x -= delta * eps". Let me verify this is actually correct math.

Let's set up. Discrete schedule. We have x_t in the "scaled" latent space. Define: the true relationship. alphas_cumprod = abar_t. sigma_t = sqrt((1-abar_t)/abar_t). So abar_t = 1/(1+sigma_t^2). The noise: x_t = sqrt(abar_t) x_0 + sqrt(1-abar_t) eps = x_0/sqrt(1+sigma_t^2) + sigma_t*eps/sqrt(1+sigma_t^2).

Hmm, this is getting complicated. But the task says "the code works and does the right things, so you don't need to compare it to comfyui". So I shouldn't spend too much effort verifying the math is correct — the user confirmed it produces correct images. My job is to review for bugs, structure, docs.

But I should still flag obvious logical issues. Let me focus on the actual code for bugs.

Let me note issues I've spotted:

**1. `denoise_step` scaling inconsistency / the `scaled` latent.** In `prepare_latent`, latents are scaled by `sigmas[0]` (sigma_max). Then in `denoise_step`, `scaled = latents / sqrt(sigma^2 + 1)`. At step 0, t = highest timestep (999), sigma = sigma_max. So scaled = (noise * sigma_max) / sqrt(sigma_max^2 + 1). 

Hmm, that's the ComfyUI EPS calculate_input: input = x / sqrt(sigma^2+1). But wait — ComfyUI's discrete eps: the model's input is the "noisy latent" in the sigma representation. Let me not overthink; user says it works.

Actually wait — there's a subtle thing. The euler sampler does `x = x - delta * v` where v = eps (model output). But the model output was computed from `scaled = x / sqrt(sigma^2+1)`. So the model output is in the "unscaled" eps. And we subtract delta*eps from x (which is in sigma-space). This is the standard discrete euler: x_{t+1} = x_t - (sigma_t - sigma_{t+1}) * eps_pred. Actually that's exactly the DDIM/continuous interpretation where x_t = sqrt(abar_t) x_0 + sqrt(1-abar_t) eps and dx/dsigma... I'll trust it works.

**2. Potential real bug: `denoise_step` uses `self._y` and `self._y_uncond` which are set in `prepare_latent`.** These are instance attributes. If the sampler calls denoise_step and the model is shared... but it's single-model, sequential under lock. However, there's a subtle issue: `prepare_latent` is called once before the loop. But what if `guidance_scale <= 1.0`? Then `cond.null` is None, `self._y_uncond` = None. In denoise_step, the CFG branch checks `guidance_scale > 1.0 and self._y_uncond is not None and cond.null is not None`. Fine.

**3. `encode_prompt` when guidance_scale <= 1.0**: returns `null=None, neg_pooled=None`. But `pooled` is always set. Good. prepare_latent: `if cond.null is not None and cond.neg_pooled is not None` → sets _y_uncond, else None. Good.

**4. `init_latents` shape order**: `(1, in_channels, height//8, width//8)`. But wait, thenoise convention — let me check other models' init_latents to see if they use [B, C, H, W] where H=height. Let me check krea2/zimage.

Actually the base docstring says canonical `[B, C, H//8, W//8]`. So height maps to H dim. That's consistent.

But `resolve_size` returns `round_up(width,8), round_up(height,8)` as (width, height). And init_latents uses params.height and params.width. Let me verify params has width/height and how resolve_size result maps. Let me check config and how pipeline calls resolve_size.

Let me check the config.py and the pipeline to see how width/height flow, and whether resolve_size order matches.


**Tool: read**

**Input:**
```json
{
  "filePath": "/home/ckuethe/llm/git_repos/thenoise/thenoise/models/config.py"
}
```

**Output:**
```
<path>/home/ckuethe/llm/git_repos/thenoise/thenoise/models/config.py</path>
<type>file</type>
<content>
1: """Configuration dataclasses that wrap related generation fields.
2: 
3: These exist so that adding a new option never changes a method signature — new
4: fields are added to the relevant struct instead. There are three groups:
5: 
6: * ``ModelConfig``   — static load-time config for a ``DiffusionModel``.
7: * ``GenerateRequest`` — the complete user-facing generation request (the
8:   API/CLI surface).
9: * ``SamplingParams`` — the denoise-stage geometry + knobs passed to the model
10:   kernels (``init_latents``, ``prepare_latent``, ``schedule``,
11:   ``finalize_latent``) and to the controller's denoise/refine helpers.
12: """
13: from __future__ import annotations
14: 
15: import torch
16: from dataclasses import dataclass
17: from typing import List, Optional
18: 
19: 
20: @dataclass
21: class ModelConfig:
22:     """Static load-time configuration for a model.
23: 
24:     Deliberately model-bound: every field is needed to load the model's own
25:     weights. Pixel-upscaler configuration is NOT a model concern and lives on
26:     the server settings instead (it operates in pixel space, needs no model).
27:     """
28: 
29:     dit_path: str
30:     vae_path: str
31:     text_encoder_path: str
32:     device: str = "cuda"
33:     dtype: torch.dtype = torch.bfloat16
34:     lora_dir: Optional[str] = None  # LoRAs mutate the DiT weights -> model concern
35: 
36: 
37: @dataclass
38: class GenerateRequest:
39:     """The complete user-facing generation request.
40: 
41:     Mirrors the fields exposed by the HTTP API and CLI. Add new options here
42:     rather than to ``PipelineController.generate``'s signature.
43:     """
44: 
45:     prompt: str
46:     negative_prompt: str = ""
47:     width: Optional[int] = None
48:     height: Optional[int] = None
49:     steps: Optional[int] = None
50:     guidance_scale: Optional[float] = None
51:     seed: Optional[int] = None
52:     upscale: bool = False
53:     upscale_factor: float = 1.0
54:     upscale_type: str = "refined"
55:     sampler: Optional[str] = None
56:     qwen_vae_enhance: bool = False
57:     film_grain: float = 0.0
58:     sharpening: float = 0.0
59:     lora_specs: Optional[List[str]] = None
60:     pixel_upscaler: Optional[str] = None
61: 
62: 
63: @dataclass(frozen=True)
64: class SamplingParams:
65:     """Denoise-stage geometry + knobs passed to the model kernels.
66: 
67:     ``seed`` is only consumed by ``init_latents``; the other kernels ignore the
68:     fields they do not need. Kept in one frozen struct so the kernel signatures
69:     stay stable as options are added.
70:     """
71: 
72:     height: int
73:     width: int
74:     steps: int
75:     seed: int
76:     guidance_scale: float
77:     sampler: str
78: 
79: 
80: __all__ = ["ModelConfig", "GenerateRequest", "SamplingParams"]

(End of file - total 80 lines)
</content>
```

---

## Assistant (Build · strix.Qwen3.8-27B · 13.9s)

_Thinking:_

Let me check how resolve_size is called in the pipeline to confirm the (width, height) order, and how width/height map to SamplingParams.


**Tool: bash**

**Input:**
```json
{
  "command": "grep -rn \"resolve_size\\|prepare_latent\\|init_latents\\|SamplingParams(\" thenoise/pipeline/ 2>/dev/null; echo \"---\"; ls thenoise/"
}
```

**Output:**
```
---
__init__.py
__main__.py
__pycache__
api.py
cli.py
dit
generate.py
models
pipeline.py
postprocess
runtime.py
samplers
ui
upscale
utils
vae

```

---

## Assistant (Build · strix.Qwen3.8-27B · 8.2s)

_Thinking:_

AGENTS.md says layout is `thenoise/` but this is actually `thenoise/` — wait, the working dir is `thenoise` and there's a `thenoise/` subpackage. Let me check pipeline.py.


**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"resolve_size\\|prepare_latent\\|init_latents\\|SamplingParams\\|create_sampler\\|SAMPLER\\b\\|\\.sampler\" thenoise/pipeline.py"
}
```

**Output:**
```
67:from thenoise.models.config import GenerateRequest, SamplingParams
68:from thenoise.samplers import create_sampler
69:from thenoise.samplers.euler import EulerSampler
207:        width, height = model.resolve_size(width, height)
217:        effective_sampler = request.sampler or model.SAMPLER
248:            params = SamplingParams(
320:        params: SamplingParams,
329:        solver = create_sampler(params.sampler, model)
331:        latents = model.init_latents(params)
332:        x = model.prepare_latent(latents, cond, params)
418:        params: SamplingParams,
453:        params: SamplingParams,
472:        x = model.prepare_latent(noised, cond, refine_params)

```

---

## Assistant (Build · strix.Qwen3.8-27B · 13.3s)

_Thinking:_

Let me look at how `resolve_size` output maps to SamplingParams and where width/height appear. Also let me check the refine path (line 453-472) and how `params.sampler` is set — note line 217 sets `effective_sampler` but does it get passed to SamplingParams as `sampler`? Let me read pipeline around 200-340.


**Tool: read**

**Input:**
```json
{
  "filePath": "/home/ckuethe/llm/git_repos/thenoise/thenoise/pipeline.py",
  "limit": 140,
  "offset": 200
}
```

**Output:**
```
<path>/home/ckuethe/llm/git_repos/thenoise/thenoise/pipeline.py</path>
<type>file</type>
<content>
200:             pixel_upscaler = self._pixel_upscalers.validate(pixel_upscaler)
201:         upscale_factor = request.upscale_factor
202:         if request.upscale and upscale_factor == 1.0:
203:             upscale_factor = float(model.UPSCALE_SCALE)
204:         factor, upscale_type = self._resolve_upscale(
205:             upscale_factor, request.upscale_type, pixel_upscaler
206:         )
207:         width, height = model.resolve_size(width, height)
208:         target_width = width
209:         target_height = height
210:         if factor != 1.0:
211:             target_width = round(width * factor)
212:             target_height = round(height * factor)
213:         refined = upscale_type == "refined" and factor > 1.0
214:         pixel_scale = self._pixel_upscaler_scale_for(
215:             factor, upscale_type, pixel_upscaler
216:         )
217:         effective_sampler = request.sampler or model.SAMPLER
218: 
219:         # seed=-1 is treated as "random" (same as None)
220:         seed = request.seed
221:         if seed is None or seed == -1:
222:             seed = random.randint(0, 2**32 - 1)
223: 
224:         # --- compute cache keys (pure data, no model access) ---
225:         prompt_key = self._cache_key_prompt(
226:             request.prompt, request.negative_prompt, guidance_scale,
227:             request.lora_specs,
228:         )
229:         sampling_key = self._cache_key_sampling(
230:             prompt_key, width, height, steps, seed, effective_sampler
231:         )
232:         decode_key = self._cache_key_decode(sampling_key, refined)
233: 
234:         # --- locked section: cache checks + model access ---
235:         with self._lock:
236:             model.switch_loras(request.lora_specs, model.dit)
237: 
238:             # Stage 1: prompt conditioning
239:             if self._cache.prompt_hit(prompt_key):
240:                 cond = self._cache.prompt_get()
241:             else:
242:                 cond = model.encode_prompt(
243:                     request.prompt, request.negative_prompt,
244:                     guidance_scale=guidance_scale,
245:                 )
246:                 self._cache.prompt_store(prompt_key, cond)
247: 
248:             params = SamplingParams(
249:                 height=height, width=width, steps=steps, seed=seed,
250:                 guidance_scale=guidance_scale, sampler=effective_sampler,
251:             )
252: 
253:             # Stage 2: sampling (denoise)
254:             if self._cache.sampling_hit(sampling_key):
255:                 latents = self._cache.sampling_get()
256:             else:
257:                 with torch.no_grad():
258:                     latents = self._denoise(cond, params)
259:                 self._cache.sampling_store(sampling_key, latents)
260: 
261:             # Stage 3/4: upscale + decode (interleaved so cache hits skip upscale)
262:             if self._cache.decode_hit(decode_key):
263:                 pixels = self._cache.decode_get()
264:             else:
265:                 # Cache miss — run latent upscale+refine (if refined) then decode
266:                 if refined:
267:                     latents = self._upscale_and_refine(latents, cond, params)
268:                 pixels = model.decode(latents)  # fp32 GPU tensor [C,H,W]
269:                 self._cache.decode_store(decode_key, pixels)
270: 
271:             # Qwen notch filter must run immediately after VAE decode (before any
272:             # pixel-domain upscaling), so the 2px grid pattern is removed at its
273:             # native resolution.
274:             if request.qwen_vae_enhance:
275:                 pixels = nyquist_notch(pixels)
276: 
277:             # Pixel-domain upscaler (fast, not cached) + GPU resize to target size.
278:             pixels = self._pixel_upscalers.apply(
279:                 pixel_upscaler, pixels, pixel_scale
280:             )
281:             pixels = self._resize_to_target(pixels, target_width, target_height)
282: 
283:             # Stage 5: postprocess (cheap — not cached)
284:             pixels = self.postprocess(
285:                 pixels,
286:                 film_grain_strength=request.film_grain,
287:                 sharpening=request.sharpening,
288:             )
289:             image = self._to_pil(pixels)
290: 
291:             if (image.width, image.height) != (target_width, target_height):
292:                 image = _center_crop(image, target_width, target_height)
293: 
294:             # Attach PNG metadata
295:             pnginfo = build_pnginfo(
296:                 model=model.name,
297:                 prompt=request.prompt,
298:                 negative_prompt=request.negative_prompt,
299:                 width=width,
300:                 height=height,
301:                 steps=steps,
302:                 guidance_scale=guidance_scale,
303:                 seed=seed,
304:                 upscale=request.upscale,
305:                 upscale_factor=factor,
306:                 upscale_type=upscale_type,
307:                 sampler=effective_sampler,
308:                 qwen_vae_enhance=request.qwen_vae_enhance,
309:                 film_grain=request.film_grain,
310:                 sharpening=request.sharpening,
311:                 lora_specs=request.lora_specs,
312:                 pixel_upscaler=pixel_upscaler,
313:             )
314:             image._pnginfo = pnginfo
315:             return image
316: 
317:     def _denoise(
318:         self,
319:         cond: Conditioning,
320:         params: SamplingParams,
321:     ) -> torch.Tensor:
322:         """Shared denoising pipeline over the model's ``schedule``.
323: 
324:         Builds the latent and schedule, then delegates the loop to the selected
325:         solver sampler (``euler`` or ``er_sde``). Each sampler calls
326:         ``denoise_step`` once per schedule step and runs integration in fp32.
327:         """
328:         model = self.model
329:         solver = create_sampler(params.sampler, model)
330: 
331:         latents = model.init_latents(params)
332:         x = model.prepare_latent(latents, cond, params)
333:         schedule = model.schedule(params)
334:         x = solver.sample(x, schedule, cond, params.guidance_scale, params.seed)
335:         return model.finalize_latent(x, params)
336: 
337:     # ------------------------------------------------------------- upscale plan
338:     def _resolve_upscale(
339:         self,

(Showing lines 200-339 of 519. Use offset=340 to continue.)
</content>
```

---

## Assistant (Build · strix.Qwen3.8-27B · 51.6s)

_Thinking:_

Note at line 230-231, `sampling_key` uses `effective_sampler` (the requested sampler, e.g. "er_sde"), NOT the fallback. So if a user requests `er_sde`, the cache key uses "er_sde", but the actual sampler used is "euler" (fallback). This means the cache key differs from actual behavior — but that's fine, just a cache key, not a bug. Actually it could cause a subtle cache issue: two requests, one with `er_sde` and one with `euler`, would have different cache keys but produce identical results (since er_sde falls back to euler). Not a bug, just suboptimal. Minor.

Now, `create_sampler(params.sampler, model)` — params.sampler = effective_sampler = "er_sde" if requested. Then create_sampler checks SUPPORTED_SAMPLERS fallback -> uses euler. Good.

Now, an important integration concern: **refine/upscale path**. For Illustrious, `_upscale_format` raises NotImplementedError. So if a user requests upscale with a 4-channel model... `load_latent_upscaler` would be called with the format from `_upscale_format()`. But `_upscale_format` raises NotImplementedError. Let me check when load_latent_upscaler is invoked — only in `_upscale_and_refine` when refined. Let me check the refine path to ensure NotImplementedError is a clean error, not a crash mid-way. Actually the docstring for the model says upscale not supported. Let me check `_resolve_upscale` and whether upscale_type could be "refined" for Illustrious. If a user passes `--upscale`, refined=True (if factor>1 and type refined), then `_upscale_and_refine` calls `load_latent_upscaler` -> `_upscale_format()` -> raises NotImplementedError. That's a reasonably clear error. Let me verify _upscale_and_refine.

Let me look at lines 418-490.


**Tool: read**

**Input:**
```json
{
  "filePath": "/home/ckuethe/llm/git_repos/thenoise/thenoise/pipeline.py",
  "limit": 75,
  "offset": 415
}
```

**Output:**
```
<path>/home/ckuethe/llm/git_repos/thenoise/thenoise/pipeline.py</path>
<type>file</type>
<content>
415:         self,
416:         latents: torch.Tensor,
417:         cond: Conditioning,
418:         params: SamplingParams,
419:     ) -> torch.Tensor:
420:         """Upscale the canonical latent ``UPSCALE_SCALE``x in latent space, then
421:         run a short low-strength refine denoise at the new size.
422: 
423:         Sesqui operates on raw VAE latents; the adaptor converts the canonical
424:         latent to/from that raw space. The refined result is the canonical latent
425:         at the upscaled spatial size, ready for ``decode``.
426:         """
427:         model = self.model
428:         upscaler, adaptor = model.load_latent_upscaler()
429:         scale = model.UPSCALE_SCALE
430:         z = latents.to(device=model.device, dtype=model.dtype)
431: 
432:         with torch.no_grad():
433:             # Adaptor math in fp32; the model runs in bf16.
434:             raw = adaptor.to_vae_latent(z).to(model.dtype)
435:             h, w = z.shape[-2:]
436:             raw_up = upscaler(raw, (scale * h, scale * w))
437:             z_up = adaptor.from_vae_latent(raw_up.float()).to(model.dtype)
438: 
439:         # One short low-strength refine denoise at the upscaled size. The refine
440:         # runs on an independent schedule (see ``_refine``), so the original
441:         # ``steps`` count is deliberately NOT forwarded.
442:         up_params = replace(
443:             params,
444:             height=scale * params.height,
445:             width=scale * params.width,
446:         )
447:         return self._refine(z_up, cond, up_params)
448: 
449:     def _refine(
450:         self,
451:         z: torch.Tensor,
452:         cond: Conditioning,
453:         params: SamplingParams,
454:     ) -> torch.Tensor:
455:         """One low-strength refine denoise step on an already-clean latent."""
456:         model = self.model
457:         refine_steps = model.REFINE_STEPS
458:         denoise = model.REFINE_DENOISE
459:         new_steps = int(refine_steps / denoise)  # int(1/0.1) = 10
460: 
461:         # Last ``refine_steps`` steps of an independent ``new_steps`` schedule.
462:         refine_params = replace(params, steps=new_steps)
463:         full = model.schedule(refine_params)
464:         sub = full[-refine_steps:]
465:         strength = float(sub[0].t)  # sigma_hat == the step's timestep
466: 
467:         # ComfyUI CONST noise scaling: x = sigma*noise + (1-sigma)*z.
468:         generator = torch.Generator(device=model.device).manual_seed(params.seed)
469:         noise = torch.randn_like(z, generator=generator)
470:         noised = strength * noise + (1.0 - strength) * z
471: 
472:         x = model.prepare_latent(noised, cond, refine_params)
473:         solver = EulerSampler(model)
474:         x = solver.sample(
475:             x, sub, cond, params.guidance_scale, params.seed, desc="refining"
476:         )
477:         return model.finalize_latent(x, refine_params)
478: 
479:     # ------------------------------------------------------------- pixel stage
480:     @staticmethod
481:     def _resize_to_target(
482:         pixels: torch.Tensor, target_w: int, target_h: int
483:     ) -> torch.Tensor:
484:         """GPU bilinear resize of ``[C, H, W]`` to the target size (no-op if equal)."""
485:         c, h, w = pixels.shape
486:         if (w, h) == (target_w, target_h):
487:             return pixels
488:         with torch.no_grad():
489:             return F.interpolate(

(Showing lines 415-489 of 519. Use offset=490 to continue.)
</content>
```

---

## Assistant (Build · strix.Qwen3.8-27B · 37.8s)

_Thinking:_

Now let me check the `detect` logic. There's an important concern: the `detect` for Illustrious checks for `input_blocks.`, `middle_block.`, `label_emb.`, `time_embed.`. But other SDXL-based models (like vanilla SDXL) would also match these. The commit message says "Didn't test loading checkpoints other than the official one... or any other SDXL based models." So detect would return True for any SDXL model. But the catalog resolution order: `[Krea2Model, AnimaModel, ZImageModel, IllustriousModel]`. Let me check `resolve` to see how it iterates. If Illustrious is last, and it's a broad detector, it might catch non-Illustrious SDXL models. That's a potential concern but the user acknowledges it. Let me check the resolve function and detect of other models to see if there's overlap.

Actually this is a legitimate review point: the detector is broad and would match any SDXL-based UNet (vanilla SDXL, other anime derivatives). If such a model is loaded, it'd be misidentified as Illustrious. But the architecture (transformer_depth) is specific to Illustrious/SDXL. Actually SDXL and Illustrious share the SAME transformer depth [0,0,2,2,10,10], so the UNet architecture is identical! So loading a vanilla SDXL checkpoint would actually work with this UNet since it's the same architecture. So it's fine functionally. Good — not a bug.

Let me check the resolve function.


**Tool: read**

**Input:**
```json
{
  "filePath": "/home/ckuethe/llm/git_repos/thenoise/thenoise/models/__init__.py"
}
```

**Output:**
```
<path>/home/ckuethe/llm/git_repos/thenoise/thenoise/models/__init__.py</path>
<type>file</type>
<content>
1: """Model catalog: the set of registered DiffusionModel classes.
2: 
3: To add a new model, write a ``DiffusionModel`` subclass (with ``name`` and a
4: ``detect(f)`` routine) and append it to ``MODEL_CATALOG``.
5: """
6: from __future__ import annotations
7: 
8: from typing import List, Type
9: 
10: from .base import DiffusionModel
11: from .anima import AnimaModel
12: from .illustrious import IllustriousModel
13: from .krea2 import Krea2Model
14: from .zimage import ZImageModel
15: 
16: MODEL_CATALOG: List[Type[DiffusionModel]] = [Krea2Model, AnimaModel, ZImageModel, IllustriousModel]
17: 
18: 
19: def resolve(dit_path: str) -> Type[DiffusionModel]:
20:     """Determine the model class from a DiT checkpoint.
21: 
22:     Opens the safetensors header ONCE and passes the handle to each registered
23:     class's ``detect()`` until one matches.
24:     """
25:     from safetensors import safe_open
26: 
27:     with safe_open(dit_path, framework="pt") as f:
28:         for cls in MODEL_CATALOG:
29:             if cls.detect(f):
30:                 return cls
31:     names = ", ".join(cls.name for cls in MODEL_CATALOG)
32:     raise ValueError(f"could not determine model type from {dit_path} (known: {names})")
33: 
34: 
35: __all__ = ["MODEL_CATALOG", "DiffusionModel", "resolve"]

(End of file - total 35 lines)
</content>
```

---

## Assistant (Build · strix.Qwen3.8-27B · 9.6s)

_Thinking:_

Now let me look at the other models' detect to understand the pattern and confirm no overlap. Let me check zimage and krea2 detect.


**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"def detect\" -A 15 thenoise/models/zimage.py thenoise/models/krea2.py thenoise/models/anima.py"
}
```

**Output:**
```
thenoise/models/zimage.py:48:    def detect(f) -> bool:
thenoise/models/zimage.py-49-        """True if this handle is the Z-Image S3-DiT.
thenoise/models/zimage.py-50-
thenoise/models/zimage.py-51-        Z-Image's distinctive blocks are the caption embedder (``cap_embedder.``),
thenoise/models/zimage.py-52-        the plain patch embedder (``x_embedder.``) and the context refiner
thenoise/models/zimage.py-53-        (``context_refiner.``). Keys are normalized first so repackaged checkpoints
thenoise/models/zimage.py-54-        (``model.diffusion_model.`` / ``net.``) resolve identically.
thenoise/models/zimage.py-55-        """
thenoise/models/zimage.py-56-        keys = list(normalize_keys(f.keys()))
thenoise/models/zimage.py-57-        has_cap = any(k.startswith("cap_embedder.") for k in keys)
thenoise/models/zimage.py-58-        has_context = any(k.startswith("context_refiner.") for k in keys)
thenoise/models/zimage.py-59-        has_x_embed = any(k.startswith("x_embedder.") for k in keys)
thenoise/models/zimage.py-60-        return has_cap and has_context and has_x_embed
thenoise/models/zimage.py-61-
thenoise/models/zimage.py-62-    def __init__(
thenoise/models/zimage.py-63-        self,
--
thenoise/models/krea2.py:42:    def detect(f) -> bool:
thenoise/models/krea2.py-43-        """True if this handle is the Krea2 (single-stream MMDiT) DiT.
thenoise/models/krea2.py-44-
thenoise/models/krea2.py-45-        Krea2's distinctive blocks are the text-fusion stream (``txtfusion.``)
thenoise/models/krea2.py-46-        and text-MLP stream (``txtmlp.``). Repackaged checkpoints (e.g. ComfyUI
thenoise/models/krea2.py-47-        exports) prefix every key with a generic wrapper such as
thenoise/models/krea2.py-48-        ``model.diffusion_model.``, so keys are normalized first and the match
thenoise/models/krea2.py-49-        is done on the architecture signature, not the raw prefix.
thenoise/models/krea2.py-50-        """
thenoise/models/krea2.py-51-        keys = list(normalize_keys(f.keys()))
thenoise/models/krea2.py-52-        has_txtfusion = any(k.startswith("txtfusion.") for k in keys)
thenoise/models/krea2.py-53-        has_txtmlp = any(k.startswith("txtmlp.") for k in keys)
thenoise/models/krea2.py-54-        return has_txtfusion and has_txtmlp
thenoise/models/krea2.py-55-
thenoise/models/krea2.py-56-    def __init__(
thenoise/models/krea2.py-57-        self,
--
thenoise/models/anima.py:36:    def detect(f) -> bool:
thenoise/models/anima.py-37-        """True if this handle is the Anima DiT.
thenoise/models/anima.py-38-
thenoise/models/anima.py-39-        Anima (Cosmos-Predict2) is uniquely identified by its LLM adapter
thenoise/models/anima.py-40-        (``llm_adapter.``) combined with adaln-modulated transformer blocks
thenoise/models/anima.py-41-        (``adaln_modulation``). We deliberately do NOT match on generic wrapper
thenoise/models/anima.py-42-        prefixes (``net.`` / ``model.diffusion_model.``) or generic attention
thenoise/models/anima.py-43-        names (``cross_attn``/``self_attn``) — those are shared across many
thenoise/models/anima.py-44-        model families and would falsely claim repackaged checkpoints of other
thenoise/models/anima.py-45-        models. Keys are normalized, then matched on Anima's own signature.
thenoise/models/anima.py-46-        """
thenoise/models/anima.py-47-        keys = list(normalize_keys(f.keys()))
thenoise/models/anima.py-48-        has_llm_adapter = any("llm_adapter" in k for k in keys)
thenoise/models/anima.py-49-        has_adaln = any("adaln_modulation" in k for k in keys)
thenoise/models/anima.py-50-        return has_llm_adapter and has_adaln
thenoise/models/anima.py-51-

```

---

## Assistant (Build · strix.Qwen3.8-27B · 140.5s)

_Thinking:_

The detect patterns are all distinct. Illustrious's is the broadest but the others won't overlap. Fine.

Now let me look at other models' `encode_prompt` to compare conventions, particularly whether they set `.to(self.dtype)`, and whether the `pooled`/`neg_pooled` handling in Conditioning is used consistently. Also I want to verify the `denoise_step` — the `cond.cond.to(dev, dtype=self.dtype)`. Fine.

Now let me think about a potential real bug: **`_size_embedding` returns a tensor but the `timestep_embedding` uses `t[:, None]`** — `t` is `torch.tensor([float(value)])` shape [1]. `t[:, None]` shape [1,1]. `freqs[None]` shape [1, half]. Product [1, half]. Good, returns [1, dim]. Then `.to(torch.float32)`. Then cat 6 of them dim=0 -> [6, dim], flatten -> [1536], unsqueeze(0) -> [1, 1536]. Good.

Now `self._y = torch.cat([cond.pooled, size_embeds], dim=-1)` — pooled is [1,1280], size_embeds [1,1536] -> [1, 2816]. Good.

Now a subtle issue: `size_embeds` is computed in float32 (timestep_embedding outputs float32, `.to(torch.float32)`). Then `torch.cat(...).to(self.dtype)`. Good, cast to bf16.

But wait: `cond.pooled` is already `.to(self.dtype)` (bf16) from _encode_prompt. And size_embeds is float32. cat of bf16 and fp32 tensors — PyTorch will promote to fp32. Then `.to(self.dtype)`. Fine.

Now `denoise_step`: `sigma = self._sigma_at(t_full).to(latents.dtype)`. `t_full = t.to(dev).reshape(1)` — t is the step.t tensor, shape [1] already. `self._alphas_cumprod[t.to(torch.long)]` — indexes into the 1000-length cumprod with t (discrete index). sigma computed in float64 (default dtype of get_alphas_cumprod is float64), then `.to(latents.dtype)` (bf16). Fine.

Now the `scaled = latents / torch.sqrt(sigma**2 + 1)`. sigma in bf16, sigma**2 in bf16... precision loss but ok.

Now a **potential real concern**: `self._alphas_cumprod = get_alphas_cumprod(device=self.device)` — computed once in __init__ in float64 on device. Good.

Now, a subtle but real bug candidate: In `denoise_step`, the timestep `t` passed is `step.t` which is `torch.tensor(float(ts[i]))`. `ts` is discrete_timesteps(steps) = integer indices reversed (noise->clean). So t is an integer-valued float. `self._sigma_at` does `t.to(torch.long)`. Good. But `t_full` is used both for sigma lookup (needs int) and passed to `self.dit(scaled, t_full, ...)`. In the UNet forward, `timestep_embedding(t, ...)` — t_full is a float tensor [1]. timestep_embedding does `timesteps[:, None].float() * freqs`. So it uses the actual float value (e.g. 999.0). Good, that's the discrete timestep index as float. Correct.

Now the schedule: `ts = discrete_timesteps(steps)` noise->clean. `sigmas = get_sigmas(steps)` noise->clean trailing 0. For i in range(steps): delta = sigmas[i] - sigmas[i+1]. Since noise->clean, sigmas decreasing, delta positive. Good.

Now `t=torch.tensor(float(ts[i]))`. ts[0] is the noisiest (999), ts[-1] smallest. Good.

Now let me reconsider: is there a mismatch between `t` (discrete index) and `sigma` (from get_sigmas)? get_sigmas uses `sigma(t)` = sqrt((1-abar)/abar) at the SAME discrete index. And `_sigma_at` computes the same. So in denoise_step, sigma should equal sigmas[i]. Consistent. Good.

Let me now think about the **`denoise_step` initial scaling double-application**. In prepare_latent: `scaled = latents * sigmas[0]`. So initial x = noise * sigma_max. Then in denoise_step at step 0: `scaled = x / sqrt(sigma^2+1)` = noise*sigma_max/sqrt(sigma_max^2+1). That's the DDPM-space x_t = sqrt(abar) x0 + sqrt(1-abar) eps. With x0=0 (pure noise start), x_t = sqrt(1-abar) eps = sigma/sqrt(1+sigma^2) * eps. And our input latent (noise) *sigma_max /sqrt(sigma_max^2+1) matches. Good.

Now the euler update: x_{t+1} = x_t - (sigma_t - sigma_{t+1}) * eps_pred. This is the standard. Good, trust it.

OK the math seems self-consistent. The user says it works.

Now let me focus on **structure/convention** and **real bugs**:

**Issue A: `load_illustrious_dit` uses `__import__("logging").getLogger(__name__)`** — unusual inline import. Other load functions (load_illustrious_vae, text.py) do `from thenoise.utils.setup_logging import setup_logging; setup_logging(); import logging; logger = logging.getLogger(__name__)` at module top. This is inconsistent with the established pattern in the same package. Minor style inconsistency. Actually it's a bit odd. Worth a minor note.

**Issue B: In `utils.py`, `load_illustrious_dit` doesn't check `info.missing_keys`/`unexpected_keys`** — it uses `dit.load_state_dict(sd, strict=True, assign=True)` which raises on mismatch, so that's fine. Actually with strict=True it raises. Good.

**Issue C: `find_illustrious_tokenizer_dir`** returns None if not found, then `load_illustrious_tokenizer(None)` falls back to vendored dir. In the model __init__: `load_illustrious_tokenizer(find_illustrious_tokenizer_dir(config.text_encoder_path))`. Fine.

**Issue D: The vendored tokenizer config files** — `special_tokens_map.json` is 1 line, `vocab.json` 1 line, `tokenizer_config.json` 34 lines, `merges.txt` 48895 lines. These are vendored data. Fine.

Now **documentation completeness** is in scope. Let me check:
- AGENTS.md lists the layout. It mentions `dit/` (per-model compute). Does it need updating to mention illustrious? Let me check AGENTS.md — it says `dit/` (per-model compute) generically. It lists `models/` (adapters + catalog + detect), `dit/`, `vae/`, `utils/`. It doesn't enumerate each model. So no doc change strictly needed. But the README or docs might enumerate supported models / samplers. Let me check for docs mentioning supported models or samplers that should mention Illustrious.

Let me search docs/README for model lists and sampler lists.


**Tool: bash**

**Input:**
```json
{
  "command": "grep -rln \"er_sde\\|SUPPORTED_SAMPLERS\\|Illustrious\\|illustrious\\|SDXL\\|zimage\\|Z-Image\\|Anima\\|Krea2\" --include=*.md . 2>/dev/null; echo \"=== sampler docs ===\"; grep -rln \"euler\\|sampler\" --include=*.md . 2>/dev/null"
}
```

**Output:**
```
./REVIEW.md
./reviews/north-mini-code.md
./reviews/nemotron3nano.md
./reviews/glm-4.7-flash.md
./reviews/qwen3.6-35B.md
./reviews/gpt-oss.md
./reviews/muse-glimmer.md
./local/sl/session-ses_ff77efa03ffe0ZVqr5n2HOtqd4.md
./local/sl/session-ses_fee4.md
./local/sl/session-ses_002e1375bffe8RAzJ8qwDsF0ZU.00.md
./local/sl/session-ses_006af0a05ffeBlwj2shqU9efhW.00.md
./local/sl/session-ses_0002398d8ffeLj77JcKXKISO9k.01.md
./README.md
./r0/review_north-mini-code.md
./r0/review_ds4.md
./r0/review_q38.md
./r0/review_nemotron-3-nano.md
./r0/review_muse-glimmer.md
./r0/review_q36.md
./r0/POTENTIAL_FIXES.md
=== sampler docs ===
./REVIEW.md
./reviews/north-mini-code.md
./reviews/glm-4.7-flash.md
./reviews/qwen3.6-35B.md
./reviews/gpt-oss.md
./reviews/muse-glimmer.md
./local/sl/session-ses_ff77efa03ffe0ZVqr5n2HOtqd4.md
./local/sl/session-ses_fee4.md
./local/sl/session-ses_002e1375bffe8RAzJ8qwDsF0ZU.00.md
./local/sl/session-ses_006af0a05ffeBlwj2shqU9efhW.00.md
./local/sl/session-ses_0002398d8ffeLj77JcKXKISO9k.01.md
./README.md
./r0/review_ds4.md
./r0/review_q38.md
./r0/review_muse-glimmer.md
./r0/review_q36.md
./r0/POTENTIAL_FIXES.md

```

---

## Assistant (Build · strix.Qwen3.8-27B · 17.4s)

_Thinking:_

Those are mostly review/session files, not project docs. Let me check the README.md for the list of supported models and samplers — that's the actual user-facing doc that should mention Illustrious.


**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"Illustrious\\|illustrious\\|SDXL\\|Z-Image\\|Anima\\|Krea\\|sampler\\|euler\\|er_sde\\|model\" README.md | head -60"
}
```

**Output:**
```
5:Loads one model at a time and generates images from text prompts. Available as a CLI tool, an HTTP API (with a simple web UI).
60:without needing any model weights yet:
77:### 4. Download a model
85:.venv/bin/python scripts/download_anima.py --out ./models/anima --variant turbo-v1.0
88:Anima is the smaller of the two original supported models (~5.4 GB total), so it
89:is the quickest way to get a first image. See [Supported Models](#supported-models)
90:for Krea 2 (larger, higher quality) and Z-Image-Turbo (distilled 8-step).
96:  --dit ./models/anima/split_files/diffusion_models/anima-turbo-v1.0.safetensors \
97:  --vae ./models/anima/split_files/vae/qwen_image_vae.safetensors \
98:  --text-encoder ./models/anima/split_files/text_encoders/qwen_3_06b_base.safetensors \
104:see [Performance](#performance). To serve the same model over HTTP with a web UI
116:- The `gfx1151` bundle is GPU-qualified (a real Anima generation) before release.
125:  --dit ./models/anima/split_files/diffusion_models/anima-turbo-v1.0.safetensors \
126:  --vae ./models/anima/split_files/vae/qwen_image_vae.safetensors \
127:  --text-encoder ./models/anima/split_files/text_encoders/qwen_3_06b_base.safetensors \
140:To use the model download scripts, install the `scripts` extra instead (or in
151:**First-run compilation:** the DiT model is compiled with `torch.compile` on load. The first
180:Anima, Krea 2, and Z-Image-Turbo are supported. New models will be added. PRs adding model support are welcome.
188:| Anima | ~5.4 GB | 2B params; fastest to download and run |
189:| Krea 2 | ~35 GB | Higher quality; much larger text encoder and DiT |
190:| Z-Image-Turbo | ~21 GB | Distilled 8-step S3-DiT; Flux VAE + Qwen3 caption encoder |
191:| Z-Image | ~21 GB | Non-distilled version of Z-Image-Turob |
193:### Krea 2
198:.venv/bin/python scripts/download_krea2.py --out ./models/krea2
205:### Anima
211:.venv/bin/python scripts/download_anima.py --out ./models/anima --variant turbo-v1.0
217:### Z-Image-Turbo
220:.venv/bin/python scripts/download_zimage.py --out ./models/zimage
228:  --dit ./models/zimage/split_files/diffusion_models/z_image_turbo_bf16.safetensors \
229:  --vae ./models/zimage/split_files/vae/ae.safetensors \
230:  --text-encoder ./models/zimage/split_files/text_encoders/qwen_3_4b.safetensors \
242:2. **HTTP server** — serve a model over HTTP with a JSON API
245:The model type is **auto-detected** from the DiT checkpoint — no need to specify which model you are using.
251:### Serve a model over HTTP
253:Anima (matches the model downloaded in [Setup](#setup)):
257:  --dit ./models/anima/split_files/diffusion_models/anima-turbo-v1.0.safetensors \
258:  --vae ./models/anima/split_files/vae/qwen_image_vae.safetensors \
259:  --text-encoder ./models/anima/split_files/text_encoders/qwen_3_06b_base.safetensors \
263:Krea 2:
267:  --dit ./models/krea2/diffusion_models/krea2_turbo_bf16.safetensors \
268:  --vae ./models/krea2/vae/qwen_image_vae.safetensors \
269:  --text-encoder ./models/krea2/text_encoders/qwen3vl_4b_bf16.safetensors \
275:  --dit ./models/zimage/split_files/diffusion_models/z_image_turbo_bf16.safetensors \
276:  --vae ./models/zimage/split_files/vae/ae.safetensors \
277:  --text-encoder ./models/zimage/split_files/text_encoders/qwen_3_4b.safetensors \
287:  --dit ./models/anima/split_files/diffusion_models/anima-turbo-v1.0.safetensors \
288:  --vae ./models/anima/split_files/vae/qwen_image_vae.safetensors \
289:  --text-encoder ./models/anima/split_files/text_encoders/qwen_3_06b_base.safetensors \
301:  --lora-dir ./models/loras \
308:LoRA format is `filename:weight` — the `.safetensors` extension is appended automatically. Omit `:weight` to use the default of `1.0`. LoRAs are switched in-memory without reloading the base model.
319:| `GET` | `/health` | Server status and loaded model |
326:All fields except `prompt` are optional. Omitted fields use the loaded model's defaults.
332:| `width` | `int` | model default | Output width in pixels |
333:| `height` | `int` | model default | Output height in pixels |
334:| `steps` | `int` | model default | Number of denoising steps |
335:| `guidance_scale` | `float` | model default | CFG scale (≤ 1.0 disables CFG) |
341:| `sampler` | `string` | `er_sde` | Denoising solver: `euler` or `er_sde` |
360:If no model is loaded, `/text2image` returns HTTP 503.
390:| `--width` | no | model default | Output width |
391:| `--height` | no | model default | Output height |

```

---

## Assistant (Build · strix.Qwen3.8-27B · 40.8s)

_Thinking:_

The README has a "Supported Models" section (line 180-191, and download sections 193-230) that does NOT mention Illustrious. And the sampler table (line 341) says `sampler` default is `er_sde` and options are `euler` or `er_sde`. This commit adds a new model and a sampler-fallback behavior. The README should be updated:
- Add Illustrious to the Supported Models table (line 180-191)
- Add a download section for Illustrious (there's `scripts/download_illustrious.py`)
- Mention the sampler fallback behavior (er_sde falls back to euler for discrete models)
- The sampler table row default is `er_sde` — but that's the model default which varies per model now (Illustrious default is `euler`). The table says "model default" for other rows but hardcodes `er_sde` for sampler. Actually line 341 says default `er_sde`. Since Illustrious uses euler as default, the doc is now partially inaccurate.

These are legitimate documentation-completeness findings. Let me verify the README's Supported Models section and confirm Illustrious is missing, and check the download script exists.

Let me read README lines 178-235 to be precise.


**Tool: read**

**Input:**
```json
{
  "filePath": "/home/ckuethe/llm/git_repos/thenoise/README.md",
  "limit": 60,
  "offset": 178
}
```

**Output:**
```
<path>/home/ckuethe/llm/git_repos/thenoise/README.md</path>
<type>file</type>
<content>
178: ## Supported Models
179: 
180: Anima, Krea 2, and Z-Image-Turbo are supported. New models will be added. PRs adding model support are welcome.
181: 
182: All download commands use `.venv/bin/python` and need the `scripts` extra
183: installed (`uv pip install -e ".[scripts]"`), because `huggingface_hub` lives
184: in the project venv created by [Setup](#setup) — a bare `python` will not work.
185: 
186: | Model | Download size | Notes |
187: |-------|---------------|-------|
188: | Anima | ~5.4 GB | 2B params; fastest to download and run |
189: | Krea 2 | ~35 GB | Higher quality; much larger text encoder and DiT |
190: | Z-Image-Turbo | ~21 GB | Distilled 8-step S3-DiT; Flux VAE + Qwen3 caption encoder |
191: | Z-Image | ~21 GB | Non-distilled version of Z-Image-Turob |
192: 
193: ### Krea 2
194: 
195: Download:
196: 
197: ```bash
198: .venv/bin/python scripts/download_krea2.py --out ./models/krea2
199: ```
200: 
201: This fetches the bf16 Turbo DiT (~26 GB), the VAE (~0.25 GB), and the Qwen3-VL
202: text encoder (~8.9 GB). Add `--include-raw` for the non-turbo DiT (another
203: ~26 GB).
204: 
205: ### Anima
206: 
207: Download — the `--variant` you pick becomes part of the DiT filename, so use the
208: same value in your `--dit` path:
209: 
210: ```bash
211: .venv/bin/python scripts/download_anima.py --out ./models/anima --variant turbo-v1.0
212: ```
213: 
214: Available variants include `turbo-v1.0` (fewest steps), `aesthetic-v1.1`, and
215: `base-v1.0`.
216: 
217: ### Z-Image-Turbo
218: 
219: ```bash
220: .venv/bin/python scripts/download_zimage.py --out ./models/zimage
221: ```
222: 
223: This fetches the single-file bf16 Turbo DiT (~12 GB), the Flux VAE (`ae.safetensors`),
224: and the Qwen3-4B text encoder (`qwen_3_4b.safetensors`, ~8 GB).
225: 
226: ```bash
227: ./thenoise.sh generate \
228:   --dit ./models/zimage/split_files/diffusion_models/z_image_turbo_bf16.safetensors \
229:   --vae ./models/zimage/split_files/vae/ae.safetensors \
230:   --text-encoder ./models/zimage/split_files/text_encoders/qwen_3_4b.safetensors \
231:   --prompt "a fox walking in the snow" \
232:   --out /tmp/zimage.png
233: ```
234: 
235: ---
236: 
237: ## Operation Modes

(Showing lines 178-237 of 403. Use offset=238 to continue.)
</content>
```

---

## Assistant (Build · strix.Qwen3.8-27B · 20.3s)

_Thinking:_

Confirmed: README Supported Models does not mention Illustrious, and there's no download section for it (though `scripts/download_illustrious.py` was added). This is a doc-completeness gap.

Now let me check the sampler table row (line 341) more carefully and the AGENTS.md. Also let me check the `pyproject.toml` change (3 lines added) — probably adds `accelerate` and `transformers` deps? Let me check.


**Tool: bash**

**Input:**
```json
{
  "command": "git show 1ddd819412e5801faf147683facb0a270005f639 -- pyproject.toml"
}
```

**Output:**
```
commit 1ddd819412e5801faf147683facb0a270005f639
Author: Chris Kuethe <chris.kuethe@gmail.com>
Date:   Sun Aug 16 06:34:21 2026 -0700

    Add Illustrious (SDXL-based) support
    
    Vibe coded implementation of Illustrious. It seems fairly popular and easy
    to test. Was able to generate some images including loras. `er_sde` is not
    a supported sampler, so there's an automatic fallback to `euler` to be user
    friendly.
    
    Didn't test loading checkpoints other than the official one from huggingface
    or any other SDXL based models.
    
    Doesn't break any other model support.
    
    Co-authored-by: DeepSeek-V4-Flash-0731 (opencode, lemonade)

diff --git a/pyproject.toml b/pyproject.toml
index d82a54f..67554ad 100644
--- a/pyproject.toml
+++ b/pyproject.toml
@@ -35,6 +35,7 @@ packages = [
     "thenoise.dit",
     "thenoise.dit.krea2",
     "thenoise.dit.anima",
+    "thenoise.dit.illustrious",
     "thenoise.dit.zimage",
     "thenoise.models",
     "thenoise.postprocess",
@@ -50,6 +51,8 @@ packages = [
 "thenoise.dit.anima" = ["configs/**/*"]
 # Tokenizer configs used by the Z-Image text encoder (loaded via __file__).
 "thenoise.dit.zimage" = ["configs/**/*"]
+# Vendored CLIP tokenizer + configs for the Illustrious (SDXL) text encoders.
+"thenoise.dit.illustrious" = ["configs/**/*"]
 # Committed Sesqui latent upscaler weights (bf16, ~6MB).
 "thenoise.upscale" = ["weights/**/*"]
 # Web UI served at /

```

---

## Assistant (Build · strix.Qwen3.8-27B · 12.8s)

_Thinking:_

Now let me check the dependencies. `build_clip_l` imports `from transformers import CLIPTextConfig, CLIPTextModel` and `from accelerate import init_empty_weights`. Are these in the project deps? Let me check pyproject for transformers/accelerate. Also `transformers` CLIPTokenizer.


**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"transformers\\|accelerate\\|numpy\\|dependencies\" pyproject.toml"
}
```

**Output:**
```
12:dependencies = [
18:    "transformers==4.57.6",
21:    "accelerate==1.6.0",
23:    "numpy",
27:[project.optional-dependencies]

```

---

## Assistant (Build · strix.Qwen3.8-27B · 248.8s)

_Thinking:_

Good, transformers, accelerate, numpy all present. Let me check how zimage uses transformers/accelerate to confirm the pattern is consistent (build_clip_l uses init_empty_weights).

Now let me check the tests to understand what's covered, and check the `test_illustrious.py` to understand what's tested (no torch). Also `test_detect.py`.

Actually, let me focus. I've done a broad review. Let me now check a couple of specific potential bugs more carefully:

1. **`_encode_prompt` CLIP-L penultimate hidden state**: `out_l.hidden_states[-2]`. For CLIPTextModel, `hidden_states` is a tuple of length num_layers+1 = 13. `hidden_states[-1]` is the final output (after last layer), `hidden_states[-2]` is the output of the 11th layer (penultimate). SDXL uses the penultimate hidden state (index -2) for CLIP-L. Correct — ComfyUI uses hidden_states[-2]. Good.

2. **CLIP-G**: uses `hidden_g, pooled = self.clip_g(input_ids)`. The OpenClipTextTransformer returns penultimate (layer n-2) and pooled. For SDXL CLIP-G, ComfyUI uses the penultimate hidden state (layer 31 of 32, i.e. index -2). The code captures `penultimate` at `i == n-2` (the second-to-last block). Good.

Wait, let me double check. SDXL CLIP-G: the "conditioner" takes the output of the 2nd-to-last transformer block (penultimate). In open_clip, the text transformer has 32 blocks. ComfyUI's SDXLClipG uses `penultimate_hidden_states`. The code's `_penultimate_and_pooled` sets `penultimate = hidden` when `i == n-2`, i.e., after block index n-2 (the 31st block, 0-indexed). That's the penultimate. Correct.

3. **pooled from CLIP-G**: `pooled = x[arange, idx]` where `x = ln_final(hidden)` (final layer output), `idx = ids.argmax()`. Then `pooled = pooled @ text_projection`. This matches open_clip: text features = ln_final output at EOS, projected by text_projection. Correct.

Now, one concern: `ids.argmax(dim=-1)` for EOS detection. As discussed, this is ComfyUI's approach. But is it robust? If the prompt contains a token with id > 49407? Vocab size is 49408, so max token id is 49407 (EOS). So EOS is always the argmax if present. Since tokenizer pads to max_length with pad_token (id 0 or 1... pad_token_id=1), and always includes EOS for non-empty sequences. For empty prompt "", the tokenizer produces [SOS, EOS] maybe? Actually an empty prompt → [pad...]? Let me think: encoding "" with truncation and max_length=77, padding="max_length" → [SOS?, ...]. Actually CLIPTokenizer for empty string: it adds no tokens, but the CLIP tokenizer always... Hmm. For empty prompt, input_ids might be all padding or [SOS, EOS]. If there's no EOS, argmax picks the largest present token. For empty string, tokens might be just pads (id 0/1) → argmax = 0 or 1 → picks first token. This is an edge case for negative_prompt="" (the default!).

Wait — **negative_prompt defaults to ""**. In `encode_prompt`, when guidance_scale > 1.0, it calls `_encode_prompt(negative_prompt)` where negative_prompt is "". So the negative encoding runs on an empty string. This is the standard SDXL behavior (empty negative prompt → the EOS/pad embedding). ComfyUI does exactly this. The argmax on empty: let me think what CLIPTokenizer returns for "".

Actually, this works in practice per the user (they tested with default negative prompt). The pooled for empty string would be the CLIP-G projection of whatever the empty encoding is — which is the standard "unconditional" embedding. So it's fine. Not a bug.

4. **`is_causal=True` in `_OpenClipMultiheadAttention`**: This applies a causal mask. But there's a subtle issue: `F.scaled_dot_product_attention(q, k, v, attn_mask=None, is_causal=True)`. With `is_causal=True` and no attn_mask, SDPA applies a lower-triangular causal mask assuming q_len == k_len. Since all sequences are exactly 77 (padded), q_len = k_len = 77. Fine. But the causal mask means token i attends to tokens 0..i. For CLIP this is correct (autoregressive). Good.

However — one subtle correctness point: the standard open_clip text transformer does NOT use a strict causal mask in the same way; actually it does use a causal mask (the text transformer is causal). ComfyUI's bigG uses causal. OK fine.

5. **`build_clip_g` strict load**: The `OpenClipTextTransformer` has `logit_scale` param (ones(())). The checkpoint `clip_g` keys — does the SDXL checkpoint include `logit_scale`? The combined text encoder file has `clip_g.*` keys. If the checkpoint has `logit_scale` (it does, open_clip models have it), then it loads. If not, strict=True would fail. The user says it loads fine, so it's present. OK.

Actually wait — there's a subtle issue. `text_projection` is defined as `nn.Parameter(torch.empty(embed_dim, embed_dim))`. In open_clip, `text_projection` is a [dim, dim] matrix. And the checkpoint key is `clip_g.text_projection` (after stripping `clip_g.`). Good, matches.

6. Now, a **real potential issue**: In `build_clip_l`, `model.load_state_dict(sd, strict=True, assign=True)` where `sd` has keys like `text_model.*`. But `CLIPTextModel`'s state_dict keys are prefixed with `text_model.` (since CLIPTextModel is the `text_model` submodule... actually CLIPTextModel's own parameters are under `text_model.`). Let me verify: `CLIPTextModel` is itself the text model, and its `named_parameters()` give keys like `text_model.embeddings...`? No. `CLIPTextModel` is a standalone model; its keys are `text_model.embeddings.word_embeddings.weight` etc. Yes — CLIPTextModel's state dict is prefixed with `text_model.`. Good, matches the checkpoint.

Now, `init_empty_weights()` from accelerate to build on meta, then `load_state_dict(assign=True)`. This is a known pattern. Fine.

7. **`model.config.use_cache = False`** for CLIP-L — fine.

Now let me think about whether there's an issue with `torch.compile` on the UNet forward. `@torch.compile` decorator on `forward`. The `t` tensor changes each step (different values but same shape). `y` (self._y) and `context` are set once. `x` shape constant. So no recompilation across steps. Good. But `t` is a data-dependent value, not structure — fine, no recompile.

Actually, one concern: `torch.compile` on a method decorated — when called via `self.dit(...)`, it works. The base `__init__` sets `torch._dynamo.config.recompile_limit = 64`. Fine.

Now let me consider the **`denoise_step` returns eps but the euler sampler does `x = x - delta * v`**. But the model output `eps` was computed from `scaled = x/sqrt(sigma^2+1)`. The returned eps is the raw UNet output (noise prediction). So `x_{t+1} = x_t - (sigma_t - sigma_{t+1}) * eps_t`. This is exactly the DDPM-derived discrete euler. Consistent. Good.

Let me now verify one thing that could be a genuine bug: **the `t` passed to `denoise_step` vs the sigma used**. In `schedule`, `t = ts[i]` and delta uses `sigmas[i]-sigmas[i+1]`. In `denoise_step`, `sigma = self._sigma_at(t)` where t=ts[i], giving sigmas[i]. So the scaling uses the same sigma as the delta's start. Good.

Now, is there any issue with `self._y` being an instance attribute that persists across requests? It's set in `prepare_latent` which runs once per request under the lock. Since single model, sequential, it's fine. But if a request fails partway... not a concern.

Now, let me check whether `decode` in base works with the 4-channel VAE. Base `decode` calls `self.vae.decode_to_pixels(latents.to(dev, dtype=self.vae.dtype))`. The Illustrious VAE's `decode_to_pixels` returns `img.clamp(-1,1)` shape [B,3,H,W]. Base decode: `if pixels.ndim == 5: squeeze`. It's 4D [B,3,H,W], so no squeeze. `pixels.to(float32)`, return `pixels[0]` → [3,H,W]. Good.

Now the base `decode` uses `self.vae.dtype`. The Illustrious VAE has a `dtype` property returning `self.decoder.conv_in.weight.dtype`. Good. And `decode_to_pixels` does `latents.to(self.dtype)`. But base decode already does `latents.to(dev, dtype=self.vae.dtype)`. Fine.

Now the latents at decode time: after `finalize_latent` (identity), the latent is in the "scaled EDM space"? Wait. Let me reconsider. The sampler integrates in the sigma-space x (where x = sigma*noise initially, and x_{t+1} = x_t - delta*eps). At the end, x is approximately... in what space? 

In the discrete euler, x_t represents the "noisy latent" where x_t/sqrt(1+sigma_t^2)... hmm. Actually let me reconsider what x represents.

The `scaled` input to the UNet is `x / sqrt(sigma^2+1)`. ComfyUI's EPS calculate_input: `input = x / sqrt(sigma^2 + 1)`. And ComfyUI keeps `x` in the "sigma" representation where the clean latent x0 = x / sigma (at the end, sigma→0... no).

Actually in ComfyUI's flow-euler for eps models, the latent `x` they integrate is the "EDM-style" latent where x = sigma * eps + x_0 * 1 (i.e., x_t = x_0 + sigma_t * eps, the "noised in sigma space"). Then the model input is x / sqrt(sigma^2+1)?? Hmm, that doesn't quite match. Let me not go down this rabbit hole — the user explicitly said it works and produces correct images, and told me not to compare to ComfyUI. The final `decode` divides by scaling_factor 0.13025 which is the SDXL latent scaling. So the final x (after denoise) is the "clean latent in UNet space" = x0/sqrt(1+0)... at sigma→0, x = x0 (since x = x0 + sigma*eps → x0). And the VAE expects latent/scaling_factor. So the final x IS the standard SDXL UNet-space latent. Consistent with `decode_to_pixels` dividing by 0.13025. Good.

I'm now confident the math is self-consistent and works.

Let me now also double check: is `prepare_latent` scaling by `sigmas[0]` correct? Initial x = noise * sigma_max. In the "x = x0 + sigma*eps" representation, at start x0 is unknown (we're generating), so x_start = sigma_max * eps where eps is our seeded noise. Yes, that's standard (start from pure noise scaled by sigma_max). Good.

Now, potential issue: `init_latents` uses `self.dit.in_channels` = 4 for channel count. Good. Shape [1, 4, H//8, W//8]. Good.

Now let me reconsider the **refine/upscale** NotImplementedError. Since Illustrious has no 4-channel upscaler, `_upscale_format` raises NotImplementedError. If a user requests `--upscale`, the pipeline at line 266-267 calls `_upscale_and_refine` → `load_latent_upscaler` → `_upscale_format()` → raises NotImplementedError. This propagates up as an unhandled exception → 500 error. That's a reasonably clear error but not user-friendly. However, is `refined` even reachable? `refined = upscale_type == "refined" and factor > 1.0`. Default upscale_type is "refined". So `--upscale` with default type would hit this. This is a real (if minor) issue: upscale with Illustrious crashes with a raw NotImplementedError rather than a friendly validation error. But the model author intentionally raised NotImplementedError with a clear message. I'll note it as a minor UX point — the error message is clear but it surfaces as an unhandled exception / 500 rather than a request validation error. Actually, let me check if there's any pre-validation that would reject upscale for models without upscaler. Let me check `_resolve_upscale` and whether UPSCALE_SCALE etc. Actually, this is borderline. I'll mention it briefly.

Let me also double-check: does `round_up` exist in utils.math? Imported `from thenoise.utils.math import round_up`. Let me verify.


**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"def round_up\" thenoise/utils/math.py; echo \"=== attention sig ===\"; grep -n \"def attention\" thenoise/utils/attention.py; echo \"=== strip_wrap_prefixes / load_split_weights ===\"; grep -n \"def strip_wrap_prefixes\\|def load_split_weights\\|def load_safetensors\\|WRAP_PREFIXES =\" thenoise/utils/safetensors.py"
}
```

**Output:**
```
6:def round_up(value: int, multiple: int) -> int:
=== attention sig ===
33:def attention(
=== strip_wrap_prefixes / load_split_weights ===
228:WRAP_PREFIXES = ("model.diffusion_model.", "net.")
231:def strip_wrap_prefixes(state_dict: dict[str, torch.Tensor]) -> dict[str, torch.Tensor]:
277:def load_safetensors(
329:def load_split_weights(

```

---

## Assistant (Build · strix.Qwen3.8-27B · 7.8s)

_Thinking:_

All references are valid. Let me check the `attention` function signature to confirm `attention([q, k, v], drop_rate=0.0)` is valid usage.


**Tool: read**

**Input:**
```json
{
  "filePath": "/home/ckuethe/llm/git_repos/thenoise/thenoise/utils/attention.py",
  "limit": 70
}
```

**Output:**
```
<path>/home/ckuethe/llm/git_repos/thenoise/thenoise/utils/attention.py</path>
<type>file</type>
<content>
1: # Unified attention function using PyTorch's scaled dot-product attention (SDPA).
2: 
3: from dataclasses import dataclass
4: import torch
5: import torch.nn.functional as F
6: from typing import Optional, Union
7: 
8: 
9: @dataclass
10: class AttentionParams:
11:     attention_mask: Optional[torch.Tensor] = None
12: 
13:     @staticmethod
14:     def create_attention_params() -> "AttentionParams":
15:         return AttentionParams()
16: 
17:     @staticmethod
18:     def create_attention_params_from_mask(
19:         img_len: Optional[int], attention_mask: Optional[torch.Tensor]
20:     ) -> "AttentionParams":
21:         if attention_mask is None:
22:             # No attention mask provided: assume all tokens are valid
23:             return AttentionParams()
24:         # Note: attention_mask is only for text tokens, not including image tokens.
25:         # Expand to include the (always valid) image tokens, then shape as an SDPA
26:         # key-padding mask: [B, 1, 1, img_len + L].
27:         attention_mask = F.pad(attention_mask, (img_len, 0), value=1)  # [B, img_len + L]
28:         attention_mask = attention_mask[:, None, None, :].to(torch.bool)  # [B, 1, 1, img_len + L]
29: 
30:         return AttentionParams(attention_mask)
31: 
32: 
33: def attention(
34:     qkv_or_q: Union[torch.Tensor, list],
35:     k: Optional[torch.Tensor] = None,
36:     v: Optional[torch.Tensor] = None,
37:     attn_params: Optional[AttentionParams] = None,
38:     drop_rate: float = 0.0,
39: ) -> torch.Tensor:
40:     """
41:     Compute scaled dot-product attention over a batch of sequences.
42: 
43:     The whole batch is processed in a single SDPA call. Variable sequence lengths are
44:     handled with a key-padding ``attention_mask`` (padding positions excluded from the
45:     softmax). ``attn_params`` may carry no mask, meaning all tokens are valid.
46: 
47:     Args:
48:         qkv_or_q: Query tensor [B, L, H, D]. or list of such tensors.
49:         k: Key tensor [B, L, H, D].
50:         v: Value tensor [B, L, H, D].
51:         attn_param: Attention parameters including the optional key-padding mask.
52:         drop_rate: Attention dropout rate.
53: 
54:     Returns:
55:         Attention output tensor [B, L, H*D].
56:     """
57:     if isinstance(qkv_or_q, list):
58:         q, k, v = qkv_or_q
59:         q: torch.Tensor = q
60:         qkv_or_q.clear()
61:         del qkv_or_q
62:     else:
63:         q: torch.Tensor = qkv_or_q
64:         del qkv_or_q
65:         assert k is not None and v is not None, "k and v must be provided if qkv_or_q is a tensor"
66:     if attn_params is None:
67:         attn_params = AttentionParams.create_attention_params()
68: 
69:     # GQA: q may carry more heads than k/v (e.g. Krea 2 = 48 query / 12 kv heads). SDPA has no
70:     # native fused GQA path, so we expand k/v to q's head count. We avoid enable_gqa=True because

(Showing lines 1-70 of 94. Use offset=71 to continue.)
</content>
```

---

## Assistant (Build · strix.Qwen3.8-27B · 23.4s)

_Thinking:_

The `attention` function expects q,k,v in shape [B, L, H, D] (heads before head_dim). In the `Attention` class in models.py:
```
q = self.to_q(hidden).view(B, -1, self.num_heads, self.head_dim)
```
So q is [B, L, num_heads, head_dim]. Then `attention([q,k,v], drop_rate=0.0)`. The attention function expects [B, L, H, D] where H=num_heads, D=head_dim. Let me check if attention does the transpose to [B, H, L, D] internally. Let me read the rest.


**Tool: read**

**Input:**
```json
{
  "filePath": "/home/ckuethe/llm/git_repos/thenoise/thenoise/utils/attention.py",
  "offset": 70
}
```

**Output:**
```
<path>/home/ckuethe/llm/git_repos/thenoise/thenoise/utils/attention.py</path>
<type>file</type>
<content>
70:     # native fused GQA path, so we expand k/v to q's head count. We avoid enable_gqa=True because
71:     # that forces SDPA onto the slow math kernel (~7x slower at K2 scale); the repeat is numerically
72:     # identical. (q/k/v here are [B, L, H, D].)
73:     enable_gqa = q.shape[-2] != k.shape[-2]
74: 
75:     # SDPA layout is [B, H, L, D], so transpose from the [B, L, H, D] input.
76:     transpose_fn = lambda x: x.transpose(1, 2)
77: 
78:     q = transpose_fn(q)
79:     k = transpose_fn(k)
80:     v = transpose_fn(v)
81: 
82:     if enable_gqa:  # expand k/v heads to avoid SDPA's slow enable_gqa math path
83:         g = q.shape[1] // k.shape[1]  # [B, H, L, D] -> heads at dim 1
84:         k = k.repeat_interleave(g, dim=1)
85:         v = v.repeat_interleave(g, dim=1)
86: 
87:     x = F.scaled_dot_product_attention(
88:         q, k, v, attn_mask=attn_params.attention_mask, dropout_p=drop_rate
89:     )
90: 
91:     x = transpose_fn(x)  # [B, L, H, D]
92:     x = x.reshape(x.shape[0], x.shape[1], -1)  # [B, L, H*D]
93: 
94:     return x

(End of file - total 94 lines)
</content>
```

---

## Assistant (Build · strix.Qwen3.8-27B · 29.7s)

_Thinking:_

Good, the attention function handles [B, L, H, D] → transposes internally. The `Attention` class passes [B, L, num_heads, head_dim]. Consistent.

Now the `Attention.forward` in models.py:
```
out = attention([q, k, v], drop_rate=0.0)
return self.to_out[0](out)
```
`to_out = nn.Sequential(nn.Linear(inner_dim, dim), nn.Dropout(0.0))`. `self.to_out[0]` is the Linear. out is [B, L, H*D] = [B, L, inner_dim]. Linear(inner_dim, dim). Good. Note the checkpoint key is `to_out.0` (the Linear), and `to_out.1` is the Dropout (no params). The state dict would have `to_out.0.weight`, `to_out.0.bias`. The model has `to_out.0` = Linear with weight+bias. Good. Does the checkpoint's `to_out.0` have bias? diffusers Attention `to_out` Linear has bias=True. Yes.

Now I've done a thorough broad review. Let me quickly check the tests to see what's verified (documentation of test coverage), then finalize.

Let me look at test_illustrious.py and test_detect.py briefly.


**Tool: bash**

**Input:**
```json
{
  "command": "git show 1ddd819412e5801faf147683facb0a270005f639 -- tests/test_illustrious.py | sed -n '1,200p'"
}
```

**Output:**
```
commit 1ddd819412e5801faf147683facb0a270005f639
Author: Chris Kuethe <chris.kuethe@gmail.com>
Date:   Sun Aug 16 06:34:21 2026 -0700

    Add Illustrious (SDXL-based) support
    
    Vibe coded implementation of Illustrious. It seems fairly popular and easy
    to test. Was able to generate some images including loras. `er_sde` is not
    a supported sampler, so there's an automatic fallback to `euler` to be user
    friendly.
    
    Didn't test loading checkpoints other than the official one from huggingface
    or any other SDXL based models.
    
    Doesn't break any other model support.
    
    Co-authored-by: DeepSeek-V4-Flash-0731 (opencode, lemonade)

diff --git a/tests/test_illustrious.py b/tests/test_illustrious.py
new file mode 100644
index 0000000..70411e9
--- /dev/null
+++ b/tests/test_illustrious.py
@@ -0,0 +1,146 @@
+"""Illustrious (SDXL) adapter tests (no real weights / no GPU needed).
+
+Covers the discrete euler schedule (timestep indices + sigma grid), the model
+defaults, size rounding, the vendored CLIP tokenizer, and the CLIP-G / VAE /
+UNet construction with random weights (CPU).
+"""
+from __future__ import annotations
+
+import torch
+
+from thenoise.dit.illustrious.sampling import (
+    discrete_timesteps,
+    get_alphas_cumprod,
+    get_sigmas,
+    sigma,
+)
+from thenoise.dit.illustrious.utils import ILLUSTRIOUS_TOKENIZER_CONFIG_DIR
+from thenoise.models import IllustriousModel
+
+
+def test_schedule_discrete_timesteps_descending():
+    ts = discrete_timesteps(28)
+    assert len(ts) == 28
+    assert ts[0] == 999  # noise -> clean
+    assert ts[-1] == 0
+    assert ts == sorted(ts, reverse=True)
+
+
+def test_schedule_sigmas_descending_with_trailing_zero():
+    sigmas = get_sigmas(28)
+    assert len(sigmas) == 29
+    assert sigmas[-1] == 0.0
+    assert all(s > n for s, n in zip(sigmas[:-1], sigmas[1:]))
+    # largest sigma at t=999, smallest (t=0) just above 0.
+    assert sigma(0) > 0.0
+    assert sigma(999) > sigma(0)
+
+
+def test_alphas_cumprod_bounds():
+    abar = get_alphas_cumprod()
+    assert abar.shape == (1000,)
+    assert 0.0 < abar[0] < 1.0  # nearly clean
+    assert abar[-1] < 0.05       # heavily noised
+
+
+def test_illustrious_defaults():
+    assert IllustriousModel.DEFAULT_STEPS == 28
+    assert IllustriousModel.DEFAULT_GUIDANCE_SCALE == 5.0
+    assert IllustriousModel.SAMPLER == "euler"
+    assert IllustriousModel.LATENT_CHANNELS == 4
+    assert IllustriousModel._VAE_SCALE == 8
+
+
+def test_resolve_size_rounds_to_multiple_of_8():
+    m = IllustriousModel
+    assert m.resolve_size(None, 1000, 1000) == (1000, 1000)
+    assert m.resolve_size(None, 1000, 1002) == (1000, 1008)
+    assert m.resolve_size(None, 513, 511) == (520, 512)
+
+
+def test_vendored_tokenizer_config_dir_exists():
+    from pathlib import Path
+
+    d = Path(ILLUSTRIOUS_TOKENIZER_CONFIG_DIR)
+    assert d.is_dir()
+    for required in ("vocab.json", "merges.txt", "tokenizer_config.json"):
+        assert (d / required).is_file(), f"missing vendored tokenizer file {required}"
+
+
+def test_find_illustrious_tokenizer_dir(tmp_path):
+    from thenoise.dit.illustrious.utils import find_illustrious_tokenizer_dir
+
+    # Downloader layout: <out>/tokenizer/ + <out>/split_files/text_encoders/file.safetensors
+    out = tmp_path / "models"
+    (out / "tokenizer").mkdir(parents=True)
+    te = out / "split_files" / "text_encoders" / "clip_l_g.safetensors"
+    assert find_illustrious_tokenizer_dir(str(te)) == str(out / "tokenizer")
+
+
+def test_find_illustrious_tokenizer_dir_returns_none_without_tokenizer(tmp_path):
+    from thenoise.dit.illustrious.utils import find_illustrious_tokenizer_dir
+
+    te = tmp_path / "split_files" / "text_encoders" / "clip_l_g.safetensors"
+    assert find_illustrious_tokenizer_dir(str(te)) is None
+
+
+def test_tokenizer_loads_offline():
+    from transformers import CLIPTokenizer
+
+    tok = CLIPTokenizer.from_pretrained(ILLUSTRIOUS_TOKENIZER_CONFIG_DIR, local_files_only=True)
+    ids = tok("a cat", padding="max_length", max_length=77, truncation=True, return_tensors="pt")
+    assert ids.input_ids.shape == (1, 77)
+
+
+def test_vae_decodes_latent_to_pixels():
+    from thenoise.dit.illustrious.vae import AutoencoderKLIllustrious
+
+    vae = AutoencoderKLIllustrious()
+    latents = torch.randn(1, 4, 8, 8)
+    pixels = vae.decode_to_pixels(latents)
+    assert pixels.shape == (1, 3, 64, 64)
+    assert (-1.0 <= pixels).all() and (pixels <= 1.0).all()
+
+
+def test_size_embedding_dim():
+    # 6 timestep_embeddings of 256 -> 1536, concatenated after pooled (1280) = 2816.
+    from thenoise.dit.illustrious.models import timestep_embedding
+
+    t = torch.tensor([1024.0])
+    emb = timestep_embedding(t, 256)
+    assert emb.shape == (1, 256)
+    assert emb.dtype == torch.float32
+
+
+def test_sigma_at_matches_sampling_grid():
+    # ``_sigma_at`` (used for the UNet input scaling) must agree with the
+    # standalone ``sigma(t)`` over the whole discrete grid.
+    from thenoise.models.illustrious import IllustriousModel
+
+    m = object.__new__(IllustriousModel)
+    m._alphas_cumprod = get_alphas_cumprod()
+
+    t = torch.arange(0, 1000, 37, dtype=torch.int64)
+    s_at = m._sigma_at(t)
+    assert s_at.shape == t.shape
+    for i, ti in enumerate(t.tolist()):
+        assert abs(float(s_at[i]) - sigma(ti)) < 1e-6
+    # noisy end has the largest sigma; clean end approaches 0.
+    assert float(s_at[0]) < float(s_at[-1])
+
+
+def test_denoise_input_scaling_factor():
+    # ComfyUI EPS ``calculate_input`` scales the model input by 1/sqrt(sigma^2+1).
+    # At the noisiest step this is ~1/sigma_max (~0.04), so feeding the raw
+    # latent (as the old code did) was ~26x too large and collapsed to gray.
+    from thenoise.models.illustrious import IllustriousModel
+
+    m = object.__new__(IllustriousModel)
+    m._alphas_cumprod = get_alphas_cumprod()
+
+    t = torch.tensor([999])
+    sigma_hat = m._sigma_at(t)
+    factor = 1.0 / torch.sqrt(sigma_hat**2 + 1)
+    assert 0.0 < float(factor) < 1.0
+    # the noisiest step's factor is well below 1 (input must be scaled down).
+    assert float(factor) < 0.1

```

---

## Assistant (Build · strix.Qwen3.8-27B · 83.1s)

_Thinking:_

The tests call `m.resolve_size(None, 1000, 1000)` — with a `None` self arg! Wait: `m = IllustriousModel; m.resolve_size(None, 1000, 1000)`. Since `resolve_size` is an instance method `def resolve_size(self, width, height)`, calling `m.resolve_size(None, 1000, 1000)` on the CLASS (not instance) passes `None` as self, 1000 as width, 1000 as height. That works because resolve_size doesn't use self. OK, that's a test calling an instance method on the class with explicit None self. Ugly but works.

Now, `test_sigma_at_matches_sampling_grid`: `m._sigma_at(t)` where t is int64 tensor. `_sigma_at` does `self._alphas_cumprod[t.to(torch.long)]`. Good.

Now let me check test_detect.py changes.

Actually, I've done enough. Let me also verify one more potential real bug: In `_sigma_at`, the default `get_alphas_cumprod(device)` uses dtype float64. `self._alphas_cumprod` is float64 on device. Indexing with `t.to(torch.long)` gives float64 sigma. Good.

Now the test `test_denoise_input_scaling_factor` and `test_sigma_at...` build the model via `object.__new__(IllustriousModel)` bypassing `__init__` (which needs weights). Good, no torch GPU needed. But `_sigma_at` uses `torch.long` indexing on a float64 tensor — fine on CPU.

Now, is there any issue with the tests importing torch? The AGENTS.md says "tests are designed to run without torch or real weights." But test_illustrious.py imports torch and uses torch.randn, torch.arange, etc. Let me check if other tests import torch. Actually AGENTS.md says "no torch needed" for CLI + runtime + detection tests. But test_illustrious uses torch. Let me check whether torch is available in the venv (it should be, ROCm build). The test constructs VAE with random weights and decodes — that's CPU torch, no GPU. That's fine as long as torch is installed. Let me verify the test suite runs. But AGENTS.md says "Never run heavy/compute-heavy commands" and "Never run the program yourself." Running pytest on these tests is the recommended verification. Let me run the illustrious + detect tests only (they're CPU/light).

Actually, `test_vae_decodes_latent_to_pixels` runs a full VAE decode on CPU (tiny 8x8 latent → 64x64). That's light. And constructing the UNet isn't tested (would be heavy at 399 params... actually constructing random UNet is a few GB — NOT tested, good). Let me run the test suite to verify nothing is broken, per the workflow. This is allowed (it's the recommended verification, not running the program/models).

Let me run pytest on the illustrious and detect tests.


Let me verify the test suite passes (this is the recommended verification, not running the model).



**Tool: bash**

**Input:**
```json
{
  "command": ".venv/bin/python -m pytest tests/test_illustrious.py tests/test_detect.py -q 2>&1 | tail -30"
}
```

**Output:**
```
....................................                                     [100%]
=============================== warnings summary ===============================
.venv/lib/python3.13/site-packages/torch/jit/_script.py:365: 14 warnings
  /home/ckuethe/llm/git_repos/thenoise/.venv/lib/python3.13/site-packages/torch/jit/_script.py:365: DeprecationWarning: `torch.jit.script_method` is deprecated. Please switch to `torch.compile` or `torch.export`.
    warnings.warn(

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
36 passed, 14 warnings in 3.25s

```

---

## Assistant (Build · strix.Qwen3.8-27B · 13.1s)

_Thinking:_

All 36 tests pass. Let me also run the full test suite quickly to ensure no regressions (the commit touches base.py, samplers/__init__.py, models/__init__.py which are shared).


**Tool: bash**

**Input:**
```json
{
  "command": ".venv/bin/python -m pytest tests/ -q 2>&1 | tail -15"
}
```

**Output:**
```
........................................................................ [ 92%]
......                                                                   [100%]
=============================== warnings summary ===============================
.venv/lib/python3.13/site-packages/torch/jit/_script.py:365: 14 warnings
  /home/ckuethe/llm/git_repos/thenoise/.venv/lib/python3.13/site-packages/torch/jit/_script.py:365: DeprecationWarning: `torch.jit.script_method` is deprecated. Please switch to `torch.compile` or `torch.export`.
    warnings.warn(

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
78 passed, 14 warnings in 3.59s

```

---

## Assistant (Build · strix.Qwen3.8-27B · 180.7s)

_Thinking:_

All 78 tests pass. Now let me finalize my review. Let me reconsider a few things I want to confirm before writing up:

1. The `__import__("logging")` in utils.py `load_illustrious_dit`. Let me double check it's the only odd one. The other load functions in the same package (text.py, vae.py) use the module-level `setup_logging()` + module logger. So `load_illustrious_dit` using inline `__import__("logging").getLogger` is inconsistent and slightly odd (works but unusual). Minor style note.

2. The sampler cache key issue (uses requested sampler name, not resolved). Minor, suboptimal caching.

3. README docs not updated for Illustrious (Supported Models table + download section + sampler fallback note). This is the main documentation-completeness finding, and it's in scope.

4. `_upscale_format` NotImplementedError → raw 500 on `--upscale`. Minor UX.

Let me reconsider whether these are worth flagging and their severity. The user said "the code works and does the right things" and "don't overthink... watch out for getting stuck in a loop." So I should be concise, flag the real items, not overstate.

Let me reconsider the sampler fallback logic once more for a real bug:

```
supported = getattr(model, "SUPPORTED_SAMPLERS", None)
if supported is not None and name in SAMPLERS and name not in supported:
    warn; name = model.SAMPLER
cls = SAMPLERS.get(name)
if cls is None: raise ValueError
```

Edge: model.SAMPLER itself must be in SAMPLERS. For Illustrious, SAMPLER="euler" which is in SAMPLERS. Good. But what if a model's SAMPLER is not in supported? Not the case here. Fine.

Another edge: what if `name` is not in SAMPLERS at all (unknown)? Then `name in SAMPLERS` is False, skip fallback, `cls = SAMPLERS.get(name)` = None → raise ValueError. Good.

Now, is there a subtle issue: the fallback sets `name = model.SAMPLER`, but does NOT re-validate that model.SAMPLER is in `supported`. For Illustrious both are "euler". Fine.

Now, the `SUPPORTED_SAMPLERS` attribute is only defined on IllustriousModel. Other models don't have it → getattr returns None → no fallback behavior (preserves old behavior). Good, backward compatible.

5. Let me reconsider the `denoise_step` unused param `i`. It's part of the interface; fine.

6. One more: in `Conditioning`, `pooled` and `neg_pooled` are new optional fields shared across ALL models. Other models don't set them (default None). That's fine since it's optional. But it's a slight "shared base pollution" — adding SDXL-specific fields to the generic Conditioning dataclass. Given the base is generic, this is a minor design smell, but acceptable since they're optional and only SDXL uses them. Might note lightly. Actually, I'll mention it as a minor design consideration but not push.

Actually, the user said don't overthink. I'll keep the design-smell notes very brief or drop them. Let me focus on: (a) README doc gap (main, in-scope), (b) upscale NotImplementedError → 500 (minor), (c) sampler cache-key uses pre-fallback name (minor), (d) `__import__("logging")` inconsistency (trivial style).

Let me verify the sampler table in README to be precise about the doc gap regarding sampler defaults. Line 341: `| sampler | string | er_sde | Denoising solver: euler or er_sde |`. Since Illustrious defaults to euler and supports only euler, and the fallback behavior is new, the README's sampler description is now incomplete/inaccurate. I'll mention.

Let me write up the review concisely. I'll organize by severity.

Let me double-check: is there any actual BUG (not just doc/minor)? Let me think hard about correctness once more, since bugs are the primary focus and I want to be certain before claiming "no bugs."

Reconsider `encode_prompt` when `guidance_scale <= 1.0`:
- `context, pooled = self._encode_prompt(prompt)` 
- `null = None`, `neg_pooled = None`
- returns Conditioning(cond, null=None, pooled, neg_pooled=None)

Then `prepare_latent`: `self._y = cat([cond.pooled, size_embeds])`. `cond.null is None` → `self._y_uncond = None`. Good.

`denoise_step`: `if guidance_scale > 1.0 and self._y_uncond is not None and cond.null is not None:` → False. Only conditional forward, returns eps. Good. CFG off works.

Now reconsider: what if `guidance_scale > 1.0` but negative_prompt is "" (default)? `_encode_prompt("")` runs. For empty string, tokenizer returns... let me actually verify it doesn't crash and produces a sane pooled. The test `test_tokenizer_loads_offline` uses "a cat" not "". But the user tested generation with default (empty) negative prompt and it worked. So empty prompt encoding works. Not a bug.

Now, a genuinely subtle correctness question about `ids.argmax(dim=-1)` for the empty negative prompt: For "", CLIPTokenizer → input_ids likely `[49406, 49407, 0, 0, ...]`? Or all zeros? Let me think. Actually CLIP tokenizer maps "" to just the start/end? No — CLIP tokenizer does not add BOS/EOS by default in HF; it just tokenizes. For empty string, `add_special_tokens` default True for CLIPTokenizer adds nothing? Actually CLIP doesn't have a special EOS added by tokenizer; the 49407 (*/.*) is the EOS token that appears in text. Hmm.

Actually, this is the well-known SDXL "unconditional" embedding. In ComfyUI, the empty prompt is encoded as the CLIP embedding of the empty string, which yields a specific vector. The argmax picks the highest token id present. For an empty string with padding, if all tokens are padding (id 0), argmax = 0 → picks token 0. This is deterministic and matches what ComfyUI/SDXL produce for the null embedding. The user confirmed generation works. So not a bug.

I'm confident: no functional bugs in the production code. The findings are: one documentation gap (README), and a few minor/robustness items.

Let me reconsider the upscale NotImplementedError more carefully to characterize severity. Actually, let me check: is there any guard that prevents reaching `_upscale_and_refine` for a model that raises in `_upscale_format`? The pipeline computes `refined = upscale_type == "refined" and factor > 1.0`. With `--upscale` (factor default 2), refined=True. Then at decode stage, `_upscale_and_refine` → `load_latent_upscaler` → `_upscale_format()` raises NotImplementedError. This would be an unhandled exception → 500. So a user who requests upscale on an Illustrious model gets a 500 with a traceback rather than a clean "not supported" message. It IS a clear message ("does not support latent upscale yet"), but it's a server error, not a client validation error. Minor severity. I'll note it.

Now let me write the review. Keep it concise and well-organized, direct about severity.

Actually, let me reconsider whether to flag the `resolve_size` test calling convention — no, that's test code, out of scope (production python files focus).

Let me also reconsider: `load_illustrious_dit` — `dit.load_state_dict(sd, strict=True, assign=True)` after building on meta. With assign=True and strict=True, this is fine. But note: it does NOT check for missing/unexpected keys explicitly, relying on strict=True to raise. That's fine and consistent enough.

One more: `load_illustrious_dit` logs via `__import__("logging").getLogger(__name__)` but never calls `setup_logging()`. The other modules call `setup_logging()` at import. Since illustrious/models.py, text.py, vae.py all import setup_logging, by the time utils.py's function runs, logging is configured. So the logger works. Just stylistically inconsistent. Trivial.

Let me write it up now.

Format: I'll give a short overall assessment, then findings grouped by severity with file:line references.

Let me get exact line numbers for the key items:
- README Supported Models: README.md:180, table 186-191, sampler row ~341.
- upscale: thenoise/models/illustrious.py `_upscale_format` (around line 258-262 in new file). Let me confirm line numbers in the new file.
- sampler cache key: thenoise/pipeline.py:230 (pre-existing, not changed by this commit — so NOT in scope to flag as a change? The commit didn't change pipeline.py. So I should NOT flag pipeline.py issues since "Only review the changes". The cache-key behavior is pre-existing. I'll drop it, or mention it only as an interaction. Actually the fallback is new and interacts with the pre-existing cache key. But the cache key code is pre-existing. I'll skip it to respect "only review changes.")

Let me get line numbers in illustrious.py for _upscale_format and the __import__ in utils.py.


**Tool: bash**

**Input:**
```json
{
  "command": "grep -n \"_upscale_format\\|__import__\\|SUPPORTED_SAMPLERS = \\|def detect\\|def denoise_step\\|self\\._y\" thenoise/models/illustrious.py thenoise/dit/illustrious/utils.py"
}
```

**Output:**
```
thenoise/models/illustrious.py:58:    SUPPORTED_SAMPLERS = ["euler"]
thenoise/models/illustrious.py:67:    def detect(f) -> bool:
thenoise/models/illustrious.py:119:        self._y = None
thenoise/models/illustrious.py:120:        self._y_uncond = None
thenoise/models/illustrious.py:198:        self._y = torch.cat([cond.pooled, size_embeds], dim=-1).to(self.dtype)
thenoise/models/illustrious.py:200:            self._y_uncond = torch.cat([cond.neg_pooled, size_embeds], dim=-1).to(self.dtype)
thenoise/models/illustrious.py:202:            self._y_uncond = None
thenoise/models/illustrious.py:223:    def denoise_step(
thenoise/models/illustrious.py:240:            eps = self.dit(scaled, t_full, self._y, context)
thenoise/models/illustrious.py:241:            if guidance_scale > 1.0 and self._y_uncond is not None and cond.null is not None:
thenoise/models/illustrious.py:243:                    scaled, t_full, self._y_uncond, cond.null.to(dev, dtype=self.dtype)
thenoise/models/illustrious.py:259:    def _upscale_format(self) -> str:
thenoise/dit/illustrious/utils.py:36:    logger = __import__("logging").getLogger(__name__)

```

---

## Assistant (Build · strix.Qwen3.8-27B · 66.0s)

_Thinking:_

I have all the info I need. Let me write the review concisely.

Overall: no functional bugs found in production code; tests pass (78). Main finding is documentation (README). Plus a few minor/robustness notes.

Let me write it.


Reviewed the full commit (18 files, ~50k lines; the bulk is the vendored CLIP tokenizer `vocab.json`/`merges.txt`). Focused on the production Python. Tests pass: `78 passed`. I traced the schedule math, UNet/CLIP/VAE key layouts, the sampler-fallback path, and the pipeline integration.

## Overall
No functional bugs found in the production code. The discrete-euler schedule, the `1/sqrt(sigma²+1)` input scaling, the dual-CLIP penultimate/pooled extraction, the SDXL UNet transformer-depth layout, and the VAE `scaling_factor` all hang together consistently, and the `er_sde → euler` fallback is correct and backward-compatible (models without `SUPPORTED_SAMPLERS` keep old behavior). The findings below are one real doc gap plus minor/robustness notes.

## Documentation (in scope — the main gap)
**README.md is not updated for the new model.** This commit adds a model + a `scripts/download_illustrious.py` but the user-facing docs don't mention it:
- `README.md:180` — "Anima, Krea 2, and Z-Image-Turbo are supported." should include Illustrious.
- `README.md:186-191` — the Supported Models table has no Illustrious row.
- No `### Illustrious` download section (the other three models each have one at `README.md:193-233`).
- `README.md:341` — the `sampler` row documents default `er_sde` and options `euler` or `er_sde`, but doesn't mention that discrete models (Illustrious) only support `euler` and auto-fallback. A user reading the API table won't know Illustrious defaults to `euler`/CFG 5.

## Minor / robustness
- **`thenoise/models/illustrious.py:259` `_upscale_format` raises `NotImplementedError`.** This is the right call (no 4-channel upscaler), but with the default `upscale_type="refined"`, a request with `--upscale` reaches `_upscale_and_refine → load_latent_upscaler → _upscale_format()` (pipeline.py:428) and surfaces as an unhandled exception / HTTP 500 rather than a clean request-validation error. The message is clear, but a friendlier pre-flight rejection would be nicer. Low severity.
- **`thenoise/dit/illustrious/utils.py:36`** uses `logger = __import__("logging").getLogger(__name__)` inline. Every other loader in this package (`text.py`, `vae.py`, `models.py`) sets up a module-level logger via `setup_logging()`. It works (logging is already configured by the sibling imports), but it's inconsistent with the established pattern. Trivial.
- **`thenoise/models/base.py:85-86`** adds `pooled`/`neg_pooled` to the generic `Conditioning` dataclass. Only SDXL-family models use them; it's optional and harmless, but it's a slight leak of one model family's needs into the shared base. Acceptable, just noting it.

Nothing here blocks the proposal. The README update is the one thing I'd want before merging.

---

