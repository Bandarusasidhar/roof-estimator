import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000";

function OwnerPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const [config, setConfig] = useState(null);
  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function getAuthHeader() {
    return "Basic " + btoa(`${username}:${password}`);
  }

  async function login(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/owner/leads`, {
        headers: {
          Authorization: getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error("Invalid username or password.");
      }

      const leadData = await response.json();

      const configResponse = await fetch(`${API}/api/config`);

      if (!configResponse.ok) {
        throw new Error("Unable to load configuration.");
      }

      const configData = await configResponse.json();

      setLeads(leadData);
      setConfig(configData);
      setAuthenticated(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveConfig() {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/owner/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader()
        },
        body: JSON.stringify({
          questions: config.questions,
          modifiers: config.modifiers
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save configuration."
        );
      }

      setConfig(data.config);
      setMessage("Configuration saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateQuestion(questionIndex, field, value) {
    const updatedQuestions = [...config.questions];

    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value
    };

    setConfig({
      ...config,
      questions: updatedQuestions
    });
  }

  function updateOption(
    questionIndex,
    optionIndex,
    field,
    value
  ) {
    const updatedQuestions = [...config.questions];

    const updatedOptions = [
      ...updatedQuestions[questionIndex].options
    ];

    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [field]: value
    };

    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions
    };

    setConfig({
      ...config,
      questions: updatedQuestions
    });
  }

  function updateModifier(field, value) {
    setConfig({
      ...config,
      modifiers: {
        ...config.modifiers,
        [field]: Number(value)
      }
    });
  }

  function logout() {
    setAuthenticated(false);
    setConfig(null);
    setLeads([]);
    setUsername("");
    setPassword("");
  }

  if (!authenticated) {
    return (
      <div className="app">
        <div className="card">
          <h1>Owner Panel</h1>

          <p className="subtitle">
            Northline Roofing & Exteriors
          </p>

          <form onSubmit={login}>
            <div className="contact-section">
              <h2>Owner Login</h2>

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />
            </div>

            {error && (
              <p className="error">
                {error}
              </p>
            )}

            <div className="buttons">
              <button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="center">
        Loading owner panel...
      </div>
    );
  }

  return (
    <div className="app">
      <div className="card">
        <h1>Owner Panel</h1>

        <p className="subtitle">
          {config.business.name}
        </p>

        <div className="buttons">
          <button onClick={saveConfig} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            className="secondary"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        {message && (
          <p className="success">
            {message}
          </p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <div className="contact-section">
          <h2>Global Pricing Modifiers</h2>

          <label>Waste Factor</label>
          <input
            type="number"
            step="0.01"
            value={config.modifiers.waste_factor}
            onChange={(event) =>
              updateModifier(
                "waste_factor",
                event.target.value
              )
            }
          />

          <label>Permit Flat Fee</label>
          <input
            type="number"
            value={config.modifiers.permit_flat_fee}
            onChange={(event) =>
              updateModifier(
                "permit_flat_fee",
                event.target.value
              )
            }
          />

          <label>Range Spread Percentage</label>
          <input
            type="number"
            value={config.modifiers.range_spread_pct}
            onChange={(event) =>
              updateModifier(
                "range_spread_pct",
                event.target.value
              )
            }
          />
        </div>

        <div className="contact-section">
          <h2>Questions & Pricing</h2>

          {config.questions.map((question, questionIndex) => (
            <div
              key={question.key}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "18px",
                marginBottom: "18px"
              }}
            >
              <label>
                Question Label
              </label>

              <input
                type="text"
                value={question.label}
                onChange={(event) =>
                  updateQuestion(
                    questionIndex,
                    "label",
                    event.target.value
                  )
                }
              />

              <label>
                <input
                  type="checkbox"
                  checked={question.active}
                  onChange={(event) =>
                    updateQuestion(
                      questionIndex,
                      "active",
                      event.target.checked
                    )
                  }
                />
                {" "}Active
              </label>

              {question.type === "number" && (
                <>
                  <label>Minimum</label>

                  <input
                    type="number"
                    value={question.min || ""}
                    onChange={(event) =>
                      updateQuestion(
                        questionIndex,
                        "min",
                        Number(event.target.value)
                      )
                    }
                  />

                  <label>Maximum</label>

                  <input
                    type="number"
                    value={question.max || ""}
                    onChange={(event) =>
                      updateQuestion(
                        questionIndex,
                        "max",
                        Number(event.target.value)
                      )
                    }
                  />
                </>
              )}

              {question.options &&
                question.options.length > 0 && (
                  <div style={{ marginTop: "15px" }}>
                    <strong>Options</strong>

                    {question.options.map(
                      (option, optionIndex) => (
                        <div
                          key={option.value}
                          style={{
                            marginTop: "12px",
                            padding: "12px",
                            background: "#f8fafc",
                            borderRadius: "8px"
                          }}
                        >
                          <input
                            type="text"
                            value={option.label}
                            onChange={(event) =>
                              updateOption(
                                questionIndex,
                                optionIndex,
                                "label",
                                event.target.value
                              )
                            }
                          />

                          {option.rate_per_sqft !==
                            undefined && (
                            <input
                              type="number"
                              step="0.01"
                              value={
                                option.rate_per_sqft
                              }
                              onChange={(event) =>
                                updateOption(
                                  questionIndex,
                                  optionIndex,
                                  "rate_per_sqft",
                                  Number(
                                    event.target.value
                                  )
                                )
                              }
                            />
                          )}

                          {option.multiplier !==
                            undefined && (
                            <input
                              type="number"
                              step="0.01"
                              value={option.multiplier}
                              onChange={(event) =>
                                updateOption(
                                  questionIndex,
                                  optionIndex,
                                  "multiplier",
                                  Number(
                                    event.target.value
                                  )
                                )
                              }
                            />
                          )}

                          {option.tear_off_per_sqft !==
                            undefined && (
                            <input
                              type="number"
                              step="0.01"
                              value={
                                option.tear_off_per_sqft
                              }
                              onChange={(event) =>
                                updateOption(
                                  questionIndex,
                                  optionIndex,
                                  "tear_off_per_sqft",
                                  Number(
                                    event.target.value
                                  )
                                )
                              }
                            />
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>

        <div className="contact-section">
          <h2>Captured Leads</h2>

          {leads.length === 0 ? (
            <p>No leads found.</p>
          ) : (
            leads.map((lead) => (
              <div
                key={lead._id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "16px",
                  marginBottom: "12px"
                }}
              >
                <strong>
                  {lead.name}
                </strong>

                <p>{lead.phone}</p>
                <p>{lead.email}</p>

                <p>
                  Estimate: $
                  {Number(
                    lead.estimate_low
                  ).toLocaleString()}
                  {" - $"}
                  {Number(
                    lead.estimate_high
                  ).toLocaleString()}
                </p>

                <details>
                  <summary>
                    View Answers
                  </summary>

                  <pre>
                    {JSON.stringify(
                      lead.answers,
                      null,
                      2
                    )}
                  </pre>
                </details>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnerPanel;