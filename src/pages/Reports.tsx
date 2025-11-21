import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, ExternalLink } from "lucide-react";

interface Task {
  id: string;
  name: string;
  subject: string;
}

interface Submission {
  id: string;
  taskId: string;
  taskName: string;
  members: string[];
  group: string;
  link: string;
  submittedAt: string;
}

const GROUPS = ["2A", "2C", "2D", "2F Leona"];

const Reports = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  useEffect(() => {
    const loadedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const loadedSubmissions = JSON.parse(localStorage.getItem("submissions") || "[]");
    setTasks(loadedTasks);
    setSubmissions(loadedSubmissions);
  }, []);

  const filteredSubmissions = submissions.filter(
    (sub) =>
      (selectedTask === "all" || !selectedTask || sub.taskId === selectedTask) &&
      (selectedGroup === "all" || !selectedGroup || sub.group === selectedGroup)
  );

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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{submission.taskName}</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                            {submission.group}
                          </span>
                          <span>•</span>
                          <span>{submission.members.join(", ")}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Entregado: {new Date(submission.submittedAt).toLocaleString("es-ES")}
                        </p>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
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
