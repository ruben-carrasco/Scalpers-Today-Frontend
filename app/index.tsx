import { Redirect } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { container } from '../src/core/container';
import { TYPES } from '../src/core/types';
import { AuthViewModel } from '../src/presentation/viewmodels/AuthViewModel';

const authViewModel = container.get<AuthViewModel>(TYPES.AuthViewModel);

export default observer(function Index() {
  if (authViewModel.isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/(auth)/login" />;
});
