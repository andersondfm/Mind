import { ReactFlowProvider } from '@xyflow/react'
import { FlowCanvas } from './components/FlowCanvas'
import '@xyflow/react/dist/style.css'

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  )
}
