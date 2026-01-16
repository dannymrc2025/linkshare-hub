import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, UserCog, Users, FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Módulo Profesor",
      description: "Crea y gestiona las tareas para tus alumnos",
      icon: UserCog,
      path: "/admin",
      gradient: "from-primary to-blue-600",
    },
    {
      title: "Módulo Alumno",
      description: "Envía tus trabajos y proyectos",
      icon: Users,
      path: "/student",
      gradient: "from-secondary to-green-600",
    },
    {
      title: "Reportes",
      description: "Visualiza los trabajos entregados",
      icon: FileText,
      path: "/reports",
      gradient: "from-accent to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Gestión de Tareas Escolares</h1>
              <p className="text-sm text-muted-foreground">Plataforma educativa para secundaria</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Comparte tu tarea
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Facilita la entrega y gestión de trabajos escolares de forma organizada y eficiente
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Card
                  key={module.path}
                  className="group cursor-pointer transition-all hover:shadow-hover hover:-translate-y-1 duration-200"
                  onClick={() => navigate(module.path)}
                >
                  <CardHeader className="space-y-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {module.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                      size="lg"
                    >
                      Acceder
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Plataforma de Gestión Educativa - Diseñada para secundaria</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
