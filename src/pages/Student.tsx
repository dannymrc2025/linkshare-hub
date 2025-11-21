import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Users } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  name: string;
  subject: string;
  maxMembers: number;
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

const Student = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [members, setMembers] = useState<string[]>([""]);
  const [group, setGroup] = useState<string>("");
  const [link, setLink] = useState("");

  useEffect(() => {
    const loadedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(loadedTasks);
  }, []);

  const currentTask = tasks.find(t => t.id === selectedTask);

  useEffect(() => {
    if (currentTask) {
      setMembers(Array(currentTask.maxMembers).fill(""));
    }
  }, [selectedTask, currentTask]);

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    const submission: Submission = {
      id: Date.now().toString(),
      taskId: selectedTask,
      taskName: currentTask?.name || "",
      members: filledMembers,
      group,
      link,
      submittedAt: new Date().toISOString(),
    };

    const existingSubmissions = JSON.parse(localStorage.getItem("submissions") || "[]");
    localStorage.setItem("submissions", JSON.stringify([...existingSubmissions, submission]));

    toast.success("Trabajo enviado exitosamente");
    setSelectedTask("");
    setMembers([""]);
    setGroup("");
    setLink("");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-hero">
      <div className="max-w-3xl mx-auto space-y-6">
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
                    <Label>Integrantes del Equipo (máx. {currentTask.maxMembers})</Label>
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

                  <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                    <Send className="w-4 h-4 mr-2" />
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
