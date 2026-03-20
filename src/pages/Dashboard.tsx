import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, FileText, Trash2, Copy, LogOut } from 'lucide-react';
import api from '../lib/api';

interface Resume {
    _id: string;
    title: string;
    theme: string;
    status: string;
    updatedAt: string;
}

const Dashboard = () => {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await api.get('/resumes');
            setResumes(response.data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error fetching resumes",
                description: "Could not load your resumes. Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const createNewResume = async () => {
        try {
            const response = await api.post('/resumes', { title: 'Untitled Resume' });
            const newResume = response.data;
            navigate(`/editor/${newResume._id}`);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error creating resume",
            });
        }
    };

    const deleteResume = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this resume?')) return;

        try {
            await api.delete(`/resumes/${id}`);
            setResumes(resumes.filter(r => r._id !== id));
            toast({ title: "Resume deleted" });
        } catch (error) {
            toast({ variant: "destructive", title: "Failed to delete" });
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
                        <p className="text-muted-foreground mt-1">Manage all your tailored resumes here.</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="flex gap-2">
                        <LogOut size={16} /> Logout
                    </Button>
                </div>

                {/* Action Bar */}
                <div className="flex justify-end">
                    <Button onClick={createNewResume} className="flex gap-2 bg-blue-600 hover:bg-blue-700">
                        <PlusCircle size={18} /> Create New Resume
                    </Button>
                </div>

                {/* Resumes Grid */}
                {isLoading ? (
                    <div className="text-center py-20 text-muted-foreground">Loading your resumes...</div>
                ) : resumes.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg bg-white">
                        <h3 className="text-xl font-semibold mb-2">No resumes found</h3>
                        <p className="text-muted-foreground mb-4">You haven't created any resumes yet. Start building one now.</p>
                        <Button onClick={createNewResume} variant="outline" className="flex gap-2 mx-auto">
                            <PlusCircle size={18} /> Create your first Resume
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 pt-4 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {resumes.map((resume) => (
                            <Card
                                key={resume._id}
                                className="group cursor-pointer hover:border-primary transition-all duration-200"
                                onClick={() => navigate(`/editor/${resume._id}`)}
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg line-clamp-1">{resume.title}</CardTitle>
                                        <FileText className="text-muted-foreground opacity-50 flex-shrink-0" size={24} />
                                    </div>
                                    <CardDescription>
                                        Last edited: {new Date(resume.updatedAt).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2 mb-2">
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                                            Theme: {resume.theme}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${resume.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {resume.status}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={(e) => deleteResume(resume._id, e)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;
