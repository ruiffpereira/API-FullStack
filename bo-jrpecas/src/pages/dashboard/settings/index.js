import { checkSession } from '@/utils/checkSession'
import Profile from '@/components/admin/profile'
import RegisterForm from '@/components/admin/register'
import RulesComponent from '@/components/admin/roules'
function Settings() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Profile />
      <RegisterForm />
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
