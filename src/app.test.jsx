
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import SistemaNotasEscolar from './app.jsx';

// Mocking alert since it's not available in JSDOM
global.alert = (message) => console.log(`Alert: ${message}`);

describe('SistemaNotasEscolar', () => {
    beforeEach(() => {
        render(<SistemaNotasEscolar />);
    });

    it('should render the login page initially', () => {
        expect(screen.getByText('EduNotas')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('usuario@escuela.cl')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Ingresa tu contraseña')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    });

    it('should allow a professor to log in with correct credentials', () => {
        fireEvent.change(screen.getByPlaceholderText('usuario@escuela.cl'), { target: { value: 'profesor1@escuela.cl' } });
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), { target: { value: 'clave123' } });
        fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

        expect(screen.getByText('Panel de Profesor')).toBeInTheDocument();
        expect(screen.getByText('Profesor de Educación Básica')).toBeInTheDocument();
    });

    it('should show an error with incorrect login credentials', () => {
        const alertSpy = vi.spyOn(window, 'alert');
        fireEvent.change(screen.getByPlaceholderText('usuario@escuela.cl'), { target: { value: 'wrong@user.com' } });
        fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

        expect(alertSpy).toHaveBeenCalledWith('Credenciales incorrectas');
    });

    describe('when logged in as a professor', () => {
        beforeEach(() => {
            fireEvent.change(screen.getByPlaceholderText('usuario@escuela.cl'), { target: { value: 'profesor1@escuela.cl' } });
            fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), { target: { value: 'clave123' } });
            fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));
        });

        it('should allow the professor to log out', () => {
            fireEvent.click(screen.getByRole('button', { name: 'Salir' }));
            expect(screen.getByText('EduNotas')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('usuario@escuela.cl')).toBeInTheDocument();
        });

        it('should allow creating a new student', () => {
            fireEvent.click(screen.getByText('Crear Alumno'));
            
            fireEvent.change(screen.getByPlaceholderText('Ej: Juan'), { target: { value: 'Juan' } });
            fireEvent.change(screen.getByPlaceholderText('Ej: Pérez'), { target: { value: 'Perez' } });

            // Select a course from the dropdown
            const courseSelect = screen.getByDisplayValue('Seleccionar curso');
            fireEvent.change(courseSelect, { target: { value: '1' } }); // Assuming course with ID 1 exists

            fireEvent.click(screen.getByRole('button', { name: 'Crear Alumno' }));

            // After creating, the modal should close. Let's check for student in the list.
            fireEvent.click(screen.getByText('Estadísticas'));
            expect(screen.getByText('Juan Perez')).toBeInTheDocument();
        });

        it('should allow registering a new grade', () => {
            fireEvent.click(screen.getByText('Registrar Nota'));

            // Fill the form to register a grade
            fireEvent.change(screen.getAllByDisplayValue('Seleccionar curso')[0], { target: { value: '1' } }); // Assuming course 1
            fireEvent.change(screen.getByDisplayValue('Primero seleccione un curso'), { target: { value: '2' } }); // Student with ID 2 in course 1
            fireEvent.change(screen.getAllByDisplayValue('Seleccionar asignatura')[0], { target: { value: '1' } }); // Math
            fireEvent.change(screen.getByPlaceholderText('Ej: 6.5'), { target: { value: '6.5' } });

            fireEvent.click(screen.getAllByRole('button', { name: 'Registrar Nota' })[1]);
            
            // Check if the grade is now visible in the statistics
            fireEvent.click(screen.getByText('Estadísticas'));
            fireEvent.click(screen.getAllByText('Ver Notas')[0]); // Open the details for the first student
            
            expect(screen.getByText('6.5')).toBeInTheDocument();
        });
        
        it('should allow deleting a grade', () => {
            // First add a grade
            fireEvent.click(screen.getByText('Registrar Nota'));
            fireEvent.change(screen.getAllByDisplayValue('Seleccionar curso')[0], { target: { value: '1' } });
            fireEvent.change(screen.getByDisplayValue('Primero seleccione un curso'), { target: { value: '2' } });
            fireEvent.change(screen.getAllByDisplayValue('Seleccionar asignatura')[0], { target: { value: '1' } });
            fireEvent.change(screen.getByPlaceholderText('Ej: 6.5'), { target: { value: '5.0' } });
            fireEvent.click(screen.getAllByRole('button', { name: 'Registrar Nota' })[1]);

            // Now go to statistics and delete it
            fireEvent.click(screen.getByText('Estadísticas'));
            fireEvent.click(screen.getAllByText('Ver Notas')[0]); // Open details
            fireEvent.click(screen.getAllByText('Eliminar')[0]); // Click delete button for the grade
            fireEvent.click(screen.getByRole('button', { name: 'Sí, Eliminar' })); // Confirm deletion

            // The grade should be gone
            expect(screen.queryByText('5.0')).not.toBeInTheDocument();
        });
        
        it('should allow deleting a student', () => {
            // Create a student to be deleted
            fireEvent.click(screen.getByText('Crear Alumno'));
            fireEvent.change(screen.getByPlaceholderText('Ej: Juan'), { target: { value: 'Pedro' } });
            fireEvent.change(screen.getByPlaceholderText('Ej: Pérez'), { target: { value: 'Pascal' } });
            fireEvent.change(screen.getByDisplayValue('Seleccionar curso'), { target: { value: '2' } }); // Course 2
            fireEvent.click(screen.getByRole('button', { name: 'Crear Alumno' }));

            // Go to statistics and delete the student
            fireEvent.click(screen.getByText('Estadísticas'));
            expect(screen.getByText('Pedro Pascal')).toBeInTheDocument(); // Make sure the student is there first
            
            fireEvent.click(screen.getAllByText('Eliminar')[1]); // Click delete on the newly created user
            fireEvent.click(screen.getByRole('button', { name: 'Sí, Eliminar' }));

            // The student should be gone
            expect(screen.queryByText('Pedro Pascal')).not.toBeInTheDocument();
        });
    });
});
