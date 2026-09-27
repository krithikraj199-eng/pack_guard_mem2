import { AnalysisResult, ComplaintPayload, ComplaintResponse } from './types';

// Proposed integration contract with Member 3's FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface ApiStatus {
  online: boolean;
  statusText: string;
  baseUrl: string;
  latencyMs?: number;
}

export async function checkBackendHealth(): Promise<ApiStatus> {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return {
        online: true,
        statusText: 'FastAPI Backend Online',
        baseUrl: API_BASE_URL,
        latencyMs: Date.now() - startTime
      };
    } else {
      return {
        online: false,
        statusText: `Backend Error (${res.status})`,
        baseUrl: API_BASE_URL
      };
    }
  } catch (err: unknown) {
    const error = err as Error;
    return {
      online: false,
      statusText: error.name === 'AbortError' ? 'Backend Timeout' : 'Backend Offline (FastAPI not reachable)',
      baseUrl: API_BASE_URL
    };
  }
}

export async function analyzePackageImage(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('client_timestamp', new Date().toISOString());

  const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown server error');
    throw new Error(`Live Analysis Failed [HTTP ${response.status}]: ${errorBody || 'Member 3 API endpoint returned an error'}`);
  }

  const data: AnalysisResult = await response.json();
  return data;
}

export async function submitComplaint(payload: ComplaintPayload): Promise<ComplaintResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown server error');
    throw new Error(`Complaint Submission Failed [HTTP ${response.status}]: ${errorBody}`);
  }

  const data: ComplaintResponse = await response.json();
  return data;
}
