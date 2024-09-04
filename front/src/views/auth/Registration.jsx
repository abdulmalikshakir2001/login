import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "features/auth/authSlice";
import InputField from "components/fields/InputField";
import { Link } from "react-router-dom";

const Registration = () => {
  // State for form inputs
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  // Handle form submission
  const handleRegister = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!name || !email || !password) {
      console.error("All fields are required");
      return;
    }

    // Log form data to console
    console.log("Form Data:", { name, email, password });

    // Dispatch the register action with form data
    dispatch(register({ name, email, password }));
  };

  const isLoading = status === "loading";

  return (
    <div className="mt-4 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <form onSubmit={handleRegister} className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px] space-y-6">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Register
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your username, email, and password to create an account!
        </p>

        {/* Username Input Field */}
        <InputField
          value={name}
          onChange={(e) => setUsername(e.target.value)} // Update state on change
          variant="auth"
          extra="mb-3"
          label="Username*"
          placeholder="Your username"
          id="username"
          type="text"
          disabled={isLoading}
        />

        {/* Email Input Field */}
        <InputField
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update state on change
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@simmmple.com"
          id="email"
          type="email"
          disabled={isLoading}
        />

        {/* Password Input Field */}
        <InputField
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update state on change
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
          disabled={isLoading}
        />

        {/* Submit Button */}
        <button type="submit" disabled={isLoading} className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-2">{error.message || 'Registration failed'}</p>}

        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Already have an account?
          </span>
          <Link to="/auth/login" className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Registration;
