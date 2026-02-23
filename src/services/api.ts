// Pase de usar el BASE_URL aca a un proxy para evitar el bloqueo del CORS que no me permitia consumir la API desde localhost.
const BASE_URL = "";

// Interfaces para candidatos y posiciones abiertas
export interface Candidate {
  uuid: string;
  candidateId: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Job {
  id: string;
  title: string;
}

// GET para obtener candidato por email
export async function getCandidateByEmail(email: string): Promise<Candidate> {
  const res = await fetch(`${BASE_URL}/api/candidate/get-by-email?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Error al obtener candidato.");
  return res.json();
}

// GET para obtener lista de posiciones abiertas
export async function getJobs(): Promise<Job[]> {
  const res = await fetch(`${BASE_URL}/api/jobs/get-list`);
  if (!res.ok) throw new Error("Error al obtener posiciones.");
  return res.json();
}

// POST para aplicar a una posición, agregue applicationID
// al body ya que la API lo requiere
export async function applyToJob(payload: {
  uuid: string;
  jobId: string;
  candidateId: string;
  applicationId: string; // ← agregás este campo
  repoUrl: string;
}): Promise<{ ok: boolean }> {
  const res = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al enviar postulación");
  return res.json();
}