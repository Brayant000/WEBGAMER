const { useState, useEffect } = React;

// ==================== BACKEND SIMULADO ====================
const ADMIN_USER = {
  id: 'admin-001',
  email: 'admin@supergamer.com',
  name: 'Administrador',
  role: 'admin',
  password: 'admin'
};

class BackendService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
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

  register(email, password, name) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      throw new Error('El email ya está registrado');
    }
    const newUser = {
      id: 'user-' + Date.now(),
      email, name, password,
      role: 'user',
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { token: btoa(newUser.id), user: newUser };
  }

  login(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Email o contraseña incorrectos');
    return { token: btoa(user.id), user };
  }

  getUser(token) {
    const userId = atob(token);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.id === userId);
  }

  getItems(category) {
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    return items.filter(item => item.category === category);
  }

  createItem(itemData, token) {
    const user = this.getUser(token);
    if (user.role !== 'admin') throw new Error('Solo admin puede crear');
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

  updateItem(itemId, updateData, token) {
    const user = this.getUser(token);
    if (user.role !== 'admin') throw new Error('Solo admin puede editar');
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const index = items.findIndex(item => item.id === itemId);
    if (index === -1) throw new Error('Item no encontrado');
    items[index] = { ...items[index], ...updateData };
    localStorage.setItem('items', JSON.stringify(items));
    return items[index];
  }

  deleteItem(itemId, token) {
    const user = this.getUser(token);
    if (user.role !== 'admin') throw new Error('Solo admin puede eliminar');
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const filtered = items.filter(item => item.id !== itemId);
    localStorage.setItem('items', JSON.stringify(filtered));
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const filteredComments = comments.filter(c => c.item_id !== itemId);
    localStorage.setItem('comments', JSON.stringify(filteredComments));
  }

  getComments(itemId) {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    return comments.filter(c => c.item_id === itemId);
  }

  createComment(itemId, text, token) {
    const user = this.getUser(token);
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const newComment = {
      id: 'comment-' + Date.now(),
      item_id: itemId,
      user_name: user.name,
      text,
      created_at: new Date().toISOString()
    };
    comments.push(newComment);
    localStorage.setItem('comments', JSON.stringify(comments));
    return newComment;
  }
}

const backend = new BackendService();

// ==================== COMPONENTES ====================

