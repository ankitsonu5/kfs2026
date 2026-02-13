export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
                <h1 className="text-3xl font-bold text-center">Forgot Password</h1>
                <p className="text-center text-gray-600">Enter your email to reset your password</p>
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded-md font-medium">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}
