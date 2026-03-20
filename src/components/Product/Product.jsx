import { Link } from "react-router-dom";

export default function Product({ service, serviceIndex, innerRef }) {
  const fallbackImage = "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=800&fit=crop";

  return (
    <div
      className="product-card"
      ref={innerRef}
      data-service-index={serviceIndex}
    >
      <Link to={`/lab/${service.id}`} className="product-card-link">
        <div className="product-image">
          <img 
            src={service.image} 
            alt={service.name} 
            onError={(e) => { e.target.src = fallbackImage; }}
          />
        </div>
        <div className="product-info">
          <div className="product-header">
            <h3 className="product-name">{service.name}</h3>
            <p className="product-price">{service.price} ₽</p>
          </div>
          <div className="product-meta">
            <p className="product-specialist">{service.specialist}</p>
            <p className="product-duration">{service.duration}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
