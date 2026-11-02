import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentService } from '../services/student.service';
import { User, Mail, Phone, BookOpen, Check, ChevronLeft, GraduationCap, Info, UserCircle2 } from 'lucide-react';

export default function CreateStudentWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    name1: '', lastName1: '', lastName2: '', birthDate: '', gender: '', docType: 'DNI', docNumber: '',
    email: '', phone: '', address: '',
    level: 'Primaria', grade: '1ro', section: 'A', admissionDate: new Date().toISOString().split('T')[0], academicYear: '2024-2025', initialStatus: 'Nuevo',
    notes: '', tutorName: '', tutorPhone: '', emergencyContact: '', isActive: true, idC: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name1 || !formData.lastName1 || !formData.birthDate || !formData.gender || !formData.docNumber) {
        alert("Por favor, completa todos los campos obligatorios de Datos Personales.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.email || !formData.phone || !formData.address) {
        alert("Por favor, completa todos los campos obligatorios de Contacto.");
        return;
      }
    }
    if (step === 3) {
      if (!formData.grade || !formData.section || !formData.academicYear) {
        alert("Por favor, completa todos los campos obligatorios de Info. Académica.");
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tutorName || !formData.tutorPhone || !formData.emergencyContact) {
      alert("Por favor, completa los campos obligatorios de Información Adicional.");
      return;
    }

    setLoading(true);
    try {
      // Payload exacto para el Backend (C#)
      const payload = {
        name1: formData.name1,
        lastName1: formData.lastName1,
        lastName2: formData.lastName2 || "",
        birthDate: `${formData.birthDate}T00:00:00`,
        gender: formData.gender, // String, máx 32
        docType: formData.docType,
        docNumber: formData.docNumber,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        level: formData.level,
        grade: formData.grade,
        section: formData.section,
        admissionDate: `${formData.admissionDate}T00:00:00`,
        academicYear: formData.academicYear,
        initialStatus: formData.initialStatus,
        notes: formData.notes || "",
        tutorName: formData.tutorName,
        tutorPhone: formData.tutorPhone,
        emergencyContact: formData.emergencyContact,
        isActive: formData.isActive,
        idC: Number(formData.idC), // Requerido (ID del curso)
        idInstitution: 1 // Aseguramos que vaya la institución
      };
      
      await StudentService.create(payload);
      alert("Estudiante guardado con éxito.");
      navigate('/students');
    } catch (error: any) {
      console.error(error.response?.data || error);
      alert(error.response?.data?.detail || "Error al guardar el estudiante. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Datos personales', icon: User },
    { num: 2, label: 'Contacto', icon: Mail },
    { num: 3, label: 'Info. académica', icon: BookOpen },
    { num: 4, label: 'Adicional', icon: Info },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <button onClick={() => navigate('/students')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors mb-4">
        <ChevronLeft size={16} /> Volver a estudiantes
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-display font-extrabold text-slate-800 dark:text-white mb-2">Nuevo estudiante</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Completa la información para registrar un nuevo estudiante.</p>
        </div>
      </div>

      <div className="relative flex justify-between items-center mb-10 max-w-4xl mx-auto">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-500 to-purple-500 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>
        
        {steps.map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-950 px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
              step > s.num ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white border-transparent shadow-lg' : 
              step === s.num ? 'bg-white dark:bg-slate-800 text-purple-600 border-purple-500 shadow-md' : 
              'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
              {step > s.num ? <Check size={18} /> : <s.icon size={18} />}
            </div>
            <span className={`text-xs font-bold ${step >= s.num ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 dark:bg-slate-800/50 dark:border-slate-700">
          <form onSubmit={handleSubmit}>
            
            {/* PASO 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><User size={20} /></div>
                  <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">Datos personales</h2></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Nombres *</label><input type="text" name="name1" required value={formData.name1} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Ej. Sofía Valentina" /></div>
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Apellidos *</label><input type="text" name="lastName1" required value={formData.lastName1} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Ej. Ramírez Torres" /></div>
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Fecha de nacimiento *</label><input type="date" name="birthDate" required value={formData.birthDate} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" /></div>
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Género *</label>
                    <select name="gender" required value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white">
                      <option value="">Seleccionar</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="No binario">No binario</option>
                    </select>
                  </div>
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Tipo Doc *</label><select name="docType" required value={formData.docType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white"><option value="DNI">DNI</option><option value="Pasaporte">Pasaporte</option></select></div>
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Nº Documento *</label><input type="text" name="docNumber" required value={formData.docNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Ej. 12345678" /></div>
                </div>
              </div>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Phone size={20} /></div>
                  <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">Contacto</h2></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Email *</label><input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="ejemplo@correo.com" /></div>
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Teléfono *</label><input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="+53 5555-0000" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-bold mb-1 dark:text-slate-300">Dirección *</label><input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Calle Falsa 123, Apartamento 4" /></div>
                </div>
              </div>
            )}

            {/* PASO 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                  <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center"><GraduationCap size={20} /></div>
                  <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">Info Académica</h2></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Nivel *</label><select name="level" required value={formData.level} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white"><option value="Primaria">Primaria</option><option value="Secundaria">Secundaria</option></select></div>
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Grado *</label><input type="text" name="grade" required value={formData.grade} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Ej. 3ro" /></div>
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Sección *</label><input type="text" name="section" required value={formData.section} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Ej. A" /></div>
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Año Académico *</label><input type="text" name="academicYear" required value={formData.academicYear} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Ej. 2024-2025" /></div>
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Fecha de Ingreso *</label><input type="date" name="admissionDate" required value={formData.admissionDate} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" /></div>
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">ID Curso *</label><input type="number" name="idC" required value={formData.idC} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Ej. 1" /></div>
                </div>
              </div>
            )}

            {/* PASO 4 */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><Info size={20} /></div>
                  <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">Adicional</h2></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Tutor Legal *</label><input type="text" name="tutorName" required value={formData.tutorName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Ej. María Torres" /></div>
                  <div><label className="block text-sm font-bold mb-1 dark:text-slate-300">Teléfono Tutor *</label><input type="tel" name="tutorPhone" required value={formData.tutorPhone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Ej. +53 5555-1111" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-bold mb-1 dark:text-slate-300">Contacto de Emergencia *</label><input type="text" name="emergencyContact" required value={formData.emergencyContact} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Ej. Tía Ana - +53 5555-2222" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-bold mb-1 dark:text-slate-300">Notas</label><textarea name="notes" rows={3} value={formData.notes} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 dark:text-white" placeholder="Alergias, necesidades especiales, etc." /></div>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 text-purple-600 rounded" />
                  <label className="font-bold text-slate-800 dark:text-white">¿Estudiante activo?</label>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button type="button" onClick={prevStep} disabled={step === 1} className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 ${step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 dark:text-white'}`}>
                <ChevronLeft size={18} /> Anterior
              </button>
              
              {step < totalSteps ? (
                <button type="button" onClick={nextStep} className="btn-lyra px-8 py-3 flex items-center gap-2">
                  Siguiente <Check size={18} />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="btn-lyra px-8 py-3 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
                  {loading ? 'Guardando...' : 'Guardar Estudiante'} <Check size={18} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Panel de Vista Previa */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 dark:bg-slate-800/50 dark:border-slate-700 sticky top-6">
            <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-white">
              <UserCircle2 size={24} className="text-blue-500" />
              <h3 className="text-lg font-bold">Resumen</h3>
            </div>
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-2xl font-bold text-purple-600 mb-3 border-4 border-white dark:border-slate-700 shadow-md">
                {formData.name1 ? formData.name1.charAt(0).toUpperCase() : '?'}
                {formData.lastName1 ? formData.lastName1.charAt(0).toUpperCase() : ''}
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white text-lg">{formData.name1 || 'Nombre'} {formData.lastName1 || 'Apellido'}</h4>
              <span className={`text-xs font-bold px-3 py-1 rounded-full mt-2 flex items-center gap-1 ${formData.isActive ? 'text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-400' : 'text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400'}`}>
                {formData.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="space-y-3 text-sm border-t border-slate-200 dark:border-slate-700 pt-4">
              <p className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Nivel:</span> <span className="font-bold text-slate-800 dark:text-white">{formData.level}</span></p>
              <p className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Grado:</span> <span className="font-bold text-slate-800 dark:text-white">{formData.grade} - {formData.section}</span></p>
              <p className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Tutor:</span> <span className="font-bold text-slate-800 dark:text-white">{formData.tutorName || 'No asignado'}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}