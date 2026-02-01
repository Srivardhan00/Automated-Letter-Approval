import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateLocalPDF = async (templateName, data, outputFileName) => {
    try {
        const templatePath = path.join(__dirname, `../templates/${templateName}.html`);
        const templateHtml = fs.readFileSync(templatePath, "utf8");
        const template = handlebars.compile(templateHtml);
        const html = template(data);

        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        // Save to temp file
        const outputPath = path.resolve("public/temp", outputFileName);
        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        await page.pdf({
            path: outputPath,
            format: "A4",
            printBackground: true
        });

        await browser.close();
        return outputPath;
    } catch (error) {
        console.error("PDF Generation Error:", error);
        throw new Error("Failed to generate PDF: " + error.message);
    }
};
