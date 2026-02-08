'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	Loader2,
	AlertTriangle,
	Clock,
	ChevronLeft,
	ChevronRight,
	SkipForward,
	CheckCircle2,
	PauseCircle,
	RefreshCcw,
	FileText,
	Ban
} from 'lucide-react';
import { instance } from '@/hooks/api';
import Link from 'next/link';

const STORAGE_KEY = 'final_exam_session_v1';

const formatTime = (totalSeconds) => {
	if (typeof totalSeconds !== 'number') return '--:--';
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	const hh = hours > 0 ? `${String(hours).padStart(2, '0')}:` : '';
	return `${hh}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const formatDateTime = (value) => {
	if (!value) return '-';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '-';
	return date.toLocaleString('uz-UZ');
};

const getStatusLabel = (status) => {
	switch (status) {
		case 'completed':
			return 'Yakunlangan';
		case 'pending':
			return 'Jarayonda';
		case 'cancelled':
			return 'Bekor qilingan';
		default:
			return status || '-';
	}
};

const getStatusClassName = (status) => {
	switch (status) {
		case 'completed':
			return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
		case 'pending':
			return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
		case 'cancelled':
			return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
		default:
			return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
	}
};

const FinalExamPage = () => {
	const [activeTab, setActiveTab] = useState('take');
	const [exam, setExam] = useState(null);
	const [questions, setQuestions] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState({});
	const [remainingTime, setRemainingTime] = useState(null);
	const [isExpired, setIsExpired] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showTimeoutModal, setShowTimeoutModal] = useState(false);
	const [isStarting, setIsStarting] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitResult, setSubmitResult] = useState(null);
	const [submitError, setSubmitError] = useState(null);
	const [isCancelling, setIsCancelling] = useState(false);
	const [cancelMessage, setCancelMessage] = useState(null);
	const [historyData, setHistoryData] = useState(null);
	const [historyLoading, setHistoryLoading] = useState(false);
	const [historyError, setHistoryError] = useState(null);

	const currentQuestion = questions[currentIndex];
	const selectedOption = currentQuestion ? answers[currentQuestion.id] : null;
	const interactionsLocked = isExpired || !currentQuestion || isSubmitting || !!submitResult;
	const hasActiveExam = !!exam && questions.length > 0;

	const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
	const resultSectionRef = useRef(null);

	const resetExamState = useCallback(() => {
		setExam(null);
		setQuestions([]);
		setAnswers({});
		setCurrentIndex(0);
		setRemainingTime(null);
		setIsExpired(false);
		setShowTimeoutModal(false);
	}, []);

	const restoreSavedSession = useCallback(() => {
		setLoading(true);
		setError(null);
		try {
			const savedSessionRaw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
			if (!savedSessionRaw) {
				resetExamState();
				setLoading(false);
				return;
			}

			const parsed = JSON.parse(savedSessionRaw);
			const expiresAt = parsed?.exam?.expiresAt ? new Date(parsed.exam.expiresAt).getTime() : null;
			const secondsLeft = expiresAt ? Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)) : 0;

			if (parsed?.questions?.length && expiresAt && secondsLeft > 0 && !parsed.expired) {
				setExam(parsed.exam);
				setQuestions(parsed.questions);
				setAnswers(parsed.answers || {});
				setCurrentIndex(parsed.currentIndex || 0);
				setRemainingTime(secondsLeft);
				setIsExpired(false);
			} else {
				localStorage.removeItem(STORAGE_KEY);
				resetExamState();
			}
		} catch (parseErr) {
			console.warn('Final exam sessionni o`qishda xatolik:', parseErr);
			localStorage.removeItem(STORAGE_KEY);
			resetExamState();
		}
		setLoading(false);
	}, [resetExamState]);

	const fetchExamHistory = useCallback(async () => {
		setHistoryLoading(true);
		setHistoryError(null);
		try {
			const response = await instance.get('/api/final-exam/history');
			setHistoryData(response.data);
		} catch (err) {
			console.error(err);
			setHistoryError(err?.response?.data?.message || 'Imtihon tarixini olishda xatolik yuz berdi.');
		} finally {
			setHistoryLoading(false);
		}
	}, []);

	useEffect(() => {
		restoreSavedSession();
	}, [restoreSavedSession]);

	useEffect(() => {
		if (activeTab === 'history' && !historyData && !historyLoading) {
			void fetchExamHistory();
		}
	}, [activeTab, historyData, historyLoading, fetchExamHistory]);

	useEffect(() => {
		if (submitResult && activeTab === 'take') {
			resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}, [submitResult, activeTab]);

	useEffect(() => {
		if (!exam || !questions.length || submitResult) return;
		const payload = {
			exam,
			questions,
			answers,
			currentIndex,
			expired: isExpired,
		};
		if (exam.expiresAt) {
			payload.exam.expiresAt = exam.expiresAt;
		}
		localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	}, [exam, questions, answers, currentIndex, isExpired, submitResult]);

	useEffect(() => {
		if (isExpired || typeof remainingTime !== 'number') return;
		if (remainingTime <= 0) {
			setIsExpired(true);
			setShowTimeoutModal(true);
			return;
		}

		const interval = setInterval(() => {
			setRemainingTime((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					setIsExpired(true);
					setShowTimeoutModal(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [remainingTime, isExpired]);

	const startExam = async (forceRestart = false) => {
		if (isStarting || (hasActiveExam && !forceRestart)) return;
		setIsStarting(true);
		setError(null);
		setSubmitError(null);
		setCancelMessage(null);
		setSubmitResult(null);
		if (forceRestart) {
			resetExamState();
		}
		try {
			const response = await instance.post('/api/final-exam/start');
			const payload = response.data;
			const newExam = payload?.exam;
			const examQuestions = payload?.questions || [];
			const expiresAt = newExam?.expiresAt ? new Date(newExam.expiresAt).getTime() : null;
			const secondsLeft = expiresAt ? Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)) : newExam?.remainingTime || 0;

			setExam(newExam);
			setQuestions(examQuestions);
			setAnswers({});
			setCurrentIndex(0);
			setRemainingTime(secondsLeft);
			setIsExpired(false);
		} catch (err) {
			console.error(err);
			setError(err?.response?.data?.message || 'Final imtihonni boshlashda xatolik yuz berdi.');
		} finally {
			setIsStarting(false);
		}
	};

	const handleSelectOption = (optionIdx) => {
		if (!currentQuestion || interactionsLocked) return;
		setAnswers((prev) => ({
			...prev,
			[currentQuestion.id]: optionIdx,
		}));
	};

	const handlePrev = () => {
		if (currentIndex === 0) return;
		setCurrentIndex((prev) => prev - 1);
	};

	const handleNext = () => {
		if (currentIndex >= questions.length - 1) return;
		setCurrentIndex((prev) => prev + 1);
	};

	const handleSkip = () => {
		if (interactionsLocked) return;
		if (currentIndex < questions.length - 1) {
			setCurrentIndex((prev) => prev + 1);
		}
	};

	const handleQuestionJump = (idx) => {
		setCurrentIndex(idx);
	};

	const handleSubmitExam = async (fromTimeout = false) => {
		if (!exam?.id || isSubmitting) return;
		const normalizedAnswers = Object.entries(answers).reduce((acc, [questionId, optionIndex]) => {
			if (typeof optionIndex === 'number') acc[questionId] = optionIndex;
			return acc;
		}, {});

		setIsSubmitting(true);
		setSubmitError(null);
		setCancelMessage(null);
		try {
			const response = await instance.post('/api/final-exam/submit', {
				examId: exam.id,
				answers: normalizedAnswers,
			});
			setSubmitResult(response.data);
			setIsExpired(true);
			setShowTimeoutModal(false);
			localStorage.removeItem(STORAGE_KEY);
			if (historyData) void fetchExamHistory();
		} catch (err) {
			console.error(err);
			setSubmitError(err?.response?.data?.message || 'Imtihonni yakunlashda xatolik yuz berdi.');
			if (fromTimeout) setShowTimeoutModal(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancelExam = async () => {
		if (!exam?.id || isCancelling || isSubmitting) return;
		setIsCancelling(true);
		setSubmitError(null);
		try {
			const response = await instance.delete(`/api/final-exam/${exam.id}/cancel`);
			setCancelMessage(response?.data?.message || 'Imtihon bekor qilindi.');
			setSubmitResult(null);
			localStorage.removeItem(STORAGE_KEY);
			resetExamState();
			if (historyData) void fetchExamHistory();
		} catch (err) {
			console.error(err);
			setSubmitError(err?.response?.data?.message || 'Imtihonni bekor qilishda xatolik yuz berdi.');
		} finally {
			setIsCancelling(false);
		}
	};

	const retryLoad = () => {
		setError(null);
		restoreSavedSession();
	};

	const handleRetakeExam = () => {
		void startExam(true);
	};

	const timerVariant = remainingTime !== null && remainingTime <= 300 ? 'text-red-600' : 'text-slate-900 dark:text-white';

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6] dark:bg-slate-900 text-slate-700 dark:text-slate-300">
				<Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
				<p className="text-sm font-semibold uppercase tracking-[0.2em]">Ma&apos;lumotlar yuklanmoqda...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6] dark:bg-slate-900 p-6 text-center">
				<div className="bg-white dark:bg-slate-800 rounded-[32px] border border-red-100 dark:border-red-900 shadow-2xl p-10 max-w-md">
					<AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Xatolik</h2>
					<p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
					<button onClick={retryLoad} className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-blue-600 text-white font-bold uppercase tracking-widest">
						Qayta urinib ko&apos;rish
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F3F4F6] dark:bg-slate-900 py-6 md:py-10 px-3 md:px-12">
			<div className="space-y-5 md:space-y-6">
				<div className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm px-4 md:px-6 py-4 md:py-5">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div>
							<p className="text-xs font-black tracking-[0.4em] text-blue-600 uppercase">Final imtihon</p>
							<h1 className="text-3xl font-black text-slate-900 dark:text-white mt-2">50 ta savol — 1 soat</h1>
						</div>
						<div className="inline-flex rounded-2xl bg-slate-100 dark:bg-slate-700 p-1">
							<button
								onClick={() => setActiveTab('take')}
								className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'take' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-300'}`}
							>
								Imtihon topshirish
							</button>
							<button
								onClick={() => setActiveTab('history')}
								className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'history' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-300'}`}
							>
								Oldingi topshirgan imtihonlarim
							</button>
						</div>
					</div>
				</div>

				{activeTab === 'take' && (
					<>
						{!hasActiveExam && !submitResult && (
							<div className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm p-5 md:p-8 text-center">
								<p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Imtihon avtomatik boshlanmaydi. Tugma orqali boshlang.</p>
								<button
									onClick={startExam}
									disabled={isStarting}
									className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
								>
									{isStarting ? 'Boshlanmoqda...' : 'Imtihonni boshlash'}
								</button>
							</div>
						)}

						{submitError && (
							<div className="rounded-2xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4 text-red-600 dark:text-red-300 text-sm font-semibold">{submitError}</div>
						)}

						{cancelMessage && (
							<div className="rounded-2xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-amber-700 dark:text-amber-300 text-sm font-semibold">{cancelMessage}</div>
						)}

						{hasActiveExam && (
							<>
								<div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-800 rounded-2xl md:rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm px-4 md:px-6 py-4 md:py-5">
									<div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-2xl px-5 py-3">
										<Clock className={timerVariant} />
										<div>
											<p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em]">Qolgan vaqt</p>
											<p className={`text-2xl font-black ${timerVariant}`}>{formatTime(remainingTime)}</p>
										</div>
									</div>
									<div className="flex flex-wrap items-center gap-3">
										<button
											onClick={() => handleSubmitExam(false)}
											disabled={!exam?.id || isSubmitting || !!submitResult || isExpired}
											className="px-5 py-3 rounded-2xl bg-slate-900 dark:bg-blue-600 text-white text-sm font-black uppercase tracking-[0.15em] disabled:opacity-50"
										>
											{isSubmitting ? 'Yuborilmoqda...' : 'Imtihonni tugatish'}
										</button>
										<button
											onClick={handleCancelExam}
											disabled={!exam?.id || isCancelling || isSubmitting || !!submitResult || isExpired}
											className="px-5 py-3 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-700 text-sm font-black uppercase tracking-[0.15em] disabled:opacity-50 flex items-center gap-2"
										>
											<Ban size={15} /> {isCancelling ? 'Bekor qilinmoqda...' : 'Imtihonni bekor qilish'}
										</button>
									</div>
								</div>

								<div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl md:rounded-[28px] border border-slate-100 dark:border-slate-700 px-3 md:px-4 py-3 md:py-4 flex flex-wrap gap-2 md:gap-3 justify-center">
										{questions.map((question, idx) => {
											const answered = answers[question.id] !== undefined;
											const active = idx === currentIndex;
											return (
												<button
													key={question.id}
													onClick={() => handleQuestionJump(idx)}
													className={`h-9 min-w-[36px] rounded-full text-xs font-bold border transition-all ${active
														? 'bg-blue-600 text-white border-blue-500 shadow-md scale-110'
														: answered
															? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
															: 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-600'
													}`}
													disabled={isExpired}
												>
													{idx + 1}
												</button>
											);
										})}
								</div>
								<div className="flex flex-wrap items-center gap-4 px-2">
									<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
										<span className="w-3 h-3 rounded-full bg-blue-600" /> Tanlangan savol
									</div>
									<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
										<span className="w-3 h-3 rounded-full bg-green-500" /> Javob berilgan
									</div>
									<div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
										<span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" /> Javob berilmagan
									</div>
								</div>

								<div className="rounded-2xl md:rounded-[36px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm p-3 md:p-8 lg:p-10">
									<div className="grid gap-8 lg:grid-cols-2">
										<div className="bg-[#F8FAFF] dark:bg-slate-700 border border-blue-50 dark:border-slate-600 shadow-inner flex items-center justify-center">
											{currentQuestion?.image ? (
												<img src={currentQuestion.image} alt="Savol" className="w-full h-full object-contain" loading="lazy" />
											) : (
												<div className="text-slate-300 dark:text-slate-500 text-sm font-semibold">Rasm mavjud emas</div>
											)}
										</div>
										<div className="flex flex-col gap-6">
											<div>
												<p className="text-sm font-semibold text-blue-500 uppercase tracking-[0.3em]">Savol {currentIndex + 1}</p>
												<h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2 leading-snug">{currentQuestion?.questionText}</h2>
											</div>
											<div className="space-y-3">
												{currentQuestion?.options.map((option, idx) => {
													const isSelected = selectedOption === idx;
													return (
														<button
															key={idx}
															onClick={() => handleSelectOption(idx)}
															disabled={interactionsLocked}
															className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all flex items-center justify-between ${isSelected
																? 'bg-slate-900 dark:bg-blue-600 text-white border-slate-900 dark:border-blue-600 shadow-lg'
																: 'bg-[#F7F9FC] dark:bg-slate-700 border-transparent text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
															} ${interactionsLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
														>
															<span className="text-sm font-medium leading-relaxed">{option}</span>
															{isSelected && <CheckCircle2 className="text-white" size={20} />}
														</button>
													);
												})}
											</div>
											<div className="flex flex-wrap items-center justify-between gap-3">
												<div className="flex gap-2">
													<button onClick={handlePrev} disabled={currentIndex === 0} className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-500 dark:text-slate-400 disabled:opacity-40">
														<ChevronLeft size={16} /> Oldingi
													</button>
													<button onClick={handleNext} disabled={currentIndex === questions.length - 1} className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-500 dark:text-slate-400 disabled:opacity-40">
														Keyingi <ChevronRight size={16} />
													</button>
												</div>
												<button onClick={handleSkip} disabled={interactionsLocked || currentIndex === questions.length - 1} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700 text-sm font-bold disabled:opacity-50">
													O&apos;tkazib yuborish <SkipForward size={16} />
												</button>
											</div>
										</div>
									</div>
								</div>
							</>
						)}

						{submitResult && (
							<div ref={resultSectionRef} className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm p-4 md:p-6 space-y-4 md:space-y-5">
								<div>
									<p className="text-xs font-black tracking-[0.3em] text-green-600 uppercase">Imtihon natijasi</p>
									<h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">{submitResult?.message}</h3>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
									<div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-4">
										<p className="text-[11px] text-slate-400 font-black uppercase">To&apos;g&apos;ri</p>
										<p className="text-xl font-black text-slate-900 dark:text-white">{submitResult?.result?.correctCount ?? 0}</p>
									</div>
									<div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-4">
										<p className="text-[11px] text-slate-400 font-black uppercase">Noto&apos;g&apos;ri</p>
										<p className="text-xl font-black text-slate-900 dark:text-white">{submitResult?.result?.wrongCount ?? 0}</p>
									</div>
									<div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-4">
										<p className="text-[11px] text-slate-400 font-black uppercase">Javobsiz</p>
										<p className="text-xl font-black text-slate-900 dark:text-white">{submitResult?.result?.unansweredCount ?? 0}</p>
									</div>
									<div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-4">
										<p className="text-[11px] text-slate-400 font-black uppercase">Foiz</p>
										<p className="text-xl font-black text-slate-900 dark:text-white">{submitResult?.result?.percentage ?? '0'}%</p>
									</div>
								</div>
								<div className="pt-2">
									<button
										onClick={handleRetakeExam}
										disabled={isStarting}
										className="px-6 py-3 rounded-2xl bg-blue-600 text-white text-sm font-black uppercase tracking-[0.15em] hover:bg-blue-700 disabled:opacity-50"
									>
										{isStarting ? 'Boshlanmoqda...' : 'Qayta topshirish'}
									</button>
								</div>
							</div>
						)}
					</>
				)}

				{activeTab === 'history' && (
					<div className="space-y-4">
						<div className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm p-4 md:p-6 space-y-4">
							<div className="flex items-center gap-2">
								<FileText size={18} className="text-indigo-600 dark:text-indigo-300" />
								<h3 className="text-lg font-black text-slate-900 dark:text-white">{historyData?.message || 'Imtihon tarixi'}</h3>
							</div>
							{historyError && <p className="text-sm text-red-600 dark:text-red-300">{historyError}</p>}
							{historyLoading && (
								<div className="space-y-2">
									{[1, 2, 3].map((i) => (
										<div key={i} className="rounded-2xl border border-slate-100 dark:border-slate-700 p-4 animate-pulse">
											<div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
											<div className="h-3 w-72 max-w-full bg-slate-200 dark:bg-slate-700 rounded mb-2" />
											<div className="h-3 w-60 max-w-full bg-slate-200 dark:bg-slate-700 rounded" />
										</div>
									))}
								</div>
							)}
							{historyData && (
								<>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										Jami: <span className="font-black text-slate-900 dark:text-white">{historyData?.total ?? 0}</span>, O&apos;tganlar:
										<span className="font-black text-slate-900 dark:text-white"> {historyData?.passedCount ?? 0}</span>
									</p>
									<div className="space-y-2">
										{historyData?.history?.map((item) => (
											<div key={item.id} className="rounded-2xl border border-slate-100 dark:border-slate-700 p-4 flex flex-wrap items-center justify-between gap-3">
												<div className="space-y-1">
													<p className="text-sm font-black text-slate-900 dark:text-white">Imtihon #{item.id}</p>
													<p className="text-xs text-slate-500 dark:text-slate-400">Foiz: {item.percentage ?? '0'}% | To&apos;g&apos;ri: {item.correctCount} / {item.totalQuestions}</p>
													<p className="text-xs text-slate-400 dark:text-slate-500">Boshlangan: {formatDateTime(item.startedAt)} | Tugagan: {formatDateTime(item.completedAt)}</p>
												</div>
												<div className="flex items-center gap-2">
													<span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${getStatusClassName(item.status)}`}>
														{getStatusLabel(item.status)}
													</span>
													<Link
														href={`/exam/history/${item.id}`}
														className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 text-white text-xs font-black uppercase tracking-wider"
													>
														Natijani ko&apos;rish
													</Link>
												</div>
											</div>
										))}
									</div>
								</>
							)}
						</div>
					</div>
				)}
			</div>

			{showTimeoutModal && (
				<div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-[32px] max-w-md w-full p-5 md:p-8 text-center shadow-2xl">
						<div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center mx-auto mb-4">
							<PauseCircle size={36} />
						</div>
						<h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Belgilangan vaqt tugadi</h3>
						<p className="text-slate-500 dark:text-slate-400 mb-6">Test davom ettirilmaydi. Javoblaringiz serverga yuboriladi.</p>
						<button
							onClick={() => handleSubmitExam(true)}
							disabled={isSubmitting}
							className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-blue-600 text-white font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2"
						>
							<RefreshCcw size={18} /> {isSubmitting ? 'Yuborilmoqda...' : 'Yakunlash va yuborish'}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default FinalExamPage;
