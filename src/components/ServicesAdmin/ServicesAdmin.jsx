import { useState, useRef } from 'react';

export default function ServicesAdmin() {
    const [services, setServices] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        specialist: '',
        duration: '',
        category: 'relax',
        description: '',
        benefits: ['', '', '', ''],
        image: null,
        minimap: null,
        imagePreview: null,
        minimapPreview: null,
    });
    const imageInputRef = useRef(null);
    const minimapInputRef = useRef(null);

    const categories = [
        { id: 'relax', name: 'Расслабляющие' },
        { id: 'therapeutic', name: 'Лечебные' },
        { id: 'sport', name: 'Спортивные' },
        { id: 'thai', name: 'Восточные' },
        { id: 'body', name: 'Для тела' },
        { id: 'face', name: 'Для лица' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    [type]: file,
                    [`${type}Preview`]: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBenefitChange = (index, value) => {
        const newBenefits = [...formData.benefits];
        newBenefits[index] = value;
        setFormData(prev => ({ ...prev, benefits: newBenefits }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const serviceData = {
            ...formData,
            id: editingService ? editingService.id : Date.now(),
            price: formData.price.toString(),
        };

        if (editingService) {
            setServices(prev => prev.map(s => s.id === editingService.id ? serviceData : s));
        } else {
            setServices(prev => [...prev, serviceData]);
        }

        resetForm();
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            price: service.price,
            specialist: service.specialist,
            duration: service.duration,
            category: service.category,
            description: service.description,
            benefits: service.benefits || ['', '', '', ''],
            image: null,
            minimap: null,
            imagePreview: service.image || null,
            minimapPreview: service.minimap || null,
        });
        setIsCreating(true);
    };

    const handleDelete = (id) => {
        if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
            setServices(prev => prev.filter(s => s.id !== id));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            specialist: '',
            duration: '',
            category: 'relax',
            description: '',
            benefits: ['', '', '', ''],
            image: null,
            minimap: null,
            imagePreview: null,
            minimapPreview: null,
        });
        setEditingService(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
        if (minimapInputRef.current) minimapInputRef.current.value = '';
    };

    const closeModal = () => {
        resetForm();
        setIsCreating(false);
    };

    return (
        <div className="admin-section">
            <div className="admin-header">
                <h3>Управление услугами</h3>
                <button 
                    className="btn-primary" 
                    onClick={() => setIsCreating(true)}
                >
                    + Добавить услугу
                </button>
            </div>

            {isCreating && (
                <div className="modal-overlay" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        closeModal();
                    }
                }}>
                    <div className="modal-container">
                        <div className="modal-header">
                            <h4>{editingService ? 'Редактировать услугу' : 'Новая услуга'}</h4>
                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeModal}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <form className="admin-form" onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit(e);
                            }}>
                        
                        <div className="form-group">
                            <label htmlFor="name">Название услуги</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Например: Классический массаж"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="price">Цена (₽)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="2500"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="duration">Длительность</label>
                                <input
                                    type="text"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="60 мин"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="specialist">Специалист</label>
                            <input
                                type="text"
                                id="specialist"
                                name="specialist"
                                value={formData.specialist}
                                onChange={handleInputChange}
                                required
                                placeholder="Анастасия Длиноручка"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Категория</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Описание</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows="4"
                                placeholder="Описание услуги..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Преимущества</label>
                            {formData.benefits.map((benefit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={benefit}
                                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                                    placeholder={`Преимущество ${index + 1}`}
                                    className="form-input-inline"
                                />
                            ))}
                        </div>

                        <div className="form-group">
                            <label>Изображение услуги</label>
                            <div className="file-upload-container">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    ref={imageInputRef}
                                    onChange={(e) => handleImageChange(e, 'image')}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => imageInputRef.current.click()}
                                >
                                    📁 Выбрать изображение
                                </button>
                                {formData.imagePreview && (
                                    <div className="image-preview">
                                        <img src={formData.imagePreview} alt="Preview" />
                                        <button
                                            type="button"
                                            className="btn-remove"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, image: null, imagePreview: null }));
                                                if (imageInputRef.current) imageInputRef.current.value = '';
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Миниатюра</label>
                            <div className="file-upload-container">
                                <input
                                    type="file"
                                    id="minimap"
                                    name="minimap"
                                    ref={minimapInputRef}
                                    onChange={(e) => handleImageChange(e, 'minimap')}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => minimapInputRef.current.click()}
                                >
                                    📁 Выбрать миниатюру
                                </button>
                                {formData.minimapPreview && (
                                    <div className="image-preview">
                                        <img src={formData.minimapPreview} alt="Minimap Preview" />
                                        <button
                                            type="button"
                                            className="btn-remove"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, minimap: null, minimapPreview: null }));
                                                if (minimapInputRef.current) minimapInputRef.current.value = '';
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingService ? 'Сохранить изменения' : 'Создать услугу'}
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={closeModal}
                            >
                                Отмена
                            </button>
                        </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Изображение</th>
                            <th>Название</th>
                            <th>Цена</th>
                            <th>Специалист</th>
                            <th>Длительность</th>
                            <th>Категория</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                                    Услуги не добавлены. Нажмите "Добавить услугу" для создания.
                                </td>
                            </tr>
                        ) : (
                            services.map((service) => (
                                <tr key={service.id}>
                                    <td>#{service.id}</td>
                                    <td>
                                        <div className="service-thumb">
                                            <img 
                                                src={service.image || 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=100&h=100&fit=crop'} 
                                                alt={service.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=100&h=100&fit=crop';
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td>{service.name}</td>
                                    <td>{service.price} ₽</td>
                                    <td>{service.specialist}</td>
                                    <td>{service.duration}</td>
                                    <td>
                                        <span className="category-badge">{service.category}</span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-icon"
                                            onClick={() => handleEdit(service)}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-icon"
                                            onClick={() => handleDelete(service.id)}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
                .admin-form-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 2rem;
                }

                .modal-overlay {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.85);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    backdrop-filter: blur(4px);
                }

                .modal-container {
                    background-color: var(--bg);
                    border-radius: 8px;
                    max-width: 700px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    animation: modalSlideIn 0.3s ease-out;
                    position: relative;
                }

                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid var(--base-200);
                    position: sticky;
                    top: 0;
                    background-color: var(--bg);
                    z-index: 10;
                }

                .modal-body {
                    overflow-y: auto;
                    max-height: calc(90vh - 140px);
                }

                .modal-body::-webkit-scrollbar {
                    width: 8px;
                }

                .modal-body::-webkit-scrollbar-track {
                    background: var(--base-100);
                }

                .modal-body::-webkit-scrollbar-thumb {
                    background: var(--base-400);
                    border-radius: 4px;
                }

                .modal-body::-webkit-scrollbar-thumb:hover {
                    background: var(--base-600);
                }

                .modal-header h4 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-family: var(--type-1);
                    text-transform: uppercase;
                }

                .modal-close {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background-color: var(--base-200);
                    color: var(--fg);
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    transition: all 0.3s ease;
                }

                .modal-close:hover {
                    background-color: var(--base-400);
                    transform: rotate(90deg);
                }

                .admin-form {
                    display: block;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .form-group {
                    margin-bottom: 1rem;
                    padding: 0 2rem;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-family: var(--type-3);
                    font-size: 0.875rem;
                }

                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 0.75rem;
                    background-color: var(--base-100);
                    border: 1px solid var(--base-200);
                    color: var(--fg);
                    font-family: var(--type-2);
                    font-size: 1rem;
                }

                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: var(--base-400);
                }

                .form-input-inline {
                    width: 100%;
                    padding: 0.5rem;
                    margin-bottom: 0.5rem;
                    background-color: var(--base-100);
                    border: 1px solid var(--base-200);
                    color: var(--fg);
                }

                .image-preview {
                    margin-top: 1rem;
                    max-width: 200px;
                    border: 1px solid var(--base-200);
                }

                .image-preview img {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                .form-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                    padding: 0 2rem 2rem 2rem;
                }

                .file-upload-container {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .image-preview {
                    position: relative;
                    margin-top: 0.5rem;
                    max-width: 300px;
                    border: 1px solid var(--base-200);
                    border-radius: 4px;
                    overflow: hidden;
                }

                .image-preview img {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                .btn-remove {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background-color: rgba(0, 0, 0, 0.7);
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    transition: background-color 0.3s ease;
                }

                .btn-remove:hover {
                    background-color: rgba(255, 0, 0, 0.8);
                }

                .btn-primary,
                .btn-secondary {
                    flex: 1;
                    padding: 0.75rem 1.5rem;
                    font-family: var(--type-3);
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    cursor: pointer;
                    border: none;
                    transition: all 0.3s ease;
                }

                .btn-primary {
                    background-color: var(--base-700);
                    color: var(--bg);
                }

                .btn-primary:hover {
                    background-color: var(--base-900);
                }

                .btn-secondary {
                    background-color: transparent;
                    color: var(--base-700);
                    border: 1px solid var(--base-700);
                }

                .btn-secondary:hover {
                    background-color: var(--base-100);
                }

                .service-thumb {
                    width: 50px;
                    height: 50px;
                    overflow: hidden;
                    border: 1px solid var(--base-200);
                }

                .service-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .category-badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    background-color: var(--base-200);
                    font-family: var(--type-3);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                }
            `}</style>
        </div>
    );
}
