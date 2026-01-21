import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Users, Loader2, ShieldAlert, LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Task {
  id: string;
  name: string;
  subject: string;
  max_members: number;
}

const GROUPS = ["2A", "2C", "2D", "2F Leona"];

const Student = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [members, setMembers] = useState<string[]>([""]);
  const [group, setGroup] = useState<string>("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      loadTasks();
    }
  }, [user, authLoading]);

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Error al cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  const currentTask = tasks.find(t => t.id === selectedTask);

  useEffect(() => {
    if (currentTask) {
      setMembers(Array(currentTask.max_members).fill(""));
    }
  }, [selectedTask, currentTask]);

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTask || !group || !link.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const filledMembers = members.filter(m => m.trim() !== "");
    if (filledMembers.length === 0) {
      toast.error("Ingresa al menos un integrante");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("submissions").insert({
        task_id: selectedTask,
        task_name: currentTask?.name || "",
        members: filledMembers,
        group_name: group,
        link,
      });

      if (error) throw error;

      toast.success("Trabajo enviado exitosamente");
      setSelectedTask("");
      setMembers([""]);
      setGroup("");
      setLink("");
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Error al enviar el trabajo");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-hero">
        <Card className="w-full max-w-md shadow-hover">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 mx-auto">
              <ShieldAlert className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Acceso Requerido</CardTitle>
            <CardDescription className="text-center">
              Debes iniciar sesión para enviar tu trabajo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => navigate("/auth")}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              Iniciar Sesión
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
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
    <div className="min-h-screen p-4 md:p-8 bg-gradient-hero">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Enviar Trabajo</h1>
              <p className="text-muted-foreground">Completa el formulario para enviar tu tarea</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>

        <Card className="shadow-hover">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Formulario de Entrega</CardTitle>
                <CardDescription>Ingresa los datos de tu equipo y el enlace del trabajo</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="task">Selecciona la Tarea</Label>
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                  <SelectTrigger id="task" className="transition-all duration-200 focus:shadow-hover">
                    <SelectValue placeholder="Elige una tarea" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No hay tareas disponibles
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.name} - {task.subject}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {currentTask && (
                <>
                  <div className="space-y-4">
                    <Label>Integrantes del Equipo (máx. {currentTask.max_members})</Label>
                    {members.map((member, index) => (
                      <Input
                        key={index}
                        value={member}
                        onChange={(e) => handleMemberChange(index, e.target.value)}
                        placeholder={`Nombre del integrante ${index + 1}${index === 0 ? " *" : ""}`}
                        className="transition-all duration-200 focus:shadow-hover"
                      />
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="group">Grupo</Label>
                    <Select value={group} onValueChange={setGroup}>
                      <SelectTrigger id="group" className="transition-all duration-200 focus:shadow-hover">
                        <SelectValue placeholder="Selecciona tu grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        {GROUPS.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link">Enlace del Trabajo</Label>
                    <Input
                      id="link"
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://..."
                      className="transition-all duration-200 focus:shadow-hover"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Enviar Trabajo
                  </Button>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Student;
