import { Link, useMatch } from 'react-router-dom'

export default function RegisterHeader() {
  const registerMatch = useMatch('/register')
  const isRegister = Boolean(registerMatch)
  return (
    <div>
      <header className='py-5'>
        <div className='container'>
          <nav className='flex items-end'>
            <Link to='/'>
              <img src='./src/assets/logo.svg' alt='' className='w-32 h-9' />
            </Link>
            <h2 className='ml-5 text-xl lg:text-2xl'>{isRegister ? 'Đăng ký' : 'Đăng nhập'}</h2>
          </nav>
        </div>
      </header>
    </div>
  )
}
