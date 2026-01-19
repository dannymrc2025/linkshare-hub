import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Lock, Plus, ListTodo, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  name: string;
  subject: string;
  max_members: number;
  created_at: string;
}

interface Submission {
  id: string;
  task_id: string;
  task_name: string;
  members: string[];
  group_name: string;
  link: string;
  submitted_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [taskName, setTaskName] = useState("");
  const [subject, setSubject] = useState("");
  const [maxMembers, setMaxMembers] = useState<string>("1");
  const [creatingTask, setCreatingTask] = useState(false);
  
  // Estado para gestión de trabajos
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskForDeletion, setSelectedTaskForDeletion] = useState<string>("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksResult, submissionsResult] = await Promise.all([
        supabase.from("tasks").select("*").order("created_at", { ascending: false }),
        supabase.from("submissions").select("*").order("submitted_at", { ascending: false }),
      ]);

      if (tasksResult.error) throw tasksResult.error;
      if (submissionsResult.error) throw submissionsResult.error;

      setTasks(tasksResult.data || []);
      setSubmissions(submissionsResult.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "2707") {
      setIsAuthenticated(true);
      toast.success("Acceso concedido");
    } else {
      toast.error("Contraseña incorrecta");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName.trim() || !subject.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setCreatingTask(true);
    try {
      const { error } = await supabase.from("tasks").insert({
        name: taskName,
        subject: subject,
        max_members: parseInt(maxMembers),
      });

      if (error) throw error;
      
      toast.success("Tarea creada exitosamente");
      setTaskName("");
      setSubject("");
      setMaxMembers("1");
      loadData();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Error al crear la tarea");
    } finally {
      setCreatingTask(false);
    }
  };

  const filteredSubmissions = submissions.filter(
    (sub) => sub.task_id === selectedTaskForDeletion
  );

  const handleToggleSubmission = (submissionId: string) => {
    setSelectedSubmissions((prev) =>
      prev.includes(submissionId)
        ? prev.filter((id) => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubmissions.length === filteredSubmissions.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(filteredSubmissions.map((sub) => sub.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedSubmissions.length === 0) {
      toast.error("Selecciona al menos un trabajo para eliminar");
      return;
    }

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("submissions")
        .delete()
        .in("id", selectedSubmissions);

      if (error) throw error;

      toast.success(`${selectedSubmissions.length} trabajo(s) eliminado(s)`);
      setSelectedSubmissions([]);
      loadData();
    } catch (error) {
      console.error("Error deleting submissions:", error);
      toast.error("Error al eliminar los trabajos");
    } finally {
      setDeleting(false);
    }
  };

  const handleTaskSelectionChange = (taskId: string) => {
    setSelectedTaskForDeletion(taskId);
    setSelectedSubmissions([]);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={creatingTask}
              >
                {creatingTask ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Crear Tarea
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sección para eliminar trabajos */}
        <Card className="shadow-card hover:shadow-hover transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-destructive flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Eliminar Trabajos</CardTitle>
                <CardDescription>Selecciona una tarea y elimina los trabajos que desees</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Seleccionar Tarea</Label>
              <Select value={selectedTaskForDeletion} onValueChange={handleTaskSelectionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Elige una tarea" />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.name} - {task.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTaskForDeletion && (
              <>
                {filteredSubmissions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No hay trabajos enviados para esta tarea
                  </p>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="selectAll"
                          checked={selectedSubmissions.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                        <Label htmlFor="selectAll" className="text-sm cursor-pointer">
                          Seleccionar todos ({filteredSubmissions.length})
                        </Label>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteSelected}
                        disabled={selectedSubmissions.length === 0 || deleting}
                      >
                        {deleting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Eliminar ({selectedSubmissions.length})
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {filteredSubmissions.map((submission) => (
                        <div
                          key={submission.id}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            checked={selectedSubmissions.includes(submission.id)}
                            onCheckedChange={() => handleToggleSubmission(submission.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {submission.members.join(", ")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Grupo {submission.group_name} • {new Date(submission.submitted_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
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
            {tasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay tareas creadas aún
              </p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="font-semibold">{task.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {task.subject} • Máx. {task.max_members} integrante{task.max_members > 1 ? "s" : ""}
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