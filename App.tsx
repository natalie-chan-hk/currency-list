import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DemoActivity } from './components/DemoActivity';

import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <DemoActivity />
    </SafeAreaProvider>
  );
}
