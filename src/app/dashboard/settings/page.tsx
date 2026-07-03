import { Setting } from '@/Models/Setting';
import SettingsForm from './SettingsForm';

export const metadata = {
  title: 'Configuración | Panel de Administración',
};

export default async function SettingsPage() {
  const defaultKeys = [
    { key: 'hero.badge', defaultValue: 'Ingeniería de Alto Desempeño' },
    { key: 'hero.title.line1', defaultValue: 'Precisión' },
    { key: 'hero.title.highlight1', defaultValue: 'Ingeniería' },
    { key: 'hero.title.line2', defaultValue: 'Innovación' },
    { key: 'hero.title.highlight2', defaultValue: '4x4' },
    { key: 'hero.subtitle', defaultValue: 'Fabricación premium de accesorios off-road donde la ingeniería de vanguardia se une a la máxima resistencia extrema.' },
    { key: 'hero.button_text', defaultValue: 'Cotizar Proyecto' },
    { key: 'about.badge', defaultValue: 'Sobre Nosotros' },
    { key: 'about.title.line1', defaultValue: 'Especialistas en la' },
    { key: 'about.title.highlight1', defaultValue: 'Aventura y el Trabajo' },
    { key: 'about.description', defaultValue: 'Somos Ecotechne, una empresa especializada en el diseño, fabricación y comercialización de accesorios premium para vehículos 4x4, pickup y off-road. Desarrollamos soluciones robustas, funcionales y de alta calidad combinando ingeniería de precisión con el diseño más resistente.' },
  ];

  const settings = await Setting.getMultiple(defaultKeys);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Configuración de la Web</h1>
        <p className="text-foreground/60 mt-1">Administra los textos y contenidos de las secciones principales.</p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
