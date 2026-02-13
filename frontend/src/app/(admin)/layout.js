export default function AdminLayout({ children }) {
    return (
        <div>
            <header className="bg-gray-800 text-white p-4">
                <h1>Admin Dashboard</h1>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
}
