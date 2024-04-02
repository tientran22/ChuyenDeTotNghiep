import React from 'react'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import Navbar from 'src/components/Navbar/Navbar'

interface Props {
  children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div>
      <Header />
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
