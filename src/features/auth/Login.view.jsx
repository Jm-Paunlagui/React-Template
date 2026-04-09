/**
 * Login.view.jsx — Login page.
 *
 * Presentation layer only. All logic lives in auth.hook.js.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    DANGER_BUTTON,
    ERROR_MESSAGE,
    MAIN_BUTTON,
    TEXT_FIELD,
    TITLE_COLOR_TEXT,
} from '../../assets/styles/pre-set-styles';
import { useAuth } from './auth.hook';

export default function LoginView() {
    const { loading, error, login } = useAuth();
    const [form, setForm] = useState({ username: '', password: '' });

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(form);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-primary-400 to-secondary-400">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
                <h1 className={`mb-6 text-3xl text-center ${TITLE_COLOR_TEXT}`}>
                    Sign In
                </h1>

                {error && (
                    <div className={`mb-4 px-4 py-3 rounded-lg ${ERROR_MESSAGE}`}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className={TEXT_FIELD}
                            placeholder="Enter username"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className={TEXT_FIELD}
                            placeholder="Enter password"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-4 py-2 mt-2 ${MAIN_BUTTON} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link to="/sign-up" className="text-primary-400 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}