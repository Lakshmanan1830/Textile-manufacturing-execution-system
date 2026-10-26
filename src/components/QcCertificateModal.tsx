import React from 'react';
import { X, Printer, Award, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import type { InspectionRoll } from '../types/textile';

interface QcCertificateModalProps {
  roll: InspectionRoll | null;
  onClose: () => void;
}

export const QcCertificateModal: React.FC<QcCertificateModalProps> = ({
  roll,
  onClose
}) => {
  if (!roll) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 my-8 print:p-0 print:border-none print:shadow-none">
        {/* Certificate Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-slate-900">
              Certificate of Quality Inspection
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div className="p-6 border-4 border-double border-slate-300 rounded-lg bg-white mt-4 font-serif">
          {/* Mill Header */}
          <div className="text-center pb-4 border-b border-slate-300">
            <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 font-sans">
              TexFlow Manufacturing Mills
            </h1>
            <p className="text-xs text-slate-600 font-sans">
              Weaving Division · Quality Assurance Laboratory · ISO 9001:2015 Accredited
            </p>
            <div className="inline-block mt-3 px-4 py-1 border border-slate-800 text-xs uppercase tracking-widest font-sans font-bold text-slate-900">
              Certificate of Inspection · ASTM D5430 Standard
            </div>
          </div>

          {/* Certificate Identification */}
          <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200 font-sans">
            <div>
              <div className="text-slate-500">Certificate No:</div>
              <div className="font-mono font-bold text-slate-900 text-sm">{roll.certificateNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-500">Date of Inspection:</div>
              <div className="font-mono text-slate-900">{roll.inspectedAt}</div>
            </div>
            <div>
              <div className="text-slate-500">Production Order Reference:</div>
              <div className="font-mono font-semibold text-slate-900">{roll.orderCode}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-500">Fabric Roll Identifier:</div>
              <div className="font-mono font-bold text-slate-900 text-sm">{roll.rollNumber}</div>
            </div>
          </div>

          {/* Fabric Specifications */}
          <div className="py-4 space-y-2 text-xs font-sans border-b border-slate-200">
            <div className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
              Inspected Cloth Parameters
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-800">
              <div><span className="text-slate-500">Fabric Construction:</span> <strong>{roll.fabricSpec}</strong></div>
              <div><span className="text-slate-500">Produced on Loom:</span> <strong className="font-mono">{roll.loomCode}</strong></div>
              <div><span className="text-slate-500">Roll Width:</span> <strong>{roll.widthInches} Inches</strong></div>
              <div><span className="text-slate-500">Roll Length:</span> <strong>{roll.lengthYards} Linear Yards</strong></div>
              <div><span className="text-slate-500">Gross Weight:</span> <strong>{roll.grossWeightKg} Kilograms</strong></div>
              <div><span className="text-slate-500">Inspection Standard:</span> <strong>ASTM D5430 (4-Point)</strong></div>
            </div>
          </div>

          {/* Defect Scoring & ASTM 4-Point Math */}
          <div className="py-4 border-b border-slate-200 font-sans">
            <div className="font-bold uppercase tracking-wider text-slate-700 text-[11px] mb-2">
              ASTM 4-Point System Assessment
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span>Total Accumulated Penalty Points:</span>
                <span className="font-mono font-bold text-slate-900">{roll.totalPoints} Points</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span>Calculated Points per 100 Square Yards:</span>
                <span className="font-mono font-extrabold text-base text-slate-900">
                  {roll.pointsPer100SqYards} pts / 100 sq yds
                </span>
              </div>
              <div className="text-[10px] text-slate-500 italic mt-1">
                Formula: (Total Points × 3600) / (Fabric Width × Roll Length)
              </div>
            </div>

            {/* Official Grade Stamp */}
            <div className="mt-4 text-center">
              <div className={`inline-block px-6 py-2 rounded-lg border-2 font-bold uppercase tracking-widest text-sm ${
                roll.grade === 'Grade A' ? 'border-emerald-600 text-emerald-800 bg-emerald-50' :
                roll.grade === 'Grade B' ? 'border-amber-600 text-amber-800 bg-amber-50' :
                'border-rose-600 text-rose-800 bg-rose-50'
              }`}>
                {roll.grade === 'Grade A' ? '✓ CERTIFIED FIRST QUALITY · GRADE A' :
                 roll.grade === 'Grade B' ? '⚠ SECOND QUALITY · GRADE B' : '✕ REJECTED · CUT-PIECE'}
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-6 font-sans text-xs">
            <div>
              <div className="text-slate-500">Certified Inspector:</div>
              <div className="font-medium text-slate-900 mt-1">{roll.inspectorName}</div>
              <div className="border-b border-slate-400 w-36 mt-4" />
              <div className="text-[10px] text-slate-400 mt-0.5">Authorized Signature</div>
            </div>
            <div className="text-right">
              <div className="text-slate-500">QA Laboratory Stamp:</div>
              <div className="font-semibold text-emerald-700 mt-1">VERIFIED ISO 9001:2015</div>
              <div className="border-b border-slate-400 w-36 ml-auto mt-4" />
              <div className="text-[10px] text-slate-400 mt-0.5">Mill Technical Director</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
