// src/app/transport/search/layout.tsx

// This is a special layout file for the ride search results page.
// It creates a full-screen, app-like experience by not including the main site header and footer.

export default function RideSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        {/* The main content of the page will be rendered here, without the default header/footer */}
        {children}
    </>
  );
}
