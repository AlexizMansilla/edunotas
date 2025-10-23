import React, { useState } from 'react';
import { User, BookOpen, BarChart3, Upload, LogOut, Eye, EyeOff } from 'lucide-react';

const DATOS_DEMO = {
    usuarios: [
        { id: 1, nombre: "Profesor de Educación Básica", email: "profesor1@escuela.cl", password: "clave123", rol: "profesor" },
        { id: 2, nombre: "Profesor de Educación Básica y Media", email: "profesor2@escuela.cl", password: "clave123", rol: "profesor" },
        { id: 3, nombre: "Profesor de Educación Media", email: "profesor3@escuela.cl", password: "clave123", rol: "profesor" }
    ],
    cursos: [
        { id: 1, nombre: "1° Básico", nivel: 1 },
        { id: 2, nombre: "2° Básico", nivel: 2 },
        { id: 3, nombre: "3° Básico", nivel: 3 },
        { id: 4, nombre: "4° Básico", nivel: 4 },
        { id: 5, nombre: "5° Básico", nivel: 5 },
        { id: 6, nombre: "6° Básico", nivel: 6 },
        { id: 7, nombre: "7° Básico", nivel: 7 },
        { id: 8, nombre: "8° Básico", nivel: 8 },
        { id: 9, nombre: "1° Medio", nivel: 9 },
        { id: 10, nombre: "2° Medio", nivel: 10 },
        { id: 11, nombre: "3° Medio", nivel: 11 },
        { id: 12, nombre: "4° Medio", nivel: 12 }
    ],
    asignaturas: [
        { id: 1, nombre: "Matemáticas", codigo: "MAT" },
        { id: 2, nombre: "Lenguaje y Comunicación", codigo: "LEN" },
        { id: 3, nombre: "Ciencias Naturales", codigo: "CIE" },
        { id: 4, nombre: "Historia y Geografía", codigo: "HIS" },
        { id: 5, nombre: "Inglés", codigo: "ING" },
        { id: 6, nombre: "Educación Física", codigo: "EDF" },
        { id: 7, nombre: "Artes Visuales", codigo: "ART" }
    ],
    profesoresCursos: [
        { profesorId: 1, cursoId: 1 }, { profesorId: 1, cursoId: 2 }, { profesorId: 1, cursoId: 3 },
        { profesorId: 1, cursoId: 4 }, { profesorId: 1, cursoId: 5 }, { profesorId: 1, cursoId: 6 },
        { profesorId: 1, cursoId: 7 }, { profesorId: 1, cursoId: 8 },
        { profesorId: 2, cursoId: 1 }, { profesorId: 2, cursoId: 2 }, { profesorId: 2, cursoId: 3 },
        { profesorId: 2, cursoId: 4 }, { profesorId: 2, cursoId: 5 }, { profesorId: 2, cursoId: 6 },
        { profesorId: 2, cursoId: 7 }, { profesorId: 2, cursoId: 8 }, { profesorId: 2, cursoId: 9 },
        { profesorId: 2, cursoId: 10 }, { profesorId: 2, cursoId: 11 }, { profesorId: 2, cursoId: 12 },
        { profesorId: 3, cursoId: 9 }, { profesorId: 3, cursoId: 10 }, { profesorId: 3, cursoId: 11 },
        { profesorId: 3, cursoId: 12 }
    ],
    alumnosCursos: [],
    notas: []
};

