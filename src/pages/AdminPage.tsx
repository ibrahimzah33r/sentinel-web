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

  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
    if (!username.trim() || !password) {
      return;
    }

    try {
      setError(null);
      setActionLoading("create");

      const createdAnalyst = await createAnalyst({
        username: username.trim(),
        password,
      });

      setAnalysts((currentAnalysts) => [...currentAnalysts, createdAnalyst]);

      setUsername("");
      setPassword("");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setError("That username already exists.");
        return;
      }

      setError("Unable to create analyst.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleEnabledChange(analyst: AnalystResponse) {
    try {
      setError(null);
      setActionLoading(`enabled-${analyst.id}`);

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
    } finally {
      setActionLoading(null);
    }
  }

  async function handleResetPassword() {
    if (resetAnalystId === null || !resetPassword) {
      return;
    }

    try {
      setError(null);
      setActionLoading(`reset-${resetAnalystId}`);

      await resetAnalystPassword(resetAnalystId, {
        password: resetPassword,
      });

      setResetAnalystId(null);
      setResetPassword("");
    } catch {
      setError("Unable to reset password.");
    } finally {
      setActionLoading(null);
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

        <button
          type="button"
          onClick={handleCreateAnalyst}
          disabled={!username.trim() || !password || actionLoading === "create"}
        >
          {actionLoading === "create" ? "Creating..." : "Add analyst"}
        </button>
      </section>

      <section>
        <h3>Analysts</h3>

        {analysts.map((analyst) => (
          <article key={analyst.id} className="analyst-card">
            <div className="analyst-summary">
              <strong>{analyst.username}</strong>

              <div className="analyst-meta">
                <span>{analyst.role}</span>

                <span>{analyst.enabled ? "Active" : "Disabled"}</span>
              </div>
            </div>

            <div className="analyst-actions">
              <button
                type="button"
                onClick={() => setResetAnalystId(analyst.id)}
              >
                Reset password
              </button>

              {analyst.role !== "ADMIN" && (
                <button
                  type="button"
                  onClick={() => handleEnabledChange(analyst)}
                  disabled={actionLoading === `enabled-${analyst.id}`}
                >
                  {actionLoading === `enabled-${analyst.id}`
                    ? analyst.enabled
                      ? "Disabling..."
                      : "Enabling..."
                    : analyst.enabled
                      ? "Disable"
                      : "Enable"}
                </button>
              )}
            </div>

            {resetAnalystId === analyst.id && (
              <div className="analyst-password-reset">
                <input
                  type="password"
                  value={resetPassword}
                  placeholder="New password"
                  onChange={(event) => setResetPassword(event.target.value)}
                />

                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={
                    !resetPassword || actionLoading === `reset-${analyst.id}`
                  }
                >
                  {actionLoading === `reset-${analyst.id}`
                    ? "Saving..."
                    : "Save password"}
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
