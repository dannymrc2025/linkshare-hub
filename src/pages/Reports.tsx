import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Task {
  id: string;
  name: string;
  subject: string;
}

interface Submission {
  id: string;
  task_id: string;
  task_name: string;
  members: string[];
  group_name: string;
  link: string;
  submitted_at: string;
  grade: string | null;
  observations: string | null;
}

const GROUPS = ["2A", "2C", "2D", "2F Leona"];

const Reports = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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

  const filteredSubmissions = submissions.filter(
    (sub) =>
      (selectedTask === "all" || !selectedTask || sub.task_id === selectedTask) &&
      (selectedGroup === "all" || !selectedGroup || sub.group_name === selectedGroup)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Reportes</h1>
            <p className="text-muted-foreground">Visualiza los trabajos entregados por los alumnos</p>
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Selecciona la tarea y grupo para ver los trabajos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                  <SelectTrigger className="transition-all duration-200 focus:shadow-hover">
                    <SelectValue placeholder="Todas las tareas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las tareas</SelectItem>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.name} - {task.subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="transition-all duration-200 focus:shadow-hover">
                    <SelectValue placeholder="Todos los grupos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los grupos</SelectItem>
                    {GROUPS.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-success flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Trabajos Entregados</CardTitle>
                <CardDescription>
                  {filteredSubmissions.length} trabajo{filteredSubmissions.length !== 1 ? "s" : ""} encontrado{filteredSubmissions.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No se encontraron trabajos con los filtros seleccionados
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-all hover:shadow-hover"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-lg">{submission.task_name}</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                            {submission.group_name}
                          </span>
                          <span>•</span>
                          <span>{submission.members.join(", ")}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Entregado: {new Date(submission.submitted_at).toLocaleString("es-ES")}
                        </p>
                        
                        {/* Grade and Observations section */}
                        {(submission.grade || submission.observations) && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg space-y-2">
                            {submission.grade && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-muted-foreground">Calificación:</span>
                                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-sm font-semibold rounded">
                                  {submission.grade}
                                </span>
                              </div>
                            )}
                            {submission.observations && (
                              <div>
                                <span className="text-xs font-medium text-muted-foreground">Observaciones:</span>
                                <p className="text-sm text-foreground mt-1">{submission.observations}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        className="hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
                      >
                        <a
                          href={submission.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Ver trabajo
                        </a>
                      </Button>
                    </div>
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

export default Reports;