function SistemaNotasEscolar() {
    const [usuario, setUsuario] = useState(null);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [formLogin, setFormLogin] = useState({ email: "", password: "" });
    const [datos, setDatos] = useState(DATOS_DEMO);
    const [vistaActual, setVistaActual] = useState("dashboard");
    const [formNota, setFormNota] = useState({
        cursoId: "",
        alumnoId: "",
        asignaturaId: "",
        valor: "",
        observaciones: ""
    });
    const [vistaDetalle, setVistaDetalle] = useState(null);
    const [modalEliminar, setModalEliminar] = useState({ mostrar: false, notaId: null });
    const [modalCrearAlumno, setModalCrearAlumno] = useState(false);
    const [modalEliminarAlumno, setModalEliminarAlumno] = useState({ mostrar: false, alumnoId: null, nombreAlumno: "" });
    const [modalEditarPerfil, setModalEditarPerfil] = useState(false);
    const [formEditarNombre, setFormEditarNombre] = useState("");
    const [formAlumno, setFormAlumno] = useState({
        nombre: "",
        apellido: "",
        cursoId: ""
    });

    const login = () => {
        const user = datos.usuarios.find(u =>
            u.email === formLogin.email && u.password === formLogin.password
        );
        if (user) {
            setUsuario(user);
            setFormLogin({ email: "", password: "" });
        } else {
            alert("Credenciales incorrectas");
        }
    };

    const logout = () => {
        setUsuario(null);
        setVistaActual("dashboard");
    };

    const abrirModalEliminar = (notaId) => {
        setModalEliminar({ mostrar: true, notaId });
    };

    const cerrarModalEliminar = () => {
        setModalEliminar({ mostrar: false, notaId: null });
    };

    const abrirModalCrearAlumno = () => {
        setModalCrearAlumno(true);
    };

    const cerrarModalCrearAlumno = () => {
        setModalCrearAlumno(false);
        setFormAlumno({ nombre: "", apellido: "", cursoId: "" });
    };

    const abrirModalEliminarAlumno = (alumnoId, nombreAlumno) => {
        setModalEliminarAlumno({ mostrar: true, alumnoId, nombreAlumno });
    };

    const cerrarModalEliminarAlumno = () => {
        setModalEliminarAlumno({ mostrar: false, alumnoId: null, nombreAlumno: "" });
    };

    const eliminarAlumno = (alumnoId) => {
        setDatos(prevDatos => ({
            ...prevDatos,
            usuarios: prevDatos.usuarios.filter(u => u.id !== alumnoId),
            alumnosCursos: prevDatos.alumnosCursos.filter(ac => ac.alumnoId !== alumnoId),
            notas: prevDatos.notas.filter(n => n.alumnoId !== alumnoId)
        }));

        if (vistaDetalle === alumnoId) {
            setVistaDetalle(null);
        }

        cerrarModalEliminarAlumno();
    };

    const crearAlumno = () => {
        if (!formAlumno.nombre || !formAlumno.apellido || !formAlumno.cursoId) {
            alert("Por favor complete todos los campos");
            return;
        }

        const nombreCompleto = `${formAlumno.nombre} ${formAlumno.apellido}`;
        const usuariosExistentes = datos.usuarios.length > 0 ? datos.usuarios : [{ id: 0 }];
        const nuevoId = Math.max(...usuariosExistentes.map(u => u.id)) + 1;
        const emailGenerado = `${formAlumno.nombre.toLowerCase()}.${formAlumno.apellido.toLowerCase()}@escuela.cl`;

        const nuevoAlumno = {
            id: nuevoId,
            nombre: nombreCompleto,
            email: emailGenerado,
            password: "clave123",
            rol: "alumno"
        };

        const nuevaAsignacion = {
            alumnoId: nuevoId,
            cursoId: parseInt(formAlumno.cursoId)
        };

        setDatos(prev => ({
            ...prev,
            usuarios: [...prev.usuarios, nuevoAlumno],
            alumnosCursos: [...prev.alumnosCursos, nuevaAsignacion]
        }));

        alert(`Alumno creado exitosamente!\n\nEmail: ${emailGenerado}\nContraseña: clave123`);
        cerrarModalCrearAlumno();
    };

    const eliminarNota = (notaId) => {
        setDatos(prevDatos => ({
            ...prevDatos,
            notas: prevDatos.notas.filter(nota => nota.id !== notaId)
        }));
        setModalEliminar({ mostrar: false, notaId: null });
    };

    const obtenerAlumnosPorCurso = (cursoId) => {
        if (!cursoId) return [];
        return datos.alumnosCursos
            .filter(ac => ac.cursoId === parseInt(cursoId))
            .map(ac => datos.usuarios.find(u => u.id === ac.alumnoId))
            .filter(alumno => alumno !== undefined);
    };

    const obtenerAlumnosPorProfesor = (profesorId) => {
        const cursosProfesor = datos.profesoresCursos
            .filter(pc => pc.profesorId === profesorId)
            .map(pc => pc.cursoId);

        return datos.alumnosCursos
            .filter(ac => cursosProfesor.includes(ac.cursoId))
            .map(ac => datos.usuarios.find(u => u.id === ac.alumnoId));
    };

    const obtenerCursosProfesor = (profesorId) => {
        return datos.profesoresCursos
            .filter(pc => pc.profesorId === profesorId)
            .map(pc => datos.cursos.find(c => c.id === pc.cursoId));
    };

    const obtenerNotasAlumno = (alumnoId) => {
        return datos.notas
            .filter(n => n.alumnoId === alumnoId)
            .map(n => ({
                ...n,
                asignatura: datos.asignaturas.find(a => a.id === n.asignaturaId)
            }));
    };

    const registrarNota = () => {
        if (!formNota.cursoId || !formNota.alumnoId || !formNota.asignaturaId || !formNota.valor) {
            alert("Por favor complete todos los campos requeridos");
            return;
        }

        const valorNota = parseFloat(formNota.valor);
        if (valorNota < 1.0 || valorNota > 7.0) {
            alert("La nota debe estar entre 1.0 y 7.0");
            return;
        }

        const nuevaNota = {
            id: datos.notas.length + 1,
            alumnoId: parseInt(formNota.alumnoId),
            asignaturaId: parseInt(formNota.asignaturaId),
            valor: valorNota,
            fechaRegistro: new Date().toISOString().split('T')[0],
            observaciones: formNota.observaciones
        };

        setDatos(prev => ({
            ...prev,
            notas: [...prev.notas, nuevaNota]
        }));

        setFormNota({ cursoId: "", alumnoId: "", asignaturaId: "", valor: "", observaciones: "" });
        alert("Nota registrada exitosamente");
    };

    const calcularPromedio = (alumnoId) => {
        const notasAlumno = datos.notas.filter(n => n.alumnoId === alumnoId);
        if (notasAlumno.length === 0) return 0;
        const suma = notasAlumno.reduce((acc, nota) => acc + nota.valor, 0);
        return (suma / notasAlumno.length).toFixed(1);
    };

    if (!usuario) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="text-white text-2xl" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">EduNotas</h1>
                        <p className="text-gray-600">Sistema de Gestión Escolar - Chile</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                value={formLogin.email}
                                onChange={(e) => setFormLogin(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="usuario@escuela.cl"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={mostrarPassword ? "text" : "password"}
                                    value={formLogin.password}
                                    onChange={(e) => setFormLogin(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                    placeholder="Ingresa tu contraseña"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={login}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                        >
                            Iniciar Sesión
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600">
                            Desarrollado por <span className="font-semibold text-blue-600">Alexis Mansilla</span>
                        </p>
                        <p className="text-center text-xs text-gray-500 mt-2">
                            © 2025 EduNotas - Sistema de Gestión Escolar
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const cursosProfesor = obtenerCursosProfesor(usuario.id);
    const alumnosProfesor = obtenerAlumnosPorProfesor(usuario.id);
    const alumnosPorCurso = obtenerAlumnosPorCurso(formNota.cursoId);
    const notasAlumno = obtenerNotasAlumno(usuario.id);
    const promedio = calcularPromedio(usuario.id);

    const notasAlumnoDetalle = vistaDetalle ? datos.notas
        .filter(n => n.alumnoId === vistaDetalle)
        .map(n => ({
            ...n,
            asignatura: datos.asignaturas.find(a => a.id === n.asignaturaId)
        })) : [];

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                                <BookOpen className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">EduNotas</h1>
                                <p className="text-sm text-gray-600">Sistema de Gestión Escolar</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-800">{usuario.nombre}</p>
                                <p className="text-xs text-gray-600 capitalize">{usuario.rol}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {usuario.rol === "profesor" && (
                <nav className="bg-gray-50 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex space-x-8 h-12 items-center">
                            <button
                                onClick={() => setVistaActual("dashboard")}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${vistaActual === "dashboard"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-gray-800"
                                    }`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setVistaActual("registrar-nota")}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${vistaActual === "registrar-nota"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-gray-800"
                                    }`}
                            >
                                Registrar Nota
                            </button>
                            <button
                                onClick={() => setVistaActual("ver-notas")}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${vistaActual === "ver-notas"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-gray-800"
                                    }`}
                            >
                                Estadísticas
                            </button>
                        </div>
                    </div>
                </nav>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {usuario.rol === "profesor" && vistaActual === "dashboard" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel de Profesor</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-100">Cursos Asignados</p>
                                            <p className="text-3xl font-bold">{cursosProfesor.length}</p>
                                        </div>
                                        <BookOpen size={32} />
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-100">Total Estudiantes</p>
                                            <p className="text-3xl font-bold">{alumnosProfesor.length}</p>
                                        </div>
                                        <User size={32} />
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100">Notas Registradas</p>
                                            <p className="text-3xl font-bold">{datos.notas.length}</p>
                                        </div>
                                        <BarChart3 size={32} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mb-6">
                                <button
                                    onClick={() => setVistaActual("registrar-nota")}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Upload size={20} />
                                    Registrar Nota
                                </button>
                                <button
                                    onClick={() => setVistaActual("ver-notas")}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <BarChart3 size={20} />
                                    Ver Estadísticas
                                </button>
                                <button
                                    onClick={abrirModalCrearAlumno}
                                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                                >
                                    <User size={20} />
                                    Crear Alumno
                                </button>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Mis Cursos</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {cursosProfesor.map(curso => (
                                        <div key={curso.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center">
                                            <h4 className="font-semibold text-gray-800">{curso.nombre}</h4>
                                            <p className="text-sm text-gray-600">Nivel {curso.nivel}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {usuario.rol === "profesor" && vistaActual === "registrar-nota" && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrar Nueva Nota</h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Curso *
                                    </label>
                                    <select
                                        value={formNota.cursoId}
                                        onChange={(e) => setFormNota(prev => ({ ...prev, cursoId: e.target.value, alumnoId: "" }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccionar curso</option>
                                        {cursosProfesor.map(curso => (
                                            <option key={curso.id} value={curso.id}>{curso.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estudiante *
                                    </label>
                                    <select
                                        value={formNota.alumnoId}
                                        onChange={(e) => setFormNota(prev => ({ ...prev, alumnoId: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        disabled={!formNota.cursoId}
                                    >
                                        <option value="">
                                            {formNota.cursoId ? "Seleccionar estudiante" : "Primero seleccione un curso"}
                                        </option>
                                        {alumnosPorCurso.map(alumno => (
                                            <option key={alumno.id} value={alumno.id}>{alumno.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Asignatura *
                                    </label>
                                    <select
                                        value={formNota.asignaturaId}
                                        onChange={(e) => setFormNota(prev => ({ ...prev, asignaturaId: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccionar asignatura</option>
                                        {datos.asignaturas.map(asignatura => (
                                            <option key={asignatura.id} value={asignatura.id}>{asignatura.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nota (1.0 - 7.0) *
                                    </label>
                                    <input
                                        type="number"
                                        min="1.0"
                                        max="7.0"
                                        step="0.1"
                                        value={formNota.valor}
                                        onChange={(e) => setFormNota(prev => ({ ...prev, valor: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ej: 6.5"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Observaciones (opcional)
                                </label>
                                <textarea
                                    value={formNota.observaciones}
                                    onChange={(e) => setFormNota(prev => ({ ...prev, observaciones: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Comentarios sobre el desempeño del estudiante..."
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={registrarNota}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Upload size={20} />
                                    Registrar Nota
                                </button>
                                <button
                                    onClick={() => setVistaActual("dashboard")}
                                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {usuario.rol === "profesor" && vistaActual === "ver-notas" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Estadísticas de Rendimiento</h2>

                            {alumnosProfesor.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="text-left p-4 border-b font-semibold">Estudiante</th>
                                                <th className="text-left p-4 border-b font-semibold">Promedio</th>
                                                <th className="text-left p-4 border-b font-semibold">Notas</th>
                                                <th className="text-left p-4 border-b font-semibold">Estado</th>
                                                <th className="text-left p-4 border-b font-semibold">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alumnosProfesor.map(alumno => {
                                                const promedioAlumno = parseFloat(calcularPromedio(alumno.id));
                                                const notasCount = datos.notas.filter(n => n.alumnoId === alumno.id).length;
                                                const estado = promedioAlumno >= 4.0 ? "Aprobado" : promedioAlumno > 0 ? "En riesgo" : "Sin notas";

                                                return (
                                                    <tr key={alumno.id} className="hover:bg-gray-50">
                                                        <td className="p-4 border-b">{alumno.nombre}</td>
                                                        <td className="p-4 border-b">
                                                            <span className={`font-semibold ${promedioAlumno >= 4.0 ? 'text-green-600' : promedioAlumno > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                                                {promedioAlumno > 0 ? promedioAlumno : 'S/N'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 border-b">{notasCount}</td>
                                                        <td className="p-4 border-b">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${promedioAlumno >= 4.0 ? 'bg-green-100 text-green-800' :
                                                                    promedioAlumno > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {estado}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 border-b">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => setVistaDetalle(vistaDetalle === alumno.id ? null : alumno.id)}
                                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                                    disabled={notasCount === 0}
                                                                >
                                                                    {notasCount > 0 ? (vistaDetalle === alumno.id ? 'Ocultar' : 'Ver Notas') : 'Sin notas'}
                                                                </button>
                                                                <button
                                                                    onClick={() => abrirModalEliminarAlumno(alumno.id, alumno.nombre)}
                                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm font-medium"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p>No hay estudiantes asignados</p>
                                </div>
                            )}
                        </div>

                        {vistaDetalle && notasAlumnoDetalle.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    Notas de {alumnosProfesor.find(a => a.id === vistaDetalle)?.nombre}
                                </h3>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="text-left p-4 border-b font-semibold">Asignatura</th>
                                                <th className="text-left p-4 border-b font-semibold">Nota</th>
                                                <th className="text-left p-4 border-b font-semibold">Fecha</th>
                                                <th className="text-left p-4 border-b font-semibold">Observaciones</th>
                                                <th className="text-left p-4 border-b font-semibold">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {notasAlumnoDetalle.map(nota => (
                                                <tr key={nota.id} className="hover:bg-gray-50">
                                                    <td className="p-4 border-b font-medium">{nota.asignatura.nombre}</td>
                                                    <td className="p-4 border-b">
                                                        <span className={`font-bold ${nota.valor >= 4.0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {nota.valor}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 border-b text-gray-600">{nota.fechaRegistro}</td>
                                                    <td className="p-4 border-b text-gray-600">{nota.observaciones || '-'}</td>
                                                    <td className="p-4 border-b">
                                                        <button
                                                            type="button"
                                                            onClick={() => abrirModalEliminar(nota.id)}
                                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm font-medium"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {usuario.rol === "alumno" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mi Rendimiento Académico</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-100">Promedio General</p>
                                            <p className="text-4xl font-bold">{promedio > 0 ? promedio : 'S/N'}</p>
                                        </div>
                                        <BarChart3 size={32} />
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-100">Estado Académico</p>
                                            <p className="text-xl font-semibold">
                                                {parseFloat(promedio) >= 4.0 ? 'Aprobado' : parseFloat(promedio) > 0 ? 'En Riesgo' : 'Sin Notas'}
                                            </p>
                                        </div>
                                        <User size={32} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Mis Notas por Asignatura</h3>
                                {notasAlumno.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="text-left p-4 border-b font-semibold">Asignatura</th>
                                                    <th className="text-left p-4 border-b font-semibold">Nota</th>
                                                    <th className="text-left p-4 border-b font-semibold">Fecha</th>
                                                    <th className="text-left p-4 border-b font-semibold">Observaciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {notasAlumno.map(nota => (
                                                    <tr key={nota.id} className="hover:bg-gray-50">
                                                        <td className="p-4 border-b font-medium">{nota.asignatura.nombre}</td>
                                                        <td className="p-4 border-b">
                                                            <span className={`font-bold ${nota.valor >= 4.0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {nota.valor}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 border-b text-gray-600">{nota.fechaRegistro}</td>
                                                        <td className="p-4 border-b text-gray-600">{nota.observaciones || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                                        <p>Aún no tienes notas registradas</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-center md:text-left">
                            <p className="text-sm text-gray-300">© 2025 EduNotas - Sistema de Gestión Escolar</p>
                            <p className="text-xs text-gray-400 mt-1">Todos los derechos reservados</p>
                        </div>

                        <div className="text-center md:text-right">
                            <p className="text-sm text-gray-300">
                                Desarrollado por
                            </p>
                            <p className="text-lg font-bold">
                                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    Alexis Mansilla
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

            {modalEliminar.mostrar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Eliminar Nota?</h3>
                            <p className="text-gray-600">
                                Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta nota?
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={cerrarModalEliminar}
                                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                No, Cancelar
                            </button>
                            <button
                                onClick={() => eliminarNota(modalEliminar.notaId)}
                                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                                Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalCrearAlumno && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="mb-6">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Crear Nuevo Alumno</h3>
                            <p className="text-gray-600 text-center text-sm">
                                Complete los datos del estudiante
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    value={formAlumno.nombre}
                                    onChange={(e) => setFormAlumno(prev => ({ ...prev, nombre: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Ej: Juan"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Apellido *
                                </label>
                                <input
                                    type="text"
                                    value={formAlumno.apellido}
                                    onChange={(e) => setFormAlumno(prev => ({ ...prev, apellido: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Ej: Pérez"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Curso *
                                </label>
                                <select
                                    value={formAlumno.cursoId}
                                    onChange={(e) => setFormAlumno(prev => ({ ...prev, cursoId: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar curso</option>
                                    {datos.cursos.map(curso => (
                                        <option key={curso.id} value={curso.id}>{curso.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                                <p className="font-semibold mb-1">📧 Credenciales generadas automáticamente:</p>
                                <p>• Email: nombre.apellido@escuela.cl</p>
                                <p>• Contraseña: clave123</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={cerrarModalCrearAlumno}
                                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={crearAlumno}
                                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                            >
                                Crear Alumno
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalEliminarAlumno.mostrar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Eliminar Alumno?</h3>
                            <p className="text-gray-600 mb-4">
                                Estás a punto de eliminar a <strong>{modalEliminarAlumno.nombreAlumno}</strong>
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                                <p className="font-semibold">⚠️ Advertencia:</p>
                                <p>Se eliminarán también todas sus notas y asignaciones de curso. Esta acción no se puede deshacer.</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={cerrarModalEliminarAlumno}
                                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                No, Cancelar
                            </button>
                            <button
                                onClick={() => eliminarAlumno(modalEliminarAlumno.alumnoId)}
                                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                                Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SistemaNotasEscolar;