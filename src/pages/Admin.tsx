import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Lock, Plus, ListTodo } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  name: string;
  subject: string;
  maxMembers: number;
  createdAt: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [taskName, setTaskName] = useState("");
  const [subject, setSubject] = useState("");
  const [maxMembers, setMaxMembers] = useState<string>("1");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "2707") {
      setIsAuthenticated(true);
      toast.success("Acceso concedido");
    } else {
      toast.error("Contraseña incorrecta");
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName.trim() || !subject.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName,
      subject: subject,
      maxMembers: parseInt(maxMembers),
      createdAt: new Date().toISOString(),
    };

    const existingTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    localStorage.setItem("tasks", JSON.stringify([...existingTasks, newTask]));
    
    toast.success("Tarea creada exitosamente");
    setTaskName("");
    setSubject("");
    setMaxMembers("1");
  };

  const getTasks = (): Task[] => {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-hero">
        <Card className="w-full max-w-md shadow-hover">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 mx-auto">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Acceso Profesor</CardTitle>
            <CardDescription className="text-center">
              Ingresa la contraseña para acceder al panel de administración
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="transition-all duration-200 focus:shadow-hover"
                />
              </div>
              <div className="space-y-2">
                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                  Acceder
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al inicio
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona las tareas de tus alumnos</p>
          </div>
        </div>

        <Card className="shadow-card hover:shadow-hover transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Crear Nueva Tarea</CardTitle>
                <CardDescription>Define los detalles de la tarea para tus alumnos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taskName">Nombre de la Tarea</Label>
                <Input
                  id="taskName"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Ej: Proyecto de Investigación"
                  className="transition-all duration-200 focus:shadow-hover"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Asignatura</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ej: Matemáticas"
                  className="transition-all duration-200 focus:shadow-hover"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxMembers">Número Máximo de Integrantes</Label>
                <Select value={maxMembers} onValueChange={setMaxMembers}>
                  <SelectTrigger id="maxMembers" className="transition-all duration-200 focus:shadow-hover">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 integrante</SelectItem>
                    <SelectItem value="2">2 integrantes</SelectItem>
                    <SelectItem value="3">3 integrantes</SelectItem>
                    <SelectItem value="4">4 integrantes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4 mr-2" />
                Crear Tarea
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-success flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Tareas Creadas</CardTitle>
                <CardDescription>Lista de todas las tareas disponibles</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {getTasks().length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay tareas creadas aún
              </p>
            ) : (
              <div className="space-y-3">
                {getTasks().map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="font-semibold">{task.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {task.subject} • Máx. {task.maxMembers} integrante{task.maxMembers > 1 ? "s" : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
