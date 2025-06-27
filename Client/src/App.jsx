import { lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectRoute from "./Components/Auth/ProtectRoute"

const Home = lazy(() => import("./Pages/Home"))
const Login = lazy(() => import("./Pages/Login"))
const Groups = lazy(() => import("./Pages/Groups"))
const Chat = lazy(() => import("./Pages/Chat"))

let user = true;

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectRoute user={user} />}>
            <Route path="/" element={<Home />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/chats/:chatId" element={<Chat />} />
          </Route>
          <Route path="/login" element={<ProtectRoute user={!user} redirect="/"><Login /></ProtectRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
