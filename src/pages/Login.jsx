import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CoreButton from "../components/CoreButton";

export default function Login() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateInputs = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
      errors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    }

    if (isRegister && !name.trim()) {
      errors.name = "Name is required";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }

      navigate("/");
    } catch (err) {
      console.error(err);

      alert(`${isRegister ? "Register" : "Login"} failed`);
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Header title="LIGHT WEIGHT BABY" />
      <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-md p-6 relative border-2 border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {isRegister ? "Register" : "Login"}
        </h2>

        <form className="space-y-2" noValidate onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setValidationErrors({});
                }}
                placeholder="Name"
                className={`border-2 ${
                  validationErrors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg w-full p-2 focus:outline-none focus:border-blue-500`}
              />
              <p
                className={`text-red-500 text-sm min-h-[1.25rem] ${
                  validationErrors.name ? "visible" : "invisible"
                }`}
              >
                {validationErrors.name || "placeholder"}
              </p>
            </div>
          )}

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationErrors({});
              }}
              placeholder="Email"
              className={`border-2 ${
                validationErrors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg w-full p-2 focus:outline-none focus:border-blue-500`}
            />
            <p
              className={`text-red-500 text-sm min-h-[1.25rem] ${
                validationErrors.email ? "visible" : "invisible"
              }`}
            >
              {validationErrors.email || "placeholder"}
            </p>
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidationErrors({});
              }}
              placeholder="Password"
              className={`border-2 ${
                validationErrors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg w-full p-2 focus:outline-none focus:border-blue-500`}
            />
            <p
              className={`text-red-500 text-sm min-h-[1.25rem] ${
                validationErrors.password ? "visible" : "invisible"
              }`}
            >
              {validationErrors.password || "placeholder"}
            </p>
          </div>

          <CoreButton
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
            title={isRegister ? "Register" : "Login"}
          />
        </form>

        <button
          className="mt-4 text-blue-600 hover:underline block w-full text-center"
          onClick={() => {
            setIsRegister(!isRegister);
            setValidationErrors({});
          }}
        >
          {isRegister
            ? "Already have an account? Login"
            : "No account? Register"}
        </button>
      </div>
    </div>
  );
}
