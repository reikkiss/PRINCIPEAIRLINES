import React, { useState } from 'react';
import { Language } from '../types';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

interface ContactSectionProps {
  language: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ language }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [brand, setBrand] = useState('');
  const [service, setService] = useState('Packaging');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-10 md:p-16 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#0015ff] font-bold">
              03 / {language === 'es' ? 'CONVERSEMOS' : 'LET\'S TALK'}
            </span>
            <h2 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-neutral-900 mt-2 uppercase leading-[0.9]">
              {language === 'es' ? 'Boring is Bad for Business' : 'Boring is Bad for Business'}
            </h2>
            <p className="text-sm text-neutral-600 mt-4 leading-relaxed font-sans">
              {language === 'es'
                ? '¿Listo para que tu marca destaque en la góndola y conquiste a tus consumidores? Escríbenos directamente o agenda una reunión.'
                : 'Ready for your brand to dominate shelves and captivate customers? Reach out directly or book a discovery call.'}
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs text-neutral-800">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#0015ff]" />
              <a href="mailto:maria@versaldesign.cl" className="hover:text-[#0015ff] font-bold">
                maria@versaldesign.cl
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#0015ff]" />
              <a href="tel:+56988371103" className="hover:text-[#0015ff] font-bold">
                +56 9 8837 1103
              </a>
            </div>
            <div className="flex items-center gap-3 text-neutral-600">
              <MapPin className="w-4 h-4 text-[#0015ff]" />
              <span>Providencia / Las Condes, Santiago de Chile</span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive form */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-emerald-50 rounded-xl border border-emerald-300 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              <h3 className="font-display font-black text-2xl text-emerald-950 uppercase">
                {language === 'es' ? '¡Mensaje Enviado con Éxito!' : 'Inquiry Received!'}
              </h3>
              <p className="text-xs text-emerald-800 max-w-md font-sans">
                {language === 'es'
                  ? 'Gracias por contactar a Versal. María Jesús y nuestro equipo de diseño te responderán en menos de 24 horas.'
                  : 'Thank you for contacting Versal. María Jesús and our design team will follow up within 24 hours.'}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-black text-white text-xs font-mono font-bold rounded"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#0015ff]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@empresa.com"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#0015ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Nombre de la Marca o Proyecto</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ej. Cerveza Artesanal, Línea Gourmet"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#0015ff]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Servicio Requerido</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#0015ff]"
                  >
                    <option value="Packaging">Packaging & Empaques</option>
                    <option value="Branding">Branding & Identidad Visual</option>
                    <option value="Lettering">Custom Lettering & Tipografía</option>
                    <option value="360">Lanzamiento Integral 360°</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Cuéntanos sobre tu visión y plazos *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe tu proyecto, fecha estimada de lanzamiento o presupuesto..."
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#0015ff] font-sans text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0015ff] hover:bg-[#0022ff] text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-transform active:scale-98 flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'es' ? 'Enviar Propuesta' : 'Send Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
