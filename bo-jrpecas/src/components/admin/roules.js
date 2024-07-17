import { useState } from 'react'

const initialRules = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'user' },
  { id: 3, name: 'empregado' },
]

function RulesComponent() {
  const [rules, setRules] = useState(initialRules)
  const [currentRule, setCurrentRule] = useState({ id: null, name: '' })

  const handleAddEditRule = (e) => {
    e.preventDefault()
    if (currentRule.id) {
      // Editar regra existente
      setRules(
        rules.map((rule) => (rule.id === currentRule.id ? currentRule : rule)),
      )
    } else {
      // Adicionar nova regra
      setRules([...rules, { ...currentRule, id: Date.now() }])
    }
    setCurrentRule({ id: null, name: '' })
  }

  const handleEdit = (rule) => {
    setCurrentRule(rule)
  }

  const handleDelete = (id) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-full">
      <form
        onSubmit={handleAddEditRule}
        className="mb-4 flex justify-between items-center"
      >
        <input
          type="text"
          value={currentRule.name}
          onChange={(e) =>
            setCurrentRule({ ...currentRule, name: e.target.value })
          }
          required
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          type="submit"
          className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {currentRule.id ? 'Editar' : 'Adicionar'}
        </button>
      </form>
      <ul>
        {rules.map((rule) => (
          <li
            key={rule.id}
            className="flex justify-between items-center mb-2 p-2 shadow rounded"
          >
            <span className="text-gray-800">{rule.name}</span>
            <div>
              <button
                onClick={() => handleEdit(rule)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(rule.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              >
                Apagar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RulesComponent
