import React, { useState } from 'react';
import { X, Layers, Calculator, CheckCircle2 } from 'lucide-react';
import type { LoomDef, WeavePattern, OrderPriority } from '../types/textile';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  looms: LoomDef[];
  onSubmitOrder: (orderData: any) => Promise<void>;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  looms,
  onSubmitOrder
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('Nordic Apparel Co.');
  const [fabricName, setFabricName] = useState('Premium Combed Poplin');
  const [construction, setConstruction] = useState('40s Combed x 40s Combed / 132 x 72 / 63" Poplin');
  const [weavePattern, setWeavePattern] = useState<WeavePattern>('Plain');
  const [widthInches, setWidthInches] = useState(63);
  const [totalMetersOrdered, setTotalMetersOrdered] = useState(8000);
  const [priority, setPriority] = useState<OrderPriority>('normal');
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0]
  );
  const [assignedLooms, setAssignedLooms] = useState<string[]>(['L-101', 'L-102']);
  const [unitPrice, setUnitPrice] = useState(3.80);
  const [notes, setNotes] = useState('Standard export packing. Zero oil contamination.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automated textile BOM yarn calculation preview
  const estWarpKg = Math.round((totalMetersOrdered * 0.17) * 1.03);
  const estWeftKg = Math.round((totalMetersOrdered * 0.11) * 1.03);
  const totalYarnKg = estWarpKg + estWeftKg;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitOrder({
        customerName,
        fabricName,
        construction,
        weavePattern,
        widthInches: Number(widthInches),
        totalMetersOrdered: Number(totalMetersOrdered),
        priority,
        deliveryDate,
        assignedLooms,
        unitPricePerMeter: Number(unitPrice),
        notes
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLoom = (code: string) => {
    if (assignedLooms.includes(code)) {
      setAssignedLooms(assignedLooms.filter(c => c !== code));
    } else {
      setAssignedLooms([...assignedLooms, code]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Create New Production Order
            </h3>
            <p className="text-xs text-slate-500">
              Generate work order, calculate yarn BOM, and assign weaving loom capacity.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Client / Buyer Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Fabric Commercial Title
              </label>
              <input
                type="text"
                required
                value={fabricName}
                onChange={(e) => setFabricName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Fabric Construction Specification
            </label>
            <input
              type="text"
              required
              value={construction}
              onChange={(e) => setConstruction(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Weave Pattern
              </label>
              <select
                value={weavePattern}
                onChange={(e) => setWeavePattern(e.target.value as WeavePattern)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="Plain">Plain 1/1</option>
                <option value="Twill 2/1">Twill 2/1</option>
                <option value="Twill 3/1">Twill 3/1</option>
                <option value="Satin 4/1">Satin 4/1</option>
                <option value="Oxford">Oxford</option>
                <option value="Dobby">Dobby</option>
                <option value="Herringbone">Herringbone</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Reed Width (Inches)
              </label>
              <input
                type="number"
                value={widthInches}
                onChange={(e) => setWidthInches(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Target Meters
              </label>
              <input
                type="number"
                required
                value={totalMetersOrdered}
                onChange={(e) => setTotalMetersOrdered(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as OrderPriority)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Delivery Deadline
              </label>
              <input
                type="date"
                required
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Price ($/meter)
              </label>
              <input
                type="number"
                step="0.05"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* Loom Assignment Checkboxes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Assign Looms for Weave Production
            </label>
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
              {looms.map(loom => {
                const isChecked = assignedLooms.includes(loom.code);
                return (
                  <button
                    key={loom.id}
                    type="button"
                    onClick={() => toggleLoom(loom.code)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                      isChecked
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {loom.code} ({loom.type.slice(0, 3)})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Textile Yarn BOM Calculation Callout */}
          <div className="p-3 bg-slate-900 text-white rounded-lg text-xs font-mono space-y-1">
            <div className="text-slate-400 text-[10px] flex items-center justify-between">
              <span>AUTOMATED YARN BOM REQUIREMENT:</span>
              <span className="text-emerald-400 font-bold">{totalYarnKg.toLocaleString()} kg TOTAL</span>
            </div>
            <div className="text-slate-200 flex justify-between text-[11px]">
              <span>Warp Yarn: {estWarpKg.toLocaleString()} kg (3% waste included)</span>
              <span>Weft Yarn: {estWeftKg.toLocaleString()} kg (4% waste included)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Mill Quality Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Order...' : 'Confirm Production Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
