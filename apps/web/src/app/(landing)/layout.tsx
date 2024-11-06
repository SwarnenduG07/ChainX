export default function LandingLayout({
    children,
  }: {
    children: React.ReactNode;
  }): JSX.Element {
    return (
      <html lang="en">
        <body className=''>{children}</body>
      </html>
    );
  }