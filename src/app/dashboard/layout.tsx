
export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div>
          <div >
           
          </div>
          <div >
            {children}
            
          </div>
        </div>
    )
  }