export const metadata = { title: "AI Website" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin:0, fontFamily:"-apple-system, BlinkMacSystemFont, sans-serif", background:"#f5f5f7" }}>
        <nav style={{ padding:"20px", background:"white", borderBottom:"1px solid #ddd", display:"flex", gap:"20px" }}>
          <a href="/" style={{ fontWeight:"600" }}>Home</a>
          <a href="/chat">AI Chat</a>
          <a href="/generate-image">Image Generator</a>
        </nav>
        <main style={{ padding:"40px" }}>
          {children}
        </main>
        <footer style={{ marginTop:"50px", padding:"20px", textAlign:"center", borderTop:"1px solid #ccc" }}>
          © 2025 My AI Website
        </footer>
      </body>
    </html>
  );
}
