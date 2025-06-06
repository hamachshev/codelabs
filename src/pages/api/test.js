import { exec } from 'child_process';
import path from 'path';
import fs from 'fs'


export const prerender = false;
export function GET({ request }) {
const url = new URL(request.url);         
const stage = url.searchParams.get("stage");  

  
const filePath = path.resolve('./codelab.config.json');
const jsonData = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(jsonData);

console.log(data);

  exec(`cd ${data.name} && ` + data.testing.command + `stage_${stage}_`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`⚠️ Stderr: ${stderr}`);
      return;
    }
    console.log(`✅ Output:\n${stdout}`);
  });

  return new Response(
    JSON.stringify({
      name: "Astro",
      stage: stage,
      success: true
    }),
  );
}