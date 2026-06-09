const fs = require('fs');

async function transliterate(text) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const json = await res.json();
    return json[0][0][0];
  } catch (e) {
    return text;
  }
}

async function main() {
  const filePath = 'src/data/familyTrees.ts';
  let content = fs.readFileSync(filePath, 'utf8');

  // Add hindiName type to Person and VillageTree
  content = content.replace(/urduName\?: string;/g, "urduName?: string;\n  hindiName?: string;");
  content = content.replace(/urduName: string;/g, "urduName: string;\n  hindiName: string;");

  // Find all objects with name and urduName
  const regex = /name:\s*"([^"]+)",\s*urduName:\s*(?:"([^"]+)"|null)/g;
  let match;
  const replacements = [];

  while ((match = regex.exec(content)) !== null) {
    const originalText = match[0];
    const englishName = match[1];
    replacements.push({ originalText, englishName });
  }

  // Also match cases where urduName is absent but fatherId is present (like Bholai)
  const regex2 = /name:\s*"([^"]+)",\s*(fatherId|slug):/g;
  while ((match = regex2.exec(content)) !== null) {
    if (!match[0].includes("urduName")) {
      const originalText = match[0];
      const englishName = match[1];
      const afterField = match[2];
      replacements.push({ 
        originalText, 
        englishName, 
        replaceWith: async (hi) => `name: "${englishName}",\n    hindiName: "${hi}",\n    ${afterField}:` 
      });
    }
  }

  for (const rep of replacements) {
    const hiName = await transliterate(rep.englishName);
    
    if (rep.replaceWith) {
      const newText = await rep.replaceWith(hiName);
      content = content.replace(rep.originalText, newText);
    } else {
      const isNull = rep.originalText.includes("null");
      const urduPart = isNull ? "null" : `"${rep.originalText.match(/urduName:\s*"([^"]+)"/)[1]}"`;
      const newText = `name: "${rep.englishName}",\n    urduName: ${urduPart},\n    hindiName: "${hiName}"`;
      content = content.replace(rep.originalText, newText);
    }
    // simple delay to prevent rate limit
    await new Promise(r => setTimeout(r, 100)); 
  }

  // Fix villageSeed satisfy array
  content = content.replace(/urduName: string;\n  alternateSpellings/g, "urduName: string;\n  hindiName: string;\n  alternateSpellings");

  // Fix villageBranchPeople
  content = content.replace(/urduName: village.urduName,/g, "urduName: village.urduName,\n  hindiName: village.hindiName,");

  fs.writeFileSync(filePath, content);
  console.log("Transliteration complete!");
}

main();
