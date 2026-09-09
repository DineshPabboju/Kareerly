import { useState } from 'react'
import { ApplicationProvider } from './context/ApplicationContext'
import Navbar from './components/Navbar'
import Board from './components/Board'
import InsightsView from './components/InsightsView'
import CardModal from './components/CardModal'
import AuthModal from './components/AuthModal'
import ToastContainer from './components/Toast'

const MainApp = () => {
  const [currentTab, setCurrentTab] = useState<'board' | 'insights'>('board')

  return (
    <main className="workspace-shell">
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      {currentTab === 'board' ? (
        <Board />
      ) : (
        <InsightsView onBackToBoard={() => setCurrentTab('board')} />
      )}

      <CardModal />
      <AuthModal />
      <ToastContainer />
    </main>
  )
}

const App = () => {
  return (
    <ApplicationProvider>
      <MainApp />
    </ApplicationProvider>
  )
}

export default App