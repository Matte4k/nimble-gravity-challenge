import { useEffect, useState } from "react";
import { getJobs, getCandidateByEmail, applyToJob, type Job, type Candidate } from "./services/api";

const MY_EMAIL = "mateonicolas96@gmail.com";

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [repoUrls, setRepoUrls] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, "idle" | "loading" | "success" | "error">>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getJobs(), getCandidateByEmail(MY_EMAIL)])
      .then(([jobs, candidate]) => {
        setJobs(jobs);
        setCandidate(candidate);
      })
      .catch(() => setError("No se pudieron cargar los datos. Revisá tu email o la conexión."));
  }, []);

  const handleSubmit = async (jobId: string) => {
    if (!candidate) return;
    const repoUrl = repoUrls[jobId]?.trim();
    if (!repoUrl) return alert("Ingresá la URL del repositorio");

    // LOG que utilice para verificar un error en el POST, ya que la API
    // no me permitia enviar la aplicacion
    console.log("Payload que se envía:", {
        uuid: candidate.uuid,
        jobId,
        candidateId: candidate.candidateId,
        repoUrl,
    });

    setStatuses((prev) => ({ ...prev, [jobId]: "loading" }));
    try {
      await applyToJob({
        uuid: candidate.uuid,
        jobId,
        candidateId: candidate.candidateId,
        applicationId: candidate.applicationId, // ← agregás esta línea
        repoUrl,
      });
      setStatuses((prev) => ({ ...prev, [jobId]: "success" }));
    } catch {
      setStatuses((prev) => ({ ...prev, [jobId]: "error" }));
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!candidate || jobs.length === 0) return <p>Cargando...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Posiciones Abiertas</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {jobs.map((job) => (
          <li key={job.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 12px" }}>{job.title}</h3>
            <input
              type="text"
              placeholder="https://github.com/user/repo"
              value={repoUrls[job.id] ?? ""}
              onChange={(e) => setRepoUrls((prev) => ({ ...prev, [job.id]: e.target.value }))}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box", marginBottom: 8, borderRadius: 4, border: "1px solid #ccc" }}
            />
            <button
              onClick={() => handleSubmit(job.id)}
              disabled={statuses[job.id] === "loading" || statuses[job.id] === "success"}
              style={{
                padding: "8px 20px",
                backgroundColor: statuses[job.id] === "success" ? "#4caf50" : "#0070f3",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {statuses[job.id] === "loading" ? "Enviando..." : statuses[job.id] === "success" ? "Enviado" : "Submit"}
            </button>
            {statuses[job.id] === "error" && <p style={{ color: "red", marginTop: 8 }}>Error al enviar. Intentá de nuevo.</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}