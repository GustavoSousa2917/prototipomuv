import AuthPlaceholderPage from './AuthPlaceholderPage'

export default function RegisterPage() {
  return (
    <AuthPlaceholderPage
      title="Criar sua conta"
      description="Cadastre-se para começar a utilizar os serviços do MUV."
      alternativePrompt="Já possui uma conta?"
      alternativeLabel="Entrar"
      alternativeTo="/login"
    />
  )
}
