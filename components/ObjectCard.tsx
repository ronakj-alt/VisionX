
import React from 'react';
import { DetectedObject } from '../types';

interface ObjectCardProps {
  object: DetectedObject;
  onHover?: (id: string | null) => void;
}

const ObjectCard: React.FC<ObjectCardProps> = ({ object, onHover }) => {
  const getPlatformStyle = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('amazon')) return 'text-orange-700 bg-orange-50 border-orange-200';
    if (p.includes('myntra')) return 'text-rose-700 bg-rose-50 border-rose-200';
    if (p.includes('flipkart')) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (p.includes('ajio')) return 'text-slate-900 bg-slate-100 border-slate-300';
    if (p.includes('tata cliq')) return 'text-red-700 bg-red-50 border-red-200';
    if (p.includes('meesho')) return 'text-pink-700 bg-pink-50 border-pink-200';
    if (p.includes('nykaa')) return 'text-pink-800 bg-rose-50 border-pink-300';
    if (p.includes('official') || p.includes('.com') || p.includes('brand')) return 'text-emerald-800 bg-emerald-50 border-emerald-200';
    return 'text-indigo-700 bg-indigo-50 border-indigo-200';
  };

  return (
    <div 
      className="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden transition-all duration-300 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100/50 group"
      onMouseEnter={() => onHover?.(object.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
        <div>
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight group-hover:text-indigo-600 transition-colors duration-300">{object.name}</h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{object.brand}</p>
        </div>
        <div className="bg-white text-emerald-600 text-[9px] font-black px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest shadow-sm">
          {Math.round(object.confidence * 100)}% MATCH
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        {object.products.map((product, idx) => {
          const platformStyle = getPlatformStyle(product.platform);
          return (
            <div key={idx} className="flex space-x-4 p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all group/product">
              <div className="w-16 h-16 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover/product:scale-110" 
                  onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/f8fafc/cbd5e1?text=PREVIEW'} 
                />
              </div>
              <div className="flex-grow flex flex-col justify-between min-w-0">
                <div>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${platformStyle} inline-block mb-1`}>
                    {product.platform}
                  </span>
                  <p className="text-[11px] text-slate-700 font-bold line-clamp-2 leading-tight uppercase tracking-tight opacity-90 group-hover/product:text-slate-900">
                    {product.title}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-slate-900 font-black text-xs">{product.price || 'CHECK PRICE'}</span>
                  <a 
                    href={product.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-indigo-600 text-white text-[9px] font-black px-4 py-2 rounded-lg hover:bg-slate-900 transition-all uppercase tracking-widest shadow-lg shadow-indigo-100 active:scale-95"
                  >
                    GO TO SHOP
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ObjectCard;
