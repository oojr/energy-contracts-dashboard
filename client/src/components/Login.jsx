import { ShieldCheck } from "lucide-react";

export default function Login({
  email,
  setEmail,
  password,
  setPassword,
  login,
  authError,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
            <ShieldCheck className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-gray-700 dark:text-gray-400 mb-8">
            Please sign in with your credentials to access the marketplace.
          </p>

          <form onSubmit={login} className="w-full space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                required
              />
            </div>
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-6 flex items-center justify-center">
            <span className="bg-white dark:bg-gray-900 px-4 text-gray-600 dark:text-gray-400 text-sm font-medium">
              TEST CREDENTIALS
            </span>
          </div>

          <div className="text-sm text-gray-700 dark:text-gray-400">
            <p>
              Email:{" "}
              <span className="font-semibold dark:text-white">
                test@example.com
              </span>
            </p>
            <p>
              Password:{" "}
              <span className="font-semibold dark:text-white">test1234</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
