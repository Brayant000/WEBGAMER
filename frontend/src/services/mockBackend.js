// Mock Backend Service para GitHub Pages (sin servidor real)
const ADMIN_USER = {
  id: 'admin-001',
  email: 'admin@supergamer.com',
  name: 'Administrador',
  role: 'admin',
  password: 'admin'
};

class MockBackendService {
  constructor() {
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([ADMIN_USER]));
    }
    if (!localStorage.getItem('items')) {
      localStorage.setItem('items', JSON.stringify([]));
    }
    if (!localStorage.getItem('comments')) {
      localStorage.setItem('comments', JSON.stringify([]));
    }
  }

  // Autenticación
  async register(email, password, name) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
      throw new Error('El email ya está registrado');
    }

    const newUser = {
      id: 'user-' + Date.now(),
      email,
      name,
      role: 'user',
      password,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const token = btoa(JSON.stringify({ userId: newUser.id, timestamp: Date.now() }));
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      access_token: token,
      token_type: 'bearer',
      user: userWithoutPassword
    };
  }

  async login(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Email o contraseña incorrectos');
    }

    const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));
    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token: token,
      token_type: 'bearer',
      user: userWithoutPassword
    };
  }

  async getMe(token) {
    try {
      const decoded = JSON.parse(atob(token));
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === decoded.userId);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  // Items
  async getItems(category) {
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    return items.filter(item => item.category === category);
  }

  async createItem(itemData, token) {
    const user = await this.getMe(token);
    if (user.role !== 'admin') {
      throw new Error('Solo los administradores pueden crear items');
    }

    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const newItem = {
      ...itemData,
      id: 'item-' + Date.now(),
      created_at: new Date().toISOString()
    };

    items.push(newItem);
    localStorage.setItem('items', JSON.stringify(items));
    return newItem;
  }

  async updateItem(itemId, updateData, token) {
    const user = await this.getMe(token);
    if (user.role !== 'admin') {
      throw new Error('Solo los administradores pueden editar items');
    }

    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new Error('Item no encontrado');
    }

    items[itemIndex] = { ...items[itemIndex], ...updateData };
    localStorage.setItem('items', JSON.stringify(items));
    return items[itemIndex];
  }

  async deleteItem(itemId, token) {
    const user = await this.getMe(token);
    if (user.role !== 'admin') {
      throw new Error('Solo los administradores pueden eliminar items');
    }

    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const filteredItems = items.filter(item => item.id !== itemId);
    localStorage.setItem('items', JSON.stringify(filteredItems));

    // Eliminar comentarios asociados
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const filteredComments = comments.filter(comment => comment.item_id !== itemId);
    localStorage.setItem('comments', JSON.stringify(filteredComments));

    return { message: 'Item eliminado exitosamente' };
  }

  // Comentarios
  async getComments(itemId, category) {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    return comments
      .filter(comment => comment.item_id === itemId && comment.category === category)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async createComment(commentData, token) {
    const user = await this.getMe(token);
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    
    const newComment = {
      ...commentData,
      id: 'comment-' + Date.now(),
      user_id: user.id,
      user_name: user.name,
      created_at: new Date().toISOString()
    };

    comments.push(newComment);
    localStorage.setItem('comments', JSON.stringify(comments));
    return newComment;
  }
}

export default new MockBackendService();