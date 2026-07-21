# SceneScript — Multimodal Toxic Meme Detection

> KID-VLM: Knowledge-Infused Distilled Vision-Language Model for hate speech detection in memes.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-scenescript.vercel.app-7c3aed?style=flat-square)](https://scenescript-frontend.vercel.app)
[![API Docs](https://img.shields.io/badge/API%20Docs-onrender.com-0ea5e9?style=flat-square)](https://scenescript-api.onrender.com/docs)
[![Research](https://img.shields.io/badge/Research-KID--VLM-22c55e?style=flat-square)](#research)

---

## Overview

SceneScript is a full-stack AI system for multimodal toxic meme classification. It combines image and text signals using a Knowledge-Infused Distilled Vision-Language Model (KID-VLM), achieving **77% accuracy** on the Facebook Hateful Memes dataset.

This repository contains:
- `backend/` — FastAPI inference server (CLIP + KID-VLM)
- `src/` — React + Vite frontend demo

---

## Features

| Feature | Description |
|---|---|
| **Single Moderation** | Upload a meme image + caption → get label + confidence |
| **Explainability** | Word-level attribution via CLIP cosine similarity |
| **Batch Moderation** | Moderate up to 10 memes simultaneously |

---

## Tech Stack

**Frontend:** React 19, Vite 8, Tailwind CSS 3, axios, lucide-react

**Backend:** FastAPI, PyTorch, CLIP (openai/clip-vit-base-patch32), SQLite, slowapi

**Models:** CLIP, ViT, BERT, ResNet50, EfficientNetB0, SVM + TF-IDF

---

## API

Base URL: `https://scenescript-api.onrender.com`

| Method | Path | Description |
|---|---|---|
| `GET` | `/v1/health` | Health check |
| `POST` | `/v1/moderate` | Single image + text moderation |
| `POST` | `/v1/moderate/batch` | Batch moderation (max 10) |
| `POST` | `/v1/explain` | Word-level attribution |

**Example:**
```bash
curl -X POST https://scenescript-api.onrender.com/v1/moderate \
  -H "x-api-key: dev-key-scenescript-2024" \
  -F "image=@meme.jpg" \
  -F "text=Look at this"
```

**Response:**
```json
{
  "label": "not_hateful",
  "confidence": 0.87,
  "text_signal": "medium",
  "model_version": "scenescript-v1",
  "latency_ms": 243
}
```

---

## Research

**KID-VLM** — Knowledge Infusion & Distillation for Detection of Indecent Memes

The model fuses image, text, and knowledge embeddings via:

```
z = φ([f_image ⊕ f_text ⊕ f_knowledge])
ŷ = σ(Wz + b)
```

A CLIP teacher model distills representations into a lightweight student network using combined distillation + classification loss.

### Results

| Model | Accuracy | F1 | AUC |
|---|---|---|---|
| TF-IDF + SVM | 57.2% | 0.51 | 0.59 |
| BERT (fine-tuned) | 81.25% | 0.80 | 0.87 |
| ResNet50 + RF | 62.1% | 0.58 | 0.65 |
| ViT + RF | 65.3% | 0.62 | 0.69 |
| CLIP Zero-shot | 68.8% | 0.65 | 0.72 |
| **KID-VLM (Early Fusion)** | **77.0%** | **0.75** | **0.82** |

**Datasets:** Facebook Hateful Memes (8,500 samples) · HarMeme (3,544 samples)

---

## Local Development

```bash
# Frontend
npm install
npm run dev        # http://localhost:5173

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Citation

```
KID-VLM: Knowledge Infusion & Distillation for Detection of INdecent Memes
Research Project, Aug – Dec 2025
```

---

*Built by [@aarzoodhankhar](https://github.com/aarzoodhankhar)*
