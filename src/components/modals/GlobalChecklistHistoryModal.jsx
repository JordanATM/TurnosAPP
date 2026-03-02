import React, { useState, useEffect } from 'react';
import {
    X, History, Clock, CheckCircle2, AlertCircle, User, Ticket, Filter, Loader2, MessageSquare, CheckSquare, Play
} from 'lucide-react';
import { fetchGlobalChecklistExecutions } from '../../services/supabaseService';

export function GlobalChecklistHistoryModal({ isOpen, onClose, onContinueExecution }) {
    const [executions, setExecutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'completed', 'in_progress', 'abandoned'

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchGlobalChecklistExecutions();
            setExecutions(data);
        } catch (err) {
            console.error('Error fetching global history:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredExecutions = executions.filter(exec => {
        if (statusFilter === 'all') return true;
        return exec.status === statusFilter;
    });

    const statusConfig = {
        completed: { label: 'Completado', color: 'text-green-700 bg-green-100', icon: CheckCircle2 },
        in_progress: { label: 'En progreso', color: 'text-blue-700 bg-blue-100', icon: Clock },
        abandoned: { label: 'Abandonado', color: 'text-red-700 bg-red-100', icon: AlertCircle },
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <History className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Historial Global de Protocolos</h2>
                            <p className="text-sm text-gray-600">Registro completo de todos los checklists ejecutados</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Filter className="w-4 h-4 text-gray-400" />
                        Filtrar por estado:
                    </div>
                    <div className="flex gap-2">
                        {[
                            { id: 'all', label: 'Todos' },
                            { id: 'completed', label: 'Completados' },
                            { id: 'in_progress', label: 'En progreso' },
                            { id: 'abandoned', label: 'Abandonados' }
                        ].map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setStatusFilter(filter.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === filter.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-3">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            <p className="text-sm text-gray-500">Cargando historial...</p>
                        </div>
                    ) : filteredExecutions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <History className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-600 font-medium text-lg">No hay ejecuciones registradas</p>
                            <p className="text-gray-500 mt-1">
                                {statusFilter === 'all'
                                    ? 'Aquí aparecerán todos los checklists cuando los ingenieros comiencen a utilizarlos.'
                                    : 'No se encontraron ejecuciones con el estado seleccionado.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredExecutions.map(exec => {
                                const cfg = statusConfig[exec.status] || statusConfig.in_progress;
                                const Icon = cfg.icon;
                                const pct = exec.total_steps > 0
                                    ? Math.round(((exec.completed_steps?.length || 0) / exec.total_steps) * 100)
                                    : 0;

                                return (
                                    <div key={exec.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-gray-900 text-lg">
                                                        {exec.protocol?.name || 'Protocolo Eliminado'}
                                                    </h3>
                                                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${cfg.color}`}>
                                                        <Icon className="w-3.5 h-3.5" />
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1.5">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                        <strong>Operador:</strong> {exec.operator_name}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Ticket className="w-4 h-4 text-gray-400" />
                                                        <strong>Ticket:</strong> <span className="text-gray-900 font-medium">{exec.ticket_number}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <strong>Inicio:</strong> {new Date(exec.started_at).toLocaleString('es-ES', {
                                                            day: '2-digit', month: '2-digit', year: 'numeric',
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">Progreso</p>
                                                <p className="text-xl font-black text-gray-800">{pct}%</p>
                                                <p className="text-[10px] text-gray-500 mt-0.5">{exec.completed_steps?.length || 0} de {exec.total_steps}</p>
                                            </div>
                                        </div>

                                        {/* Barra de progreso visual */}
                                        <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ${exec.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            {/* Detalle interno */}
                                            <details className="group flex-1">
                                                <summary className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800 select-none list-none flex items-center gap-2">
                                                    <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                                                    Ver detalle de confirmaciones
                                                </summary>
                                                <div className="mt-4 pl-6 space-y-3">
                                                    {exec.completed_steps && exec.completed_steps.length > 0 ? (
                                                        exec.completed_steps.sort((a, b) => a - b).map(stepIdx => (
                                                            <div key={stepIdx} className="flex flex-col gap-1.5">
                                                                <div className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                                                                    <CheckSquare className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                                    <span>Paso #{stepIdx + 1} completado</span>
                                                                </div>
                                                                {exec.step_comments && exec.step_comments[stepIdx] && (
                                                                    <div className="ml-6 bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-sm text-gray-600 flex items-start gap-2 relative">
                                                                        <MessageSquare className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                                                        <p className="whitespace-pre-wrap leading-relaxed italic">{exec.step_comments[stepIdx]}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic">No se completó ningún paso en esta ejecución.</p>
                                                    )}
                                                </div>
                                            </details>

                                            {(exec.status === 'in_progress' || exec.status === 'abandoned') && (
                                                <button
                                                    onClick={() => onContinueExecution(exec)}
                                                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors border border-blue-200"
                                                >
                                                    <Play className="w-4 h-4" />
                                                    Continuar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
                    >
                        Cerrar Historial
                    </button>
                </div>
            </div>
        </div>
    );
}

// Icono faltante local para el details:
function ChevronRight(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
