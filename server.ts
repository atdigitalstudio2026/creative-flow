import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to initialize GoogleGenAI lazily and safely
  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // AI Assistant Routes
  app.post("/api/ai/generate-brief", async (req, res) => {
    try {
      const { prompt, taskType, targetAudience } = req.body;
      const ai = getAI();

      if (!ai) {
        // High quality fallback if API key is not configured
        return res.json({
          objective: `Meningkatkan awareness dan konversi campaign untuk ${prompt || "produk"}`,
          targetAudience: targetAudience || "Generasi muda usia 20-35 tahun, aktif di media sosial",
          keyMessage: "Kualitas terbaik, promo spesial terbatas, praktis dan modern",
          designDirection: "Modern, clean, visual kontras tinggi, typography bold & eye-catching",
          mandatoryElements: "Logo Brand, Foto Produk Resolusi Tinggi, Badge Diskon / Promo, Call To Action (CTA)",
          doList: "Gunakan palet warna brand yang segar; Buat headline jelas terbaca dalam 2 detik; Berikan ruang negatif yang cukup",
          dontList: "Jangan menumpuk teks terlalu padat; Hindari warna kusam; Jangan crop produk pada bagian penting",
          checklist: [
            "Logo Brand resolusi vektor/PNG transparan",
            "Hero image produk utama",
            "Label harga / promo diskon",
            "Call to action (Beli Sekarang / Swipe Up)",
            "Brand guideline typography & color palette",
            "Export format sesuai spesifikasi platform"
          ]
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Anda adalah Senior Creative Director. Buat creative brief terstruktur dalam Bahasa Indonesia untuk kebutuhan: "${prompt}". Jenis task: "${taskType || "Desain Kreatif"}".
Kembalikan respon dalam JSON murni dengan format:
{
  "objective": "...",
  "targetAudience": "...",
  "keyMessage": "...",
  "designDirection": "...",
  "mandatoryElements": "...",
  "doList": "...",
  "dontList": "...",
  "checklist": ["item 1", "item 2", "item 3", "item 4", "item 5"]
}`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err: any) {
      console.error("Error generating brief:", err);
      res.status(500).json({ error: "Gagal memproses permintaan AI", details: err.message });
    }
  });

  app.post("/api/ai/summarize-task", async (req, res) => {
    try {
      const { taskData } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          summary: `Task ${taskData?.task_id || "CR-Task"}: "${taskData?.title || ""}" saat ini berstatus "${taskData?.status || "IN_PROGRESS"}" dengan prioritas ${taskData?.priority || "HIGH"}. Telah melalui ${taskData?.revisions?.length || 0} kali revisi dan ${taskData?.versions?.length || 1} iterasi versi file.`,
          insights: "Perhatikan deadline yang semakin dekat. Pastikan seluruh feedback revisi terakhir telah diakomodir sebelum final approval."
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Anda adalah AI Creative Operations Specialist. Buat ringkasan eksekutif singkat (2-3 kalimat) dan 1 rekomendasi tindakan dalam Bahasa Indonesia untuk data pekerjaan berikut:
${JSON.stringify(taskData, null, 2)}
Kembalikan JSON dengan format: { "summary": "...", "insights": "..." }`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Error summarizing task:", err);
      res.status(500).json({ error: "Gagal merangkum task", details: err.message });
    }
  });

  app.post("/api/ai/summarize-revisions", async (req, res) => {
    try {
      const { revisions } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          summary: "Revisi berfokus pada penyesuaian hierarki tipografi judul, kontras warna latar belakang, dan proporsi penempatan logo brand agar tidak terpotong.",
          actionPoints: [
            "Perbesar ukuran heading utama dan rapikan kerning teks",
            "Gunakan background yang lebih bersih dan modern",
            "Pastikan logo ditempatkan dengan safe margin minimal 40px"
          ]
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Rangkum poin-poin feedback revisi berikut menjadi intisari actionable yang mudah dipahami desainer dalam Bahasa Indonesia:
${JSON.stringify(revisions, null, 2)}
Kembalikan JSON format: { "summary": "...", "actionPoints": ["...", "..."] }`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Error summarizing revisions:", err);
      res.status(500).json({ error: "Gagal merangkum revisi", details: err.message });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "creative-task-flow-api", timestamp: new Date().toISOString() });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Creative Task Flow server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
