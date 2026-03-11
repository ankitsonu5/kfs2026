export default function PublicLayout({ children }) {
  return (
    <div className="pb-14 md:pb-0">
      <main>{children}</main>
    </div>
  );
}
