'use client';

import { useState } from 'react';

export default function VehicleFormSelectors({ 
  brands, 
  models,
  defaultBrandId = '',
  defaultModelId = ''
}: { 
  brands: any[], 
  models: any[],
  defaultBrandId?: string | number,
  defaultModelId?: string | number
}) {
  const [selectedBrand, setSelectedBrand] = useState(defaultBrandId.toString());

  const filteredModels = models.filter(m => m.brand_id.toString() === selectedBrand);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="vehicle_brand_id" className="block text-sm font-semibold text-foreground mb-2">Marca *</label>
        <select 
          id="vehicle_brand_id"
          name="vehicle_brand_id"
          required
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors appearance-none"
        >
          <option value="">Selecciona una marca...</option>
          {brands.map((brand) => (
            <option key={brand.brand_id} value={brand.brand_id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="vehicle_model_id" className="block text-sm font-semibold text-foreground mb-2">Modelo *</label>
        <select 
          id="vehicle_model_id"
          name="vehicle_model_id"
          required
          defaultValue={defaultModelId}
          disabled={!selectedBrand}
          className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-accent transition-colors appearance-none disabled:opacity-50"
        >
          <option value="">Selecciona un modelo...</option>
          {filteredModels.map((model) => (
            <option key={model.vehicle_model_id} value={model.vehicle_model_id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
