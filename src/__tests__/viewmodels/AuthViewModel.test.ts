import { AuthViewModel } from '../../presentation/viewmodels/AuthViewModel';

// Mock notificationService
jest.mock('../../services/NotificationService', () => ({
  notificationService: {
    registerForPushNotifications: jest.fn().mockResolvedValue(null),
    getLastNotificationResponse: jest.fn().mockResolvedValue(null),
  },
}));

// Mock Platform
jest.mock('react-native', () => ({
  Platform: { OS: 'ios', Version: '17.0' },
}));

const mockLoginUseCase = {
  execute: jest.fn(),
};

const mockGoogleLoginUseCase = {
  execute: jest.fn(),
};

const mockRegisterUseCase = {
  execute: jest.fn(),
};

const mockGetCurrentUserUseCase = {
  execute: jest.fn(),
};

const mockLogoutUseCase = {
  execute: jest.fn().mockResolvedValue(undefined),
};

const mockRegisterDeviceTokenUseCase = {
  execute: jest.fn().mockResolvedValue(undefined),
};

const mockHomeViewModel = { reset: jest.fn() };
const mockEventsViewModel = { reset: jest.fn() };
const mockAlertsViewModel = { reset: jest.fn() };
const mockSettingsViewModel = { reset: jest.fn() };

function createViewModel(): AuthViewModel {
  const vm = Object.create(AuthViewModel.prototype);
  vm.loginUseCase = mockLoginUseCase;
  vm.googleLoginUseCase = mockGoogleLoginUseCase;
  vm.registerUseCase = mockRegisterUseCase;
  vm.getCurrentUserUseCase = mockGetCurrentUserUseCase;
  vm.logoutUseCase = mockLogoutUseCase;
  vm.registerDeviceTokenUseCase = mockRegisterDeviceTokenUseCase;
  vm.homeViewModel = mockHomeViewModel;
  vm.eventsViewModel = mockEventsViewModel;
  vm.alertsViewModel = mockAlertsViewModel;
  vm.settingsViewModel = mockSettingsViewModel;

  // Initialize observable properties
  vm.user = null;
  vm.isLoading = false;
  vm.isAuthenticated = false;
  vm.error = null;
  vm.pushToken = null;
  vm._registeringPushToken = false;
  return vm;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AuthViewModel', () => {
  describe('login', () => {
    it('sets isAuthenticated on success', async () => {
      const vm = createViewModel();
      const mockUser = { id: '1', email: 'test@test.com', name: 'Test' };
      mockLoginUseCase.execute.mockResolvedValue({
        user: mockUser,
        token: 'jwt-token',
      });

      const result = await vm.login('test@test.com', 'password123');

      expect(result).toBe(true);
      expect(vm.isAuthenticated).toBe(true);
      expect(vm.user).toBeTruthy();
      expect(vm.error).toBeNull();
    });

    it('sets error on failure', async () => {
      const vm = createViewModel();
      mockLoginUseCase.execute.mockRejectedValue(new Error('Invalid credentials'));

      const result = await vm.login('test@test.com', 'wrong');

      expect(result).toBe(false);
      expect(vm.isAuthenticated).toBe(false);
      expect(vm.error).toBeTruthy();
    });

    it('sets isLoading during execution', async () => {
      const vm = createViewModel();
      let loadingDuringExec = false;

      mockLoginUseCase.execute.mockImplementation(async () => {
        loadingDuringExec = vm.isLoading;
        return { user: { id: '1', email: 'a@a.com', name: 'A' }, token: 't' };
      });

      await vm.login('a@a.com', 'pass');

      expect(loadingDuringExec).toBe(true);
      expect(vm.isLoading).toBe(false);
    });
  });

  describe('loginWithGoogle', () => {
    it('sets isAuthenticated on success', async () => {
      const vm = createViewModel();
      const mockUser = { id: '1', email: 'google@test.com', name: 'Google User' };
      mockGoogleLoginUseCase.execute.mockResolvedValue({
        user: mockUser,
        token: 'jwt-token',
      });

      const result = await vm.loginWithGoogle('google-id-token');

      expect(result).toBe(true);
      expect(mockGoogleLoginUseCase.execute).toHaveBeenCalledWith({
        id_token: 'google-id-token',
      });
      expect(vm.isAuthenticated).toBe(true);
      expect(vm.user).toBeTruthy();
      expect(vm.error).toBeNull();
    });

    it('sets error on failure', async () => {
      const vm = createViewModel();
      mockGoogleLoginUseCase.execute.mockRejectedValue(new Error('Invalid Google token'));

      const result = await vm.loginWithGoogle('bad-token');

      expect(result).toBe(false);
      expect(vm.isAuthenticated).toBe(false);
      expect(vm.error).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('clears authenticated state', async () => {
      const vm = createViewModel();
      vm.isAuthenticated = true;
      vm.user = { id: '1' } as any;
      vm.pushToken = 'token';

      await vm.logout();

      expect(vm.isAuthenticated).toBe(false);
      expect(vm.user).toBeNull();
      expect(vm.pushToken).toBeNull();
    });

    it('resets all sub-viewmodels', async () => {
      const vm = createViewModel();
      await vm.logout();

      expect(mockHomeViewModel.reset).toHaveBeenCalled();
      expect(mockEventsViewModel.reset).toHaveBeenCalled();
      expect(mockAlertsViewModel.reset).toHaveBeenCalled();
      expect(mockSettingsViewModel.reset).toHaveBeenCalled();
    });
  });

  describe('clearError', () => {
    it('resets error to null', () => {
      const vm = createViewModel();
      vm.error = 'Some error message';
      vm.clearError();
      expect(vm.error).toBeNull();
    });
  });

  describe('checkAuth', () => {
    it('sets authenticated when user exists', async () => {
      const vm = createViewModel();
      const mockUser = { id: '1', email: 'test@test.com', name: 'Test' };
      mockGetCurrentUserUseCase.execute.mockResolvedValue(mockUser);

      await vm.checkAuth();

      expect(vm.isAuthenticated).toBe(true);
      expect(vm.user).toBeTruthy();
      expect(vm.isLoading).toBe(false);
    });

    it('sets not authenticated when no user', async () => {
      const vm = createViewModel();
      mockGetCurrentUserUseCase.execute.mockResolvedValue(null);

      await vm.checkAuth();

      expect(vm.isAuthenticated).toBe(false);
      expect(vm.user).toBeNull();
    });

    it('sets not authenticated on error', async () => {
      const vm = createViewModel();
      mockGetCurrentUserUseCase.execute.mockRejectedValue(new Error('Token invalid'));

      await vm.checkAuth();

      expect(vm.isAuthenticated).toBe(false);
      expect(vm.user).toBeNull();
      expect(vm.isLoading).toBe(false);
    });
  });
});
