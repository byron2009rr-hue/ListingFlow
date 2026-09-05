.dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: white;
}

.dashboard-header {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info span:first-child {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
}

.tier-badge {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
}

.dashboard-container {
  display: flex;
  flex: 1;
  gap: 0;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.nav-item {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 12px 24px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  border-left-color: #3b82f6;
}

.content-area {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.content-area h2 {
  font-size: 1.75rem;
  margin-bottom: 24px;
  color: white;
}

/* Generate Section */
.generate-section {
  max-width: 900px;
}

.generations-info {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  background: rgba(59, 130, 246, 0.1);
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.form-group textarea {
  resize: vertical;
  font-family: 'Courier New', monospace;
  min-height: 150px;
}

.generated-content {
  margin-top: 32px;
  padding: 24px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
}

.generated-content h3 {
  margin-bottom: 16px;
  color: #60a5fa;
}

.content-box {
  background: rgba(0, 0, 0, 0.3);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  max-height: 400px;
  overflow-y: auto;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

/* History Section */
.history-section {
  max-width: 900px;
}

.history-list {
  display: grid;
  gap: 16px;
}

.history-item {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 16px;
}

.history-item h4 {
  color: #60a5fa;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.history-item p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Billing Section */
.billing-section {
  max-width: 1000px;
}

.tier-card {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
}

.tier-card h3 {
  margin-bottom: 8px;
  color: #60a5fa;
}

.tier-card p {
  color: rgba(255, 255, 255, 0.8);
}

.tier-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.tier-option {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.tier-option:hover {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.05);
}

.tier-option.featured {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.1);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}

.tier-option h4 {
  font-size: 1.25rem;
  margin-bottom: 8px;
  color: white;
}

.tier-option .price {
  font-size: 1.75rem;
  font-weight: 700;
  color: #60a5fa;
  margin-bottom: 16px;
}

.tier-option ul {
  list-style: none;
  margin-bottom: 16px;
}

.tier-option li {
  padding: 8px 0;
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.95rem;
}

.tier-option li:last-child {
  border-bottom: none;
}

.tier-option button {
  width: 100%;
}

/* Settings Section */
.settings-section {
  max-width: 600px;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-group button {
  width: 100%;
  padding: 12px;
  text-align: left;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px;
    flex-direction: row;
    gap: 0;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .nav-item {
    padding: 12px 16px;
    white-space: nowrap;
    border-left: none;
    border-bottom: 3px solid transparent;
  }

  .nav-item.active {
    border-left: none;
    border-bottom-color: #3b82f6;
  }

  .content-area {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .tier-options {
    grid-template-columns: 1fr;
  }
}

/* Scrollbar styling */
.content-area::-webkit-scrollbar,
.sidebar::-webkit-scrollbar {
  width: 8px;
}

.content-area::-webkit-scrollbar-track,
.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.content-area::-webkit-scrollbar-thumb,
.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.content-area::-webkit-scrollbar-thumb:hover,
.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}