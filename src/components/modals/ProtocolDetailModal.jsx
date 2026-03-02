import React, { useState, useEffect, useCallback } from 'react';
import {
  X, FileText, Calendar, CheckSquare, Square,
  ClipboardList, User, Ticket, ChevronRight, ArrowLeft,
  Clock, CheckCircle2, AlertCircle, History, Loader2,
  RotateCcw, Save, MessageSquare, Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchChecklistExecutions,
  createChecklistExecution,
  updateChecklistExecution
} from '../../services/supabaseService';

// ── Fase 1: Formulario de inicio ──────────────────────────────
function StartForm({ protocol, userEmail, onStart, onClose }) {
  const [operatorName, setOperatorName] = useState(userEmail || '');
  const [ticketNumber, setTicketNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!operatorName.trim() || !ticketNumber.trim()) return;
    setSubmitting(true);
    try {
      await onStart({ operatorName: operatorName.trim(), ticketNumber: ticketNumber.trim() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-5">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <ClipboardList className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Iniciar ejecución del checklist</p>
          <p className="text-xs text-blue-600 mt-0.5">
            Completa los datos antes de comenzar. El progreso se guardará automáticamente.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <User className="w-4 h-4 inline mr-1 text-gray-500" />
            Nombre del operador <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={operatorName}
            onChange={e => setOperatorName(e.target.value)}
            placeholder="Tu nombre completo"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            required
            autoFocus
          />
          {userEmail && (
            <p className="text-xs text-gray-400 mt-1">
              Autocompletado con tu sesión. Puedes modificarlo si es necesario.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <Ticket className="w-4 h-4 inline mr-1 text-gray-500" />
            Número de ticket <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={ticketNumber}
            onChange={e => setTicketNumber(e.target.value)}
            placeholder="Ej: INC-2024-00123"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || !operatorName.trim() || !ticketNumber.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            Iniciar Checklist
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Fase 2: Ejecución activa del checklist ──────────────────────
function ChecklistExecution({ execution, checklistItems, onToggle, onSaveComment, onComplete, onAbandon, saving }) {
  const [editingComment, setEditingComment] = useState(null);
  const [commentText, setCommentText] = useState('');
  const completedSteps = execution.completed_steps || [];
  const progress = checklistItems.length > 0
    ? Math.round((completedSteps.length / checklistItems.length) * 100)
    : 0;
  const allDone = completedSteps.length === checklistItems.length;

  const handleOpenComment = (index) => {
    setEditingComment(index);
    setCommentText(execution.step_comments?.[index] || '');
  };

  const handleSaveCommentLocally = (index) => {
    onSaveComment(index, commentText);
    setEditingComment(null);
    setCommentText('');
  };

  const progressColor = progress === 100 ? 'bg-green-500' : progress >= 50 ? 'bg-blue-500' : 'bg-blue-400';

  return (
    <div className="flex flex-col h-full">
      {/* Info de la ejecución */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-gray-400" />
          <strong>Operador:</strong> {execution.operator_name}
        </span>
        <span className="flex items-center gap-1.5">
          <Ticket className="w-3.5 h-3.5 text-gray-400" />
          <strong>Ticket:</strong> {execution.ticket_number}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          {new Date(execution.started_at).toLocaleString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}
        </span>
        {saving && (
          <span className="flex items-center gap-1 text-blue-500">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Guardando...
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Barra de progreso */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Progreso</span>
            <span className={`text-sm font-bold ${progress === 100 ? 'text-green-600' : 'text-blue-600'}`}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`${progressColor} h-2.5 rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {completedSteps.length} de {checklistItems.length} pasos completados
          </p>
        </div>

        {/* Items del checklist */}
        <div className="space-y-2">
          {checklistItems.map((item, index) => {
            const isDone = completedSteps.includes(index);
            const hasComment = !!execution.step_comments?.[index];
            const isEditing = editingComment === index;

            return (
              <div
                key={index}
                className={`w-full flex flex-col gap-2 p-3.5 rounded-xl border-2 transition-all ${isDone
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-white'
                  }`}
              >
                <div className="flex items-start gap-3 w-full">
                  <button
                    onClick={() => onToggle(index)}
                    className="pt-0.5 shrink-0 flex items-start gap-3 flex-1 text-left"
                  >
                    {isDone ? (
                      <CheckSquare className="w-5 h-5 text-green-500" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                    <span className={`flex-1 text-sm leading-relaxed ${isDone ? 'text-green-700 line-through opacity-80' : 'text-gray-700'
                      }`}>
                      {item}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenComment(index)}
                      className={`p-1.5 rounded-lg transition-colors ${hasComment || isEditing ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                        }`}
                      title="Agregar o ver comentario"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    {isDone && (
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                    )}
                  </div>
                </div>

                {/* Área de comentario */}
                {isEditing ? (
                  <div className="mt-2 flex flex-col gap-2 pl-8 pr-2">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Escribe un comentario o nota para este paso..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y min-h-[60px]"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingComment(null)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleSaveCommentLocally(index)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Guardar Nota
                      </button>
                    </div>
                  </div>
                ) : hasComment ? (
                  <div className="mt-1 pl-8 pr-2">
                    <div className="bg-white/60 border border-gray-100 rounded-lg p-2.5 text-xs text-gray-600 italic flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <p className="whitespace-pre-wrap leading-relaxed flex-1">{execution.step_comments[index]}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer con acciones */}
      <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/80 flex gap-3">
        <button
          onClick={onAbandon}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Abandonar
        </button>
        <button
          onClick={onComplete}
          disabled={!allDone}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${allDone
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          title={!allDone ? 'Completa todos los pasos primero' : ''}
        >
          <CheckCircle2 className="w-4 h-4" />
          {allDone ? 'Finalizar y Guardar' : `Faltan ${checklistItems.length - completedSteps.length} pasos`}
        </button>
      </div>
    </div>
  );
}

// ── Panel de historial ──────────────────────────────────────────
function HistoryPanel({ executions, loading, checklistItems }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (executions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <History className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Sin ejecuciones previas</p>
        <p className="text-gray-400 text-sm mt-1">Las ejecuciones completadas aparecerán aquí</p>
      </div>
    );
  }

  const statusConfig = {
    completed: { label: 'Completado', color: 'text-green-700 bg-green-100', icon: CheckCircle2 },
    in_progress: { label: 'En progreso', color: 'text-blue-700 bg-blue-100', icon: Clock },
    abandoned: { label: 'Abandonado', color: 'text-red-700 bg-red-100', icon: AlertCircle },
  };

  return (
    <div className="divide-y divide-gray-100">
      {executions.map(exec => {
        const cfg = statusConfig[exec.status] || statusConfig.in_progress;
        const Icon = cfg.icon;
        const pct = exec.total_steps > 0
          ? Math.round(((exec.completed_steps?.length || 0) / exec.total_steps) * 100)
          : 0;

        return (
          <div key={exec.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.color}`}>
                    <Icon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Ticket: <span className="text-gray-800">{exec.ticket_number}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-800">{exec.operator_name}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-500">
                  {new Date(exec.started_at).toLocaleString('es-ES', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
                <p className="text-xs font-semibold mt-0.5 text-gray-700">{pct}% completo</p>
              </div>
            </div>

            {/* Mini progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
              <div
                className={`h-1.5 rounded-full ${exec.status === 'completed' ? 'bg-green-400' : 'bg-blue-400'}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Pasos completados */}
            {exec.completed_steps && exec.completed_steps.length > 0 && (
              <details className="mt-2">
                <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 font-medium">
                  Ver pasos completados ({exec.completed_steps.length}/{exec.total_steps})
                </summary>
                <ul className="mt-2 space-y-2 pl-2">
                  {exec.completed_steps.sort((a, b) => a - b).map(stepIdx => (
                    <li key={stepIdx} className="flex flex-col gap-1 pb-1">
                      <div className="flex items-start gap-1.5 text-xs text-gray-600">
                        <CheckSquare className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                        <span>{checklistItems[stepIdx] || `Paso ${stepIdx + 1}`}</span>
                      </div>
                      {exec.step_comments?.[stepIdx] && (
                        <div className="ml-5 bg-gray-50 border border-gray-200 rounded p-1.5 text-[11px] text-gray-500 italic flex items-start gap-1.5">
                          <MessageSquare className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                          <span className="whitespace-pre-wrap">{exec.step_comments[stepIdx]}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Modal Principal ─────────────────────────────────────────────
export function ProtocolDetailModal({ isOpen, onClose, protocol, initialPhase, initialExecution }) {
  const { user } = useAuth();

  // 'start' | 'executing' | 'history'
  const [phase, setPhase] = useState(initialPhase || 'start');
  const [currentExecution, setCurrentExecution] = useState(null);
  const [executions, setExecutions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);

  const isChecklist = protocol?.type === 'checklist';

  const getChecklistItems = useCallback(() => {
    if (!protocol || protocol.type !== 'checklist') return [];
    return protocol.instructions.split('\n').filter(line => line.trim() !== '');
  }, [protocol]);

  const checklistItems = getChecklistItems();

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

  // Reset al abrir
  useEffect(() => {
    if (isOpen && protocol) {
      if (initialPhase) {
        setPhase(initialPhase);
      } else {
        setPhase(isChecklist ? 'start' : 'view');
      }
      setCurrentExecution(initialExecution || null);
    }
  }, [isOpen, protocol, isChecklist, initialPhase, initialExecution]);

  // Cargar historial cuando se solicita
  const loadHistory = useCallback(async () => {
    if (!protocol) return;
    setLoadingHistory(true);
    try {
      const data = await fetchChecklistExecutions(protocol.id);
      setExecutions(data);
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, [protocol]);

  useEffect(() => {
    if (phase === 'history') loadHistory();
  }, [phase, loadHistory]);

  // Iniciar una nueva ejecución
  const handleStart = async ({ operatorName, ticketNumber }) => {
    const exec = await createChecklistExecution({
      protocolId: protocol.id,
      operatorName,
      ticketNumber,
      totalSteps: checklistItems.length
    });
    setCurrentExecution(exec);
    setPhase('executing');
  };

  // Toggle de un paso
  const handleToggle = async (index) => {
    if (!currentExecution) return;
    const prev = currentExecution.completed_steps || [];
    const next = prev.includes(index)
      ? prev.filter(i => i !== index)
      : [...prev, index];

    // Optimistic update
    setCurrentExecution(e => ({ ...e, completed_steps: next }));

    setSaving(true);
    try {
      const updated = await updateChecklistExecution(currentExecution.id, {
        completedSteps: next,
        stepComments: currentExecution.step_comments || {},
        status: next.length === checklistItems.length ? 'completed' : 'in_progress'
      });
      setCurrentExecution(updated);
    } catch (err) {
      // Revert on error
      setCurrentExecution(e => ({ ...e, completed_steps: prev }));
      console.error('Error saving step:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveComment = async (index, text) => {
    if (!currentExecution) return;
    const currentComments = currentExecution.step_comments || {};
    const newComments = { ...currentComments };
    if (text.trim()) {
      newComments[index] = text.trim();
    } else {
      delete newComments[index];
    }

    setCurrentExecution(e => ({ ...e, step_comments: newComments }));
    setSaving(true);
    try {
      const updated = await updateChecklistExecution(currentExecution.id, {
        completedSteps: currentExecution.completed_steps || [],
        stepComments: newComments,
        status: currentExecution.status
      });
      setCurrentExecution(updated);
    } catch (err) {
      setCurrentExecution(e => ({ ...e, step_comments: currentComments }));
      console.error('Error saving comment:', err);
    } finally {
      setSaving(false);
    }
  };

  // Finalizar
  const handleComplete = async () => {
    if (!currentExecution) return;
    setSaving(true);
    try {
      await updateChecklistExecution(currentExecution.id, {
        completedSteps: currentExecution.completed_steps,
        stepComments: currentExecution.step_comments || {},
        status: 'completed'
      });
      setPhase('history');
    } catch (err) {
      console.error('Error completing execution:', err);
    } finally {
      setSaving(false);
    }
  };

  // Abandonar
  const handleAbandon = async () => {
    if (!currentExecution) return;
    setSaving(true);
    try {
      await updateChecklistExecution(currentExecution.id, {
        completedSteps: currentExecution.completed_steps,
        stepComments: currentExecution.step_comments || {},
        status: 'abandoned'
      });
    } catch (err) {
      console.error('Error abandoning execution:', err);
    } finally {
      setSaving(false);
      setPhase('start');
      setCurrentExecution(null);
    }
  };

  if (!isOpen || !protocol) return null;

  const isView = phase === 'view'; // solo protocolo tipo texto

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b border-gray-200 ${isChecklist ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-blue-50'}`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Back button en historial */}
            {phase === 'history' && (
              <button
                onClick={() => setPhase('start')}
                className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors shrink-0"
                title="Volver"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isChecklist ? 'bg-white/20' : 'bg-blue-100'}`}>
              {isChecklist
                ? <ClipboardList className="w-5 h-5 text-white" />
                : <FileText className="w-5 h-5 text-blue-600" />
              }
            </div>

            <div className="flex-1 min-w-0">
              <h2 className={`font-bold truncate ${isChecklist ? 'text-white text-lg' : 'text-gray-900 text-xl'}`}>
                {protocol.name}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                {protocol.updated_at && (
                  <span className={`text-xs flex items-center gap-1 ${isChecklist ? 'text-blue-100' : 'text-gray-500'}`}>
                    <Calendar className="w-3 h-3" />
                    Actualizado: {formatDate(protocol.updated_at)}
                  </span>
                )}
                {phase === 'executing' && (
                  <span className="text-xs text-blue-100 bg-white/20 px-2 py-0.5 rounded-full font-medium">
                    En ejecución
                  </span>
                )}
                {phase === 'history' && (
                  <span className="text-xs text-white font-medium">
                    Historial de ejecuciones
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Botón historial (solo en fase start) */}
            {isChecklist && phase === 'start' && (
              <button
                onClick={() => setPhase('history')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-xs font-medium"
                title="Ver historial"
              >
                <History className="w-4 h-4" />
                Historial
              </button>
            )}

            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isChecklist ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* VISTA TEXTO */}
          {isView && (
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Instrucciones</h3>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                  {protocol.instructions}
                </div>
              </div>
            </div>
          )}

          {/* FASE START: formulario */}
          {phase === 'start' && isChecklist && (
            <StartForm
              protocol={protocol}
              userEmail={user?.email || ''}
              onStart={handleStart}
              onClose={onClose}
            />
          )}

          {/* FASE EXECUTING: checklist interactivo */}
          {phase === 'executing' && currentExecution && (
            <ChecklistExecution
              execution={currentExecution}
              checklistItems={checklistItems}
              onToggle={handleToggle}
              onSaveComment={handleSaveComment}
              onComplete={handleComplete}
              onAbandon={handleAbandon}
              saving={saving}
            />
          )}

          {/* FASE HISTORY */}
          {phase === 'history' && (
            <HistoryPanel
              executions={executions}
              loading={loadingHistory}
              checklistItems={checklistItems}
            />
          )}
        </div>

        {/* Footer para vista de texto */}
        {isView && (
          <div className="border-t border-gray-100 px-6 py-3 bg-gray-50/80">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
