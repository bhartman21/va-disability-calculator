import { Disability, Extremity } from '../models';

export interface ParsedCsvResult {
  serviceConnected: Omit<Disability, 'id'>[];
  notServiceConnected: { name: string; rating: number; reason: string }[];
}

export function parseCsv(csvContent: string): ParsedCsvResult {
  const result: ParsedCsvResult = {
    serviceConnected: [],
    notServiceConnected: []
  };

  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return result;

  const headers = parseCsvLine(lines[0]);
  const textIdx = headers.findIndex(h => h.trim() === 'Diagnostic Text');
  const ratingIdx = headers.findIndex(h => h.trim() === 'Rating Percentage');
  const decisionIdx = headers.findIndex(h => h.trim() === 'Decision');
  const dcIdx = headers.findIndex(h => h.trim() === 'Diagnostic Type Code');
  const secondaryDcIdx = headers.findIndex(h => h.trim() === 'hyph_diagnostic_type_code');

  if (textIdx === -1 || ratingIdx === -1 || decisionIdx === -1) {
    throw new Error('INVALID_FORMAT');
  }

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length <= Math.max(textIdx, ratingIdx, decisionIdx)) continue;

    const name = cols[textIdx].trim();
    const ratingRaw = cols[ratingIdx].trim().replace(/['"]/g, '');
    const rating = parseInt(ratingRaw, 10) || 0;
    const decision = cols[decisionIdx].trim();
    
    // Extract DCs if columns exist
    const diagnosticCode = dcIdx !== -1 ? cols[dcIdx].trim().replace(/['"]/g, '') : undefined;
    const secondaryDiagnosticCode = secondaryDcIdx !== -1 ? cols[secondaryDcIdx].trim().replace(/['"]/g, '') : undefined;

    if (decision.toLowerCase().includes('not service connected')) {
      result.notServiceConnected.push({ name, rating, reason: decision });
    } else {
      const extremity = determineExtremity(name);
      result.serviceConnected.push({ 
        name, 
        rating, 
        extremity, 
        diagnosticCode: diagnosticCode || undefined,
        secondaryDiagnosticCode: secondaryDiagnosticCode || undefined
      });
    }
  }

  return result;
}

function parseCsvLine(text: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result.map(s => {
    let clean = s.trim();
    if (clean.startsWith('"') && clean.endsWith('"')) {
      clean = clean.substring(1, clean.length - 1);
    }
    return clean;
  });
}

function determineExtremity(text: string): Extremity {
  const lower = text.toLowerCase();
  
  // Explicit "Extremity" keywords
  if (lower.includes('left upper extremity')) return 'left-arm';
  if (lower.includes('right upper extremity')) return 'right-arm';
  if (lower.includes('left lower extremity')) return 'left-leg';
  if (lower.includes('right lower extremity')) return 'right-leg';
  
  // Fallbacks for plain english commonly used in some VA strings
  if (lower.includes('left arm') || lower.includes('left shoulder') || lower.includes('left elbow')) return 'left-arm';
  if (lower.includes('right arm') || lower.includes('right shoulder') || lower.includes('right elbow')) return 'right-arm';
  if (lower.includes('left leg') || lower.includes('left knee') || lower.includes('left ankle')) return 'left-leg';
  if (lower.includes('right leg') || lower.includes('right knee') || lower.includes('right ankle')) return 'right-leg';
  
  return 'none';
}
