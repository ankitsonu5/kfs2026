export default function PublicLayout({ children }) {
  return (
    <div className="pb-20 md:pb-0">
      <main>{children}</main>
    </div>
  );
}
