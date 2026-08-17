import { useEffect, useState } from "react";
import "./App.css";

const API = "https://roof-estimator-server.onrender.com";

function App() {
  const [config, setConfig] = useState(null);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/config`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load configuration");
        }

        return response.json();
      })
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to connect to the estimator.");
        setLoading(false);
      });
  }, []);

  function handleAnswer(key, value) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [key]: value
    }));

    setError("");
  }

  function validateCurrentQuestion() {
    const question = config.questions
      .filter((item) => item.active)[step];

    const answer = answers[question.key];

    if (
      question.required &&
      (answer === undefined || answer === null || answer === "")
    ) {
      setError("Please answer this question before continuing.");
      return false;
    }

    if (question.type === "number") {
      const numberValue = Number(answer);

      if (Number.isNaN(numberValue)) {
        setError("Please enter a valid number.");
        return false;
      }

      if (
        question.min !== undefined &&
        numberValue < question.min
      ) {
        setError(
          `Please enter a value of at least ${question.min}.`
        );
        return false;
      }

      if (
        question.max !== undefined &&
        numberValue > question.max
      ) {
        setError(
          `Please enter a value no greater than ${question.max}.`
        );
        return false;
      }
    }

    return true;
  }

  function nextStep() {
    if (!validateCurrentQuestion()) {
      return;
    }

    const activeQuestions = config.questions.filter(
      (question) => question.active
    );

    if (step < activeQuestions.length - 1) {
      setStep(step + 1);
      setError("");
    }
  }

  function previousStep() {
    if (step > 0) {
      setStep(step - 1);
      setError("");
    }
  }

  async function submitEstimator() {
    if (!validateCurrentQuestion()) {
      return;
    }

    if (!contact.name || !contact.phone || !contact.email) {
      setError("Please enter your name, phone and email.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/estimate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          answers: answers
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to calculate estimate"
        );
      }

      setEstimate(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function startNewEstimate() {
    setAnswers({});
    setContact({
      name: "",
      phone: "",
      email: ""
    });
    setEstimate(null);
    setStep(0);
    setError("");
  }

  if (loading && !config) {
    return (
      <div className="center">
        Loading estimator...
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="center error">
        {error}
      </div>
    );
  }

  if (estimate) {
    return (
      <div className="app">
        <div className="card result-card">
          <h1>{config.business.name}</h1>

          <p className="subtitle">
            Your estimated roofing cost
          </p>

          <div className="estimate">
            <span>Estimated range</span>

            <strong>
              ${Number(estimate.estimate_low).toLocaleString()} -
              ${Number(estimate.estimate_high).toLocaleString()}
            </strong>
          </div>

          <p className="note">
            This is an estimate based on the information you
            provided.
          </p>

          <button onClick={startNewEstimate}>
            Start Another Estimate
          </button>
        </div>
      </div>
    );
  }

  const questions = config.questions.filter(
    (question) => question.active
  );

  const question = questions[step];

  const isLastQuestion =
    step === questions.length - 1;

  return (
    <div className="app">
      <div className="card">
        <h1>{config.business.name}</h1>

        <p className="subtitle">
          Get a quick roofing estimate
        </p>

        <div className="progress">
          Step {step + 1} of {questions.length}
        </div>

        <div className="question">
          <label>{question.label}</label>

          {question.type === "number" && (
            <div>
              <input
                type="number"
                min={question.min}
                max={question.max}
                value={answers[question.key] || ""}
                onChange={(event) =>
                  handleAnswer(
                    question.key,
                    event.target.value
                  )
                }
                placeholder={question.unit}
              />

              <small>
                {question.min} - {question.max}{" "}
                {question.unit}
              </small>
            </div>
          )}

          {question.type === "select" && (
            <select
              value={answers[question.key] || ""}
              onChange={(event) =>
                handleAnswer(
                  question.key,
                  event.target.value
                )
              }
            >
              <option value="">
                Select an option
              </option>

              {question.options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {isLastQuestion && (
          <div className="contact-section">
            <h2>Your contact details</h2>

            <input
              type="text"
              placeholder="Full name"
              value={contact.name}
              onChange={(event) =>
                setContact({
                  ...contact,
                  name: event.target.value
                })
              }
            />

            <input
              type="tel"
              placeholder="Phone"
              value={contact.phone}
              onChange={(event) =>
                setContact({
                  ...contact,
                  phone: event.target.value
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={contact.email}
              onChange={(event) =>
                setContact({
                  ...contact,
                  email: event.target.value
                })
              }
            />
          </div>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <div className="buttons">
          {step > 0 && (
            <button
              className="secondary"
              onClick={previousStep}
            >
              Back
            </button>
          )}

          {!isLastQuestion && (
            <button onClick={nextStep}>
              Next
            </button>
          )}

          {isLastQuestion && (
            <button
              onClick={submitEstimator}
              disabled={loading}
            >
              {loading
                ? "Calculating..."
                : "Get My Estimate"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;