// Página de Autenticación
function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const result = backend.login(email, password);
        onLogin(result.token, result.user);
      } else {
        const result = backend.register(email, password, name);
        onLogin(result.token, result.user);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          Super <span className="highlight">Gamer</span>
        </h1>
        
        <div className="flex gap-2 mb-4">
          <button 
            className={`btn ${isLogin ? 'hero-btn' : ''}`}
            onClick={() => setIsLogin(true)}
            style={{flex: 1}}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`btn ${!isLogin ? 'hero-btn' : ''}`}
            onClick={() => setIsLogin(false)}
            style={{flex: 1}}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              className="input"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            className="input"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
          
          <button type="submit" className="btn hero-btn" style={{width: '100%'}}>
            {isLogin ? 'Entrar' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Página de Selección
function SelectionPage({ user, onSelect, onLogout }) {
  return (
    <div className="selection-page">
      <div style={{position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
        {user.role === 'admin' && (
          <div style={{padding: '0.5rem 1rem', background: '#fbd020', color: 'black', borderRadius: '9999px', fontWeight: 'bold'}}>
            ADMIN
          </div>
        )}
        <button className="btn hero-btn" onClick={onLogout}>Salir</button>
      </div>

      <h1 className="auth-title" style={{color: 'white'}}>
        ¡Hola, {user.name}!
      </h1>
      <p style={{color: '#a1a1aa', fontSize: '1.25rem'}}>Elige tu mundo favorito</p>

      <div className="selection-grid">
        <div className="selection-card" onClick={() => onSelect('games')}>
          <img src="https://images.pexels.com/photos/7773751/pexels-photo-7773751.jpeg" alt="Gaming" />
          <div className="selection-overlay">
            <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>🎮</div>
            <h2 style={{fontSize: '2rem', fontFamily: 'Syne', fontWeight: 'bold'}}>Videojuegos</h2>
            <p>Explora el mundo gaming</p>
          </div>
        </div>

        <div className="selection-card" onClick={() => onSelect('heroes')}>
          <img src="https://images.pexels.com/photos/15344060/pexels-photo-15344060.jpeg" alt="Heroes" />
          <div className="selection-overlay">
            <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>⚡</div>
            <h2 style={{fontSize: '2rem', fontFamily: 'Syne', fontWeight: 'bold'}}>Superhéroes</h2>
            <p>Descubre héroes legendarios</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal para Agregar/Editar Items
function ItemModal({ isOpen, onClose, onSave, item, isDark }) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    image_url: item?.image_url || '',
    official_link: item?.official_link || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${isDark ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        <h2 style={{fontFamily: 'Syne', fontSize: '1.5rem', marginBottom: '1rem'}}>
          {item ? 'Editar Item' : 'Nuevo Item'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input"
            placeholder="Título"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
          <textarea
            className="input"
            placeholder="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            rows="3"
          />
          <input
            type="url"
            className="input"
            placeholder="URL de Imagen"
            value={formData.image_url}
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            required
          />
          <input
            type="url"
            className="input"
            placeholder="Enlace Oficial"
            value={formData.official_link}
            onChange={(e) => setFormData({...formData, official_link: e.target.value})}
            required
          />
          <div className="flex gap-2">
            <button type="button" className="btn" onClick={onClose} style={{flex: 1}}>Cancelar</button>
            <button type="submit" className={`btn ${isDark ? 'gaming-btn' : 'hero-btn'}`} style={{flex: 1}}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Sección (Gaming o Héroes)
function Section({ category, user, token, onBack }) {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  const isGaming = category === 'games';
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    loadItems();
  }, [category]);

  useEffect(() => {
    if (selectedItem) {
      loadComments(selectedItem.id);
    }
  }, [selectedItem]);

  const loadItems = () => {
    setItems(backend.getItems(category));
  };

  const loadComments = (itemId) => {
    setComments(backend.getComments(itemId));
  };

  const handleSave = (formData) => {
    try {
      if (editingItem) {
        backend.updateItem(editingItem.id, formData, token);
      } else {
        backend.createItem({...formData, category}, token);
      }
      loadItems();
      setEditingItem(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = (itemId) => {
    if (confirm('¿Eliminar este item?')) {
      backend.deleteItem(itemId, token);
      loadItems();
      setSelectedItem(null);
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    backend.createComment(selectedItem.id, commentText, token);
    setCommentText('');
    loadComments(selectedItem.id);
  };

  return (
    <div className={isGaming ? 'gaming-bg' : 'hero-bg'}>
      <div 
        className="section-header"
        style={{
          backgroundImage: `url(${isGaming 
            ? 'https://images.pexels.com/photos/4389796/pexels-photo-4389796.jpeg'
            : 'https://images.pexels.com/photos/7768663/pexels-photo-7768663.jpeg'
          })`
        }}
      >
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className="flex justify-between items-center">
            <button 
              className={`btn ${isGaming ? 'gaming-btn' : 'hero-btn'}`}
              onClick={onBack}
            >
              ← Volver
            </button>
          </div>
          <h1 className="section-title" style={{color: isGaming ? 'var(--gaming-primary)' : 'var(--hero-primary)', marginTop: '1rem'}}>
            {isGaming ? '🎮 Videojuegos' : '⚡ Superhéroes'}
          </h1>
        </div>
      </div>

      <div className="container">
        {isAdmin && !selectedItem && (
          <div style={{display: 'flex', justifyContent: 'flex-end', padding: '2rem 0'}}>
            <button 
              className={`btn ${isGaming ? 'gaming-btn' : 'hero-btn'}`}
              onClick={() => { setEditingItem(null); setModalOpen(true); }}
            >
              + Agregar {isGaming ? 'Juego' : 'Héroe'}
            </button>
          </div>
        )}

        {selectedItem ? (
          <div style={{paddingTop: '2rem'}}>
            <button 
              onClick={() => setSelectedItem(null)}
              style={{marginBottom: '1rem', color: isGaming ? 'var(--gaming-primary)' : 'var(--hero-primary)', cursor: 'pointer', background: 'none', border: 'none', fontSize: '1rem'}}
            >
              ← Volver a la lista
            </button>
            <div className={isGaming ? 'gaming-card' : 'hero-card'}>
              <img src={selectedItem.image_url} alt={selectedItem.title} className="item-image" />
              <div className="item-content">
                <h3 className="item-title" style={{color: isGaming ? 'var(--gaming-primary)' : 'var(--hero-primary)'}}>
                  {selectedItem.title}
                </h3>
                <p className="item-description">{selectedItem.description}</p>
                <div className="flex gap-2">
                  <a 
                    href={selectedItem.official_link} 
                    target="_blank" 
                    className={`btn ${isGaming ? 'gaming-btn' : 'hero-btn'}`}
                  >
                    Ver Oficial
                  </a>
                  {isAdmin && (
                    <>
                      <button 
                        className="btn"
                        onClick={() => { setEditingItem(selectedItem); setModalOpen(true); }}
                        style={{background: 'var(--gaming-accent)', color: 'black'}}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="btn"
                        onClick={() => handleDelete(selectedItem.id)}
                        style={{background: '#e62429', color: 'white'}}
                      >
                        🗑️ Eliminar
                      </button>
                    </>
                  )}
                </div>

                <div className="comments-section">
                  <h3 style={{marginBottom: '1rem', fontSize: '1.5rem'}}>💬 Comentarios</h3>
                  <form onSubmit={handleComment} className="flex gap-2 mb-4">
                    <input
                      type="text"
                      className="input"
                      placeholder="Escribe tu comentario..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      style={{flex: 1, marginBottom: 0}}
                    />
                    <button type="submit" className={`btn ${isGaming ? 'gaming-btn' : 'hero-btn'}`}>
                      Enviar
                    </button>
                  </form>
                  {comments.length === 0 ? (
                    <p style={{color: 'var(--gaming-text-secondary)'}}>No hay comentarios aún</p>
                  ) : (
                    comments.map(comment => (
                      <div key={comment.id} className="comment">
                        <div className="comment-author">{comment.user_name}</div>
                        <div className="comment-text">{comment.text}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="items-grid">
            {items.length === 0 ? (
              <p style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem'}}>No hay items todavía</p>
            ) : (
              items.map(item => (
                <div 
                  key={item.id} 
                  className={isGaming ? 'gaming-card' : 'hero-card'}
                  onClick={() => setSelectedItem(item)}
                  style={{cursor: 'pointer'}}
                >
                  <img src={item.image_url} alt={item.title} className="item-image" />
                  <div className="item-content">
                    <h3 className="item-title" style={{color: isGaming ? 'var(--gaming-primary)' : 'var(--hero-primary)'}}>
                      {item.title}
                    </h3>
                    <p className="item-description">{item.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <ItemModal 
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingItem(null); }}
        onSave={handleSave}
        item={editingItem}
        isDark={isGaming}
      />
    </div>
  );
}

// ==================== APP PRINCIPAL ====================
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('auth'); // 'auth', 'selection', 'games', 'heroes'

  useEffect(() => {
    if (token) {
      try {
        const userData = backend.getUser(token);
        if (userData) {
          setUser(userData);
          setCurrentView('selection');
        } else {
          handleLogout();
        }
      } catch (err) {
        handleLogout();
      }
    }
  }, []);

  const handleLogin = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    setCurrentView('selection');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setCurrentView('auth');
  };

  const handleSelect = (category) => {
    setCurrentView(category);
  };

  if (currentView === 'auth') {
    return <AuthPage onLogin={handleLogin} />;
  }

  if (currentView === 'selection') {
    return <SelectionPage user={user} onSelect={handleSelect} onLogout={handleLogout} />;
  }

  return <Section category={currentView} user={user} token={token} onBack={() => setCurrentView('selection')} />;
}

// Renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);