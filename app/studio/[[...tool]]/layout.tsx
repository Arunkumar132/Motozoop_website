const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="font-poppins antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
