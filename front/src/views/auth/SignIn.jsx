import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from 'features/auth/authSlice.js';
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState("");

  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard"); 
    }
  }, [user, navigate]);

  const handleSignIn = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setFormError("Both email and password are required");
      return;
    }
    setFormError("");
    dispatch(signIn({ email, password }));
  };

  const isLoading = status === 'loading';

  return (
    <div className="mt-4 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <form onSubmit={handleSignIn} className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px] space-y-6">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>

        {/* Email Input Field */}
        <InputField
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update state on change
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@simmmple.com"
          id="email"
          type="text"
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

        {/* Remember me Checkbox and Forgot Password */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
              Keep me logged In
            </p>
          </div>
          <Link to="/forgot-password" className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Form Error Handling */}
        {formError && (
          <p className="text-red-500 mt-2">{formError}</p>
        )}

        {/* API Error Message */}
        {error && (
          <p className="text-red-500 mt-2">
            {error.message || 'Login failed. Please check your credentials.'}
          </p>
        )}

        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <Link to="/auth/register" className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
