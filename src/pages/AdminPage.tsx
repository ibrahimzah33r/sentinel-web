import { useEffect, useState } from "react";
import { ApiError } from "../api/client";

import {
  createAnalyst,
  getAnalysts,
  resetAnalystPassword,
  setAnalystEnabled,
} from "../api/admin";

import type { AnalystResponse } from "../api/admin";

function AdminPage() {
  const [analysts, setAnalysts] = useState<AnalystResponse[]>([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [resetPassword, setResetPassword] = useState("");

  const [resetAnalystId, setResetAnalystId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalysts();
  }, []);

  async function loadAnalysts() {
    try {
      setError(null);

      const response = await getAnalysts();

      setAnalysts(response);
    } catch {
      setError("Unable to load analysts.");
    }
  }

  async function handleCreateAnalyst() {
    try {
      setError(null);

      const createdAnalyst = await createAnalyst({
        username,
        password,
      });

      setAnalysts((currentAnalysts) => [...currentAnalysts, createdAnalyst]);

      setUsername("");
      setPassword("");
    } catch (error) {
      if (error instanceof ApiError) {
        setError(`Unable to create analyst: ${error.message}`);
        return;
      }

      setError("Unable to create analyst.");
    }
  }

  async function handleEnabledChange(analyst: AnalystResponse) {
    try {
      setError(null);

      const updatedAnalyst = await setAnalystEnabled(
        analyst.id,
        !analyst.enabled,
      );

      setAnalysts((currentAnalysts) =>
        currentAnalysts.map((currentAnalyst) =>
          currentAnalyst.id === updatedAnalyst.id
            ? updatedAnalyst
            : currentAnalyst,
        ),
      );
    } catch {
      setError("Unable to update analyst.");
    }
  }

  async function handleResetPassword() {
    if (resetAnalystId === null) {
      return;
    }

    try {
      setError(null);

      await resetAnalystPassword(resetAnalystId, {
        password: resetPassword,
      });

      setResetAnalystId(null);
      setResetPassword("");
    } catch {
      setError("Unable to reset password.");
    }
  }

  return (
    <section>
      <h2>Admin</h2>
      <p>Manage Sentinel analyst accounts.</p>

      {error && <p role="alert">{error}</p>}

      <section>
        <h3>Add analyst</h3>

        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(event) => setUsername(event.target.value)}
        />

        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="button" onClick={handleCreateAnalyst}>
          Add analyst
        </button>
      </section>

      <section>
        <h3>Analysts</h3>

        {analysts.map((analyst) => (
          <article key={analyst.id}>
            <div>
              <strong>{analyst.username}</strong>

              <span>{analyst.role}</span>

              <span>{analyst.enabled ? "Active" : "Disabled"}</span>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setResetAnalystId(analyst.id)}
              >
                Reset password
              </button>

              <button
                type="button"
                onClick={() => handleEnabledChange(analyst)}
              >
                {analyst.enabled ? "Disable" : "Enable"}
              </button>
            </div>

            {resetAnalystId === analyst.id && (
              <div>
                <input
                  type="password"
                  value={resetPassword}
                  placeholder="New password"
                  onChange={(event) => setResetPassword(event.target.value)}
                />

                <button type="button" onClick={handleResetPassword}>
                  Save password
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setResetAnalystId(null);
                    setResetPassword("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </article>
        ))}
      </section>
    </section>
  );
}

export default AdminPage;
