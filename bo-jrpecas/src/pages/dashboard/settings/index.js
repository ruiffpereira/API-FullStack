import { checkSession } from '@/utils/checkSession'
import Profile from '@/components/admin/profile'
import RegisterForm from '@/components/admin/register'
import RulesComponent from '@/components/admin/roules'
function Settings() {
  const dummyUsers = [
    { id: 1, username: 'usuario1' },
    { id: 2, username: 'usuario2' },
    { id: 3, username: 'usuario3' },
    { id: 4, username: 'usuario4' },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Profile />
      <RegisterForm
        dummyUsers={dummyUsers[0]}
        onDeleteUser={(userId) =>
          console.log(`Deletar usuário com ID: ${userId}`)
        }
      />
      <RulesComponent />
    </div>
  )
}

export default Settings

export async function getServerSideProps(context) {
  const sessionCheckResult = await checkSession(context.req)
  if (sessionCheckResult) {
    return sessionCheckResult
  }
  return {
    props: {},
  }
}
