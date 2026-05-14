import { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [page, setPage] = useState('shop'); // 'shop' | 'orders'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [addedProductId, setAddedProductId] = useState(null);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      if (!result.data || result.data.length === 0) throw new Error('No products returned from server.');
      setProducts(result.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      setOrders(result.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrdersError(err.message || 'Failed to load orders.');
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch orders whenever the orders page is opened
  useEffect(() => {
    if (page === 'orders') fetchOrders();
  }, [page, fetchOrders]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setAddedProductId(product._id);
    setTimeout(() => setAddedProductId(null), 1000);
    setIsCartOpen(true);
    showToast(`"${product.name}" added to cart`);
  };

  const updateQuantity = (productId, amount) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item._id === productId ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({ productId: item._id, quantity: item.quantity, price: item.price })),
          totalAmount: cartTotal,
        }),
      });
      if (!response.ok) throw new Error('Checkout failed');
      setCart([]);
      setIsCartOpen(false);
      showToast('Order placed successfully!');
    } catch (err) {
      console.error('Checkout error:', err);
      showToast('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="logo" onClick={() => setPage('shop')} style={{ cursor: 'pointer' }}>
            NexGen<span className="highlight">Tech</span>
          </h1>
          <div className="nav-links">
            <button
              className={`nav-tab ${page === 'shop' ? 'active' : ''}`}
              onClick={() => setPage('shop')}
            >
              Shop
            </button>
            <button
              className={`nav-tab ${page === 'orders' ? 'active' : ''}`}
              onClick={() => setPage('orders')}
            >
              My Orders
            </button>
            <div className="cart-icon" onClick={() => { setPage('shop'); setIsCartOpen(true); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Overlay */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart {cartItemCount > 0 && <span className="cart-count-label">({cartItemCount})</span>}</h2>
          <button className="close-cart" onClick={() => setIsCartOpen(false)}>&times;</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ color: 'var(--border)', marginBottom: '1rem' }}>
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p className="empty-cart">Your cart is empty.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Add some products to get started!</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  <div className="cart-item-controls">
                    <button onClick={() => updateQuantity(item._id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                    <button className="remove-btn" onClick={() => removeFromCart(item._id)} title="Remove">🗑</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-button" onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        )}
      </div>

      {/* ── SHOP PAGE ── */}
      {page === 'shop' && (
        <>
          <header className="hero">
            <div className="hero-content">
              <h2>Elevate Your Lifestyle</h2>
              <p>Discover the latest premium tech gadgets curated just for you.</p>
              <button className="cta-button" onClick={scrollToProducts}>Shop Now</button>
            </div>
          </header>

          <main className="container" id="products-section">
            <div className="section-header">
              <h3>Featured Products</h3>
              <div className="underline"></div>
            </div>

            {loading && <div className="loader"></div>}

            {error && (
              <div className="error-container">
                <p className="error-message">⚠️ {error}</p>
                <button className="retry-button" onClick={fetchProducts}>Retry</button>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No products found.</p>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="grid">
                {products.map(product => {
                  const isAdded = addedProductId === product._id;
                  const itemInCart = cart.find(i => i._id === product._id);
                  return (
                    <div className="card" key={product._id}>
                      <div className="card-img-container">
                        <img src={product.image} alt={product.name} className="card-img" loading="lazy" />
                      </div>
                      <div className="card-content">
                        <h4 className="card-title">{product.name}</h4>
                        <p className="card-desc">{product.description}</p>
                        <div className="card-footer">
                          <span className="price">${product.price.toFixed(2)}</span>
                          <button
                            className={`buy-button ${isAdded ? 'added' : ''}`}
                            onClick={() => addToCart(product)}
                            disabled={isAdded}
                          >
                            {isAdded ? '✓ Added!' : itemInCart ? `In Cart (${itemInCart.quantity})` : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </>
      )}

      {/* ── ORDERS PAGE ── */}
      {page === 'orders' && (
        <main className="container">
          <div className="section-header">
            <h3>My Orders</h3>
            <div className="underline"></div>
          </div>

          {ordersLoading && <div className="loader"></div>}

          {ordersError && (
            <div className="error-container">
              <p className="error-message">⚠️ {ordersError}</p>
              <button className="retry-button" onClick={fetchOrders}>Retry</button>
            </div>
          )}

          {!ordersLoading && !ordersError && orders.length === 0 && (
            <div className="no-orders">
              <p>No orders yet.</p>
              <button className="retry-button" onClick={() => setPage('shop')}>Start Shopping</button>
            </div>
          )}

          {!ordersLoading && !ordersError && orders.length > 0 && (
            <div className="orders-list">
              {orders.map((order, idx) => (
                <div className="order-card" key={order._id}>
                  <div className="order-card-header">
                    <div>
                      <span className="order-number">Order #{orders.length - idx}</span>
                      <span className="order-id"> · {order._id}</span>
                    </div>
                    <div className="order-meta">
                      <span className="order-date">{formatDate(order.purchaseDate)}</span>
                      <span className="order-badge">Completed</span>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.map((item, i) => {
                      const product = item.productId; // populated by backend
                      return (
                        <div className="order-item-row" key={i}>
                          {product?.image && (
                            <img src={product.image} alt={product?.name || 'Product'} className="order-item-img" />
                          )}
                          <div className="order-item-details">
                            <span className="order-item-name">{product?.name || 'Product'}</span>
                            <span className="order-item-qty">Qty: {item.quantity}</span>
                          </div>
                          <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="order-card-footer">
                    <span>Total Paid</span>
                    <span className="order-total">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      <footer>
        <p>&copy; 2026 NexGen Tech. Cloud Computing Lab Practical (MERN).</p>
      </footer>

      {/* Toast */}
      <div className={`toast ${toastVisible ? 'show' : ''}`}>
        <div className="toast-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>{toastMessage}</span>
        </div>
      </div>
    </>
  );
}

export default App;
