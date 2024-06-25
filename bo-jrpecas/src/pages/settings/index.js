import { Fragment, useState, useRef } from 'react'

function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef(null)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal()
    }
  }

  return (
    <Fragment>
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={handleClickOutside}
      >
        <h2 className="text-2xl font-bold mb-4">Perfil</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Nome</label>
          <input
            type="text"
            value="john_doe"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value="john@example.com"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            disabled
          />
        </div>
        <button
          onClick={openModal}
          className="w-full bg-green-500 text-white py-2 rounded mt-4"
        >
          Mudar password
        </button>
        <button className="w-full bg-blue-500 text-white py-2 rounded mt-4">
          Logout
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div
              ref={modalRef}
              className="bg-white p-6 rounded-lg shadow-lg w-96"
            >
              <h2 className="text-xl font-bold mb-4">Mudar password</h2>
              <div className="mb-4">
                <label className="block text-gray-700">Atual Password</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nova Password</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded mt-4">
                Update Password
              </button>
              <button
                onClick={closeModal}
                className="w-full bg-gray-300 text-gray-700 py-2 rounded mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  )
}

export default Settings
