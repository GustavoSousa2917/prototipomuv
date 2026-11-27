import AuthPlaceholderPage from './AuthPlaceholderPage'

export default function LoginPage() {
  return (
    <AuthPlaceholderPage
      title="Entrar no MUV"
      description="Acesse sua conta para utilizar os serviços da plataforma."
      alternativePrompt="Ainda não possui uma conta?"
      alternativeLabel="Criar conta"
      alternativeTo="/cadastro"
    />
  )
}
