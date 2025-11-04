import axios from "axios";
import pptxgen from "pptxgenjs";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

// Directory for saving generated PPT files
const pptDir = path.resolve("uploads");
if (!fs.existsSync(pptDir)) fs.mkdirSync(pptDir);

/**
 * Generate slides based on a text prompt
 */
export const generateSlides = async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    if (!apiKey) {
      console.error("❌ Missing GEMINI_API_KEY in .env");
      return res.status(500).json({ message: "Gemini API key not configured" });
    }

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    console.log(`🧠 Generating slides for: "${prompt}" using model: ${model}`);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: `Generate a clean JSON object for PowerPoint slides on topic: "${prompt}". 
                Format example: 
                {
                  "title": "Topic Title",
                  "slides": [
                    { "title": "Slide 1 Title", "content": ["point 1", "point 2"] }
                  ]
                }`
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey, // ✅ correct for AI Studio keys
        },
      }
    );

    const textOutput =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!textOutput) {
      console.error("⚠️ No text response from Gemini:", response.data);
      return res.status(500).json({ message: "No content returned from Gemini" });
    }

    // Safely extract JSON from Gemini text response
    let slideData;
    try {
      slideData = JSON.parse(textOutput);
    } catch {
      const jsonMatch = textOutput.match(/{[\s\S]*}/);
      if (jsonMatch) {
        slideData = JSON.parse(jsonMatch[0]);
      } else {
        console.error("⚠️ Could not parse JSON:", textOutput);
        return res.status(500).json({ message: "Gemini returned non-JSON response" });
      }
    }

    res.json({ success: true, slides: slideData });
  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    res
      .status(error.response?.status || 500)
      .json({ message: "Failed to generate slides", details: error.message });
  }
};

/**
 * Edit or update slides with a new prompt
 */
export const editSlides = async (req, res) => {
  try {
    const { slides, prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    if (!slides || !prompt) {
      return res
        .status(400)
        .json({ message: "Slides JSON and prompt are required" });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are editing PowerPoint slides. Here are the existing slides: 
                ${JSON.stringify(slides)}.
                Instruction: ${prompt}.
                Return the entire updated slide JSON in the same format.`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
      }
    );

    const textOutput =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!textOutput) {
      return res.status(500).json({ message: "No response from Gemini" });
    }

    let updatedSlides;
    try {
      updatedSlides = JSON.parse(textOutput);
    } catch {
      const match = textOutput.match(/{[\s\S]*}/);
      updatedSlides = match ? JSON.parse(match[0]) : null;
    }

    if (!updatedSlides) {
      return res.status(500).json({ message: "Failed to parse Gemini response" });
    }

    res.json({ success: true, slides: updatedSlides });
  } catch (error) {
    console.error("❌ Edit Slides Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to edit slides" });
  }
};

/**
 * Convert slide JSON to PPTX file and return the download URL
 */
export const generatePPT = async (req, res) => {
  try {
    const { slides } = req.body;
    if (!slides || !Array.isArray(slides)) {
      return res.status(400).json({ message: "Invalid slides format" });
    }

    const pptx = new pptxgen();

    // === build slides ===
    slides.forEach((s) => {
      const slide = pptx.addSlide();
      slide.addText(s.title || "Untitled Slide", {
        x: 1,
        y: 0.5,
        fontSize: 28,
        bold: true,
      });
      s.content?.forEach((item, i) => {
        slide.addText(`• ${item}`, {
          x: 1,
          y: 1.5 + i * 0.5,
          fontSize: 18,
        });
      });
    });

    const fileName = `slide_${Date.now()}.pptx`;
    const filePath = path.join(pptDir, fileName);

    // ✅ generate Base64 then convert to Buffer
    const b64 = await pptx.write("base64");
    const buffer = Buffer.from(b64, "base64");
    fs.writeFileSync(filePath, buffer);

    console.log("✅ PowerPoint generated:", filePath);
    res.json({ success: true, url: `/uploads/${fileName}` });
  } catch (error) {
    console.error("❌ PPT Generation Error:", error);
    res.status(500).json({ message: "Failed to generate PPT file" });
  }
};

/* ---------------------------------- PDF ---------------------------------- */
export const generatePDF = async (req, res) => {
  try {
    const { slides } = req.body;
    if (!slides || !Array.isArray(slides)) {
      return res.status(400).json({ message: "Invalid slides format" });
    }

    const fileName = `slide_${Date.now()}.pdf`;
    const filePath = path.join(pptDir, fileName);

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    slides.forEach((s, i) => {
      if (i > 0) doc.addPage();

      doc.fontSize(22).fillColor("#0056D2").text(s.title || "Untitled Slide", {
        align: "left",
      });
      doc.moveDown();

      doc.fontSize(14).fillColor("#333");
      s.content?.forEach((item) => {
        doc.text(`• ${item}`, { indent: 20, lineGap: 4 });
      });
    });

    doc.end();

    // ✅ Wait for file to finish writing
    writeStream.on("finish", () => {
      const fileBuffer = fs.readFileSync(filePath);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
      res.send(fileBuffer);
    });
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    res.status(500).json({ message: "Failed to generate PDF file" });
  }
};