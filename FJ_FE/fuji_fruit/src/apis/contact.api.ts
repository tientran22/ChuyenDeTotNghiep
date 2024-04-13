import http from 'src/utils/https'

const contactApi = {
  contactForm: (body: { name: string; email_address: string }) => http.post('/api/send-email', body)
}

export default contactApi
