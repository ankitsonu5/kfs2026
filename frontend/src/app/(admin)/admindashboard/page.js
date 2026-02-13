export default function AdminDashboard() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p>Welcome to the administration panel.</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-100 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Statistics</h2>
                    <p>Dashboard statistics will appear here</p>
                </div>
                <div className="bg-green-100 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Management</h2>
                    <p>Management tools will appear here</p>
                </div>
            </div>
        </div>
    );
}
