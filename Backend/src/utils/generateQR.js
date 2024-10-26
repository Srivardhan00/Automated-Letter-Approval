import fs from "fs";
import qr from "qr-image";

const generateQR = (url) => {
  const qr_svg = qr.image(`${url}`, { type: "png" });
  qr_svg.pipe(fs.createWriteStream("qr.png"));
};

export default generateQR;

generateQR("hello world");