import api from './api';

class UserService {
  getPublicContent() {
    return api.get('/protected/all');
  }

  getUserBoard() {
    return api.get('/protected/user');
  }

  getModeratorBoard() {
    return api.get('/protected/mod');
  }

  getAdminBoard() {
    return api.get('/protected/admin');
  }
}

export default new UserService();
