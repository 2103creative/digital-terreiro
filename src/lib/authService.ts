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
  },
  // Adicionando os usuários solicitados
  {
    id: '3',
    name: 'Karina',
    email: 'karina@terreiro.com',
    password: '123456',
    role: 'user',
    isActive: true
  },
  {
    id: '4',
    name: 'Nicole',
    email: 'nicole@terreiro.com',
    password: '123456',
    role: 'user',
    isActive: true
  },
  {
    id: '5',
    name: 'Tita',
    email: 'tita@terreiro.com',
    password: '123456',
    role: 'user',
    isActive: true
  },
  {
    id: '6',
    name: 'Maicon',
    email: 'maicon@terreiro.com',
    password: '123456',
    role: 'user',
    isActive: true
  },
  {
    id: '7',
    name: 'Jeferson',
    email: 'jeferson@terreiro.com',
    password: '123456',
    role: 'user',
    isActive: true
  },
  {
    id: '8',
    name: 'Leno',
    email: 'leno@terreiro.com',
    password: '123456',
    role: 'user',
    isActive: true
  },
  {
    id: '9',
    name: 'Carol',
    email: 'carol@terreiro.com',
    password: '123456',
    role: 'user',
    isActive: true
  },
  {
    id: '10',
    name: 'Camila',
    email: 'camila@terreiro.com',
    password: '123456',
    role: 'user',
    isActive: true
  },
  {
    id: '11',
    name: 'Baby',
    email: 'baby@terreiro.com',
    password: '123456',
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
        localStorage.setItem('userName', userWithoutPassword.name);
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
    const userName = localStorage.getItem('userName');
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
          // Se não encontrar no array, tenta recriar com os dados do localStorage
          if (userName) {
            resolve({
              id: userId,
              name: userName,
              email: userEmail,
              role: userRole as 'admin' | 'user',
              isActive: true
            });
          } else {
            resolve(null);
          }
        }
      }, 300);
    } else {
      resolve(null);
    }
  });
};

// Obter lista de todos os usuários (para admin)
export const getAllUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    // Simular uma chamada de API
    setTimeout(() => {
      // Retorna todos os usuários sem as senhas
      const usersWithoutPasswords = USERS.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
      });
      
      resolve(usersWithoutPasswords);
    }, 500);
  });
};

// Logout
export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    
    resolve();
  });
}; 