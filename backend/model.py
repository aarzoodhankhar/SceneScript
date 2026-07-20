import torch
import numpy as np
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import io, pickle, os

device = "cuda" if torch.cuda.is_available() else "cpu"

clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
clip_model.eval()

def get_clip_embedding(image, text):
    inputs = clip_processor(
        text=[text], images=[image], return_tensors="pt", padding=True
    ).to(device)
    with torch.no_grad():
        text_emb = clip_model.get_text_features(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"]
        )
        image_emb = clip_model.get_image_features(pixel_values=inputs["pixel_values"])
    return torch.cat([text_emb, image_emb], dim=1).cpu().numpy()

MLP_PATH = os.getenv("MLP_MODEL_PATH", "scenescript_clip_mlp.pkl")
mlp = None

def load_model():
    global mlp
    if os.path.exists(MLP_PATH):
        with open(MLP_PATH, "rb") as f:
            mlp = pickle.load(f)
        print(f"MLP model loaded from {MLP_PATH}")
    else:
        print("WARNING: MLP model not found — using zero-shot CLIP fallback")

def clip_zeroshot(image, text):
    inputs = clip_processor(
        text=["a hateful meme", "a normal meme"],
        images=[image], return_tensors="pt", padding=True
    ).to(device)
    with torch.no_grad():
        probs = clip_model(**inputs).logits_per_image.softmax(dim=1).cpu().numpy()[0]
    return int(np.argmax(probs)), float(probs[np.argmax(probs)])

def predict(image_bytes, text):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    embedding = get_clip_embedding(image, text)
    if mlp is not None:
        label = int(mlp.predict(embedding)[0])
        proba = mlp.predict_proba(embedding)[0]
        confidence = float(proba[label])
    else:
        label, confidence = clip_zeroshot(image, text)
    return {
        "label": "hateful" if label == 1 else "not_hateful",
        "confidence": round(confidence, 4),
        "text_signal": "high" if abs(float(np.linalg.norm(embedding[0, :512]))) > 0.5 else "medium",
        "model_version": "scenescript-v1",
        "research_paper": "https://github.com/kanchanlamba/Just-KIDDIN-Knowledge-Infusion-and-Distillation-for-Detection-of-INdecent-Memes"
    }
