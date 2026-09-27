function escapePdfText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function buildSimplePdf(title: string, lines: string[]): Uint8Array {
  const header = "%PDF-1.4\n";
  const wrapped: string[] = [];
  for (const line of lines) {
    const chunks = line.length > 92 ? line.match(/.{1,92}/g) ?? [line] : [line];
    wrapped.push(...chunks);
  }
  const bodyLines = [`(${escapePdfText(title)}) Tj`, "0 -22 Td", ...wrapped.flatMap((l, i) => {
    const cmd = [`(${escapePdfText(l)}) Tj`];
    if (i < wrapped.length - 1) cmd.push("0 -14 Td");
    return cmd;
  })];
  const stream = `BT /F1 16 Tf 48 780 Td ${bodyLines.join(" ")} ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let offset = header.length;
  const xref = ["xref", "0 6", "0000000000 65535 f "];
  let body = "";
  objects.forEach((obj, i) => {
    xref.push(`${String(offset).padStart(10, "0")} 00000 n `);
    const chunk = `${i + 1} 0 obj\n${obj}\nendobj\n`;
    body += chunk;
    offset += chunk.length;
  });
  const xrefStart = header.length + body.length;
  const tail = `${xref.join("\n")}\ntrailer << /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return new TextEncoder().encode(header + body + tail);
}
