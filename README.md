# SceneScript — AI Multimodal Content Moderation API

> Detect toxic/hateful memes using image + text together. Built on KID-VLM research.

## Quick Start

```bash
curl -X POST https://your-api.onrender.com/v1/moderate   -H "x-api-key: dev-key-scenescript-2024"   -F "image=@meme.jpg"   -F "text=Look at this"

Response

{
  "label": "not_hateful",
  "confidence": 0.8731,
  "text_signal": "medium",
  "model_version": "scenescript-v1",
  "latency_ms": 243.5
}

Architecture

- Model: CLIP (openai/clip-vit-base-patch32) + MLP classifier
- Research: KID-VLM — Knowledge Infusion & Distillation for meme detection
- Dataset: Facebook Hateful Memes (8,500 samples), accuracy: 68.8%
- Fallback: Zero-shot CLIP similarity if no fine-tuned model present

Endpoints

┌────────┬────────────────────┬──────────────────────────────┐
│ Method │        Path        │         Description          │
├────────┼────────────────────┼──────────────────────────────┤
│ GET    │ /v1/health         │ Health check                 │
├────────┼────────────────────┼──────────────────────────────┤
│ POST   │ /v1/moderate       │ Single image+text moderation │
├────────┼────────────────────┼──────────────────────────────┤
│ POST   │ /v1/moderate/batch │ Batch moderation (max 10)    │
└────────┴────────────────────┴──────────────────────────────┘

Research Paper

Just KIDDIN': Knowledge Infusion and Distillation for Detection of INdecent Memes
