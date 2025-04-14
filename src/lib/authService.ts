// Interface para o usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

// Usuários fictícios
const USERS = [
  {
    id: '1',
    name: 'Administrador',
    email: 'root@admin.com',
    password: '057841',
    role: 'admin',
    isActive: true
  },
  {
    id: '2',
    name: 'Usuário Padrão',
    email: 'user@user.com',
    password: '148750',
    role: 'user',
    isActive: true
  }
];

// Autenticar usuário
export const authenticate = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    // Simular uma chamada de API
    setTimeout(() => {
      const user = USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Não retornamos a senha
        const { password, ...userWithoutPassword } = user;
        
        // Salvar informações no localStorage
        localStorage.setItem('userId', userWithoutPassword.id);
        localStorage.setItem('userEmail', userWithoutPassword.email);
        localStorage.setItem('userRole', userWithoutPassword.role);
        localStorage.setItem('isAuthenticated', 'true');
        
        resolve(userWithoutPassword as User);
      } else {
        resolve(null);
      }
    }, 800);
  });
};

// Verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Verificar se o usuário é administrador
export const isAdmin = (): boolean => {
  return localStorage.getItem('userRole') === 'admin';
};

// Obter usuário atual
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    const isAuthenticatedValue = localStorage.getItem('isAuthenticated');
    
    if (isAuthenticatedValue === 'true' && userId && userEmail && userRole) {
      // Buscar informações do usuário (simulado)
      setTimeout(() => {
        const userFound = USERS.find(u => u.id === userId);
        
        if (userFound) {
          const { password, ...userWithoutPassword } = userFound;
          resolve(userWithoutPassword as User);
        } else {
          resolve(null);
        }
      }, 300);
    } else {
      resolve(null);
    }
  });
};

// Logout
export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    
    resolve();
  });
}; 